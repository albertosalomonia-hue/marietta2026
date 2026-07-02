import { useState } from 'react'
import RoleChooser from './components/RoleChooser'
import EmployeePortal from './components/EmployeePortal'
import AdminApp from './components/AdminApp'
import { useAdminEmployees } from './hooks/useAdminData'
import { useEmployerConfig } from './hooks/useEmployerConfig'
import {
  deleteEmployeeRow,
  firmarContratoComoAdmin,
  firmarContratoEmpleado,
  insertContrato,
  insertEmployee,
  marcarContratoLeido,
  saveEmployerConfig,
  updateEmployeeRow,
} from './lib/api'
import { deleteFile, uploadAsAdmin, uploadEmployeeSignature } from './lib/storageFiles'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const { employees, loading, refetch } = useAdminEmployees(isAdmin)
  const { employerConfig, loading: loadingEmployerConfig, refetch: refetchEmployerConfig } = useEmployerConfig()

  const [portalEmployee, setPortalEmployee] = useState(null)

  // ---------- Mutaciones de admin ----------

  const handleSaveEmployee = async (employee, { fotoDataUrl, fotoRemoved }) => {
    let fotoPath = employee.fotoPath
    if (fotoDataUrl) {
      fotoPath = await uploadAsAdmin(`photos/${employee.id}.png`, fotoDataUrl)
    } else if (fotoRemoved) {
      if (employee.fotoPath) await deleteFile(employee.fotoPath)
      fotoPath = null
    }
    const employeeConFoto = { ...employee, fotoPath }

    const yaExiste = employees.some((e) => e.id === employee.id)
    if (yaExiste) {
      await updateEmployeeRow(employee.id, employeeConFoto)
    } else {
      await insertEmployee(employeeConFoto)
    }
    await refetch()
  }

  const handleEliminarEmployee = async (employee) => {
    if (!confirm(`¿Eliminar a ${employee.nombre}? Se perderá su historial de contratos.`)) return
    await deleteEmployeeRow(employee.id)
    await refetch()
  }

  const handleGuardarEmployerConfig = async (config) => {
    await saveEmployerConfig(config)
    await refetchEmployerConfig()
  }

  const handleGenerarContrato = async (employeeId, nuevoContrato) => {
    await insertContrato(employeeId, nuevoContrato)
    await refetch()
  }

  // El admin registra la firma del empleado en su nombre (ej. lo firma en persona frente a él).
  const handleFirmarContratoAdmin = async (employeeId, contratoId, resultado) => {
    const path = resultado.dataUrl ? await uploadAsAdmin(`signatures/${contratoId}-admin.png`, resultado.dataUrl) : resultado.existingPath
    await firmarContratoComoAdmin(contratoId, path)
    await refetch()
  }

  // ---------- Mutaciones del portal de empleado (rol anon, con PIN) ----------

  const handleMarcarLeido = async (contratoId) => {
    await marcarContratoLeido(contratoId)
    setPortalEmployee((prev) => ({
      ...prev,
      contratos: prev.contratos.map((c) => (c.id === contratoId ? { ...c, leidoEn: new Date().toISOString() } : c)),
    }))
  }

  const handleFirmarEmpleado = async (contratoId, resultado) => {
    const path = resultado.dataUrl ? await uploadEmployeeSignature(contratoId, resultado.dataUrl) : resultado.existingPath
    await firmarContratoEmpleado(contratoId, path)
    setPortalEmployee((prev) => ({
      ...prev,
      contratos: prev.contratos.map((c) =>
        c.id === contratoId ? { ...c, firmaEmpleadoPath: path, firmaEmpleadoEn: new Date().toISOString() } : c,
      ),
    }))
  }

  // ---------- Enrutamiento ----------

  if (isAdmin) {
    if (loading || loadingEmployerConfig || !employerConfig) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500">
          Cargando datos…
        </div>
      )
    }
    return (
      <AdminApp
        employees={employees}
        employerConfig={employerConfig}
        onSaveEmployee={handleSaveEmployee}
        onEliminarEmployee={handleEliminarEmployee}
        onGuardarEmployerConfig={handleGuardarEmployerConfig}
        onGenerarContrato={handleGenerarContrato}
        onFirmarContrato={handleFirmarContratoAdmin}
        onLogout={() => setIsAdmin(false)}
      />
    )
  }

  if (portalEmployee) {
    if (loadingEmployerConfig || !employerConfig) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500">
          Cargando…
        </div>
      )
    }
    return (
      <EmployeePortal
        employee={portalEmployee}
        employerConfig={employerConfig}
        onMarcarLeido={handleMarcarLeido}
        onFirmar={handleFirmarEmpleado}
        onLogout={() => setPortalEmployee(null)}
      />
    )
  }

  return <RoleChooser onEnterAdmin={() => setIsAdmin(true)} onEnterEmployee={setPortalEmployee} />
}

export default App
