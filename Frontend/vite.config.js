import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL ? process.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:4000',
        changeOrigin: true,
        // Keep the '/api' prefix so backend routes mounted at '/api' continue to work
        rewrite: (path) => path,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
});
