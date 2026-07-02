import { calcularEstadoEmpleado } from '../../utils/employeeContracts'

export default function AlertsBanner({ employees, onVerEmpleado }) {
  const alertas = employees
    .map((emp) => ({ emp, info: calcularEstadoEmpleado(emp) }))
    .filter(({ info }) => info.estado === 'alerta' || info.estado === 'vencido')
    .sort((a, b) => a.info.diasRestantes - b.info.diasRestantes)

  if (!alertas.length) return null

  return (
    <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-4">
      <h3 className="mb-2 text-sm font-semibold text-amber-900">
        ⚠ {alertas.length} empleado(s) requieren atención
      </h3>
      <ul className="flex flex-col gap-1.5">
        {alertas.map(({ emp, info }) => (
          <li key={emp.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-amber-900">
              <b>{emp.nombre}</b>
              {' — '}
              {info.estado === 'vencido'
                ? `${info.tipo === 'primer_contrato' ? 'primer contrato pendiente' : 'contrato vencido'} hace ${Math.abs(info.diasRestantes)} día(s)`
                : `${info.tipo === 'primer_contrato' ? 'inicia' : 'vence'} en ${info.diasRestantes} día(s)`}
            </span>
            <button
              type="button"
              onClick={() => onVerEmpleado(emp)}
              className="shrink-0 rounded-md border border-amber-400 bg-white px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100"
            >
              Ver / Generar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
