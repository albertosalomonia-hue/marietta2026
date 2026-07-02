import { useEffect, useState } from 'react'
import { listarEmpleadosParaLogin, loginEmpleado } from '../lib/api'

export default function RoleChooser({ onEnterAdmin, onEnterEmployee }) {
  const [mode, setMode] = useState(null) // null | 'empleado'
  const [empleadosLista, setEmpleadosLista] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (mode === 'empleado') {
      listarEmpleadosParaLogin().then(setEmpleadosLista)
    }
  }, [mode])

  const handleEmployeeLogin = async (e) => {
    e.preventDefault()
    if (!selectedId) {
      setError('Selecciona tu nombre de la lista.')
      return
    }
    setError('')
    setEnviando(true)
    try {
      const employee = await loginEmpleado(selectedId, pin)
      if (!employee) {
        setError('PIN incorrecto o el empleado no tiene PIN configurado.')
        return
      }
      onEnterEmployee(employee)
    } catch (err) {
      setError('Ocurrió un error al iniciar sesión. Intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-center text-xl font-bold text-slate-900">Contratos — Transportes Marietta</h1>
        <p className="mb-6 text-center text-sm text-slate-500">¿Quién eres?</p>

        {mode !== 'empleado' ? (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onEnterAdmin}
              className="rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Soy administrador
            </button>
            <button
              type="button"
              onClick={() => setMode('empleado')}
              className="rounded-md border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Soy empleado
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmployeeLogin} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-slate-700">Mi nombre</span>
              <select
                required
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Selecciona tu nombre…</option>
                {empleadosLista.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-slate-700">PIN</span>
              <input
                required
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm tracking-widest"
                placeholder="••••"
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode(null)
                  setError('')
                }}
                className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {enviando ? 'Entrando…' : 'Entrar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
