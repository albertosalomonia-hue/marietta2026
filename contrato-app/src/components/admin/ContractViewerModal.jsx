import { useEffect, useRef, useState } from 'react'
import Modal from './Modal'
import ContractPreview from '../ContractPreview'
import ResponsiveDocument from '../ResponsiveDocument'
import { usePdfExport } from '../../hooks/usePdfExport'
import { buildContractData } from '../../utils/employeeContracts'

export default function ContractViewerModal({ employee, contrato, employerConfig, onClose, onOpened }) {
  const previewRef = useRef(null)
  const { generandoPdf, handlePrint, handleDownloadPdf } = usePdfExport(previewRef)
  const [contractData, setContractData] = useState(null)

  useEffect(() => {
    let cancelled = false
    buildContractData(employerConfig, employee, contrato).then((data) => {
      if (!cancelled) setContractData(data)
    })
    onOpened?.()
    return () => {
      cancelled = true
    }
    // Solo se debe registrar la "lectura" y construir los datos una vez, al abrir el visor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const nombreArchivo = `Contrato_${employee.nombre.trim().replace(/\s+/g, '_') || 'trabajo'}_${contrato.fechaInicio}.pdf`

  return (
    <Modal title={`Contrato de ${employee.nombre}`} onClose={onClose} wide>
      <div className="no-print mb-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={handlePrint}
          disabled={!contractData}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Imprimir
        </button>
        <button
          type="button"
          onClick={() => handleDownloadPdf(nombreArchivo)}
          disabled={generandoPdf || !contractData}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {generandoPdf ? 'Generando…' : 'Descargar PDF'}
        </button>
      </div>
      {contractData ? (
        <ResponsiveDocument>
          <ContractPreview ref={previewRef} data={contractData} />
        </ResponsiveDocument>
      ) : (
        <p className="py-10 text-center text-sm text-slate-500">Cargando contrato…</p>
      )}
    </Modal>
  )
}
