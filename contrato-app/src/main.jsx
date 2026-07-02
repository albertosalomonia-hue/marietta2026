import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Actualiza la PWA sola en cuanto haya una versión nueva desplegada, y recarga
// automáticamente para no quedarse con JS/CSS viejo cacheado (evita bugs como
// exportar PDFs con una versión desactualizada del código).
if ('serviceWorker' in navigator) {
  let recargando = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (recargando) return
    recargando = true
    window.location.reload()
  })
}
registerSW({ immediate: true })

// Si una sesión ya abierta quedó con una versión vieja del HTML (ej. justo antes
// de que este mismo arreglo se desplegara), un import bajo demanda (como jsPDF al
// exportar) puede apuntar a un archivo con hash que ya no existe en el servidor
// tras un nuevo despliegue. Vite dispara este evento en ese caso: recargamos para
// traer la versión actual en vez de mostrar un error.
window.addEventListener('vite:preloadError', () => {
  window.location.reload()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
