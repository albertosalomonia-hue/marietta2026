import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        lang: 'es',
        name: 'Contratos — Transportes Marietta',
        short_name: 'Marietta',
        description: 'Generador y administrador de contratos de Transportes Marietta.',
        theme_color: '#4f46e5',
        background_color: '#f1f5f9',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        // No cachear llamadas a Supabase: los datos siempre deben venir de la red.
        navigateFallbackDenylist: [/^\/api/],
        // El service worker nuevo toma el control de inmediato (no espera a que se
        // cierren todas las pestañas/instancias viejas). Evita quedarse "atascado"
        // en una versión vieja cacheada de la app tras cada actualización.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})
