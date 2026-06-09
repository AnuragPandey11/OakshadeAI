// src/components/ui/profile-card-testimonial-carousel.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaGithub, FaTwitter, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import { cn } from "../../lib/utils";

// Two team members for now — edit names, roles, photos, and social links here.
const testimonials = [
  {
    name: "Lorem Ipsum",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    githubUrl: "#",
    twitterUrl: "#",
    youtubeUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "Dolor Sit",
    title: "Consectetur adipiscing elit",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
    imageUrl:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=600&q=80",
    githubUrl: "#",
    twitterUrl: "#",
    youtubeUrl: "#",
    linkedinUrl: "#",
  },
];

export function TestimonialCarousel({ className }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => setCurrentIndex((i) => (i + 1) % testimonials.length);
  const handlePrevious = () =>
    setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[currentIndex];

  const socialIcons = [
    { icon: FaGithub, url: t.githubUrl, label: "GitHub" },
    { icon: FaTwitter, url: t.twitterUrl, label: "Twitter" },
    { icon: FaYoutube, url: t.youtubeUrl, label: "YouTube" },
    { icon: FaLinkedinIn, url: t.linkedinUrl, label: "LinkedIn" },
  ];

  return (
    <div className={cn("mx-auto w-full max-w-5xl px-4", className)}>
      {/* Desktop layout */}
      <div className="relative hidden items-center md:flex">
        {/* Avatar */}
        <div className="h-[470px] w-[470px] flex-shrink-0 overflow-hidden rounded-3xl bg-neutral-200">
          <AnimatePresence mode="wait">
            <motion.img
              key={t.imageUrl}
              src={t.imageUrl}
              alt={t.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full w-full object-cover grayscale"
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {/* Card */}
        <div className="z-10 ml-[-80px] max-w-xl flex-1 rounded-3xl bg-white p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold text-neutral-900">{t.name}</h3>
                <p className="text-sm font-medium text-neutral-600">{t.title}</p>
              </div>

              <p className="mb-8 text-base leading-relaxed text-neutral-800">{t.description}</p>

              <div className="flex space-x-4">
                {socialIcons.map(({ icon: Icon, url, label }) => (
                  <a
                    key={label}
                    href={url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-neutral-900 transition-all hover:scale-105 hover:bg-neutral-700"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </a>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="mx-auto max-w-sm text-center md:hidden">
        <div className="mb-6 aspect-square w-full overflow-hidden rounded-3xl bg-neutral-200">
          <AnimatePresence mode="wait">
            <motion.img
              key={t.imageUrl}
              src={t.imageUrl}
              alt={t.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full w-full object-cover grayscale"
              draggable={false}
            />
          </AnimatePresence>
        </div>

        <div className="px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <h3 className="mb-2 text-xl font-bold text-neutral-900">{t.name}</h3>
              <p className="mb-4 text-sm font-medium text-neutral-600">{t.title}</p>
              <p className="mb-6 text-sm leading-relaxed text-neutral-800">{t.description}</p>

              <div className="flex justify-center space-x-4">
                {socialIcons.map(({ icon: Icon, url, label }) => (
                  <a
                    key={label}
                    href={url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-neutral-900 transition-colors hover:bg-neutral-700"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </a>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          onClick={handlePrevious}
          aria-label="Previous"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 shadow-md transition-colors hover:bg-neutral-200"
        >
          <ChevronLeft className="h-6 w-6 text-neutral-700" />
        </button>

        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "h-3 w-3 cursor-pointer rounded-full transition-colors",
                i === currentIndex ? "bg-neutral-900" : "bg-neutral-400"
              )}
              aria-label={`Go to ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 shadow-md transition-colors hover:bg-neutral-200"
        >
          <ChevronRight className="h-6 w-6 text-neutral-700" />
        </button>
      </div>
    </div>
  );
}
