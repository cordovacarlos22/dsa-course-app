import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The code editor (CodeMirror, ~515 kB) is its own chunk, loaded only
    // when a coding step opens, so it doesn't slow down the first page.
    chunkSizeWarningLimit: 600,
  },
  test: {
    // jsdom gives tests a fake browser (document, window) to render React into.
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
