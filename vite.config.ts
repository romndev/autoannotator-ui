import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 8080,
    proxy: {
      '^/api.*': {
        target: 'http://aa_client:8000',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  }
})
