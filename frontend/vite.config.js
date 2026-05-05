import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, loadEnv } from "vite";
import svgr from "@svgr/rollup"

//const FRONTEND_PORT = import.meta.env.VITE_FRONTEND_PORT;
//const SERVER_URL = import.meta.env.VITE_SERVER_URL;




export default defineConfig(({mode}) => {

  const env = loadEnv(mode, process.cwd(), "");


  const FRONTEND_PORT = env.VITE_FRONTEND_PORT;
  const SERVER_URL = env.VITE_API_URL_BROWSER;

  console.log("VITE MODE: ", mode);
  console.log("VITE API: ", SERVER_URL);
  console.log("VITE PORT: ", FRONTEND_PORT);


  return  {
  plugins: [
    svgr(),
    reactRouter(),

  ],
  clearScreen:false,
  base: "/",
  server: {
    port: FRONTEND_PORT,
    host: "0.0.0.0",
    strictPort: true,
    watch: {
      usePolling: true,
    },
  //   proxy: {
  //     '/api/v1': {
  //       target: SERVER_URL,
  //       changeOrigin: true,
  //       secure: false,
  //       // rewrite: (path) => path.replace(/^\/api\/v1/, 'api/v1'),
  //     },
  //     '/uploads': {
  //       target: SERVER_URL,
  //       changeOrigin: true,
  //       secure: false,
  //   },
  //   cors: {
  //     origin: true,
  //     credentials: true
  //   }
  // },
  build: {
    outDir: 'dist'
  },
}
  }


});

