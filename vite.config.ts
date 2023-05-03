import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      filter: /\.(js|mjs|json|css|html)$/i,
      algorithm: "brotliCompress",
    }),
  ],
  build: {
    commonjsOptions: {
      include: /node_modules/,
    },
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash][extname]",
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  base: "",
});
