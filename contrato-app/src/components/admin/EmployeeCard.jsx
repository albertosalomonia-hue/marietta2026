import Avatar from './Avatar'
import StatusBadge from './StatusBadge'
import { calcularEstadoEmpleado } from '../../utils/employeeContracts'

export default function EmployeeCard({ employee, onClick }) {
  const { estado, diasRestantes, tipo } = calcularEstadoEmpleado(employee)
  const ultimo = employee.contratos[employee.contratos.length - 1]
  const firmado = Boolean(ultimo?.firmaEmpleado)
  const leido = Boolean(ultimo?.leidoEn)

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md"
    >
      <Avatar nombre={employee.nombre} foto={employee.foto} size="lg" />
      <div className="font-semibold text-slate-900">{employee.nombre}</div>
      <div className="text-xs text-slate-500">{employee.cargo}</div>
      <div className="text-xs text-slate-400">DNI {employee.dni}</div>

      <StatusBadge estado={estado} />
      <div className="text-xs text-slate-500">
        {estado === 'vencido' ? `hace ${Math.abs(diasRestantes)} día(s)` : `${tipo === 'primer_contrato' ? 'inicia' : 'vence'} en ${diasRestantes} día(s)`}
      </div>

      {ultimo && (
        <div className="mt-1 flex gap-1.5">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
              firmado ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-slate-50 text-slate-500 ring-slate-400/20'
            }`}
          >
            {firmado ? '✓ Firmado' : '✗ Sin firmar'}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
              leido ? 'bg-sky-50 text-sky-700 ring-sky-600/20' : 'bg-slate-50 text-slate-500 ring-slate-400/20'
            }`}
          >
            {leido ? '✓ Leído' : '✗ No leído'}
          </span>
        </div>
      )}
    </button>
  )
}
