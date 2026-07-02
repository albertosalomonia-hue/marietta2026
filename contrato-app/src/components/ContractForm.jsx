import Field, { TextInput, TextArea } from './Field'

function Section({ title, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-700">{title}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </div>
  )
}

export default function ContractForm({ data, onChange, onReset }) {
  const set = (group, key) => (e) => {
    const value = e.target.value
    onChange((prev) => ({ ...prev, [group]: { ...prev[group], [key]: value } }))
  }

  return (
    <div className="flex flex-col gap-4">
      <Section title="Empleador">
        <Field label="Razón social">
          <TextInput value={data.empleador.razonSocial} onChange={set('empleador', 'razonSocial')} />
        </Field>
        <Field label="RUC">
          <TextInput value={data.empleador.ruc} onChange={set('empleador', 'ruc')} />
        </Field>
        <Field label="Domicilio fiscal">
          <TextArea rows={2} className="sm:col-span-2" value={data.empleador.domicilioFiscal} onChange={set('empleador', 'domicilioFiscal')} />
        </Field>
        <Field label="Gerente general">
          <TextInput value={data.empleador.gerente} onChange={set('empleador', 'gerente')} />
        </Field>
        <Field label="DNI del gerente">
          <TextInput value={data.empleador.gerenteDni} onChange={set('empleador', 'gerenteDni')} />
        </Field>
        <Field label="Inicio de actividades">
          <TextInput value={data.empleador.fechaInicioActividades} onChange={set('empleador', 'fechaInicioActividades')} />
        </Field>
        <Field label="Fecha de inscripción REMYPE">
          <TextInput value={data.empleador.fechaRemype} onChange={set('empleador', 'fechaRemype')} />
        </Field>
        <Field label="Fecha de acreditación">
          <TextInput value={data.empleador.fechaAcreditacion} onChange={set('empleador', 'fechaAcreditacion')} />
        </Field>
      </Section>

      <Section title="Trabajador">
        <Field label="Nombre completo">
          <TextInput value={data.trabajador.nombre} onChange={set('trabajador', 'nombre')} />
        </Field>
        <Field label="DNI">
          <TextInput value={data.trabajador.dni} onChange={set('trabajador', 'dni')} />
        </Field>
        <Field label="Domicilio real">
          <TextArea rows={2} className="sm:col-span-2" value={data.trabajador.domicilio} onChange={set('trabajador', 'domicilio')} />
        </Field>
        <Field label="Cargo">
          <TextInput value={data.trabajador.cargo} onChange={set('trabajador', 'cargo')} />
        </Field>
      </Section>

      <Section title="Plazo y jornada">
        <Field label="Duración (texto, ej. 01 mes)">
          <TextInput value={data.contrato.plazoTexto} onChange={set('contrato', 'plazoTexto')} />
        </Field>
        <Field label="Jurisdicción">
          <TextInput value={data.contrato.jurisdiccion} onChange={set('contrato', 'jurisdiccion')} />
        </Field>
        <Field label="Fecha de inicio">
          <TextInput type="date" value={data.contrato.fechaInicio} onChange={set('contrato', 'fechaInicio')} />
        </Field>
        <Field label="Fecha de término">
          <TextInput type="date" value={data.contrato.fechaFin} onChange={set('contrato', 'fechaFin')} />
        </Field>
        <Field label="Fecha de firma">
          <TextInput type="date" value={data.contrato.fechaFirma} onChange={set('contrato', 'fechaFirma')} />
        </Field>
        <Field label="Jornada de trabajo">
          <TextInput value={data.contrato.jornadaTexto} onChange={set('contrato', 'jornadaTexto')} />
        </Field>
      </Section>

      <Section title="Remuneración">
        <Field label="Monto mensual neto (S/.)">
          <TextInput type="number" step="0.01" value={data.remuneracion.monto} onChange={set('remuneracion', 'monto')} />
        </Field>
        <Field label="Texto en letras (opcional, se autogenera)">
          <TextInput placeholder="Se genera automáticamente" value={data.remuneracion.monedaTexto} onChange={set('remuneracion', 'monedaTexto')} />
        </Field>
      </Section>

      <Section title="Gastos asumidos por el empleador (cláusula 6.4)">
        <Field label="Examen médico (S/.)">
          <TextInput type="number" step="0.01" value={data.gastos.examenMedico} onChange={set('gastos', 'examenMedico')} />
        </Field>
        <Field label="Cursos con certificación (S/.)">
          <TextInput type="number" step="0.01" value={data.gastos.cursos} onChange={set('gastos', 'cursos')} />
        </Field>
        <Field label="Seguros SCTR y Vida Ley (S/.)">
          <TextInput type="number" step="0.01" value={data.gastos.seguros} onChange={set('gastos', 'seguros')} />
        </Field>
      </Section>

      <button
        type="button"
        onClick={onReset}
        className="self-start text-sm font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
      >
        Restablecer valores de ejemplo
      </button>
    </div>
  )
}
