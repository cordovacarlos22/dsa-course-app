import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import contentCatalog from './scripts/content-catalog.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    contentCatalog(fileURLToPath(new URL('./content', import.meta.url))),
  ],
  build: {
    // The code editor (CodeMirror, ~515 kB) is its own chunk, loaded only
    // when a coding step opens, so it doesn't slow down the first page.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Lessons and quizzes go in their own files: editing a lesson then
        // only changes that file, so students don't re-download the app
        // code. They load with the pages that show them (the first page only
        // needs the summary from scripts/content-catalog.js).
        manualChunks(id) {
          if (/\/content\/lessons\/.*\.md/.test(id)) return 'lessons'
          if (id.includes('/content/practice/')) return 'practice'
        },
      },
    },
  },
  test: {
    // jsdom gives tests a fake browser (document, window) to render React into.
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    // npm run test:coverage: how much of the app code the unit tests run.
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      reporter: ['text-summary', 'html'],
    },
  },
})
