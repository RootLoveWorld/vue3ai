import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import wasm from 'vite-plugin-wasm'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), wasm()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext'
  },
  optimizeDeps: {
    exclude: ['three']
  }
})