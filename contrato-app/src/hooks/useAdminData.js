import { useCallback, useEffect, useState } from 'react'
import { fetchEmployeesWithContratos } from '../lib/api'

// Lista de empleados: solo se consulta cuando el usuario entró como administrador
// (ver RLS en supabase/schema.sql — actualmente abierta al rol anon, sin login real).
export function useAdminEmployees(isAdmin) {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    const emps = await fetchEmployeesWithContratos()
    setEmployees(emps)
  }, [])

  useEffect(() => {
    if (!isAdmin) return
    setLoading(true)
    refetch().finally(() => setLoading(false))
  }, [isAdmin, refetch])

  return { employees, loading, refetch }
}
