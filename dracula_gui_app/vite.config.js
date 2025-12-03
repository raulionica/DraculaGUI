import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    // build-ul iese direct în extensie
    outDir: "../dracula_extension/dracula_app",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html")
      },
      output: {
        entryFileNames: "main.js",          // bundle principal
        assetFileNames: "assets/[name].[ext]"
      }
    }
  }
});
