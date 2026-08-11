// src/utils/brandConfig.js
// ─────────────────────────────────────────────────────────────────────────
// Global brand + company details. Referenced across the site (contact,
// footer, socials). Update once here and it propagates everywhere.
// ─────────────────────────────────────────────────────────────────────────

export const brandConfig = {
  name: "Oakshade AI",
  tagline: "Transforming ideas into digital reality",
  email: "oakshade.business@gmail.com",
  // NOT RENDERED ANYWHERE RIGHT NOW: phone, whatsapp, address, hours and
  // socialMedia are placeholders kept for when those channels go live. The
  // footer + contact section currently publish the email address only.
  phone: "+1 (555) 012-3456",
  whatsapp: "+15550123456",
  address: {
    line1: "123 Innovation Drive",
    line2: "Suite 400",
    city: "San Francisco, CA 94105",
  },
  hours: {
    weekdays: "Mon – Fri: 9:00 – 18:00",
    weekend: "Sat – Sun: By appointment",
  },
  socialMedia: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    linkedin: "https://linkedin.com/",
  },
};
