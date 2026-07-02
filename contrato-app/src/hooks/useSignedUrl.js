import { useEffect, useState } from 'react'
import { getSignedUrl } from '../lib/storageFiles'

// Resuelve una ruta de Supabase Storage a una URL firmada temporal para poder
// usarla directamente en un <img src>. Devuelve null mientras carga o si no hay ruta.
export function useSignedUrl(path) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    let cancelled = false
    if (!path) {
      setUrl(null)
      return
    }
    getSignedUrl(path).then((signedUrl) => {
      if (!cancelled) setUrl(signedUrl)
    })
    return () => {
      cancelled = true
    }
  }, [path])

  return url
}
