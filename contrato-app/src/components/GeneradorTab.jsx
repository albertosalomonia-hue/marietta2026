import { useRef, useState } from 'react'
import ContractForm from './ContractForm'
import ContractPreview from './ContractPreview'
import ResponsiveDocument from './ResponsiveDocument'
import { defaultData } from '../utils/defaultData'
import { usePdfExport } from '../hooks/usePdfExport'

export default function GeneradorTab() {
  const [data, setData] = useState(defaultData)
  const previewRef = useRef(null)
  const { generandoPdf, handlePrint, handleDownloadPdf } = usePdfExport(previewRef)

  const handleReset = () => setData(defaultData)

  const nombreArchivo = `Contrato_${data.trabajador.nombre.trim().replace(/\s+/g, '_') || 'trabajo'}.pdf`

  return (
    <>
      <div className="no-print mx-auto mb-4 flex max-w-7xl flex-wrap justify-end gap-2 px-4 sm:px-6">
        <button
          onClick={handlePrint}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Imprimir
        </button>
        <button
          onClick={() => handleDownloadPdf(nombreArchivo)}
          disabled={generandoPdf}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {generandoPdf ? 'Generando…' : 'Descargar PDF'}
        </button>
      </div>

      <main className="mx-auto max-w-7xl gap-6 px-4 pb-6 sm:px-6 lg:flex">
        <div className="no-print mb-6 w-full lg:mb-0 lg:w-[420px] lg:shrink-0">
          <ContractForm data={data} onChange={setData} onReset={handleReset} />
        </div>

        <div className="w-full">
          <ResponsiveDocument>
            <ContractPreview ref={previewRef} data={data} />
          </ResponsiveDocument>
        </div>
      </main>
    </>
  )
}
