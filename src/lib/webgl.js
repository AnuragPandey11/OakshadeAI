// src/lib/webgl.js
// Tiny WebGL1 helpers shared by ShaderCanvas and ShaderImage. Deliberately not
// three.js — every effect on the site is a single full-screen fragment shader,
// which needs ~60 lines of plumbing, not a 600 KB scene graph.

// One oversized triangle covers the viewport: cheaper than a two-triangle quad
// and there's no diagonal seam.
const FULLSCREEN_VERTEX = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

/**
 * Creates a canvas filling `container`, compiles `fragment` and binds the
 * full-screen triangle. Returns null when WebGL is unavailable or the shader
 * fails, so callers just keep their CSS background as the fallback.
 *
 * The canvas is created here (not rendered by React) so StrictMode's
 * mount → unmount → mount never reuses a context we already lost.
 */
export function createGLCanvas(container, fragment) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity 900ms ease";

  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, FULLSCREEN_VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(program));
    return null;
  }
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  container.appendChild(canvas);

  const locations = {};
  const uniform = (name) =>
    name in locations ? locations[name] : (locations[name] = gl.getUniformLocation(program, name));

  // Sets a float / vecN uniform from a number or an array of numbers.
  const set = (name, value) => {
    const loc = uniform(name);
    if (Array.isArray(value)) gl[`uniform${value.length}f`](loc, ...value);
    else gl.uniform1f(loc, value);
  };

  let dpr = 1;
  // Match the drawing buffer to the canvas's CSS size. DPR is capped — these
  // are soft, blurry effects, so retina resolution is wasted fill-rate.
  const resize = (maxDpr) => {
    dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  };

  return {
    canvas,
    gl,
    uniform,
    set,
    resize,
    getDpr: () => dpr,
    draw: () => gl.drawArrays(gl.TRIANGLES, 0, 3),
    show: () => (canvas.style.opacity = "1"),
    hide: () => (canvas.style.opacity = "0"),
    destroy: () => {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    },
  };
}

export const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
