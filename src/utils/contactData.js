// src/utils/contactData.js
// ─────────────────────────────────────────────────────────────────────────
// All copy + assets for the Contact section. `iconName` maps to an icon in
// the component's local iconMap (MapPin, Phone, Mail, Clock, FaWhatsapp).
// ─────────────────────────────────────────────────────────────────────────

import { brandConfig } from "./brandConfig";

export const contactData = {
  hero: {
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Oakshade AI workspace",
    eyebrow: "Get in touch",
    heading: "Let's build something remarkable together",
    subheading:
      "Tell us about your project and we'll get back to you within one business day.",
  },

  // Email is the only contact channel we publish for now. The phone /
  // WhatsApp cards are kept here (commented out) so they can be switched back
  // on once those numbers are live — see brandConfig.phone / .whatsapp.
  infoCards: [
    {
      iconName: "Mail",
      title: "Email us",
      lines: [brandConfig.email, "We reply within one business day"],
      href: `mailto:${brandConfig.email}`,
    },
    // {
    //   iconName: "Phone",
    //   title: "Call us",
    //   lines: [brandConfig.phone, "Mon – Fri, 9am – 6pm"],
    //   href: `tel:${brandConfig.phone.replace(/[^\d+]/g, "")}`,
    // },
    // {
    //   iconName: "FaWhatsapp",
    //   title: "WhatsApp",
    //   lines: ["Chat with our team", "Fast, direct answers"],
    //   href: `https://wa.me/${brandConfig.whatsapp.replace(/[^\d]/g, "")}`,
    // },
  ],

  form: {
    eyebrow: "Send a message",
    heading: "Tell us about your project",
    submitLabel: "Send message",
    // Submitting hands the message to the visitor's own email app via a
    // mailto: link — nothing is sent from the site itself, so the success
    // copy has to make the "now press send in your mail app" step clear.
    successHeading: "Your email app is opening",
    successMessage:
      "We've pre-filled a message to us with your details — press send in your email app and it's on its way. We reply within one business day.",
    successFallback:
      "Nothing opened? Your device may not have an email app set up. Copy your message below and send it to us from anywhere.",
    successFallbackLabel: "Open the email again",
    successRetry: "Write another message",
    // Subject line of the generated email. {name} is replaced at send time.
    mailSubject: "New enquiry from {name} — Oakshade AI website",
    // Each field carries its own label, placeholder and validation rules.
    // `required`, `minLength`, `maxLength` and `pattern` are enforced by
    // validateField() in contact-section.jsx; `errors` holds the message shown
    // for each failing rule (`pattern` → the `invalid` message).
    fields: {
      name: {
        label: "Full name",
        placeholder: "Jane Doe",
        required: true,
        minLength: 2,
        maxLength: 60,
        // Letters (any alphabet), accents, spaces, apostrophes, hyphens, dots.
        pattern: /^[\p{L}\p{M}][\p{L}\p{M}'’.\- ]*$/u,
        errors: {
          required: "Please enter your name.",
          minLength: "Your name needs at least 2 characters.",
          maxLength: "Your name can be at most 60 characters.",
          invalid: "Please use letters only — no numbers or symbols.",
        },
      },
      email: {
        label: "Email",
        placeholder: "jane@company.com",
        inputType: "email",
        required: true,
        maxLength: 254,
        pattern: /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/,
        errors: {
          required: "Please enter your email address.",
          maxLength: "That email address is too long.",
          invalid: "That doesn't look like a valid email address.",
        },
      },
      phone: {
        label: "Phone (optional)",
        placeholder: "+91 98765 43210",
        inputType: "tel",
        required: false,
        maxLength: 20,
        // Digits plus the usual separators; digit count is checked separately.
        pattern: /^[+]?[\d\s\-().]+$/,
        minDigits: 7,
        maxDigits: 15,
        errors: {
          maxLength: "That phone number is too long.",
          invalid: "Use digits, spaces, +, -, ( ) or . only.",
          digits: "Please enter a phone number with 7–15 digits.",
        },
      },
      message: {
        label: "Message",
        placeholder: "Tell us a little about what you're building…",
        required: true,
        minLength: 10,
        maxLength: 1000,
        errors: {
          required: "Please write us a message.",
          minLength: "Tell us a bit more — at least 10 characters.",
          maxLength: "Please keep your message under 1000 characters.",
        },
      },
    },
    // Shown above the form when the send itself fails.
    networkError:
      "Unable to send your message right now. Please check your connection and try again.",
    // Shown above the form when fields are invalid on submit.
    invalidSummary: "Please fix the highlighted fields and try again.",
  },

  mapSection: {
    image:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Map to Oakshade AI office",
    locationName: "Oakshade AI HQ",
    locationSubtext: brandConfig.address.city,
    directionsUrl: "https://maps.google.com/",
    directionsLabel: "Directions",
  },

  // Not rendered for now — the social accounts don't exist yet. Kept so the
  // card can be re-enabled in contact-section.jsx without rewriting the copy.
  socialsCard: {
    heading: "Follow along",
    subtext:
      "See what we're building and shipping. Follow us for updates, ideas, and behind-the-scenes.",
  },
};
