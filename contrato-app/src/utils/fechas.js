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

function toDateUTC(fechaISO) {
  const [anio, mes, dia] = fechaISO.split('-').map(Number)
  return new Date(Date.UTC(anio, mes - 1, dia))
}

function toISO(date) {
  return date.toISOString().slice(0, 10)
}

export function hoyISO() {
  const now = new Date()
  return toISO(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())))
}

export function sumarDiasISO(fechaISO, dias) {
  const d = toDateUTC(fechaISO)
  d.setUTCDate(d.getUTCDate() + dias)
  return toISO(d)
}

// Suma N meses conservando el mismo día del mes (ej. 21-ABR + 1 mes = 21-MAY),
// que es la convención usada en estos contratos peruanos sujetos a modalidad.
export function sumarMesesISO(fechaISO, meses) {
  const d = toDateUTC(fechaISO)
  const diaOriginal = d.getUTCDate()
  d.setUTCMonth(d.getUTCMonth() + meses)
  // Si el mes destino tiene menos días (ej. 31-ENE + 1 mes), evita que JS "desborde" al mes siguiente
  if (d.getUTCDate() !== diaOriginal) {
    d.setUTCDate(0)
  }
  return toISO(d)
}

// Diferencia en días entre dos fechas ISO: fechaISO - referenciaISO
export function diferenciaEnDias(fechaISO, referenciaISO) {
  const a = toDateUTC(fechaISO)
  const b = toDateUTC(referenciaISO)
  return Math.round((a.getTime() - b.getTime()) / 86400000)
}
