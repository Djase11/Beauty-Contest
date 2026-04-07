import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
 
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, '../client/dist'),
    emptyOutDir: true,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      }
    }
  },
  server: {
    proxy: {
      '/socket.io': { target: 'http://localhost:3001', ws: true }
    }
  }
})
 
