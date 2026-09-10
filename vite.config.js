import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    plugins: [react()],
    build: {
        outDir: "dist/cloudflare-pages",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                home: resolve(import.meta.dirname, "index.html"),
                work: resolve(import.meta.dirname, "work.html")
            }
        }
    }
});
