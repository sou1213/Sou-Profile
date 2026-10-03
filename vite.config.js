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
                work: resolve(import.meta.dirname, "work.html"),
                blog: resolve(import.meta.dirname, "blog.html"),
                blogPost: resolve(import.meta.dirname, "blog/first-hackathon.html"),
                enHome: resolve(import.meta.dirname, "en/index.html"),
                enWork: resolve(import.meta.dirname, "en/work.html"),
                enBlog: resolve(import.meta.dirname, "en/blog.html"),
                enBlogPost: resolve(import.meta.dirname, "en/blog/first-hackathon.html")
            }
        }
    }
});
