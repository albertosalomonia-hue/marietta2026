import { useRef, useState } from 'react'
import ContractForm from './components/ContractForm'
import ContractPreview from './components/ContractPreview'
import { defaultData } from './utils/defaultData'

function App() {
  const [data, setData] = useState(defaultData)
  const previewRef = useRef(null)

  const handleReset = () => setData(defaultData)

  const handlePrint = () => window.print()

  const handleDownloadPdf = async () => {
    const element = previewRef.current
    if (!element) return
    const html2pdf = (await import('html2pdf.js')).default
    const nombreArchivo = `Contrato_${data.trabajador.nombre.trim().replace(/\s+/g, '_') || 'trabajo'}.pdf`
    html2pdf()
      .set({
        margin: 10,
        filename: nombreArchivo,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save()
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
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Descargar PDF
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
