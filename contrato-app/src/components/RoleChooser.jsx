import { useState } from 'react'

export default function RoleChooser({ employees, onEnterAdmin, onEnterEmployee }) {
  const [mode, setMode] = useState(null) // null | 'empleado'
  const [selectedId, setSelectedId] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const handleEmployeeLogin = (e) => {
    e.preventDefault()
    const employee = employees.find((emp) => emp.id === selectedId)
    if (!employee) {
      setError('Selecciona tu nombre de la lista.')
      return
    }
    if (!employee.pin) {
      setError('Este empleado no tiene PIN configurado. Contacta al administrador.')
      return
    }
    if (pin !== employee.pin) {
      setError('PIN incorrecto.')
      return
    }
    onEnterEmployee(employee.id)
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
                {employees.map((emp) => (
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
              <button type="submit" className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                Entrar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
