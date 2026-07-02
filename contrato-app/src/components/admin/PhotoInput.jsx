import { useSignedUrl } from '../../hooks/useSignedUrl'

// existingPath: ruta ya guardada en Storage (o null). newDataUrl: archivo recién elegido,
// pendiente de subir cuando se guarde el formulario (o null). onSelectNew/onRemove solo
// actualizan el estado local del formulario; la subida real ocurre al guardar el empleado.
export default function PhotoInput({ existingPath, newDataUrl, onSelectNew, onRemove }) {
  const existingUrl = useSignedUrl(newDataUrl ? null : existingPath)
  const preview = newDataUrl || existingUrl

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onSelectNew(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center gap-3">
      {preview ? (
        <img src={preview} alt="Foto del empleado" className="h-16 w-16 rounded-full border border-slate-200 object-cover" />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-slate-300 text-xs text-slate-400">
          Sin foto
        </div>
      )}
      <div className="flex flex-col gap-1">
        <input type="file" accept="image/*" onChange={handleUpload} className="text-xs" />
        {preview && (
          <button type="button" onClick={onRemove} className="self-start text-xs text-red-600 underline hover:text-red-700">
            Quitar foto
          </button>
        )}
      </div>
    </div>
  )
}
