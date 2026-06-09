// src/components/ui/oakshade-hero.jsx

// Feather the video's rectangular edges so it melts into the section
// background instead of showing a hard box. Horizontal + vertical gradients
// composited together fade all four edges.
const FEATHER =
  "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%), " +
  "linear-gradient(to bottom, transparent 0%, #000 11%, #000 89%, transparent 100%)";

const featherStyle = {
  WebkitMaskImage: FEATHER,
  maskImage: FEATHER,
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

export function OakshadeHero() {
  return (
    <section id="home" className="w-full bg-[#bcbcbc] lg:h-screen">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center gap-5 px-6 pb-12 pt-24 lg:h-full lg:flex-row lg:items-center lg:gap-10 lg:pb-0 lg:pt-0">
        {/* Left — text */}
        <div className="order-2 w-full text-center lg:order-1 lg:w-[40%] lg:text-left">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-600 sm:text-xs">
            Lorem Ipsum
          </p>
          <h1 className="mb-5 text-3xl font-bold leading-[1.08] tracking-tight text-neutral-900 sm:text-4xl md:text-5xl xl:text-6xl">
            Lorem ipsum dolor sit amet.
          </h1>
          <p className="mx-auto max-w-md text-base leading-relaxed text-neutral-700 md:text-lg lg:mx-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>
        </div>

        {/* Right — video, cropped (4:3) + enlarged to fill the space; feathered to blend */}
        <div className="order-1 flex w-full justify-center lg:order-2 lg:w-[60%]">
          <div className="relative aspect-[4/3] w-full overflow-hidden lg:scale-[1.12]">
            <video
              className="absolute inset-0 h-full w-full object-cover object-center"
              style={featherStyle}
              src="/media/oakshade-hero.mp4"
              poster="/media/oakshade-hero-poster.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default OakshadeHero;
