/* vite.config.js */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- PASTIIN INI ADA

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- DAN PASTIIN INI DIPANGGIL
  ],
})