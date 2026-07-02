import StatusBadge from './StatusBadge'
import EmployeeRowCard from './EmployeeRowCard'
import { calcularEstadoEmpleado } from '../../utils/employeeContracts'

export default function EmployeeTable({ employees, onVerContratos, onEditar, onEliminar }) {
  if (!employees.length) {
    return <p className="rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Todavía no hay empleados registrados.</p>
  }

  return (
    <>
      {/* Tarjetas en pantallas angostas (celulares) */}
      <div className="flex flex-col gap-3 sm:hidden">
        {employees.map((emp) => (
          <EmployeeRowCard key={emp.id} employee={emp} onVerContratos={onVerContratos} onEditar={onEditar} onEliminar={onEliminar} />
        ))}
      </div>

      {/* Tabla en pantallas medianas/grandes */}
      <table className="hidden w-full min-w-[640px] text-left text-sm sm:table">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
            <th className="py-2 pr-3">Nombre</th>
            <th className="py-2 pr-3">DNI</th>
            <th className="py-2 pr-3">Cargo</th>
            <th className="py-2 pr-3">Estado</th>
            <th className="py-2 pr-3">Contratos</th>
            <th className="py-2 pr-3"></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => {
            const { estado, diasRestantes, tipo } = calcularEstadoEmpleado(emp)
            return (
              <tr key={emp.id} className="border-b border-slate-100">
                <td className="py-2 pr-3 font-medium text-slate-900">{emp.nombre}</td>
                <td className="py-2 pr-3">{emp.dni}</td>
                <td className="py-2 pr-3">{emp.cargo}</td>
                <td className="py-2 pr-3">
                  <div className="flex flex-col gap-0.5">
                    <StatusBadge estado={estado} />
                    <span className="text-xs text-slate-500">
                      {estado === 'vencido'
                        ? `hace ${Math.abs(diasRestantes)} día(s)`
                        : `${tipo === 'primer_contrato' ? 'inicia' : 'vence'} en ${diasRestantes} día(s)`}
                    </span>
                  </div>
                </td>
                <td className="py-2 pr-3">{emp.contratos.length}</td>
                <td className="py-2 pr-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onVerContratos(emp)}
                      className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Contratos
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditar(emp)}
                      className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onEliminar(emp)}
                      className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
