import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";


// export default defineConfig({
//   plugins: [reactRouter()],
//   base: "./",
//   server: {
//     port: 2071,
//     host: true
//   }
// });

export default defineConfig({
  plugins: [reactRouter()],
  base: "/",
  server: {
    port: 2071,
    host: "0.0.0.0",
    proxy: {
      '/api/v1': {
        target: 'http://192.168.0.102:2070',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api\/v1/, 'api/v1'),
      },
      '/uploads': {
        target: 'http://localhost:2070',
        changeOrigin: true,
        secure: false,
    },
    cors: {
      origin: true,
      credentials: true
    }
    
  },
  build: {
    outDir: 'dist'
  },
}

  
})
