import { useState } from 'react'
import EmployeeCard from './EmployeeCard'
import AlertsBanner from './AlertsBanner'
import ContratosModal from './ContratosModal'

export default function DashboardTab({ employees, employerConfig, onGenerarContrato, onFirmarContrato }) {
  const [contratosEmployeeId, setContratosEmployeeId] = useState(null)
  const contratosEmployee = employees.find((e) => e.id === contratosEmployeeId) || null

  return (
    <div className="flex flex-col gap-4">
      <AlertsBanner employees={employees} onVerEmpleado={(emp) => setContratosEmployeeId(emp.id)} />

      {employees.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          Todavía no hay empleados registrados. Agrégalos desde la pestaña "Empleados".
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {employees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} onClick={() => setContratosEmployeeId(emp.id)} />
          ))}
        </div>
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
