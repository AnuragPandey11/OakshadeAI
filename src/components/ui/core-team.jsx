// src/components/ui/core-team.jsx
import { TestimonialCarousel } from "./profile-card-testimonial-carousel";

export default function CoreTeam() {
  return (
    <section id="team" className="w-full scroll-mt-24 bg-neutral-200">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Core Team
        </p>
        <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-neutral-900 md:text-5xl">
          Lorem ipsum dolor sit amet
        </h2>

        <TestimonialCarousel />
      </div>
    </section>
  );
}
