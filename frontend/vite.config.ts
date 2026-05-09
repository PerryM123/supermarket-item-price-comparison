import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        routesDirectory: "./app/routes",
        generatedRouteTree: "./app/routeTree.gen.ts",
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      watch: {
        ignored: ["**/tests/**"],
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
