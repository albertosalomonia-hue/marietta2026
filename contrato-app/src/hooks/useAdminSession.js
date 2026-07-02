import { useEffect, useState } from 'react'
import { getSession, onAuthStateChange } from '../lib/auth'

export function useAdminSession() {
  const [session, setSession] = useState(undefined) // undefined = cargando, null = sin sesión

  useEffect(() => {
    getSession().then(setSession)
    return onAuthStateChange(setSession)
  }, [])

  return session
}
