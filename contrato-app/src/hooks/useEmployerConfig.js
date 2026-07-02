import { useCallback, useEffect, useState } from 'react'
import { fetchEmployerConfig } from '../lib/api'

// La config de la empresa es legible tanto por el admin como por el portal de empleado
// (rol anon), así que se carga siempre, sin depender de si hay sesión de administrador.
export function useEmployerConfig() {
  const [employerConfig, setEmployerConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    const cfg = await fetchEmployerConfig()
    setEmployerConfig(cfg)
    return cfg
  }, [])

  useEffect(() => {
    refetch().finally(() => setLoading(false))
  }, [refetch])

  return { employerConfig, loading, refetch }
}
