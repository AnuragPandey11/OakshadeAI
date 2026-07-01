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

  infoCards: [
    {
      iconName: "Phone",
      title: "Call us",
      lines: [brandConfig.phone, "Mon – Fri, 9am – 6pm"],
      href: `tel:${brandConfig.phone.replace(/[^\d+]/g, "")}`,
    },
    {
      iconName: "Mail",
      title: "Email us",
      lines: [brandConfig.email, "We reply within 24 hours"],
      href: `mailto:${brandConfig.email}`,
    },
    {
      iconName: "FaWhatsapp",
      title: "WhatsApp",
      lines: ["Chat with our team", "Fast, direct answers"],
      href: `https://wa.me/${brandConfig.whatsapp.replace(/[^\d]/g, "")}`,
    },
  ],

  form: {
    eyebrow: "Send a message",
    heading: "Tell us about your project",
    submitLabel: "Send message",
    successHeading: "Message sent!",
    successMessage:
      "Thanks for reaching out — we'll be in touch within one business day.",
    successRetry: "Send another message",
    fields: {
      name: { label: "Full name", placeholder: "Jane Doe" },
      email: { label: "Email", placeholder: "jane@company.com" },
      phone: { label: "Phone (optional)", placeholder: "+1 (555) 000-0000" },
      message: {
        label: "Message",
        placeholder: "Tell us a little about what you're building…",
      },
    },
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

  socialsCard: {
    heading: "Follow along",
    subtext:
      "See what we're building and shipping. Follow us for updates, ideas, and behind-the-scenes.",
  },
};
