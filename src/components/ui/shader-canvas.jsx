// src/components/ui/shader-canvas.jsx
import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { createGLCanvas, prefersReducedMotion } from "../../lib/webgl";

/**
 * ShaderCanvas — an animated fragment-shader background that fills its nearest
 * positioned parent. Give that parent a matching CSS background: it shows while
 * the canvas fades in, and stays as the fallback when WebGL is unavailable.
 *
 * Built-in uniforms: u_time (s), u_resolution (device px), u_dpr, u_mouse
 * (0–1 across the canvas, eased; rests at the centre) and u_hover (eases to 1
 * while the pointer is over the canvas, back to 0 when it leaves). `uniforms` adds static
 * values, e.g. { u_base: 0.74, u_amp: 0.05 }.
 *
 * Only renders while on screen. With prefers-reduced-motion it draws a single
 * still frame and ignores the cursor.
 */
export default function ShaderCanvas({ fragment, uniforms = {}, className, maxDpr = 1.5 }) {
  const containerRef = useRef(null);
  const uniformsRef = useRef(uniforms);
  uniformsRef.current = uniforms;

  useEffect(() => {
    const gl = createGLCanvas(containerRef.current, fragment);
    if (!gl) return;

    const still = prefersReducedMotion();
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, hover: 0, inside: 0 };
    const start = performance.now();
    let raf = 0;
    let visible = false;

    const render = (now) => {
      gl.resize(maxDpr);
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      mouse.hover += (mouse.inside - mouse.hover) * 0.05;
      gl.set("u_time", still ? 12 : (now - start) / 1000);
      gl.set("u_resolution", [gl.canvas.width, gl.canvas.height]);
      gl.set("u_dpr", gl.getDpr());
      gl.set("u_mouse", [mouse.x, mouse.y]);
      gl.set("u_hover", mouse.hover);
      Object.entries(uniformsRef.current).forEach(([name, value]) => gl.set(name, value));
      gl.draw();
      gl.show();
    };

    const loop = (now) => {
      render(now);
      raf = visible && !still ? requestAnimationFrame(loop) : 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(gl.canvas);

    // The animated loop resizes every frame; a still frame needs a redraw.
    const ro = new ResizeObserver(() => still && render(performance.now()));
    ro.observe(gl.canvas);

    const onPointerMove = (e) => {
      if (!visible || still) {
        mouse.inside = 0;
        return;
      }
      const r = gl.canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
      const inside = mouse.tx >= 0 && mouse.tx <= 1 && mouse.ty >= 0 && mouse.ty <= 1;
      mouse.inside = inside ? 1 : 0;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      gl.destroy();
    };
  }, [fragment, maxDpr]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    />
  );
}
