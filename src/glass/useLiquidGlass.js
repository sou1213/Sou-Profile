import { useEffect } from "react";
import { glassTokens } from "./tokens.js";

const vertexShaderSource = `
attribute vec2 position;

void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;

uniform sampler2D backdrop;
uniform vec2 resolution;
uniform vec2 documentSize;
uniform vec4 lensRect;
uniform float pixelRatio;
uniform float scrollOffset;
uniform float radius;
uniform float opacity;
uniform float blurAmount;
uniform float saturation;
uniform float edge;
uniform float shine;
uniform float shadow;
uniform float refraction;
uniform float dispersion;

vec3 sampleBackdrop(vec2 point) {
    vec2 documentPoint = point + vec2(0.0, scrollOffset);
    vec2 uv = clamp(documentPoint / documentSize, vec2(0.0), vec2(1.0));
    return texture2D(backdrop, uv).rgb;
}

float roundedRectangle(vec2 point, vec2 halfSize, float cornerRadius) {
    vec2 q = abs(point) - halfSize + cornerRadius;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - cornerRadius;
}

vec3 sampleGlass(vec2 point) {
    if (blurAmount < 0.1) {
        return sampleBackdrop(point);
    }

    float amount = blurAmount * 0.5;
    vec3 color = sampleBackdrop(point) * 0.20;
    color += sampleBackdrop(point + vec2(amount, 0.0)) * 0.12;
    color += sampleBackdrop(point - vec2(amount, 0.0)) * 0.12;
    color += sampleBackdrop(point + vec2(0.0, amount)) * 0.12;
    color += sampleBackdrop(point - vec2(0.0, amount)) * 0.12;
    color += sampleBackdrop(point + vec2(amount, amount)) * 0.08;
    color += sampleBackdrop(point - vec2(amount, amount)) * 0.08;
    color += sampleBackdrop(point + vec2(amount, -amount)) * 0.08;
    color += sampleBackdrop(point + vec2(-amount, amount)) * 0.08;
    return color;
}

void main() {
    vec2 point = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y) / pixelRatio;
    vec2 halfSize = lensRect.zw * 0.5;
    vec2 local = point - lensRect.xy - halfSize;
    float cornerRadius = min(radius, min(halfSize.x, halfSize.y));
    float distance = roundedRectangle(local, halfSize, cornerRadius);
    float shadowDistance = roundedRectangle(local - vec2(0.0, 9.0), halfSize, cornerRadius);
    float shadowAlpha = exp(-max(shadowDistance, 0.0) / 14.0) * shadow * 0.5 * smoothstep(-1.0, 3.0, distance);

    vec3 color = vec3(0.0);
    float alpha = shadowAlpha;

    if (distance < 1.0) {
        vec2 gradient = vec2(
            roundedRectangle(local + vec2(0.5, 0.0), halfSize, cornerRadius) - roundedRectangle(local - vec2(0.5, 0.0), halfSize, cornerRadius),
            roundedRectangle(local + vec2(0.0, 0.5), halfSize, cornerRadius) - roundedRectangle(local - vec2(0.0, 0.5), halfSize, cornerRadius)
        );
        vec2 normal = normalize(gradient + vec2(0.0001));
        float rim = exp(-abs(distance) / 9.0);
        vec2 offset = -normal * refraction * rim;
        vec3 glass = sampleGlass(point + offset);

        glass.r = sampleGlass(point + offset + normal * dispersion * rim).r;
        glass.b = sampleGlass(point + offset - normal * dispersion * rim).b;

        float luminance = dot(glass, vec3(0.2126, 0.7152, 0.0722));
        glass = mix(vec3(luminance), glass, saturation);
        glass = mix(glass, vec3(1.0), opacity);
        glass += shine * 0.30 * (1.0 - local.y / max(halfSize.y, 1.0));

        float specular = pow(max(dot(normal, normalize(vec2(-0.5, -1.0))), 0.0), 3.0);
        glass += edge * exp(-abs(distance + 1.0) / 1.2) * (0.15 + 0.75 * specular);

        float coverage = 1.0 - smoothstep(-0.8, 0.8, distance);
        color = mix(color, glass, coverage);
        alpha = max(alpha, coverage);
    }

    gl_FragColor = vec4(color * alpha, alpha);
}
`;

function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Unable to allocate a Glass shader");

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(message || "Glass shader compilation failed");
    }

    return shader;
}

function createProgram(gl) {
    const program = gl.createProgram();
    if (!program) throw new Error("Unable to allocate the Glass program");

    let vertexShader = null;
    let fragmentShader = null;

    try {
        vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program) || "Glass shader linking failed");
        }

        return program;
    } catch (error) {
        gl.deleteProgram(program);
        throw error;
    } finally {
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
    }
}

class NavigationGlassRenderer {
    constructor({ canvas, backdropElement, lensElement }) {
        this.canvas = canvas;
        this.backdropElement = backdropElement;
        this.lensElement = lensElement;
        this.gl = null;
        this.program = null;
        this.buffer = null;
        this.texture = null;
        this.frameRequest = null;
        this.captureTimer = null;
        this.capturePromise = null;
        this.destroyed = false;
        this.documentSize = [1, 1];
        this.abortController = new AbortController();
        this.resizeObserver = typeof ResizeObserver === "undefined"
            ? null
            : new ResizeObserver(() => {
                this.scheduleRender();
                this.queueCapture();
            });
        this.mutationObserver = typeof MutationObserver === "undefined"
            ? null
            : new MutationObserver(() => this.queueCapture());
    }

    start() {
        if (
            typeof matchMedia === "function" &&
            matchMedia("(prefers-reduced-transparency: reduce)").matches
        ) {
            document.documentElement.dataset.glassRenderer = "reduced";
            return;
        }

        try {
            this.initializeWebGL();
        } catch (error) {
            console.warn("Liquid Glass fallback:", error);
            this.useFallback();
            return;
        }

        const { signal } = this.abortController;
        addEventListener("scroll", () => this.scheduleRender(), { passive: true, signal });
        addEventListener("resize", () => {
            this.scheduleRender();
            this.queueCapture();
        }, { passive: true, signal });
        this.canvas.addEventListener("webglcontextlost", this.handleContextLost, { signal });
        this.canvas.addEventListener("webglcontextrestored", this.handleContextRestored, { signal });
        this.backdropElement.addEventListener("animationend", () => this.queueCapture(0), { signal });
        this.resizeObserver?.observe(this.backdropElement);
        this.resizeObserver?.observe(this.lensElement);
        this.mutationObserver?.observe(this.backdropElement, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true,
            attributeFilter: ["class", "open", "src"]
        });

        this.backdropElement.querySelectorAll("img").forEach((image) => {
            if (!image.complete) {
                image.addEventListener("load", () => this.queueCapture(), { once: true, signal });
            }
        });

        document.fonts?.ready.then(() => this.queueCapture());
        this.queueCapture(0);
    }

    initializeWebGL() {
        const gl = this.canvas.getContext("webgl", {
            alpha: true,
            antialias: false,
            depth: false,
            premultipliedAlpha: true,
            powerPreference: "low-power",
            preserveDrawingBuffer: false
        });

        if (!gl) {
            throw new Error("WebGL is unavailable");
        }

        this.gl = gl;
        this.program = createProgram(gl);
        gl.useProgram(this.program);

        this.buffer = gl.createBuffer();
        if (!this.buffer) throw new Error("Unable to allocate the Glass vertex buffer");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
        );

        const position = gl.getAttribLocation(this.program, "position");
        if (position < 0) throw new Error("Glass shader position attribute is unavailable");

        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

        this.texture = gl.createTexture();
        if (!this.texture) throw new Error("Unable to allocate the Glass backdrop texture");

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 0, 0])
        );

        this.uniforms = Object.fromEntries(
            [
                "backdrop",
                "resolution",
                "documentSize",
                "lensRect",
                "pixelRatio",
                "scrollOffset",
                "radius",
                "opacity",
                "blurAmount",
                "saturation",
                "edge",
                "shine",
                "shadow",
                "refraction",
                "dispersion"
            ].map((name) => [name, gl.getUniformLocation(this.program, name)])
        );

        gl.uniform1i(this.uniforms.backdrop, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.disable(gl.DEPTH_TEST);
        document.documentElement.dataset.glassRenderer = "loading";
    }

    async capture() {
        if (
            this.capturePromise ||
            this.destroyed ||
            !this.gl ||
            this.backdropElement.dataset.transitioning === "true"
        ) return;

        this.capturePromise = (async () => {
            const gl = this.gl;
            const width = this.backdropElement.scrollWidth;
            const height = this.backdropElement.scrollHeight;
            const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            const maxPixelCount = 8_000_000;
            const pixelBudgetScale = Math.sqrt(maxPixelCount / (width * height));
            const scale = Math.min(
                1.25,
                maxTextureSize / width,
                maxTextureSize / height,
                pixelBudgetScale
            );

            if (scale < 0.25) {
                throw new Error("The page is too large for a safe WebGL texture");
            }

            const { default: html2canvas } = await import("html2canvas");
            const snapshot = await html2canvas(this.backdropElement, {
                backgroundColor: null,
                height,
                width,
                scale,
                logging: false,
                useCORS: true,
                windowHeight: height,
                windowWidth: width
            });

            if (this.destroyed || !this.gl) return;
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, snapshot);
            this.documentSize = [width, height];
            this.canvas.hidden = false;
            document.documentElement.dataset.glassRenderer = "ready";
            this.scheduleRender();
        })();

        try {
            await this.capturePromise;
        } catch (error) {
            console.warn("Liquid Glass capture fallback:", error);
            this.useFallback();
        } finally {
            this.capturePromise = null;
        }
    }

    render() {
        this.frameRequest = null;
        if (this.destroyed || !this.gl || !this.program) return;

        const gl = this.gl;
        const pixelRatio = Math.min(devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.round(innerWidth * pixelRatio));
        const height = Math.max(1, Math.round(innerHeight * pixelRatio));

        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
            gl.viewport(0, 0, width, height);
        }

        const lens = this.lensElement.getBoundingClientRect();
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.program);
        gl.uniform2f(this.uniforms.resolution, width, height);
        gl.uniform2f(this.uniforms.documentSize, this.documentSize[0], this.documentSize[1]);
        gl.uniform4f(this.uniforms.lensRect, lens.left, lens.top, lens.width, lens.height);
        gl.uniform1f(this.uniforms.pixelRatio, pixelRatio);
        gl.uniform1f(this.uniforms.scrollOffset, scrollY);
        gl.uniform1f(this.uniforms.radius, glassTokens.radius);
        gl.uniform1f(this.uniforms.opacity, glassTokens.opacity);
        gl.uniform1f(this.uniforms.blurAmount, glassTokens.blur);
        gl.uniform1f(this.uniforms.saturation, glassTokens.saturation);
        gl.uniform1f(this.uniforms.edge, glassTokens.edge);
        gl.uniform1f(this.uniforms.shine, glassTokens.shine);
        gl.uniform1f(this.uniforms.shadow, glassTokens.shadow);
        gl.uniform1f(this.uniforms.refraction, glassTokens.refraction);
        gl.uniform1f(this.uniforms.dispersion, glassTokens.dispersion);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    scheduleRender() {
        if (this.frameRequest === null && !this.destroyed) {
            this.frameRequest = requestAnimationFrame(() => this.render());
        }
    }

    queueCapture(delay = 180) {
        if (this.backdropElement.dataset.transitioning === "true") return;

        clearTimeout(this.captureTimer);
        this.captureTimer = setTimeout(() => this.capture(), delay);
    }

    useFallback() {
        document.documentElement.dataset.glassRenderer = "fallback";
        this.canvas.hidden = true;
    }

    handleContextLost = (event) => {
        event.preventDefault();
        this.gl = null;
        this.program = null;
        this.buffer = null;
        this.texture = null;
        this.useFallback();
    };

    handleContextRestored = () => {
        if (this.destroyed) return;

        try {
            this.canvas.hidden = false;
            this.initializeWebGL();
            this.queueCapture(0);
        } catch (error) {
            console.warn("Liquid Glass restore fallback:", error);
            this.useFallback();
        }
    };

    destroy() {
        this.destroyed = true;
        this.abortController.abort();
        this.resizeObserver?.disconnect();
        this.mutationObserver?.disconnect();
        clearTimeout(this.captureTimer);
        if (this.frameRequest !== null) cancelAnimationFrame(this.frameRequest);

        if (this.gl) {
            if (this.buffer) this.gl.deleteBuffer(this.buffer);
            if (this.texture) this.gl.deleteTexture(this.texture);
            if (this.program) this.gl.deleteProgram(this.program);
        }
    }
}

export function useLiquidGlass({ canvasRef, backdropRef, lensRef, refreshKey }) {
    useEffect(() => {
        const canvas = canvasRef.current;
        const backdropElement = backdropRef.current;
        const lensElement = lensRef.current;

        if (!canvas || !backdropElement || !lensElement) return undefined;

        const renderer = new NavigationGlassRenderer({ canvas, backdropElement, lensElement });
        renderer.start();

        return () => renderer.destroy();
    }, [backdropRef, canvasRef, lensRef, refreshKey]);
}
