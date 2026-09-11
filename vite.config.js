import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      'medroute-0wte.onrender.com',
      '.onrender.com',
      'localhost',
      '127.0.0.1'
    ],
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    host: '0.0.0.0'
  },
  server: {
    allowedHosts: [
      'medroute-0wte.onrender.com',
      '.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  }
})
