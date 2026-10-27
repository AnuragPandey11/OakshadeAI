// src/components/ui/contact-section.jsx
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Check, Calendar as CalendarIcon } from "lucide-react";
// Socials + WhatsApp are not rendered for now — re-add this import when the
// socials card / WhatsApp info card below are switched back on.
// import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { contactData } from "../../utils/contactData";
import { brandConfig } from "../../utils/brandConfig";
import { Eyebrow, MaskedText } from "./reveal";
import RollLabel from "./roll-label";
import ShaderCanvas from "./shader-canvas";
import { halftoneShader } from "../../lib/shaders";
import BookingCalendar from "./booking-calendar";
import { bookingData } from "../../utils/bookingData";

const iconMap = { MapPin, Phone, Mail, Clock };

// Faint dot matrix on the neutral-950 "What happens next" card.
const CARD_DOTS = { u_base: 0.039, u_ink: 0.15, u_cell: 12 };

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

// ── Validation ────────────────────────────────────────────────────────────
// Every rule lives on the field in contactData.form.fields — this function
// just applies them in order and returns the first failing message ("" = ok).
const FIELD_ORDER = ["name", "email", "phone", "message"];

function validateField(key, rawValue, fields) {
  const rules = fields[key];
  const value = rawValue.trim();
  const msg = rules.errors ?? {};

  if (!value) return rules.required ? msg.required ?? "This field is required." : "";
  if (rules.minLength && value.length < rules.minLength) return msg.minLength ?? "";
  if (rules.maxLength && value.length > rules.maxLength) return msg.maxLength ?? "";
  if (rules.pattern && !rules.pattern.test(value)) return msg.invalid ?? "";

  // Phone: the pattern only allows the right characters — count digits too.
  if (rules.minDigits || rules.maxDigits) {
    const digits = value.replace(/\D/g, "").length;
    if (digits < (rules.minDigits ?? 0) || digits > (rules.maxDigits ?? Infinity))
      return msg.digits ?? "";
  }
  return "";
}

function validateAll(values, fields) {
  const errs = {};
  FIELD_ORDER.forEach((key) => {
    const error = validateField(key, values[key], fields);
    if (error) errs[key] = error;
  });
  return errs;
}

// ── Shared field renderer ─────────────────────────────────────────────────
// One component for every input so validation, error styling and the a11y
// wiring (aria-invalid / aria-describedby) stay identical across fields.
function Field({ id, config, value, error, onChange, onBlur, textarea = false }) {
  const base =
    "w-full px-5 py-4 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-neutral-300";
  const state = error
    ? "border-red-400 focus:ring-red-200 focus:border-red-400"
    : "border-neutral-200 focus:ring-neutral-900/20 focus:border-neutral-900";

  const shared = {
    id,
    name: id,
    value,
    onChange,
    onBlur,
    maxLength: config.maxLength,
    placeholder: config.placeholder,
    required: config.required,
    "aria-invalid": error ? "true" : "false",
    "aria-describedby": error ? `${id}-error` : undefined,
    className: `${base} ${state}${textarea ? " resize-none" : ""}`,
  };

  // A live character count, shown once the user is within 100 of the limit.
  const nearLimit =
    config.maxLength && value.length > config.maxLength - 100 ? true : false;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={id}
          className="block text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-2"
        >
          {config.label}
        </label>
        {nearLimit && (
          <span
            className={`text-[11px] tabular-nums ${
              value.length >= config.maxLength ? "text-red-500" : "text-neutral-400"
            }`}
          >
            {value.length}/{config.maxLength}
          </span>
        )}
      </div>

      {textarea ? <textarea rows={5} {...shared} /> : <input type={config.inputType ?? "text"} {...shared} />}

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  // A field only shows its error once it has been blurred or submit was tried.
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Toggle between interactive booking calendar ("book") and direct message form ("message")
  const [contactMode, setContactMode] = useState("book");

  const { hero, infoCards, nextSteps, form, socialsCard } = contactData;

  // Hero image parallax: it drifts slower than the page as the hero scrolls.
  const heroRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const fields = form.fields;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((s) => ({ ...s, [name]: value }));
    // Re-validate live only after the field has been touched, so we correct
    // errors as the user types without nagging them mid-first-attempt.
    if (touched[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, fields),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setFieldErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, fields),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Client-side gate — validate everything, reveal every error at once.
    const errs = validateAll(formState, fields);
    setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])));
    setFieldErrors(errs);

    if (Object.keys(errs).length > 0) {
      // Send focus to the first field that failed so keyboard and screen
      // reader users land on the problem rather than hunting for it.
      document.getElementById(FIELD_ORDER.find((k) => errs[k]))?.focus();
      return;
    }
    // Send message directly to oakshade.business@gmail.com
    setIsSubmitting(true);
    try {
      if (bookingData.web3formsKey) {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: bookingData.web3formsKey,
            subject: form.mailSubject.replace("{name}", formState.name.trim()),
            from_name: "Oakshade AI Contact Form",
            name: formState.name.trim(),
            email: formState.email.trim(),
            phone: formState.phone.trim() || "Not provided",
            message: formState.message.trim(),
          }),
        });
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to send message");
        }
      } else {
        openMailClient(formState);
      }
      setIsSubmitted(true);
      setTouched({});
      setFieldErrors({});
    } catch {
      try {
        openMailClient(formState);
        setIsSubmitted(true);
        setTouched({});
        setFieldErrors({});
      } catch {
        setServerError(form.networkError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Builds the mailto: URL and navigates to it, which hands off to whatever
  // email app the device has registered (Mail, Outlook, Gmail, …).
  function openMailClient(values) {
    const subject = form.mailSubject.replace("{name}", values.name.trim());
    const body = [
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
      values.phone.trim() ? `Phone: ${values.phone.trim()}` : null,
      "",
      values.message.trim(),
      "",
      "— Sent from the Oakshade AI website contact form",
    ]
      .filter((line) => line !== null)
      .join("\r\n");

    window.location.href =
      `mailto:${brandConfig.email}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  }

  // Only surface an error once its field has been touched.
  const errorFor = (key) => (touched[key] ? fieldErrors[key] || "" : "");
  const hasErrors = FIELD_ORDER.some((k) => errorFor(k));

  return (
    <section id="contact" className="scroll-mt-24 bg-white text-neutral-800">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative overflow-hidden h-[65vh] min-h-[440px] md:min-h-[520px] bg-neutral-900">
        {/* Full-bleed image — oversized for the parallax, and it settles out
            of a slow zoom the first time it scrolls into view. */}
        <div className="absolute inset-0 z-0">
          <motion.img
            src={hero.image}
            alt={hero.imageAlt}
            style={reduce ? undefined : { y: heroImageY }}
            initial={{ scale: 1.15 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
          />
          {/* Layered gradients: left-side dark for text legibility, bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Text — left-aligned, bottom-anchored */}
        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-6 lg:px-16 pb-14 md:pb-20 max-w-7xl">
            <Eyebrow className="text-sm tracking-[0.2em] text-neutral-300 mb-4">
              {hero.eyebrow}
            </Eyebrow>
            <MaskedText
              as="h1"
              delay={0.1}
              text={hero.heading}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] text-white mb-5 max-w-2xl"
            />
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

      {/* ── Mode Switcher & Content ─────────────────────────────────────── */}
      <div className="py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
          {/* Centered Segmented Control */}
          <div className="flex flex-col items-center mb-14 text-center">
            <Eyebrow className="text-xs uppercase tracking-[0.25em] text-neutral-400 mb-3">
              Get Started
            </Eyebrow>
            <MaskedText
              as="h2"
              text="How would you like to *connect*?"
              className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-6"
            />
            <div className="inline-flex p-1.5 rounded-2xl bg-neutral-100 border border-neutral-200/80 shadow-inner">
              <button
                type="button"
                onClick={() => setContactMode("book")}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  contactMode === "book"
                    ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/10"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <CalendarIcon size={16} />
                <span>Book a 30-Min Call</span>
              </button>
              <button
                type="button"
                onClick={() => setContactMode("message")}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  contactMode === "message"
                    ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/10"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <Mail size={16} />
                <span>Send a Message</span>
              </button>
            </div>
          </div>

          {contactMode === "book" ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <BookingCalendar />
              <div className="mt-8 text-center text-xs text-neutral-500">
                Prefer sending us a direct note instead?{" "}
                <button
                  type="button"
                  onClick={() => setContactMode("message")}
                  className="font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-600 cursor-pointer"
                >
                  Fill out the message form
                </button>{" "}
                or email us at{" "}
                <a
                  href={`mailto:${brandConfig.email}`}
                  className="font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
                >
                  {brandConfig.email}
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20"
            >
              {/* Form */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="lg:col-span-7"
              >
                <Eyebrow className="text-sm tracking-[0.2em] text-neutral-400 mb-3">
                  {form.eyebrow}
                </Eyebrow>
              <MaskedText
                text={form.heading}
                delay={0.1}
                className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-8"
              />

              {isSubmitted ? (
                <div className="bg-neutral-100 rounded-2xl p-10 text-center space-y-4 border border-neutral-200">
                  {/* Shares layoutId with the submit button, which morphs
                      into this badge on success (and back on "send another"). */}
                  <motion.div
                    layoutId="contact-submit"
                    style={{ borderRadius: 999 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center bg-neutral-900 text-white"
                  >
                    <motion.span
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 18 }}
                    >
                      <Check size={28} strokeWidth={3} />
                    </motion.span>
                  </motion.div>
                  <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
                    {form.successHeading}
                  </h3>
                  <p className="text-neutral-500">{form.successMessage}</p>

                  {/* Fallback: mailto: does nothing on devices with no mail
                      app configured, and that failure is silent — so always
                      offer a retry and the plain address. */}
                  <div className="pt-2 space-y-3 border-t border-neutral-200 mt-6">
                    <p className="text-sm text-neutral-500 pt-4">
                      {form.successFallback}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => openMailClient(formState)}
                        className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-700 transition-colors cursor-pointer"
                      >
                        <Send size={14} />
                        {form.successFallbackLabel}
                      </button>
                      <a
                        href={`mailto:${brandConfig.email}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-white border border-neutral-200 px-5 py-3 text-sm font-medium text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
                      >
                        <Mail size={16} />
                        {brandConfig.email}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormState({ name: "", email: "", phone: "", message: "" });
                    }}
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

                  {/* Validation summary — mirrors the per-field errors */}
                  {hasErrors && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
                      <span className="mt-0.5 shrink-0">⚠</span>
                      <p>{form.invalidSummary}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field
                      id="name"
                      config={fields.name}
                      value={formState.name}
                      error={errorFor("name")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Field
                      id="email"
                      config={fields.email}
                      value={formState.email}
                      error={errorFor("email")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  <Field
                    id="phone"
                    config={fields.phone}
                    value={formState.phone}
                    error={errorFor("phone")}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <Field
                    id="message"
                    config={fields.message}
                    value={formState.message}
                    error={errorFor("message")}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    textarea
                  />

                  {/* borderRadius lives in style (not rounded-xl) so Framer can
                      tween it during the layoutId morph. */}
                  <motion.button
                    type="submit"
                    layoutId="contact-submit"
                    style={{ borderRadius: 12 }}
                    disabled={isSubmitting}
                    className="group inline-flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 font-bold uppercase text-xs tracking-[0.2em] hover:bg-neutral-700 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <RollLabel>{form.submitLabel}</RollLabel>
                        <Send size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Sidebar — one dark card: what happens after you write, then
                the direct channels (infoCards). It replaces the old logo,
                "Prefer email?" and info cards, which showed the email
                address three times. Sticks beside the form on desktop. */}
            <motion.aside
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="lg:col-span-5"
            >
              <div className="relative overflow-hidden rounded-3xl bg-neutral-950 p-8 text-white md:p-10 lg:sticky lg:top-28">
                <ShaderCanvas fragment={halftoneShader} uniforms={CARD_DOTS} />
                <div className="relative">
                  <Eyebrow className="mb-8 text-xs tracking-[0.25em] text-neutral-500">
                    {nextSteps.eyebrow}
                  </Eyebrow>

                  <ol className="space-y-7">
                    {nextSteps.steps.map((step, i) => (
                      <li key={step.title} className="flex gap-5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs font-semibold tabular-nums text-white/70">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="font-semibold tracking-tight text-white">{step.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-neutral-400">{step.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-10 space-y-5 border-t border-white/10 pt-8">
                    {infoCards.map((card) => {
                      const Icon = iconMap[card.iconName];
                      const external = card.href?.startsWith("http");
                      return (
                        <a
                          key={card.title}
                          href={card.href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className="group flex items-start gap-4"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-colors group-hover:bg-white group-hover:text-neutral-900">
                            {Icon && <Icon size={18} strokeWidth={1.5} />}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                              {card.title}
                            </span>
                            <span className="link-underline text-sm text-white [overflow-wrap:anywhere] sm:text-base">
                              {card.lines[0]}
                            </span>
                            {card.lines[1] && (
                              <span className="mt-1 block text-xs text-neutral-500">{card.lines[1]}</span>
                            )}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Socials card — hidden until the accounts exist. Re-enable by
                  uncommenting this block and the react-icons import above.
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
              */}
            </motion.aside>
          </motion.div>
        )}
        </div>
      </div>
    </section>
  );
}
