import { defineConfig } from 'vite'

// Vite config aligned for ZMP deploy: output to `www` and base ""
export default defineConfig({
  base: '',
  build: {
    outDir: 'www',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
})