// src/components/ui/shader-image.jsx
import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { createGLCanvas, prefersReducedMotion } from "../../lib/webgl";
import { imageTransitionShader } from "../../lib/shaders";

const DURATION = 1100;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * ShaderImage — an image that changes `src` with a WebGL liquid wipe instead of
 * a cut. `direction` (1 / -1) sets which way the wipe travels.
 *
 * A plain <img> always sits underneath: it carries the alt text, and it's what
 * people see if WebGL is unavailable or an image can't be used as a texture
 * (remote images must send CORS headers — Unsplash and same-origin files do).
 * Size it via `className`, like the <img> it replaces.
 */
export default function ShaderImage({ src, alt, direction = 1, className }) {
  const containerRef = useRef(null);
  const showRef = useRef(null);

  useEffect(() => {
    const gl = createGLCanvas(containerRef.current, imageTransitionShader);
    if (!gl) return;
    const ctx = gl.gl;
    ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
    ctx.uniform1i(gl.uniform("u_tex0"), 0);
    ctx.uniform1i(gl.uniform("u_tex1"), 1);

    const still = prefersReducedMotion();
    const cache = new Map(); // url → Promise<{ texture, size }>
    const state = { current: null, next: null, progress: 0, dir: 1, start: 0, raf: 0, token: 0 };

    const load = (url) => {
      if (!cache.has(url)) {
        cache.set(
          url,
          new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              const texture = ctx.createTexture();
              ctx.bindTexture(ctx.TEXTURE_2D, texture);
              ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
              ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
              ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
              ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
              try {
                ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGB, ctx.RGB, ctx.UNSIGNED_BYTE, img);
              } catch (err) {
                reject(err); // cross-origin image without CORS headers
                return;
              }
              resolve({ texture, size: [img.naturalWidth, img.naturalHeight] });
            };
            img.onerror = reject;
            img.src = url;
          })
        );
      }
      return cache.get(url);
    };

    const render = () => {
      if (!state.current) return;
      gl.resize(2);
      const to = state.next ?? state.current;
      ctx.activeTexture(ctx.TEXTURE0);
      ctx.bindTexture(ctx.TEXTURE_2D, state.current.texture);
      ctx.activeTexture(ctx.TEXTURE1);
      ctx.bindTexture(ctx.TEXTURE_2D, to.texture);
      gl.set("u_resolution", [gl.canvas.width, gl.canvas.height]);
      gl.set("u_res0", state.current.size);
      gl.set("u_res1", to.size);
      gl.set("u_progress", state.progress);
      gl.set("u_dir", state.dir);
      gl.draw();
    };

    const tick = (now) => {
      const t = Math.min(1, (now - state.start) / DURATION);
      state.progress = easeInOutCubic(t);
      render();
      if (t < 1) {
        state.raf = requestAnimationFrame(tick);
        return;
      }
      state.current = state.next;
      state.next = null;
      state.progress = 0;
      state.raf = 0;
      render();
    };

    showRef.current = async (url, dir) => {
      const token = ++state.token;
      let image;
      try {
        image = await load(url);
      } catch {
        if (token === state.token) {
          state.current = null;
          gl.hide(); // let the <img> underneath show
        }
        return;
      }
      if (token !== state.token) return; // a newer image was requested meanwhile

      // Interrupted mid-wipe: settle on the image we were heading to.
      if (state.raf) {
        cancelAnimationFrame(state.raf);
        state.raf = 0;
        state.current = state.next;
        state.next = null;
      }
      if (!state.current || still) {
        state.current = image;
        state.progress = 0;
        render();
        gl.show();
        return;
      }
      if (image === state.current) return;
      state.next = image;
      state.dir = dir;
      state.start = performance.now();
      state.raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(() => !state.raf && render());
    ro.observe(gl.canvas);

    return () => {
      state.token++;
      cancelAnimationFrame(state.raf);
      ro.disconnect();
      showRef.current = null;
      gl.destroy();
    };
  }, []);

  useEffect(() => {
    showRef.current?.(src, direction < 0 ? -1 : 1);
    // `direction` is read alongside `src`; it never changes on its own.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
    </div>
  );
}
