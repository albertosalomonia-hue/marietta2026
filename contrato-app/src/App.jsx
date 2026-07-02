import { useRef, useState } from 'react'
import ContractForm from './components/ContractForm'
import ContractPreview from './components/ContractPreview'
import { defaultData } from './utils/defaultData'

function App() {
  const [data, setData] = useState(defaultData)
  const [generandoPdf, setGenerandoPdf] = useState(false)
  const previewRef = useRef(null)

  const handleReset = () => setData(defaultData)

  const handlePrint = () => window.print()

  const handleDownloadPdf = async () => {
    const container = previewRef.current
    if (!container || generandoPdf) return

    const pageEls = container.querySelectorAll('.pdf-page--sheet')
    if (!pageEls.length) return

    setGenerandoPdf(true)
    try {
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

      const nombreArchivo = `Contrato_${data.trabajador.nombre.trim().replace(/\s+/g, '_') || 'trabajo'}.pdf`
      pdf.save(nombreArchivo)
    } catch (error) {
      console.error('Error al generar el PDF:', error)
      alert('Ocurrió un error al generar el PDF. Revisa la consola para más detalles.')
    } finally {
      setGenerandoPdf(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="no-print sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Generador de Contratos — Transportes Marietta</h1>
            <p className="text-sm text-slate-500">Completa los datos y genera el contrato listo para imprimir o descargar en PDF.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Imprimir
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={generandoPdf}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generandoPdf ? 'Generando…' : 'Descargar PDF'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl gap-6 px-6 py-6 lg:flex">
        <div className="no-print mb-6 w-full lg:mb-0 lg:w-[420px] lg:shrink-0">
          <ContractForm data={data} onChange={setData} onReset={handleReset} />
        </div>

        <div className="w-full overflow-x-auto">
          <ContractPreview ref={previewRef} data={data} />
        </div>
      </main>
    </div>
  )
}

export default App
