import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import 'dotenv/config'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: process.env.PORT ?? 8080,
    proxy: {
      '^/api.*': {
        target: process.env.API_HOST ?? 'http://localhost:8000',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  }
})
