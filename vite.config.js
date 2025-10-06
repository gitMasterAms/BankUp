import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // garante que qualquer rota caia no index.html
    fs: {
      strict: false
    }
  },
  preview: {
    // no modo preview (após build), força fallback também
    port: 4173,
    strictPort: true
  },
  appType: 'spa' // <-- essa é a chave p/ Vite tratar como SPA
})
