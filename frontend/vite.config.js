import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const API_URL = process.env.NODE_ENV === "production"? "https://street-connect-y4un.vercel.app/" : "http://localhost:8080";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: API_URL, // Your Backend
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {
        target: API_URL,
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
