import { supabase } from './supabaseClient'

const BUCKET = 'contratos-files'

async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl)
  return res.blob()
}

// Sube una imagen (dataURL) como administrador autenticado; puede sobrescribir rutas existentes.
export async function uploadAsAdmin(path, dataUrl) {
  const blob = await dataUrlToBlob(dataUrl)
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type || 'image/png',
    upsert: true,
  })
  if (error) throw error
  return path
}

// Sube la firma del propio empleado (rol anon, sin sesión real): siempre a una ruta
// nueva y única dentro de "signatures/", ya que anon solo tiene permiso de INSERT.
export async function uploadEmployeeSignature(contratoId, dataUrl) {
  const blob = await dataUrlToBlob(dataUrl)
  const path = `signatures/${contratoId}-${Date.now()}.png`
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type || 'image/png',
    upsert: false,
  })
  if (error) throw error
  return path
}

export async function getSignedUrl(path, expiresInSeconds = 3600) {
  if (!path) return null
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresInSeconds)
  if (error) {
    console.error('Error creando URL firmada para', path, error)
    return null
  }
  return data.signedUrl
}

export async function deleteFile(path) {
  if (!path) return
  await supabase.storage.from(BUCKET).remove([path])
}
