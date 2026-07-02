import { useState } from 'react'
import Modal from './Modal'
import Field, { TextInput } from '../Field'
import PhotoInput from './PhotoInput'

export default function EmployeeFormModal({ initialEmployee, onSave, onClose }) {
  const [employee, setEmployee] = useState(initialEmployee)

  const set = (path) => (e) => {
    const value = e.target.value
    setEmployee((prev) => {
      const next = { ...prev }
      if (path.includes('.')) {
        const [group, key] = path.split('.')
        next[group] = { ...next[group], [key]: value }
      } else {
        next[path] = value
      }
      return next
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!employee.nombre.trim() || !employee.dni.trim()) {
      alert('Nombre y DNI son obligatorios.')
      return
    }
    onSave(employee)
  }

  const isNew = employee.contratos.length === 0

  return (
    <Modal title={initialEmployee.nombre ? 'Editar empleado' : 'Nuevo empleado'} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Foto">
          <PhotoInput value={employee.foto} onChange={(foto) => setEmployee((prev) => ({ ...prev, foto }))} />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Nombre completo">
            <TextInput required value={employee.nombre} onChange={set('nombre')} />
          </Field>
          <Field label="DNI">
            <TextInput required value={employee.dni} onChange={set('dni')} />
          </Field>
          <Field label="Domicilio real">
            <TextInput value={employee.domicilio} onChange={set('domicilio')} />
          </Field>
          <Field label="Cargo">
            <TextInput value={employee.cargo} onChange={set('cargo')} />
          </Field>
          <Field label="PIN de acceso (4 dígitos, para que el empleado vea/firme su contrato)">
            <div className="flex gap-2">
              <TextInput
                inputMode="numeric"
                maxLength={4}
                placeholder="Ej. 7990"
                value={employee.pin}
                onChange={set('pin')}
                className="w-28"
              />
              <button
                type="button"
                onClick={() => setEmployee((prev) => ({ ...prev, pin: prev.dni.slice(-4) }))}
                className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Usar últimos 4 del DNI
              </button>
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-2">
          <Field label="Duración de cada contrato">
            <div className="flex gap-2">
              <TextInput
                type="number"
                min="1"
                value={employee.duracionValor}
                onChange={set('duracionValor')}
                className="w-24"
              />
              <select
                value={employee.duracionUnidad}
                onChange={set('duracionUnidad')}
                className="rounded-md border border-slate-300 px-2 py-2 text-sm"
              >
                <option value="meses">Meses</option>
                <option value="dias">Días</option>
              </select>
            </div>
          </Field>
          <Field label="Avisar con cuántos días de anticipación">
            <TextInput type="number" min="0" value={employee.alertaDiasAntes} onChange={set('alertaDiasAntes')} />
          </Field>
          <Field label={isNew ? 'Fecha de inicio del primer contrato' : 'Fecha de inicio del primer contrato (histórico)'}>
            <TextInput type="date" value={employee.fechaInicioPrimerContrato} onChange={set('fechaInicioPrimerContrato')} disabled={!isNew} />
          </Field>
          <Field label="Jornada de trabajo">
            <TextInput value={employee.jornadaTexto} onChange={set('jornadaTexto')} />
          </Field>
          <Field label="Jurisdicción">
            <TextInput value={employee.jurisdiccion} onChange={set('jurisdiccion')} />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-2">
          <Field label="Remuneración mensual neta (S/.)">
            <TextInput type="number" step="0.01" value={employee.remuneracion.monto} onChange={set('remuneracion.monto')} />
          </Field>
          <Field label="Texto en letras (opcional)">
            <TextInput placeholder="Se genera automáticamente" value={employee.remuneracion.monedaTexto} onChange={set('remuneracion.monedaTexto')} />
          </Field>
          <Field label="Examen médico (S/.)">
            <TextInput type="number" step="0.01" value={employee.gastos.examenMedico} onChange={set('gastos.examenMedico')} />
          </Field>
          <Field label="Cursos con certificación (S/.)">
            <TextInput type="number" step="0.01" value={employee.gastos.cursos} onChange={set('gastos.cursos')} />
          </Field>
          <Field label="Seguros SCTR y Vida Ley (S/.)">
            <TextInput type="number" step="0.01" value={employee.gastos.seguros} onChange={set('gastos.seguros')} />
          </Field>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancelar
          </button>
          <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  )
}
