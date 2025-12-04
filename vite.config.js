import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Group all firebase modules together
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'firebase-vendor';
          }
          // React core libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          // Redux libraries
          if (id.includes('node_modules/react-redux') || id.includes('node_modules/@reduxjs/toolkit')) {
            return 'redux-vendor';
          }
          // UI libraries
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/lucide-react') || id.includes('node_modules/react-hot-toast')) {
            return 'ui-vendor';
          }
          // Charts library (large dependency)
          // Include d3 dependencies with recharts to avoid initialization issues
          if (id.includes('node_modules/recharts') ||
              id.includes('node_modules/d3-') ||
              id.includes('node_modules/victory-')) {
            return 'charts-vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'esbuild',
    // Use ES2020 for better module support and avoid TDZ issues
    target: 'es2020',
    cssCodeSplit: true,
    // Ensure proper module preloading
    modulePreload: {
      polyfill: true
    }
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : []
  },
  optimizeDeps: {
    include: ['recharts'],
    esbuildOptions: {
      target: 'es2020'
    }
  }
}))
