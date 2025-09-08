import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/lib': resolve(__dirname, './src/lib'),
      '@/pages': resolve(__dirname, './src/pages'),
      '@/types': resolve(__dirname, './src/types'),
      '@/circuits': resolve(__dirname, './circuits'),
      buffer: 'buffer',
      process: 'process/browser',
      util: 'util'
    }
  },
  define: {
    global: 'globalThis',
    'process.env': {}
  },
  optimizeDeps: {
    include: ['buffer', 'process']
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          midnight: ['@midnight-ntwrk/midnightjs', '@midnight-ntwrk/compact-runtime'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  }
})
