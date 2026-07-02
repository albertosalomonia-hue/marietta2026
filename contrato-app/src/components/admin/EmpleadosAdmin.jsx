import { useState } from 'react'
import EmployeeTable from './EmployeeTable'
import EmployerConfigPanel from './EmployerConfigPanel'
import EmployeeFormModal from './EmployeeFormModal'
import ContratosModal from './ContratosModal'
import { crearEmpleadoVacio } from '../../utils/employeeContracts'

export default function EmpleadosAdmin({
  employees,
  setEmployees,
  employerConfig,
  setEmployerConfig,
  onGenerarContrato,
  onFirmarContrato,
}) {
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [contratosEmployeeId, setContratosEmployeeId] = useState(null)

  const contratosEmployee = employees.find((e) => e.id === contratosEmployeeId) || null

  const handleSaveEmployee = (employee) => {
    setEmployees((prev) => {
      const exists = prev.some((e) => e.id === employee.id)
      return exists ? prev.map((e) => (e.id === employee.id ? employee : e)) : [...prev, employee]
    })
    setEditingEmployee(null)
  }

  const handleEliminar = (employee) => {
    if (!confirm(`¿Eliminar a ${employee.nombre}? Se perderá su historial de contratos.`)) return
    setEmployees((prev) => prev.filter((e) => e.id !== employee.id))
  }

  return (
    <div className="flex flex-col gap-4">
      <EmployerConfigPanel employerConfig={employerConfig} onSave={setEmployerConfig} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-900">Empleados registrados</h2>
        <button
          type="button"
          onClick={() => setEditingEmployee(crearEmpleadoVacio())}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Nuevo empleado
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <EmployeeTable
          employees={employees}
          onVerContratos={(emp) => setContratosEmployeeId(emp.id)}
          onEditar={(emp) => setEditingEmployee(emp)}
          onEliminar={handleEliminar}
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
