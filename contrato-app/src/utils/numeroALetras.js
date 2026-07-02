const UNIDADES = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE']
const DECENAS = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE']
const VEINTES = ['VEINTE', 'VEINTIUNO', 'VEINTIDÓS', 'VEINTITRÉS', 'VEINTICUATRO', 'VEINTICINCO', 'VEINTISÉIS', 'VEINTISIETE', 'VEINTIOCHO', 'VEINTINUEVE']
const DECENAS_10 = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
const CENTENAS = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS']

// Convierte "...UNO" en "...UN" cuando antecede a MIL/MILLÓN (ej. VEINTIUN MIL, no VEINTIUNO MIL)
function apocopar(letras) {
  if (letras === 'UNO') return 'UN'
  if (letras.endsWith(' UNO')) return letras.slice(0, -3) + 'UN'
  if (letras === 'VEINTIUNO') return 'VEINTIÚN'
  return letras
}

function seccion(numero, divisor, singular, plural) {
  const cientos = Math.floor(numero / divisor)
  const resto = numero % divisor
  let letras = ''
  if (cientos > 0) {
    letras = cientos === 1 ? singular : `${apocopar(convertirGrupo(cientos))} ${plural}`
  }
  return { letras, resto }
}

function convertirGrupo(numero) {
  let letras = ''
  if (numero === 100) return 'CIEN'
  const centenaIdx = Math.floor(numero / 100)
  let resto = numero % 100
  if (centenaIdx > 0) letras += CENTENAS[centenaIdx]
  if (resto > 0) {
    if (letras !== '') letras += ' '
    if (resto < 10) {
      letras += UNIDADES[resto]
    } else if (resto < 20) {
      letras += DECENAS[resto - 10]
    } else if (resto < 30) {
      letras += VEINTES[resto - 20]
    } else {
      const decena = Math.floor(resto / 10)
      const unidad = resto % 10
      letras += DECENAS_10[decena]
      if (unidad > 0) letras += ` Y ${UNIDADES[unidad]}`
    }
  }
  return letras.trim()
}

export function enteroALetras(numero) {
  numero = Math.floor(Math.abs(numero))
  if (numero === 0) return 'CERO'
  if (numero > 999999999) return String(numero)

  let letras = ''

  const millones = seccion(numero, 1000000, 'UN MILLÓN', 'MILLONES')
  const miles = seccion(millones.resto, 1000, 'MIL', 'MIL')
  const centenas = convertirGrupo(miles.resto)

  if (millones.letras) letras += millones.letras
  if (miles.letras) {
    letras += (letras ? ' ' : '')
    // "MIL" no lleva número delante cuando es 1 (ej. 1500 -> MIL QUINIENTOS, no UN MIL)
    if (miles.letras === 'MIL') {
      letras += 'MIL'
    } else {
      letras += miles.letras
    }
  }
  if (centenas) letras += (letras ? ' ' : '') + centenas

  return letras.trim()
}

export function montoALetras(monto, moneda = 'SOLES') {
  const num = Number(monto) || 0
  const entero = Math.floor(num)
  const centavos = Math.round((num - entero) * 100)
  const centavosStr = String(centavos).padStart(2, '0')
  return `${enteroALetras(entero)} Y ${centavosStr}/100 ${moneda}`
}
