import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(), // Add React plugin if it's not there
    tailwindcss(),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      // Proxy requests from /api to your backend container
      "/api": {
        target: "http://backend:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
