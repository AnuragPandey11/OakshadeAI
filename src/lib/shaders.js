// src/lib/shaders.js
// GLSL fragment shaders for the site's WebGL effects. All monochrome, to sit in
// the neutral palette. Built-in uniforms (u_time, u_resolution, u_mouse, u_hover, u_dpr)
// are supplied by ShaderCanvas; the rest are passed through its `uniforms` prop.

const HEADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
`;

// Value noise + fractal Brownian motion — the base texture for every effect.
const NOISE = `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}
`;

/**
 * Slow, domain-warped "smoke" around a base grey, with a soft pool of light
 * under the cursor.
 *   u_base — background luminance (0–1), e.g. 0.737 for #bcbcbc
 *   u_amp  — how far the smoke strays from the base (keep small, ~0.02–0.06)
 */
export const smokeShader = `${HEADER}
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_hover;
uniform float u_base;
uniform float u_amp;
${NOISE}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 p = uv * aspect * 1.6;
  float t = u_time * 0.04;
  vec2 m = (u_mouse - 0.5) * 0.35;

  vec2 q = vec2(fbm(p + vec2(0.0, t) + m), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.5),
                fbm(p + 3.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p + 2.5 * r);

  float d = distance(uv * aspect, u_mouse * aspect);
  float glow = exp(-d * d * 5.0) * u_hover;

  float lum = u_base + (f - 0.5) * u_amp * 3.0 + glow * u_amp * 0.8;
  gl_FragColor = vec4(vec3(lum), 1.0);
}
`;

/**
 * Halftone dot matrix drifting over a dark surface — dots swell with the noise
 * field and near the cursor. Weighted toward the bottom-right so copy in the
 * top-left stays clean.
 *   u_base — background luminance, u_ink — brightest dot luminance
 *   u_cell — grid cell size in CSS px
 */
export const halftoneShader = `${HEADER}
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_hover;
uniform float u_dpr;
uniform float u_base;
uniform float u_ink;
uniform float u_cell;
${NOISE}
void main() {
  float size = u_cell * u_dpr;
  vec2 px = gl_FragCoord.xy;
  vec2 center = (floor(px / size) + 0.5) * size;
  vec2 uv = center / u_resolution;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  float t = u_time * 0.05;

  float n = fbm(uv * aspect * 2.2 + vec2(t, -t * 0.6));
  float mask = smoothstep(0.15, 1.1, uv.x * 0.6 + (1.0 - uv.y) * 0.7);
  float md = distance(uv * aspect, u_mouse * aspect);
  float boost = exp(-md * md * 12.0) * 0.7 * u_hover;

  float v = clamp(smoothstep(0.35, 0.75, n) * mask + boost, 0.0, 1.0);
  float radius = v * size * 0.38;
  float dotA = (1.0 - smoothstep(radius - 0.75, radius + 0.75, length(px - center)))
             * smoothstep(0.0, 0.08, v);

  gl_FragColor = vec4(vec3(mix(u_base, u_ink, dotA)), 1.0);
}
`;

/**
 * Liquid wipe between two images (used by ShaderImage). A noisy front sweeps
 * across in `u_dir`, warping both images along its edge; the incoming image
 * settles from a slight zoom.
 */
export const imageTransitionShader = `${HEADER}
uniform vec2 u_resolution;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;
uniform vec2 u_res0;
uniform vec2 u_res1;
uniform float u_progress;
uniform float u_dir;
${NOISE}
// object-fit: cover, in UV space.
vec2 cover(vec2 uv, vec2 img) {
  float rc = u_resolution.x / u_resolution.y;
  float ri = img.x / img.y;
  vec2 s = rc > ri ? vec2(1.0, ri / rc) : vec2(rc / ri, 1.0);
  return (uv - 0.5) * s + 0.5;
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float n = fbm(uv * vec2(u_resolution.x / u_resolution.y, 1.0) * 3.0);

  float x = u_dir > 0.0 ? uv.x : 1.0 - uv.x;
  float v = clamp(x * 0.6 + n * 0.4, 0.0, 1.0);
  float w = 0.12;
  float p = u_progress * (1.0 + 2.0 * w) - w;
  float mixNew = 1.0 - smoothstep(p - w, p + w, v);
  float edge = clamp(1.0 - abs(v - p) / w, 0.0, 1.0);

  vec2 off = (vec2(n, fbm(uv * 3.0 + 7.3)) - 0.5) * 0.08 * edge;
  vec2 uv0 = (uv + off - 0.5) * (1.0 - 0.04 * u_progress) + 0.5;
  vec2 uv1 = (uv - off - 0.5) * (1.0 - 0.06 * (1.0 - u_progress)) + 0.5;

  vec3 a = texture2D(u_tex0, cover(uv0, u_res0)).rgb;
  vec3 b = texture2D(u_tex1, cover(uv1, u_res1)).rgb;
  vec3 col = mix(a, b, mixNew) + edge * edge * 0.08;
  gl_FragColor = vec4(col, 1.0);
}
`;
