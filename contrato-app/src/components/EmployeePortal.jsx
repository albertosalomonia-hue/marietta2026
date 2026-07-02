import { useState } from 'react'
import Avatar from './admin/Avatar'
import StatusBadge from './admin/StatusBadge'
import ContractViewerModal from './admin/ContractViewerModal'
import SignatureModal from './admin/SignatureModal'
import { calcularEstadoEmpleado, employeeContratoToContractData } from '../utils/employeeContracts'
import { formatearFechaLarga } from '../utils/fechas'

export default function EmployeePortal({ employee, employerConfig, onMarcarLeido, onFirmar, onLogout }) {
  const [viendoContrato, setViendoContrato] = useState(false)
  const [firmando, setFirmando] = useState(false)

  const ultimo = employee.contratos[employee.contratos.length - 1] || null
  const { estado, diasRestantes, tipo } = calcularEstadoEmpleado(employee)

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="no-print flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
        <h1 className="text-base font-bold text-slate-900 sm:text-lg">Mi contrato</h1>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <Avatar nombre={employee.nombre} foto={employee.foto} size="lg" />
          <div className="text-lg font-semibold text-slate-900">{employee.nombre}</div>
          <div className="text-sm text-slate-500">{employee.cargo}</div>
          <div className="text-xs text-slate-400">DNI {employee.dni}</div>

          <div className="mt-2">
            <StatusBadge estado={estado} />
          </div>
          <div className="text-xs text-slate-500">
            {estado === 'vencido'
              ? `${tipo === 'primer_contrato' ? 'Tu primer contrato debió generarse hace' : 'Tu contrato venció hace'} ${Math.abs(diasRestantes)} día(s).`
              : `${tipo === 'primer_contrato' ? 'Tu primer contrato inicia en' : 'Tu contrato vence en'} ${diasRestantes} día(s).`}
          </div>

          {!ultimo ? (
            <p className="mt-4 text-sm text-slate-500">Todavía no tienes un contrato generado. Contacta al administrador.</p>
          ) : (
            <>
              <div className="mt-3 grid w-full grid-cols-2 gap-2 rounded-md bg-slate-50 p-3 text-left text-xs text-slate-600">
                <div>
                  <div className="font-medium text-slate-800">Plazo</div>
                  {ultimo.plazoTexto}
                </div>
                <div>
                  <div className="font-medium text-slate-800">Del</div>
                  {formatearFechaLarga(ultimo.fechaInicio)}
                </div>
                <div>
                  <div className="font-medium text-slate-800">Al</div>
                  {formatearFechaLarga(ultimo.fechaFin)}
                </div>
                <div>
                  <div className="font-medium text-slate-800">Remuneración</div>
                  S/. {Number(ultimo.monto).toFixed(2)}
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                    ultimo.leidoEn ? 'bg-sky-50 text-sky-700 ring-sky-600/20' : 'bg-slate-50 text-slate-500 ring-slate-400/20'
                  }`}
                >
                  {ultimo.leidoEn ? '✓ Leído' : 'Pendiente de leer'}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                    ultimo.firmaEmpleado ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-slate-50 text-slate-500 ring-slate-400/20'
                  }`}
                >
                  {ultimo.firmaEmpleado ? '✓ Firmado' : 'Pendiente de firmar'}
                </span>
              </div>

              <div className="mt-4 flex w-full flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setViendoContrato(true)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Ver mi contrato
                </button>
                {!ultimo.firmaEmpleado && (
                  <button
                    type="button"
                    onClick={() => setFirmando(true)}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Firmar mi contrato
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {viendoContrato && ultimo && (
        <ContractViewerModal
          employee={employee}
          contractData={employeeContratoToContractData(employerConfig, employee, ultimo)}
          onOpened={() => {
            if (!ultimo.leidoEn) onMarcarLeido(ultimo.id)
          }}
          onClose={() => setViendoContrato(false)}
        />
      )}

      {firmando && ultimo && (
        <SignatureModal
          title={`Firma de ${employee.nombre}`}
          onSave={(dataUrl) => onFirmar(ultimo.id, dataUrl)}
          onClose={() => setFirmando(false)}
        />
      )}
    </div>
  )
}
