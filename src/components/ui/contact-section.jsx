// src/components/ui/contact-section.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
// Socials + WhatsApp are not rendered for now — re-add this import when the
// socials card / WhatsApp info card below are switched back on.
// import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { contactData } from "../../utils/contactData";
import { brandConfig } from "../../utils/brandConfig";

const iconMap = { MapPin, Phone, Mail, Clock };

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

  const { hero, infoCards, form, socialsCard } = contactData;
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
    // The site has no backend, so we hand the message to the visitor's own
    // email client with everything pre-filled. They press send there.
    setIsSubmitting(true);
    try {
      openMailClient(formState);
      setIsSubmitted(true);
      // The values are kept (not cleared) so the mailto can be re-opened if
      // the email app didn't launch — see the fallback in the success panel.
      setTouched({});
      setFieldErrors({});
    } catch {
      setServerError(form.networkError);
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
          <div
            className={`grid gap-5 md:gap-6 ${
              infoCards.length === 1
                ? "grid-cols-1 mx-auto max-w-md"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
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

              {/* Email card — the only contact channel we publish for now */}
              <div className="bg-neutral-100 p-6 md:p-8 rounded-2xl border border-neutral-200">
                <h3 className="font-bold tracking-tight text-lg text-neutral-900 mb-4">
                  Prefer email?
                </h3>
                <p className="text-sm text-neutral-500 mb-6">
                  Write to us directly and we'll get back to you within one business
                  day.
                </p>
                <a
                  href={`mailto:${brandConfig.email}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-neutral-200 text-sm font-medium text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
                >
                  <Mail size={18} />
                  {brandConfig.email}
                </a>
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
