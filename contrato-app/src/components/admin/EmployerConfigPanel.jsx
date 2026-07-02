import { useState } from 'react'
import Field, { TextInput, TextArea } from '../Field'
import SignatureModal from './SignatureModal'

export default function EmployerConfigPanel({ employerConfig, onSave }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(employerConfig)
  const [firmando, setFirmando] = useState(false)

  const set = (key) => (e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSave = (e) => {
    e.preventDefault()
    onSave(draft)
    setOpen(false)
  }

  const handleSaveFirma = (dataUrl) => {
    const next = { ...draft, gerenteFirma: dataUrl }
    setDraft(next)
    onSave(next)
  }

  return (
    <div className="mb-4 rounded-md border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-semibold text-slate-700"
      >
        Datos de la empresa (empleador)
        <span className="text-slate-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-3 border-t border-slate-200 p-4 sm:grid-cols-2">
          <Field label="Razón social">
            <TextInput value={draft.razonSocial} onChange={set('razonSocial')} />
          </Field>
          <Field label="RUC">
            <TextInput value={draft.ruc} onChange={set('ruc')} />
          </Field>
          <Field label="Domicilio fiscal">
            <TextArea rows={2} className="sm:col-span-2" value={draft.domicilioFiscal} onChange={set('domicilioFiscal')} />
          </Field>
          <Field label="Gerente general">
            <TextInput value={draft.gerente} onChange={set('gerente')} />
          </Field>
          <Field label="DNI del gerente">
            <TextInput value={draft.gerenteDni} onChange={set('gerenteDni')} />
          </Field>
          <Field label="Inicio de actividades">
            <TextInput value={draft.fechaInicioActividades} onChange={set('fechaInicioActividades')} />
          </Field>
          <Field label="Fecha de inscripción REMYPE">
            <TextInput value={draft.fechaRemype} onChange={set('fechaRemype')} />
          </Field>
          <Field label="Fecha de acreditación">
            <TextInput value={draft.fechaAcreditacion} onChange={set('fechaAcreditacion')} />
          </Field>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Firma del gerente general (se usa en todos los contratos)</span>
            <div className="flex items-center gap-3">
              {draft.gerenteFirma ? (
                <img src={draft.gerenteFirma} alt="Firma del gerente" className="h-14 rounded border border-slate-200 bg-white object-contain px-2" />
              ) : (
                <span className="text-xs text-slate-400">Sin firma registrada</span>
              )}
              <button
                type="button"
                onClick={() => setFirmando(true)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                {draft.gerenteFirma ? 'Cambiar firma' : 'Registrar firma'}
              </button>
            </div>
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Guardar datos de la empresa
            </button>
          </div>
        </form>
      )}

      {firmando && (
        <SignatureModal
          title="Firma del gerente general"
          initialValue={draft.gerenteFirma}
          onSave={handleSaveFirma}
          onClose={() => setFirmando(false)}
        />
      )}
    </div>
  )
}
