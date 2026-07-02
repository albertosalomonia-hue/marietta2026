import { useState } from 'react'
import GeneradorTab from './GeneradorTab'
import EmpleadosAdmin from './admin/EmpleadosAdmin'
import DashboardTab from './admin/DashboardTab'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'empleados', label: 'Empleados' },
  { id: 'generador', label: 'Generador manual' },
]

export default function AdminApp({
  employees,
  employerConfig,
  onSaveEmployee,
  onEliminarEmployee,
  onGuardarEmployerConfig,
  onGenerarContrato,
  onFirmarContrato,
  onLogout,
}) {
  const [tab, setTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="no-print sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-slate-900 sm:text-lg">Contratos — Transportes Marietta</h1>
            <p className="hidden text-sm text-slate-500 sm:block">Administra empleados y genera sus contratos, o crea uno manual.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <nav className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-100 p-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                    tab === t.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
            <button
              type="button"
              onClick={onLogout}
              className="whitespace-nowrap rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:px-3 sm:text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {tab === 'generador' ? (
        <GeneradorTab />
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          {tab === 'dashboard' ? (
            <DashboardTab
              employees={employees}
              employerConfig={employerConfig}
              onGenerarContrato={onGenerarContrato}
              onFirmarContrato={onFirmarContrato}
            />
          ) : (
            <EmpleadosAdmin
              employees={employees}
              employerConfig={employerConfig}
              onSaveEmployee={onSaveEmployee}
              onEliminarEmployee={onEliminarEmployee}
              onGuardarEmployerConfig={onGuardarEmployerConfig}
              onGenerarContrato={onGenerarContrato}
              onFirmarContrato={onFirmarContrato}
            />
          )}
        </main>
      )}
    </div>
  )
}
