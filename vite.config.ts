import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import antdImportPlugin from "vite-plugin-antd-import";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      filter: /\.(js|mjs|json|css|html)$/i,
      algorithm: "gzip",
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
  },
  base: "",
});
