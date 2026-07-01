// src/components/ui/contact-section.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { contactData } from "../../utils/contactData";
import { brandConfig } from "../../utils/brandConfig";

const iconMap = { MapPin, Phone, Mail, Clock, FaWhatsapp };

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

// ── Validation helpers ────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s\-()+]{7,20}$/;

function validateForm({ name, email, phone, message }) {
  const errs = {};
  if (!name.trim() || name.trim().length < 2)
    errs.name = "Please enter your full name (at least 2 characters).";
  if (!email.trim() || !EMAIL_RE.test(email.trim()))
    errs.email = "Please enter a valid email address.";
  if (phone.trim() && !PHONE_RE.test(phone.trim()))
    errs.phone = "Phone number looks invalid — please check it.";
  if (!message.trim() || message.trim().length < 10)
    errs.message = "Please write a message (at least 10 characters).";
  return errs;
}

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((s) => ({ ...s, [name]: value }));
    // Clear the field error as the user corrects their input
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Client-side gate
    const errs = validateForm(formState);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      // TODO: wire this up to your backend / email service (e.g. Formspree,
      // Resend, an API route, etc.). For now we simulate a successful send.
      await new Promise((resolve) => setTimeout(resolve, 900));
      setIsSubmitted(true);
      setFormState({ name: "", email: "", phone: "", message: "" });
    } catch {
      setServerError(
        "Unable to send your message right now. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const { hero, infoCards, form, socialsCard } = contactData;

  return (
    <section id="contact" className="scroll-mt-24 bg-white text-neutral-800">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden h-[65vh] min-h-[440px] md:min-h-[520px]">
        {/* Full-bleed image */}
        <div className="absolute inset-0 z-0">
          <img
            src={hero.image}
            alt={hero.imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Layered gradients: left-side dark for text legibility, bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Text — left-aligned, bottom-anchored */}
        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-6 lg:px-16 pb-14 md:pb-20 max-w-7xl">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-300 mb-4"
            >
              {hero.eyebrow}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] text-white mb-5 max-w-2xl"
            >
              {hero.heading}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              className="text-base md:text-lg text-white/75 max-w-lg leading-relaxed"
            >
              {hero.subheading}
            </motion.p>
          </div>
        </div>
      </div>

      {/* ── Info Cards ───────────────────────────────────────────────────── */}
      <div className="py-16 md:py-20 bg-neutral-100">
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {infoCards.map((card, i) => {
              const Icon = iconMap[card.iconName];
              const isLink = !!card.href;
              const Wrapper = isLink ? motion.a : motion.div;
              const wrapperProps = isLink
                ? {
                    href: card.href,
                    target: card.href.startsWith("http") ? "_blank" : undefined,
                    rel: card.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined,
                  }
                : {};

              return (
                <Wrapper
                  key={card.title}
                  {...wrapperProps}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className={`bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 block transition-all ${
                    isLink
                      ? "cursor-pointer hover:shadow-lg hover:-translate-y-1 group"
                      : "hover:shadow-lg transition-shadow"
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-5 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                    {Icon && <Icon strokeWidth={1.5} />}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-neutral-900 mb-3">
                    {card.title}
                  </h3>
                  <div className="space-y-1">
                    {card.lines.map((line, idx) => (
                      <p key={idx} className="text-sm text-neutral-500">
                        {line}
                      </p>
                    ))}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Form + Socials ───────────────────────────────────────────────── */}
      <div className="py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3">
                {form.eyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-8">
                {form.heading}
              </h2>

              {isSubmitted ? (
                <div className="bg-neutral-100 rounded-2xl p-10 text-center space-y-4 border border-neutral-200">
                  <CheckCircle size={48} className="text-neutral-900 mx-auto" />
                  <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
                    {form.successHeading}
                  </h3>
                  <p className="text-neutral-500">{form.successMessage}</p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-sm text-neutral-900 underline underline-offset-4 hover:text-neutral-600 cursor-pointer"
                  >
                    {form.successRetry}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Server-error banner */}
                  {serverError && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
                      <span className="mt-0.5 shrink-0">⚠</span>
                      <p>{serverError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-2"
                      >
                        {form.fields.name.label}
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formState.name}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-neutral-300 ${
                          fieldErrors.name
                            ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                            : "border-neutral-200 focus:ring-neutral-900/20 focus:border-neutral-900"
                        }`}
                        placeholder={form.fields.name.placeholder}
                      />
                      {fieldErrors.name && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-2"
                      >
                        {form.fields.email.label}
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-neutral-300 ${
                          fieldErrors.email
                            ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                            : "border-neutral-200 focus:ring-neutral-900/20 focus:border-neutral-900"
                        }`}
                        placeholder={form.fields.email.placeholder}
                      />
                      {fieldErrors.email && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-2"
                    >
                      {form.fields.phone.label}
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formState.phone}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-neutral-300 ${
                        fieldErrors.phone
                          ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                          : "border-neutral-200 focus:ring-neutral-900/20 focus:border-neutral-900"
                      }`}
                      placeholder={form.fields.phone.placeholder}
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-2"
                    >
                      {form.fields.message.label}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 transition-all resize-none placeholder:text-neutral-300 ${
                        fieldErrors.message
                          ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                          : "border-neutral-200 focus:ring-neutral-900/20 focus:border-neutral-900"
                      }`}
                      placeholder={form.fields.message.placeholder}
                    />
                    {fieldErrors.message && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {fieldErrors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-[0.2em] hover:bg-neutral-700 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        {form.submitLabel}
                        <Send size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="lg:col-span-5 space-y-8"
            >
              {/* Brand logo — occupies the same space the map card did */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center p-3">
                <img
                  src="/media/oakshade-logo.png"
                  alt={brandConfig.name}
                  className="h-full w-full object-contain scale-110"
                />
              </div>

              {/* Socials Card */}
              <div className="bg-neutral-100 p-6 md:p-8 rounded-2xl border border-neutral-200">
                <h3 className="font-bold tracking-tight text-lg text-neutral-900 mb-4">
                  {socialsCard.heading}
                </h3>
                <p className="text-sm text-neutral-500 mb-6">
                  {socialsCard.subtext}
                </p>
                <div className="flex gap-3">
                  <a
                    href={brandConfig.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-neutral-200 text-sm font-medium text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
                  >
                    <FaInstagram size={18} />
                    Instagram
                  </a>
                  <a
                    href={brandConfig.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-neutral-200 text-sm font-medium text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
                  >
                    <FaFacebookF size={18} />
                    Facebook
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
