export default function PhotoInput({ value, onChange }) {
  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <img src={value} alt="Foto del empleado" className="h-16 w-16 rounded-full border border-slate-200 object-cover" />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-slate-300 text-xs text-slate-400">
          Sin foto
        </div>
      )}
      <div className="flex flex-col gap-1">
        <input type="file" accept="image/*" onChange={handleUpload} className="text-xs" />
        {value && (
          <button type="button" onClick={() => onChange(null)} className="self-start text-xs text-red-600 underline hover:text-red-700">
            Quitar foto
          </button>
        )}
      </div>
    </div>
  )
}
