import { useState } from 'react'
import Modal from './Modal'
import StatusBadge from './StatusBadge'
import ContractViewerModal from './ContractViewerModal'
import SignatureModal from './SignatureModal'
import { calcularEstadoEmpleado, employeeContratoToContractData, generarSiguienteContrato, obtenerFirmaGuardada } from '../../utils/employeeContracts'
import { formatearFechaLarga } from '../../utils/fechas'

export default function ContratosModal({ employee, employerConfig, onGenerarContrato, onFirmarContrato, onClose }) {
  const [viendoContratoId, setViendoContratoId] = useState(null)
  const [firmandoContratoId, setFirmandoContratoId] = useState(null)
  const viendoContrato = employee.contratos.find((c) => c.id === viendoContratoId) || null

  const { estado, diasRestantes, tipo } = calcularEstadoEmpleado(employee)

  const handleGenerar = () => {
    const nuevo = generarSiguienteContrato(employee)
    onGenerarContrato(employee.id, nuevo)
  }

  const handleGuardarFirma = (dataUrl) => {
    onFirmarContrato(employee.id, firmandoContratoId, dataUrl)
    setFirmandoContratoId(null)
  }

  const mensajeEstado =
    estado === 'vencido'
      ? `${tipo === 'primer_contrato' ? 'El primer contrato debió generarse hace' : 'El contrato venció hace'} ${Math.abs(diasRestantes)} día(s).`
      : estado === 'alerta'
        ? `${tipo === 'primer_contrato' ? 'El primer contrato debe generarse en' : 'El contrato vence en'} ${diasRestantes} día(s).`
        : `${tipo === 'primer_contrato' ? 'Faltan' : 'Vence en'} ${diasRestantes} día(s).`

  return (
    <Modal title={`Contratos de ${employee.nombre}`} onClose={onClose} wide>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-2">
          <StatusBadge estado={estado} />
          <span className="text-sm text-slate-700">{mensajeEstado}</span>
        </div>
        <button
          type="button"
          onClick={handleGenerar}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {employee.contratos.length === 0 ? 'Generar primer contrato' : 'Generar siguiente contrato'}
        </button>
      </div>

      {employee.contratos.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">Este empleado todavía no tiene contratos generados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="py-2 pr-3">Plazo</th>
                <th className="py-2 pr-3">Inicio</th>
                <th className="py-2 pr-3">Fin</th>
                <th className="py-2 pr-3">Remuneración</th>
                <th className="py-2 pr-3">Leído</th>
                <th className="py-2 pr-3">Firma</th>
                <th className="py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {[...employee.contratos].reverse().map((c) => (
                <tr key={c.id} className="border-b border-slate-100">
                  <td className="py-2 pr-3">{c.plazoTexto}</td>
                  <td className="py-2 pr-3">{formatearFechaLarga(c.fechaInicio)}</td>
                  <td className="py-2 pr-3">{formatearFechaLarga(c.fechaFin)}</td>
                  <td className="py-2 pr-3">S/. {Number(c.monto).toFixed(2)}</td>
                  <td className="py-2 pr-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                        c.leidoEn ? 'bg-sky-50 text-sky-700 ring-sky-600/20' : 'bg-slate-50 text-slate-500 ring-slate-400/20'
                      }`}
                    >
                      {c.leidoEn ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="py-2 pr-3">
                    {c.firmaEmpleado ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        Firmado
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setFirmandoContratoId(c.id)}
                        className="rounded-md border border-indigo-300 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
                      >
                        Firmar
                      </button>
                    )}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    <button
                      type="button"
                      onClick={() => setViendoContratoId(c.id)}
                      className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Ver / Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viendoContrato && (
        <ContractViewerModal
          employee={employee}
          contractData={employeeContratoToContractData(employerConfig, employee, viendoContrato)}
          onClose={() => setViendoContratoId(null)}
        />
      )}

      {firmandoContratoId && (
        <SignatureModal
          title={`Firma de ${employee.nombre}`}
          firmaGuardada={obtenerFirmaGuardada(employee)}
          onSave={handleGuardarFirma}
          onClose={() => setFirmandoContratoId(null)}
        />
      )}
    </Modal>
  )
}
