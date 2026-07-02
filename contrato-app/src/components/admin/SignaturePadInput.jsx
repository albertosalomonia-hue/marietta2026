import { useEffect, useRef, useState } from 'react'
import SignaturePad from 'signature_pad'

export default function SignaturePadInput({ initialValue, firmaGuardada, onSave, onCancel }) {
  const canvasRef = useRef(null)
  const padRef = useRef(null)
  const fileInputRef = useRef(null)
  const [uploadedImage, setUploadedImage] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    canvas.getContext('2d').scale(ratio, ratio)

    padRef.current = new SignaturePad(canvas, { backgroundColor: '#ffffff', penColor: '#0f172a' })
    return () => padRef.current?.off()
  }, [])

  const handleClear = () => {
    padRef.current?.clear()
    setUploadedImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setUploadedImage(reader.result)
      padRef.current?.clear()
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (uploadedImage) {
      onSave(uploadedImage)
      return
    }
    if (!padRef.current || padRef.current.isEmpty()) {
      alert('Dibuja una firma o sube una imagen antes de guardar.')
      return
    }
    onSave(padRef.current.toDataURL('image/png'))
  }

  return (
    <div className="flex flex-col gap-3">
      {initialValue && !uploadedImage && (
        <div className="rounded-md border border-slate-200 p-2">
          <p className="mb-1 text-xs text-slate-500">Firma actual guardada:</p>
          <img src={initialValue} alt="Firma actual" className="h-16 object-contain" />
        </div>
      )}

      <div className="relative rounded-md border border-slate-300 bg-white">
        {uploadedImage ? (
          <img src={uploadedImage} alt="Firma subida" className="h-40 w-full object-contain p-2" />
        ) : (
          <canvas ref={canvasRef} className="h-40 w-full cursor-crosshair touch-none" />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-medium text-slate-600">
          O sube una imagen de la firma:{' '}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="text-xs" />
        </label>
        <button type="button" onClick={handleClear} className="text-xs font-medium text-slate-500 underline hover:text-slate-700">
          Limpiar
        </button>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Cancelar
        </button>
        <button type="button" onClick={handleSave} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          Guardar firma
        </button>
      </div>
    </div>
  )
}
