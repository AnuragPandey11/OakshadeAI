// src/components/ui/browser-mockup.jsx
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

/**
 * BrowserMockup — houses project video and static media inside a compact,
 * sleek macOS browser window frame with zero-flicker cross-fade and smart playback.
 */
export default function BrowserMockup({
  video,
  videoMp4,
  poster,
  title = "Project preview",
  autoPlay = true,
  hoverPlay = false,
  className,
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const stageRef = useRef(null);

  // Check for reduced motion
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reset playing state when media changes
  useEffect(() => {
    setPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [video, poster]);

  // Autoplay management
  useEffect(() => {
    if (!video || !autoPlay || hoverPlay || reducedMotion) return;

    const el = videoRef.current;
    if (!el) return;

    el.defaultMuted = true;
    el.muted = true;
    const p = el.play();
    if (p) {
      p.catch(() => {});
    }
  }, [video, autoPlay, hoverPlay, reducedMotion]);

  // Desktop hover interactions (when hoverPlay is active)
  const handleMouseEnter = () => {
    if (!hoverPlay || !videoRef.current || reducedMotion) return;
    const el = videoRef.current;
    el.defaultMuted = true;
    el.muted = true;
    el.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    if (!hoverPlay || !videoRef.current) return;
    const el = videoRef.current;
    el.pause();
    el.currentTime = 0;
    setPlaying(false);
  };

  // Touch device scroll-in auto-play for hoverPlay cards
  useEffect(() => {
    if (!hoverPlay || !video || !stageRef.current || reducedMotion) return;

    const isTouch = window.matchMedia("(hover: none)").matches;
    if (!isTouch) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoRef.current) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            videoRef.current.defaultMuted = true;
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
            setPlaying(false);
          }
        });
      },
      { threshold: 0.7 }
    );

    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, [hoverPlay, video, reducedMotion]);

  return (
    <div
      ref={stageRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("project-stage", className)}
    >
      <div className="browser-frame">
        <div className="browser-bar" aria-hidden="true">
          <span className="browser-dot" />
          <span className="browser-dot" />
          <span className="browser-dot" />
        </div>
        <div className="browser-media">
          {/* Static poster sits underneath to prevent blank frames */}
          {poster && (
            <img
              src={poster}
              alt={title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain object-top"
            />
          )}

          {/* Video overlays with zero-flicker cross-fade */}
          {video && !reducedMotion && (
            <video
              ref={(el) => {
                if (el) {
                  el.defaultMuted = true;
                  el.muted = true;
                  if (autoPlay && !hoverPlay) {
                    el.play().catch(() => {});
                  }
                  videoRef.current = el;
                }
              }}
              poster={poster}
              autoPlay={autoPlay && !hoverPlay}
              muted
              loop
              playsInline
              preload={autoPlay && !hoverPlay ? "auto" : "metadata"}
              className={cn(
                "absolute inset-0 h-full w-full object-contain object-top transition-opacity duration-300",
                playing ? "opacity-100" : "opacity-0"
              )}
              onPlaying={() => setPlaying(true)}
            >
              {videoMp4 && <source src={videoMp4} type="video/mp4" />}
              <source src={video} type="video/mp4" />
              <source src={video} type="video/quicktime" />
            </video>
          )}
        </div>
      </div>
    </div>
  );
}
