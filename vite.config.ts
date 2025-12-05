import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://waslammka.runasp.net",
        changeOrigin: true
      },
      "/assets": {
        target: "http://waslammka.runasp.net",
        changeOrigin: true
      }
    }
  }
})
