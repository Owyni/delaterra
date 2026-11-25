import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración conservadora para priorizar builds predecibles.
  // Se desactivan Cache Components y Partial Prefetching mientras
  // estabilizamos las rutas dinámicas y la sesión del carrito.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
