const STYLES = {
  vigente: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  alerta: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  vencido: 'bg-red-50 text-red-700 ring-red-600/20',
}

const LABELS = {
  vigente: 'Vigente',
  alerta: 'Por vencer',
  vencido: 'Vencido',
}

export default function StatusBadge({ estado }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[estado]}`}>
      {LABELS[estado]}
    </span>
  )
}
