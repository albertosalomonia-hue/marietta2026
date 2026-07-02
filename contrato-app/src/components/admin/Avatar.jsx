import { useEffect, useState } from 'react'
import { useSignedUrl } from '../../hooks/useSignedUrl'

function iniciales(nombre) {
  return (nombre || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || '?'
}

export default function Avatar({ nombre, fotoPath, size = 'md' }) {
  const sizeClasses = size === 'lg' ? 'h-24 w-24 text-2xl' : size === 'sm' ? 'h-10 w-10 text-xs' : 'h-16 w-16 text-lg'
  const fotoUrl = useSignedUrl(fotoPath)
  const [fotoFallida, setFotoFallida] = useState(false)
  useEffect(() => setFotoFallida(false), [fotoPath])

  if (fotoUrl && !fotoFallida) {
    return (
      <img
        src={fotoUrl}
        alt={nombre}
        onError={() => setFotoFallida(true)}
        className={`${sizeClasses} rounded-full object-cover ring-1 ring-slate-200`}
      />
    )
  }

  return (
    <div className={`flex ${sizeClasses} items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 ring-1 ring-slate-200`}>
      {iniciales(nombre)}
    </div>
  )
}
