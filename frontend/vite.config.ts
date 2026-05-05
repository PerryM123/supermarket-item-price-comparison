import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    host: "0.0.0.0",
    hmr: {
      clientPort: process.env.HMR_CLIENT_PORT
        ? parseInt(process.env.HMR_CLIENT_PORT)
        : undefined,
    },
    allowedHosts: process.env.VITE_ALLOWED_HOST
      ? [process.env.VITE_ALLOWED_HOST]
      : ["local.super-price-check.com"]
  },
});
