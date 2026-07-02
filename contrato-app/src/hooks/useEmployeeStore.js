import { useEffect, useState } from 'react'
import { loadEmployees, saveEmployees, loadEmployerConfig, saveEmployerConfig } from '../utils/storage'
import { defaultData } from '../utils/defaultData'

// Estado compartido de empleados/empresa, persistido en localStorage.
// Vive en App.jsx para que tanto el panel de administrador como el portal
// de autoservicio del empleado lean y escriban sobre los mismos datos.
export function useEmployeeStore() {
  const [employees, setEmployees] = useState(() => loadEmployees())
  const [employerConfig, setEmployerConfig] = useState(() => loadEmployerConfig(defaultData.empleador))

  useEffect(() => {
    saveEmployees(employees)
  }, [employees])

  useEffect(() => {
    saveEmployerConfig(employerConfig)
  }, [employerConfig])

  const updateEmployee = (employeeId, updater) => {
    setEmployees((prev) => prev.map((e) => (e.id === employeeId ? updater(e) : e)))
  }

  return { employees, setEmployees, employerConfig, setEmployerConfig, updateEmployee }
}
