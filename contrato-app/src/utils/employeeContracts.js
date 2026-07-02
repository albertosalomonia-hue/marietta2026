import { diferenciaEnDias, hoyISO, sumarDiasISO, sumarMesesISO } from './fechas'
import { getSignedUrl } from '../lib/storageFiles'

export function computeFechaFin(fechaInicioISO, duracionValor, duracionUnidad) {
  const valor = Number(duracionValor) || 0
  if (duracionUnidad === 'meses') return sumarMesesISO(fechaInicioISO, valor)
  return sumarDiasISO(fechaInicioISO, Math.max(valor - 1, 0))
}

export function formatearPlazoTexto(duracionValor, duracionUnidad) {
  const valor = Number(duracionValor) || 0
  const valorStr = String(valor).padStart(2, '0')
  if (duracionUnidad === 'meses') return `${valorStr} ${valor === 1 ? 'mes' : 'meses'}`
  return `${valorStr} ${valor === 1 ? 'día' : 'días'}`
}

export function crearId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function crearEmpleadoVacio() {
  return {
    id: crearId(),
    nombre: '',
    dni: '',
    domicilio: '',
    cargo: 'TRIPULANTE DE EMBARCACIÓN FLUVIAL',
    fotoPath: null,
    pin: '',
    duracionValor: 1,
    duracionUnidad: 'meses',
    alertaDiasAntes: 7,
    fechaInicioPrimerContrato: hoyISO(),
    jornadaTexto: '28 días de trabajo en campo por 10 días de descanso',
    jurisdiccion: 'Maynas',
    remuneracion: { monto: '1500.00', monedaTexto: '' },
    gastos: { examenMedico: '306.00', cursos: '200.00', seguros: '150.00' },
    contratos: [],
  }
}

// Arma el objeto de datos que espera ContractPreview/buildContractBlocks a partir de
// la config de empresa persistida + un empleado + un contrato puntual de su historial.
// Resuelve las rutas de Storage (foto/firmas) a URLs firmadas temporales, así el resto
// del árbol de renderizado (ContractPreview) sigue trabajando con URLs de imagen simples.
export async function buildContractData(empleadorConfig, employee, contrato) {
  const [gerenteFirma, firmaEmpleado] = await Promise.all([
    getSignedUrl(empleadorConfig.gerenteFirmaPath),
    getSignedUrl(contrato.firmaEmpleadoPath),
  ])

  return {
    empleador: { ...empleadorConfig, gerenteFirma },
    trabajador: {
      nombre: employee.nombre,
      dni: employee.dni,
      domicilio: employee.domicilio,
      cargo: employee.cargo,
    },
    contrato: {
      plazoTexto: contrato.plazoTexto,
      fechaInicio: contrato.fechaInicio,
      fechaFin: contrato.fechaFin,
      fechaFirma: contrato.fechaFirma,
      jornadaTexto: employee.jornadaTexto,
      jurisdiccion: employee.jurisdiccion,
      firmaEmpleado,
      firmaEmpleadoEn: contrato.firmaEmpleadoEn || null,
    },
    remuneracion: {
      monto: contrato.monto,
      monedaTexto: employee.remuneracion?.monedaTexto || '',
    },
    gastos: employee.gastos,
  }
}

// Calcula los datos del próximo contrato a generar para un empleado (no lo persiste).
export function generarSiguienteContrato(employee) {
  const ultimo = employee.contratos[employee.contratos.length - 1]
  const fechaInicio = ultimo ? sumarDiasISO(ultimo.fechaFin, 1) : employee.fechaInicioPrimerContrato
  const fechaFin = computeFechaFin(fechaInicio, employee.duracionValor, employee.duracionUnidad)
  return {
    id: crearId(),
    fechaInicio,
    fechaFin,
    fechaFirma: fechaInicio,
    plazoTexto: formatearPlazoTexto(employee.duracionValor, employee.duracionUnidad),
    monto: employee.remuneracion.monto,
    generadoEn: new Date().toISOString(),
    firmaEmpleadoPath: null,
    firmaEmpleadoEn: null,
    leidoEn: null,
  }
}

// Devuelve la ruta de Storage de la firma más reciente que el empleado ya usó en algún
// contrato anterior (o null si nunca firmó). Se usa para ofrecer "Usar mi firma guardada"
// sin tener que volver a subir el archivo (se reutiliza la misma ruta ya existente).
export function obtenerFirmaGuardadaPath(employee) {
  const firmados = employee.contratos.filter((c) => c.firmaEmpleadoPath)
  if (!firmados.length) return null
  return firmados[firmados.length - 1].firmaEmpleadoPath
}

// Determina el estado del empleado respecto a su próximo evento de contrato (generación o renovación).
// Devuelve { tipo: 'primer_contrato' | 'renovacion', fechaReferencia, diasRestantes, estado }
// estado: 'vigente' | 'alerta' | 'vencido'
export function calcularEstadoEmpleado(employee, referenciaISO = hoyISO()) {
  const ultimo = employee.contratos[employee.contratos.length - 1]
  const tipo = ultimo ? 'renovacion' : 'primer_contrato'
  const fechaReferencia = ultimo ? ultimo.fechaFin : employee.fechaInicioPrimerContrato
  const diasRestantes = diferenciaEnDias(fechaReferencia, referenciaISO)
  const alertaDiasAntes = Number(employee.alertaDiasAntes) || 0

  let estado = 'vigente'
  if (diasRestantes < 0) estado = 'vencido'
  else if (diasRestantes <= alertaDiasAntes) estado = 'alerta'

  return { tipo, fechaReferencia, diasRestantes, estado }
}
