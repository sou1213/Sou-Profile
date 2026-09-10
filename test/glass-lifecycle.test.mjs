import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";

const source = (await readFile(new URL("../src/glass/useLiquidGlass.js", import.meta.url), "utf8"))
    .replace(/^import .*;\n/gm, "")
    .replace('await import("html2canvas")', 'await Promise.resolve({ default: captureBackdrop })')
    .replace("export function useLiquidGlass", "function useLiquidGlass");

function setup() {
    let resolveCapture;
    let rejectCapture;
    const pending = new Promise((resolve, reject) => {
        resolveCapture = resolve;
        rejectCapture = reject;
    });
    const document = { documentElement: { dataset: { glassRenderer: "ready" } } };
    const context = {
        document,
        AbortController,
        console: { warn() {} },
        captureBackdrop: () => pending,
        setTimeout,
        clearTimeout
    };
    runInNewContext(`${source}\nthis.Renderer = NavigationGlassRenderer;`, context);
    const canvas = { hidden: false };
    const renderer = new context.Renderer({
        canvas,
        backdropElement: { dataset: {}, scrollWidth: 1440, scrollHeight: 3000 },
        lensElement: {}
    });
    renderer.gl = {
        getParameter: () => 16384,
        activeTexture() {}, bindTexture() {}, pixelStorei() {}, texImage2D() {}
    };
    renderer.scheduleRender = () => {};
    return { renderer, document, canvas, resolveCapture, rejectCapture };
}

test("a previous page's late capture failure cannot hide the new page's glass", async () => {
    const { renderer, document, canvas, rejectCapture } = setup();
    const capture = renderer.capture();
    renderer.destroyed = true;
    rejectCapture(new Error("Old page capture failed"));
    await capture;
    assert.equal(document.documentElement.dataset.glassRenderer, "ready");
    assert.equal(canvas.hidden, false);
});

test("an update during capture requests a fresh snapshot after completion", async () => {
    const { renderer, resolveCapture } = setup();
    const queued = [];
    renderer.queueCapture = (delay) => queued.push(delay);
    const capture = renderer.capture();
    await renderer.capture();
    await renderer.capture();
    resolveCapture({});
    await capture;
    assert.deepEqual(queued, [0]);
});

test("disposed renderers ignore late font and fallback callbacks", () => {
    const { renderer, canvas, document } = setup();
    renderer.destroyed = true;
    renderer.queueCapture(0);
    renderer.useFallback();
    assert.equal(renderer.captureTimer, null);
    assert.equal(canvas.hidden, false);
    assert.equal(document.documentElement.dataset.glassRenderer, "ready");
});
