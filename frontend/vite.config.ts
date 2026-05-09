import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [tailwindcss(), reactRouter()],
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      watch: {
        ignored: ['**/tests/**'],
      },
      host: "0.0.0.0",
      hmr: {
        clientPort: process.env.HMR_CLIENT_PORT
          ? parseInt(process.env.HMR_CLIENT_PORT)
          : undefined,
      },
      allowedHosts: env.VITE_ALLOWED_HOST
        ? [env.VITE_ALLOWED_HOST]
        : ["local.super-price-check.com"],
    },
  };
});
