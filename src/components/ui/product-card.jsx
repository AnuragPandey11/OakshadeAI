// src/components/ui/product-card.jsx
import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";

export const ProductHighlightCard = React.forwardRef(
  ({ className, categoryIcon, category, title, description, imageSrc, imageAlt, media, ...props }, ref) => {
    // --- 3D tilt ---
    // Pointer position as a 0–1 fraction of the card. It rests at the centre
    // (0.5, 0.5) = no tilt; resting at 0,0 used to leave every card tipped
    // toward its top-left corner when the mouse wasn't on it.
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const hover = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      mouseX.set((clientX - left) / width);
      mouseY.set((clientY - top) / height);
      hover.set(1);
    };

    const rotateX = useTransform(mouseY, [0, 1], [10, -10]);
    const rotateY = useTransform(mouseX, [0, 1], [-10, 10]);

    const springConfig = { stiffness: 300, damping: 20 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);

    // --- Glow follow (fades in on hover, out on leave) ---
    const glowX = useTransform(mouseX, [0, 1], [0, 100]);
    const glowY = useTransform(mouseY, [0, 1], [0, 100]);
    const glowOpacity = useSpring(useTransform(hover, [0, 1], [0, 0.6]), springConfig);

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(0.5);
          mouseY.set(0.5);
          hover.set(0);
        }}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative h-[350px] w-full max-w-[350px] rounded-2xl border border-neutral-200 bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl",
          className
        )}
        {...props}
      >
        <div
          style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
          className="absolute inset-4 overflow-hidden rounded-xl bg-neutral-900/[0.04] shadow-inner"
        >
          {/* Grid texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

          {/* Glow that follows the mouse (monochrome) */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-xl opacity-0"
            style={{
              opacity: glowOpacity,
              background: useTransform(
                [glowX, glowY],
                ([x, y]) => `radial-gradient(120px at ${x}% ${y}%, rgba(23,23,23,0.18), transparent 60%)`
              ),
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between p-6">
            <div className="flex items-center space-x-2 text-neutral-900">
              {categoryIcon}
              <span className="text-sm font-medium">{category}</span>
            </div>

            <div className="text-neutral-900">
              <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
              <p className="mt-2 max-w-[60%] text-xs text-neutral-500">{description}</p>
            </div>
          </div>

          {/* Corner decoration: either a rendered node (`media`, e.g. an icon)
              or an image / GIF via `imageSrc`. Sits below the z-10 text block
              so it reads as a watermark rather than competing with the copy. */}
          {media ? (
            <motion.div
              aria-hidden="true"
              style={{ transform: "translateZ(50px)" }}
              whileHover={{ scale: 1.1, y: -20, x: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="pointer-events-none absolute -right-6 -bottom-6"
            >
              {media}
            </motion.div>
          ) : (
            <motion.img
              src={imageSrc}
              alt={imageAlt}
              style={{ transform: "translateZ(50px)" }}
              whileHover={{ scale: 1.1, y: -20, x: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute -right-12 -bottom-12 h-56 w-56 object-contain"
            />
          )}
        </div>
      </motion.div>
    );
  }
);

ProductHighlightCard.displayName = "ProductHighlightCard";
