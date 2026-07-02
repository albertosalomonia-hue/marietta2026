import { supabase } from './supabaseClient'

// Supabase Auth siempre identifica a los usuarios por email internamente. Como el login
// real de este admin es por DNI, mapeamos el DNI a un correo sintético fijo que nunca se
// usa para enviar nada — es solo la forma en que Supabase Auth guarda la cuenta.
const ADMIN_EMAIL_DOMAIN = 'marietta-admin.internal'

export function dniToAdminEmail(dni) {
  return `${dni.trim()}@${ADMIN_EMAIL_DOMAIN}`
}

export async function signInAdmin(dni, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email: dniToAdminEmail(dni), password })
  if (error) throw error
  return data.session
}

export async function signOutAdmin() {
  await supabase.auth.signOut()
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onAuthStateChange(callback) {
  const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => callback(session))
  return () => subscription.subscription.unsubscribe()
}
