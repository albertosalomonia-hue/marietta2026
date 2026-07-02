const MESES = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
]

// Recibe 'yyyy-mm-dd' (valor nativo de <input type="date">) y devuelve "21 de ABRIL del 2026"
export function formatearFechaLarga(fechaISO) {
  if (!fechaISO) return ''
  const [anio, mes, dia] = fechaISO.split('-').map(Number)
  if (!anio || !mes || !dia) return ''
  const diaStr = String(dia).padStart(2, '0')
  return `${diaStr} de ${MESES[mes - 1]} del ${anio}`
}
