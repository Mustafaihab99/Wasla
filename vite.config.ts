import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://wasla1.runasp.net",
        changeOrigin: true
      },
      "/assets": {
        target: "http://wasla1.runasp.net",
        changeOrigin: true
      }
    }
  }
})
