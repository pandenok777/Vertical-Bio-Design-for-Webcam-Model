import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // ← Важно для продакшена (относительные пути)
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
