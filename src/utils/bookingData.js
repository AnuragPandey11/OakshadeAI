// src/utils/bookingData.js
// ─────────────────────────────────────────────────────────────────────────
// Configuration and copy for the custom Cal.com-style booking calendar.
// Follows the project convention: content lives in src/utils/*.js
// ─────────────────────────────────────────────────────────────────────────

export const bookingData = {
  recipientEmail: "oakshade.business@gmail.com",
  // Cal.com official event link
  calLink: "oakshade-lagcg4/30min",
  // Google Apps Script Webhook URL for auto-creating Google Calendar + Google Meet events
  googleScriptUrl: import.meta.env.VITE_GOOGLE_SCRIPT_URL || "",
  // Web3Forms access key for direct inbox delivery (free from https://web3forms.com)
  web3formsKey: import.meta.env.VITE_WEB3FORMS_KEY || "",
  brandName: "Oakshade AI",
  sessionTitle: "Let's discuss your project.",
  sessionType: "Discovery & Strategy Session",
  durationMinutes: 30,
  durationLabel: "30m",
  location: "Google Meet",
  
  descriptionList: {
    heading: "🚀 Discovery & Strategy Session:",
    items: [
      "1. Your project idea and target users",
      "2. Technical architecture and platform choice",
      "3. Timeline and budget discussion",
      "4. Next steps & execution plan",
    ],
  },

  defaultTimezone: "Asia/Kolkata",
  timezones: [
    { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
    { value: "America/New_York", label: "America/New_York (EST/EDT)" },
    { value: "America/Los_Angeles", label: "America/Los_Angeles (PST/PDT)" },
    { value: "America/Chicago", label: "America/Chicago (CST/CDT)" },
    { value: "Europe/London", label: "Europe/London (GMT/BST)" },
    { value: "Europe/Berlin", label: "Europe/Berlin (CET/CEST)" },
    { value: "Asia/Dubai", label: "Asia/Dubai (GST)" },
    { value: "Asia/Singapore", label: "Asia/Singapore (SGT)" },
    { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
    { value: "Australia/Sydney", label: "Australia/Sydney (AEST)" },
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  ],

  // Default weekday available time slots (24h format HH:mm)
  // These represent the provider's standard working hours
  standardSlots: [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ],

  form: {
    title: "Enter your details",
    subtitle: "Please provide your info so we can send the meeting invitation.",
    nameLabel: "Your Name",
    namePlaceholder: "Jane Doe",
    emailLabel: "Email Address",
    emailPlaceholder: "jane@company.com",
    phoneLabel: "Phone Number (Optional)",
    phonePlaceholder: "+1 (555) 012-3456",
    notesLabel: "What would you like to discuss?",
    notesPlaceholder: "Briefly share your project goals, current challenges, or any questions...",
    submitButton: "Confirm Booking",
    submittingButton: "Scheduling...",
    backButton: "Back to calendar",
  },

  confirmation: {
    title: "You are scheduled!",
    subtitle: "A calendar invitation and Google Meet link will be sent to your email from",
    googleCalendarBtn: "Add to Google Calendar",
    downloadIcsBtn: "Download iCal (.ics)",
    bookAnotherBtn: "Schedule another meeting",
  },
};
