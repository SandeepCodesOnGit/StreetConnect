import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "https://street-connect-y4un.vercel.app/", // Your Backend
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {
        target: "https://street-connect-y4un.vercel.app/",
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});