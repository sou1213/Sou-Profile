import react from "@vitejs/plugin-react";
import { build } from "vite";
import { cp, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = resolve(projectRoot, "dist", "cloudflare-pages");
const renderOutput = resolve(projectRoot, "dist", "render");

await build({ configFile: join(projectRoot, "vite.config.js") });

const publicFiles = [
    "assets",
    "theme-bootstrap.js",
    "robots.txt",
    "sitemap.xml",
    "_headers",
    "_redirects"
];

for (const file of publicFiles) {
    await cp(join(projectRoot, file), join(outputRoot, file), { recursive: true });
}

await build({
    configFile: false,
    plugins: [react()],
    build: {
        emptyOutDir: true,
        outDir: renderOutput,
        ssr: join(projectRoot, "src", "render.jsx"),
        rollupOptions: { output: { entryFileNames: "render.js" } }
    }
});

const { render } = await import(pathToFileURL(join(renderOutput, "render.js")));

for (const [file, page] of [["index.html", "home"], ["work.html", "work"]]) {
    const outputFile = join(outputRoot, file);
    const html = await readFile(outputFile, "utf8");
    const markup = render(page);
    await writeFile(
        outputFile,
        html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
    );
}

console.log(`Cloudflare Pages output: ${outputRoot}`);
