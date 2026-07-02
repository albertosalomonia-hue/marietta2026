import { useEffect, useRef } from 'react'
import Modal from './Modal'
import ContractPreview from '../ContractPreview'
import ResponsiveDocument from '../ResponsiveDocument'
import { usePdfExport } from '../../hooks/usePdfExport'

export default function ContractViewerModal({ employee, contractData, onClose, onOpened }) {
  const previewRef = useRef(null)
  const { generandoPdf, handlePrint, handleDownloadPdf } = usePdfExport(previewRef)

  useEffect(() => {
    onOpened?.()
    // Solo se debe registrar la "lectura" una vez, al abrir el visor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const nombreArchivo = `Contrato_${employee.nombre.trim().replace(/\s+/g, '_') || 'trabajo'}_${contractData.contrato.fechaInicio}.pdf`

  return (
    <Modal title={`Contrato de ${employee.nombre}`} onClose={onClose} wide>
      <div className="no-print mb-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Imprimir
        </button>
        <button
          type="button"
          onClick={() => handleDownloadPdf(nombreArchivo)}
          disabled={generandoPdf}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {generandoPdf ? 'Generando…' : 'Descargar PDF'}
        </button>
      </div>
      <ResponsiveDocument>
        <ContractPreview ref={previewRef} data={contractData} />
      </ResponsiveDocument>
    </Modal>
  )
}
