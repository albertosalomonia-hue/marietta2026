import { useState } from 'react'
import RoleChooser from './components/RoleChooser'
import EmployeePortal from './components/EmployeePortal'
import AdminApp from './components/AdminApp'
import { useEmployeeStore } from './hooks/useEmployeeStore'

function App() {
  const { employees, setEmployees, employerConfig, setEmployerConfig, updateEmployee } = useEmployeeStore()
  const [session, setSession] = useState(null) // null | { role: 'admin' } | { role: 'empleado', employeeId }

  const handleGenerarContrato = (employeeId, nuevoContrato) => {
    updateEmployee(employeeId, (e) => ({ ...e, contratos: [...e.contratos, nuevoContrato] }))
  }

  const handleFirmarContrato = (employeeId, contratoId, firmaDataUrl) => {
    updateEmployee(employeeId, (e) => ({
      ...e,
      contratos: e.contratos.map((c) =>
        c.id === contratoId ? { ...c, firmaEmpleado: firmaDataUrl, firmaEmpleadoEn: new Date().toISOString() } : c,
      ),
    }))
  }

  const handleMarcarLeido = (employeeId, contratoId) => {
    updateEmployee(employeeId, (e) => ({
      ...e,
      contratos: e.contratos.map((c) => (c.id === contratoId ? { ...c, leidoEn: new Date().toISOString() } : c)),
    }))
  }

  if (!session) {
    return (
      <RoleChooser
        employees={employees}
        onEnterAdmin={() => setSession({ role: 'admin' })}
        onEnterEmployee={(employeeId) => setSession({ role: 'empleado', employeeId })}
      />
    )
  }

  if (session.role === 'empleado') {
    const employee = employees.find((e) => e.id === session.employeeId)
    if (!employee) {
      setSession(null)
      return null
    }
    return (
      <EmployeePortal
        employee={employee}
        employerConfig={employerConfig}
        onMarcarLeido={(contratoId) => handleMarcarLeido(employee.id, contratoId)}
        onFirmar={(contratoId, firmaDataUrl) => handleFirmarContrato(employee.id, contratoId, firmaDataUrl)}
        onLogout={() => setSession(null)}
      />
    )
  }

  return (
    <AdminApp
      employees={employees}
      setEmployees={setEmployees}
      employerConfig={employerConfig}
      setEmployerConfig={setEmployerConfig}
      onGenerarContrato={handleGenerarContrato}
      onFirmarContrato={handleFirmarContrato}
      onLogout={() => setSession(null)}
    />
  )
}

export default App
