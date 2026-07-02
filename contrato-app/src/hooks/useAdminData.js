import { useCallback, useEffect, useState } from 'react'
import { fetchEmployeesWithContratos } from '../lib/api'

// Lista de empleados: solo la puede leer un administrador autenticado (ver RLS en supabase/schema.sql).
export function useAdminEmployees(session) {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    const emps = await fetchEmployeesWithContratos()
    setEmployees(emps)
  }, [])

  useEffect(() => {
    if (!session) return
    setLoading(true)
    refetch().finally(() => setLoading(false))
  }, [session, refetch])

  return { employees, loading, refetch }
}
