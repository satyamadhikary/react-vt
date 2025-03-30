import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,  // ✅ Reduces build size
    minify: "terser",  // ✅ More efficient than default esbuild
    rollupOptions: {
      output: {
        manualChunks: undefined, // ✅ Prevents excessive chunk splitting
      }
    },
  },
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
