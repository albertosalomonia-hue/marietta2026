const EMPLOYEES_KEY = 'marietta.contratos.empleados.v1'
const EMPLOYER_KEY = 'marietta.contratos.empleador.v1'

export function loadEmployees() {
  try {
    const raw = localStorage.getItem(EMPLOYEES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveEmployees(list) {
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(list))
}

export function loadEmployerConfig(defaultConfig) {
  try {
    const raw = localStorage.getItem(EMPLOYER_KEY)
    return raw ? JSON.parse(raw) : defaultConfig
  } catch {
    return defaultConfig
  }
}

export function saveEmployerConfig(config) {
  localStorage.setItem(EMPLOYER_KEY, JSON.stringify(config))
}
