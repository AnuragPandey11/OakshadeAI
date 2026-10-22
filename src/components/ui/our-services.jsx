// src/components/ui/our-services.jsx
import { motion } from "framer-motion";
import CardFlip from "./flip-card";
import Carousel from "./carousel";
import SectionHeading from "./section-heading";
import { EASE_OUT } from "./reveal";
import { services } from "../../utils/servicesData";

export default function OurServices() {
  return (
    <section id="services" className="w-full scroll-mt-24 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {/* Left: heading — Right: view-all button */}
        <SectionHeading
          eyebrow="Our Services"
          title="Everything you need to *build* and scale"
          ctaLabel="View all services"
          ctaTo="/services"
        />

        {/* Cards as a carousel (single-card swipeable slider on mobile). Each
            card rises in as it enters view — the first row staggers, cards
            further along the track animate when scrolled to. */}
        <Carousel itemClassName="w-[85%] sm:w-[300px]">
          {services.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: (i % 4) * 0.1 }}
              className="flex w-full justify-center"
            >
              <CardFlip
                slug={s.slug}
                title={s.title}
                subtitle={s.subtitle}
                description={s.description}
                features={s.features}
                color={s.color}
                media={s.image}
              />
            </motion.div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
