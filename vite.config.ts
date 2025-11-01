import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Si estás en Railway, usa base: '/', si es GitHub Pages, usa '/Gasolina_Smart/'
  base: process.env.RAILWAY_ENVIRONMENT ? '/' : '/Gasolina_Smart/',
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    strictPort: true,
    allowedHosts: [
      "gasolinasmart-production.up.railway.app",
      ".railway.app",
    ],
  },
  plugins: [
    react()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
}));
