import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build` arma la web principal (/) y la demo de tienda (/demo/) para publicar.
// Los modos "single" y "demo-single" generan un único HTML para vistas previas.
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === 'single' || mode === 'demo-single' ? [viteSingleFile()] : [])],
  build: {
    rollupOptions: {
      input:
        mode === 'single'
          ? resolve(__dirname, 'index.html')
          : mode === 'demo-single'
            ? resolve(__dirname, 'demo/index.html')
            : { main: resolve(__dirname, 'index.html'), demo: resolve(__dirname, 'demo/index.html') },
    },
  },
}))
