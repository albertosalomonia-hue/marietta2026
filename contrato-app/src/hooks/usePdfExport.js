import { useState } from 'react'

// Espera activamente (en vez de confiar en un tiempo fijo) a que la hoja recupere
// su ancho real de 210mm (~790px) tras quitarle el escalado responsivo. En
// celulares más lentos, un tiempo fijo corto puede no alcanzar para que el
// navegador termine de aplicar el cambio de estilo antes de capturar, lo que
// producía capturas "encogidas" que luego se veían agrandadas/borrosas al
// estirarse dentro de la hoja A4 del PDF.
async function esperarEscalaCompleta(pageEl, timeoutMs = 1500) {
  const inicio = performance.now()
  while (performance.now() - inicio < timeoutMs) {
    if (pageEl.getBoundingClientRect().width >= 780) return
    await new Promise((resolve) => requestAnimationFrame(resolve))
  }
}

export function usePdfExport(previewRef) {
  const [generandoPdf, setGenerandoPdf] = useState(false)

  const handlePrint = () => window.print()

  const handleDownloadPdf = async (filename) => {
    const container = previewRef.current
    if (!container || generandoPdf) return

    const pageEls = container.querySelectorAll('.pdf-page--sheet')
    if (!pageEls.length) return

    setGenerandoPdf(true)
    // Desactiva temporalmente el escalado responsivo (ver ResponsiveDocument/index.css)
    // para que la captura siempre use el documento a resolución/tamaño real, sin importar
    // qué tan angosta sea la pantalla desde la que se exporta.
    document.body.classList.add('pdf-exporting')
    try {
      // Fuerza un reflow síncrono y confirma que el des-escalado ya se aplicó de verdad
      // antes de seguir, en vez de asumirlo por tiempo.
      void document.body.offsetHeight
      await esperarEscalaCompleta(pageEls[0])

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas-pro'),
        import('jspdf'),
      ])

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      for (let i = 0; i < pageEls.length; i++) {
        const canvas = await html2canvas(pageEls[i], {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        })
        const imgData = canvas.toDataURL('image/jpeg', 0.95)
        if (i > 0) pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
      }

      pdf.save(filename)
    } catch (error) {
      console.error('Error al generar el PDF:', error)
      // La sesión tiene cargada una versión vieja de la app y el archivo que intenta
      // cargar bajo demanda ya no existe en el servidor (se desplegó una versión más
      // nueva). Recargar trae la versión actual en vez de dejar el error.
      if (/dynamically imported module|Failed to fetch/i.test(error.message)) {
        alert('Hay una versión más nueva de la aplicación disponible. Se va a recargar la página; después vuelve a intentar descargar el PDF.')
        window.location.reload()
        return
      }
      alert('Ocurrió un error al generar el PDF. Revisa la consola para más detalles.')
    } finally {
      document.body.classList.remove('pdf-exporting')
      setGenerandoPdf(false)
    }
  }

  return { generandoPdf, handlePrint, handleDownloadPdf }
}
