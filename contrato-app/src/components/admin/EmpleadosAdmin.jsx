import { useState } from 'react'
import EmployeeTable from './EmployeeTable'
import EmployerConfigPanel from './EmployerConfigPanel'
import EmployeeFormModal from './EmployeeFormModal'
import ContratosModal from './ContratosModal'
import { crearEmpleadoVacio } from '../../utils/employeeContracts'
import { descargarEmpleadosExcel } from '../../utils/exportEmpleadosExcel'

export default function EmpleadosAdmin({
  employees,
  employerConfig,
  onSaveEmployee,
  onEliminarEmployee,
  onGuardarEmployerConfig,
  onGenerarContrato,
  onFirmarContrato,
}) {
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [contratosEmployeeId, setContratosEmployeeId] = useState(null)

  const contratosEmployee = employees.find((e) => e.id === contratosEmployeeId) || null

  const handleSaveEmployee = async (employee, fotoInfo) => {
    await onSaveEmployee(employee, fotoInfo)
    setEditingEmployee(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <EmployerConfigPanel employerConfig={employerConfig} onSave={onGuardarEmployerConfig} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-900">Empleados registrados</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => descargarEmpleadosExcel(employees)}
            className="rounded-md border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
          >
            ⬇ Descargar Excel
          </button>
          <button
            type="button"
            onClick={() => setEditingEmployee(crearEmpleadoVacio())}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + Nuevo empleado
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <EmployeeTable
          employees={employees}
          onVerContratos={(emp) => setContratosEmployeeId(emp.id)}
          onEditar={(emp) => setEditingEmployee(emp)}
          onEliminar={onEliminarEmployee}
        />
      </div>

      {editingEmployee && (
        <EmployeeFormModal
          initialEmployee={editingEmployee}
          onSave={handleSaveEmployee}
          onClose={() => setEditingEmployee(null)}
        />
      )}

      {contratosEmployee && (
        <ContratosModal
          employee={contratosEmployee}
          employerConfig={employerConfig}
          onGenerarContrato={onGenerarContrato}
          onFirmarContrato={onFirmarContrato}
          onClose={() => setContratosEmployeeId(null)}
        />
      )}
    </div>
  )
}
