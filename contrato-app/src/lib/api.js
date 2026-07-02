import { supabase } from './supabaseClient'

// ---------- Mapeo DB (snake_case) <-> forma que usa el resto de la app (camelCase) ----------

function mapEmployerConfig(row) {
  return {
    razonSocial: row.razon_social,
    ruc: row.ruc,
    domicilioFiscal: row.domicilio_fiscal,
    gerente: row.gerente,
    gerenteDni: row.gerente_dni,
    fechaInicioActividades: row.fecha_inicio_actividades,
    fechaRemype: row.fecha_remype,
    fechaAcreditacion: row.fecha_acreditacion,
    gerenteFirmaPath: row.gerente_firma_path || null,
  }
}

function mapEmployerConfigToRow(config) {
  return {
    razon_social: config.razonSocial,
    ruc: config.ruc,
    domicilio_fiscal: config.domicilioFiscal,
    gerente: config.gerente,
    gerente_dni: config.gerenteDni,
    fecha_inicio_actividades: config.fechaInicioActividades,
    fecha_remype: config.fechaRemype,
    fecha_acreditacion: config.fechaAcreditacion,
    gerente_firma_path: config.gerenteFirmaPath ?? null,
  }
}

function mapContrato(row) {
  return {
    id: row.id,
    fechaInicio: row.fecha_inicio,
    fechaFin: row.fecha_fin,
    fechaFirma: row.fecha_firma,
    plazoTexto: row.plazo_texto,
    monto: row.monto,
    generadoEn: row.generado_en,
    firmaEmpleadoPath: row.firma_empleado_path || null,
    firmaEmpleadoEn: row.firma_empleado_en || null,
    leidoEn: row.leido_en || null,
  }
}

function mapEmployee(row, contratoRows = []) {
  return {
    id: row.id,
    nombre: row.nombre,
    dni: row.dni,
    domicilio: row.domicilio,
    cargo: row.cargo,
    fotoPath: row.foto_path || null,
    pin: row.pin || '',
    duracionValor: row.duracion_valor,
    duracionUnidad: row.duracion_unidad,
    alertaDiasAntes: row.alerta_dias_antes,
    fechaInicioPrimerContrato: row.fecha_inicio_primer_contrato,
    jornadaTexto: row.jornada_texto,
    jurisdiccion: row.jurisdiccion,
    remuneracion: { monto: row.remuneracion_monto, monedaTexto: row.remuneracion_moneda_texto || '' },
    gastos: {
      examenMedico: row.gastos_examen_medico,
      cursos: row.gastos_cursos,
      seguros: row.gastos_seguros,
    },
    contratos: contratoRows.map(mapContrato).sort((a, b) => (a.fechaInicio < b.fechaInicio ? -1 : 1)),
  }
}

function mapEmployeeToRow(employee) {
  return {
    nombre: employee.nombre,
    dni: employee.dni,
    domicilio: employee.domicilio,
    cargo: employee.cargo,
    foto_path: employee.fotoPath ?? null,
    pin: employee.pin || null,
    duracion_valor: Number(employee.duracionValor) || 1,
    duracion_unidad: employee.duracionUnidad,
    alerta_dias_antes: Number(employee.alertaDiasAntes) || 0,
    fecha_inicio_primer_contrato: employee.fechaInicioPrimerContrato,
    jornada_texto: employee.jornadaTexto,
    jurisdiccion: employee.jurisdiccion,
    remuneracion_monto: Number(employee.remuneracion.monto) || 0,
    remuneracion_moneda_texto: employee.remuneracion.monedaTexto || '',
    gastos_examen_medico: Number(employee.gastos.examenMedico) || 0,
    gastos_cursos: Number(employee.gastos.cursos) || 0,
    gastos_seguros: Number(employee.gastos.seguros) || 0,
  }
}

function mapContratoNuevoToRow(employeeId, contrato) {
  return {
    id: contrato.id,
    employee_id: employeeId,
    fecha_inicio: contrato.fechaInicio,
    fecha_fin: contrato.fechaFin,
    fecha_firma: contrato.fechaFirma,
    plazo_texto: contrato.plazoTexto,
    monto: Number(contrato.monto) || 0,
    generado_en: contrato.generadoEn,
  }
}

function assertNoError(error, context) {
  if (error) {
    console.error(`Error en ${context}:`, error)
    throw error
  }
}

// ---------- Empleador (config de empresa) ----------

export async function fetchEmployerConfig() {
  const { data, error } = await supabase.from('employer_config').select('*').eq('id', true).single()
  assertNoError(error, 'fetchEmployerConfig')
  return mapEmployerConfig(data)
}

export async function saveEmployerConfig(config) {
  const { error } = await supabase.from('employer_config').update(mapEmployerConfigToRow(config)).eq('id', true)
  assertNoError(error, 'saveEmployerConfig')
}

// ---------- Empleados (admin, requiere sesión autenticada) ----------

export async function fetchEmployeesWithContratos() {
  const [{ data: employeeRows, error: empError }, { data: contratoRows, error: contError }] = await Promise.all([
    supabase.from('employees').select('*').order('nombre'),
    supabase.from('contratos').select('*'),
  ])
  assertNoError(empError, 'fetchEmployeesWithContratos (employees)')
  assertNoError(contError, 'fetchEmployeesWithContratos (contratos)')

  return employeeRows.map((row) =>
    mapEmployee(
      row,
      contratoRows.filter((c) => c.employee_id === row.id),
    ),
  )
}

export async function insertEmployee(employee) {
  const { data, error } = await supabase.from('employees').insert(mapEmployeeToRow(employee)).select().single()
  assertNoError(error, 'insertEmployee')
  return mapEmployee(data, [])
}

export async function updateEmployeeRow(employeeId, employee) {
  const { error } = await supabase.from('employees').update(mapEmployeeToRow(employee)).eq('id', employeeId)
  assertNoError(error, 'updateEmployeeRow')
}

export async function deleteEmployeeRow(employeeId) {
  const { error } = await supabase.from('employees').delete().eq('id', employeeId)
  assertNoError(error, 'deleteEmployeeRow')
}

export async function insertContrato(employeeId, contrato) {
  const { error } = await supabase.from('contratos').insert(mapContratoNuevoToRow(employeeId, contrato))
  assertNoError(error, 'insertContrato')
}

// Firma que el propio administrador registra en nombre del empleado (ej. lo firma en persona
// frente al admin). Usa la sesión autenticada, así que actualiza la tabla directamente.
export async function firmarContratoComoAdmin(contratoId, firmaPath) {
  const { error } = await supabase
    .from('contratos')
    .update({ firma_empleado_path: firmaPath, firma_empleado_en: new Date().toISOString() })
    .eq('id', contratoId)
  assertNoError(error, 'firmarContratoComoAdmin')
}

// ---------- Portal de empleado (rol anon, vía funciones RPC) ----------

export async function listarEmpleadosParaLogin() {
  const { data, error } = await supabase.rpc('listar_empleados_login')
  assertNoError(error, 'listarEmpleadosParaLogin')
  return data
}

export async function loginEmpleado(employeeId, pin) {
  const { data, error } = await supabase.rpc('login_empleado', { p_employee_id: employeeId, p_pin: pin })
  assertNoError(error, 'loginEmpleado')
  if (!data) return null
  return mapEmployee(
    {
      id: data.id,
      nombre: data.nombre,
      dni: data.dni,
      domicilio: data.domicilio,
      cargo: data.cargo,
      foto_path: data.foto_path,
      pin: '',
      duracion_valor: data.duracion_valor,
      duracion_unidad: data.duracion_unidad,
      alerta_dias_antes: data.alerta_dias_antes,
      fecha_inicio_primer_contrato: data.fecha_inicio_primer_contrato,
      jornada_texto: data.jornada_texto,
      jurisdiccion: data.jurisdiccion,
      remuneracion_monto: data.remuneracion_monto,
      remuneracion_moneda_texto: data.remuneracion_moneda_texto,
      gastos_examen_medico: data.gastos_examen_medico,
      gastos_cursos: data.gastos_cursos,
      gastos_seguros: data.gastos_seguros,
    },
    data.contratos,
  )
}

export async function marcarContratoLeido(contratoId) {
  const { error } = await supabase.rpc('marcar_contrato_leido', { p_contrato_id: contratoId })
  assertNoError(error, 'marcarContratoLeido')
}

export async function firmarContratoEmpleado(contratoId, firmaPath) {
  const { error } = await supabase.rpc('firmar_contrato_empleado', { p_contrato_id: contratoId, p_firma_path: firmaPath })
  assertNoError(error, 'firmarContratoEmpleado')
}
