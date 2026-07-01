// src/components/ui/our-services.jsx
import CardFlip from "./flip-card";
import Carousel from "./carousel";
import SectionHeading from "./section-heading";
import { services } from "../../utils/servicesData";

export default function OurServices() {
  return (
    <section id="services" className="w-full scroll-mt-24 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {/* Left: heading — Right: view-all button */}
        <SectionHeading
          eyebrow="Our Services"
          title="Lorem ipsum dolor sit amet"
          ctaLabel="View all services"
          ctaTo="/services"
        />

        {/* Cards as a carousel (single-card swipeable slider on mobile) */}
        <Carousel itemClassName="w-[85%] sm:w-[300px]">
          {services.map((s) => (
            <CardFlip
              key={s.slug}
              title={s.title}
              subtitle={s.subtitle}
              description={s.description}
              features={s.features}
              color={s.color}
            />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
