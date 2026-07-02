import Avatar from './Avatar'
import StatusBadge from './StatusBadge'
import { calcularEstadoEmpleado } from '../../utils/employeeContracts'

export default function EmployeeRowCard({ employee, onVerContratos, onEditar, onEliminar }) {
  const { estado, diasRestantes, tipo } = calcularEstadoEmpleado(employee)

  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <Avatar nombre={employee.nombre} fotoPath={employee.fotoPath} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-slate-900">{employee.nombre}</div>
        <div className="text-xs text-slate-500">DNI {employee.dni} · {employee.contratos.length} contrato(s)</div>
        <div className="truncate text-xs text-slate-500">{employee.cargo}</div>

        <div className="mt-1.5 flex items-center gap-2">
          <StatusBadge estado={estado} />
          <span className="text-xs text-slate-500">
            {estado === 'vencido'
              ? `hace ${Math.abs(diasRestantes)} día(s)`
              : `${tipo === 'primer_contrato' ? 'inicia' : 'vence'} en ${diasRestantes} día(s)`}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onVerContratos(employee)}
            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Contratos
          </button>
          <button
            type="button"
            onClick={() => onEditar(employee)}
            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onEliminar(employee)}
            className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
