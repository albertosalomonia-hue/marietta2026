import { calcularEstadoEmpleado } from './employeeContracts'

const ESTADOS = { vigente: 'Vigente', alerta: 'Por vencer', vencido: 'Vencido' }

// Columnas de la plantilla: encabezado, ancho, formato opcional y cómo sacar el valor.
const COLUMNAS = [
  { header: 'N°', width: 5, value: (_e, i) => i + 1 },
  { header: 'Nombre completo', width: 34, value: (e) => e.nombre },
  { header: 'DNI', width: 12, value: (e) => e.dni },
  { header: 'Domicilio', width: 40, value: (e) => e.domicilio },
  { header: 'Cargo', width: 34, value: (e) => e.cargo },
  { header: 'Inicio primer contrato', width: 20, fmt: 'dd/mm/yyyy', value: (e) => fecha(e.fechaInicioPrimerContrato) },
  { header: 'Duración', width: 10, value: (e) => Number(e.duracionValor) || 0 },
  { header: 'Unidad', width: 10, value: (e) => e.duracionUnidad },
  { header: 'Jornada', width: 44, value: (e) => e.jornadaTexto },
  { header: 'Jurisdicción', width: 14, value: (e) => e.jurisdiccion },
  { header: 'Remuneración (S/)', width: 18, fmt: '#,##0.00', value: (e) => Number(e.remuneracion?.monto) || 0 },
  { header: 'Examen médico (S/)', width: 18, fmt: '#,##0.00', value: (e) => Number(e.gastos?.examenMedico) || 0 },
  { header: 'Cursos (S/)', width: 14, fmt: '#,##0.00', value: (e) => Number(e.gastos?.cursos) || 0 },
  { header: 'Seguros (S/)', width: 14, fmt: '#,##0.00', value: (e) => Number(e.gastos?.seguros) || 0 },
  { header: 'N° contratos', width: 12, value: (e) => e.contratos?.length || 0 },
  { header: 'Fin último contrato', width: 20, fmt: 'dd/mm/yyyy', value: (e) => fecha(e.contratos?.at(-1)?.fechaFin) },
  { header: 'Estado', width: 12, value: (e) => ESTADOS[calcularEstadoEmpleado(e).estado] },
  { header: 'Días restantes', width: 14, value: (e) => calcularEstadoEmpleado(e).diasRestantes },
]

// 'yyyy-mm-dd' -> Date en UTC (Excel lo muestra como fecha real, no como texto)
function fecha(iso) {
  if (!iso) return null
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, d))
}

// Genera y descarga un .xlsx con una fila por empleado. Sin empleados, descarga la plantilla vacía.
export async function descargarEmpleadosExcel(employees) {
  const { default: ExcelJS } = await import('exceljs')
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Empleados', { views: [{ state: 'frozen', ySplit: 1 }] })

  ws.columns = COLUMNAS.map((c) => ({ header: c.header, width: c.width, style: c.fmt ? { numFmt: c.fmt } : {} }))

  const header = ws.getRow(1)
  header.height = 24
  header.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
  })

  employees.forEach((emp, i) => ws.addRow(COLUMNAS.map((c) => c.value(emp, i))))

  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: COLUMNAS.length } }

  const buffer = await wb.xlsx.writeBuffer()
  const url = URL.createObjectURL(
    new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
  )
  const a = document.createElement('a')
  a.href = url
  a.download = `empleados_${new Date().toISOString().slice(0, 10)}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}
