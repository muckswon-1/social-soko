import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 2071,
    host: true,
    // Proxy API requests to backend
    // proxy: {
    //   '/api': {
    //     target: import.meta.VITE_API_URL,
    //     changeOrigin: true,
    //     secure: false,
    //     rewrite: (path) => path.replace(/^\/auth/, '/api/v1'),
    //   },
    // },
  },
});