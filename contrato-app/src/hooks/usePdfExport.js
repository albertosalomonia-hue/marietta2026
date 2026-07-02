import { useState } from 'react'

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
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

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
      alert('Ocurrió un error al generar el PDF. Revisa la consola para más detalles.')
    } finally {
      document.body.classList.remove('pdf-exporting')
      setGenerandoPdf(false)
    }
  }

  return { generandoPdf, handlePrint, handleDownloadPdf }
}
