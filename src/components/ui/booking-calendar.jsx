// src/components/ui/booking-calendar.jsx
// ─────────────────────────────────────────────────────────────────────────
// Custom Cal.com-style dark booking calendar component for Oakshade AI.
// Replicates the 3-column dark layout: Info | Month Picker | Time Slots,
// with 12h/24h toggle, timezone support, details intake, and calendar export.
// ─────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Globe,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowLeft,
  ExternalLink,
  Download,
  Sparkles,
} from "lucide-react";
import { bookingData } from "../../utils/bookingData";
import { brandConfig } from "../../utils/brandConfig";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_SHORT = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

// Helper to format hour to 12h or 24h
function formatTimeSlot(timeStr, format24h) {
  if (format24h) return timeStr;
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12;
  h = h ? h : 12; // hour 0 is 12 am
  return `${h}:${mStr}${ampm}`;
}

// Helper to get ordinal suffix (1st, 2nd, 3rd, 27th, etc.)
function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Generate Google Calendar Link
function getGoogleCalendarUrl({ title, description, startDate, endDate, location }) {
  const formatGCalDate = (date) =>
    date.toISOString().replace(/-|:|\.\d\d\d/g, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description,
    location: location,
    dates: `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Generate .ics File content and trigger download
function downloadIcsFile({ title, description, startDate, endDate, location, organizerEmail }) {
  const formatIcsDate = (date) =>
    date.toISOString().replace(/-|:|\.\d\d\d/g, "");

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Oakshade AI//Booking Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    `LOCATION:${location}`,
    `ORGANIZER;CN=Oakshade AI:mailto:${organizerEmail}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `STATUS:CONFIRMED`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsLines], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `oakshade-meeting-${startDate.toISOString().slice(0, 10)}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export default function BookingCalendar({ className = "" }) {
  const calLink = bookingData.calLink;

  // If Cal.com link is configured, render official Cal.com dark embed connected to Google Calendar
  if (calLink) {
    return (
      <div
        className={`relative w-full max-w-5xl mx-auto rounded-3xl bg-[#0c0c0e] border border-neutral-800/90 text-neutral-100 shadow-2xl overflow-hidden font-sans p-1 sm:p-2 ${className}`}
        data-lenis-prevent
      >
        <div className="w-full min-h-[700px] h-[720px] rounded-2xl overflow-hidden">
          <iframe
            src={`https://cal.com/${calLink}?embed=true&theme=dark`}
            title="Oakshade AI Strategy Session Booking"
            className="w-full h-full border-0 rounded-2xl bg-[#0c0c0e]"
            allow="camera; microphone; autoplay; fullscreen"
          />
        </div>
      </div>
    );
  }

  // Fallback to custom built component if calLink is ever cleared
  // Current real date
  const today = useMemo(() => new Date(), []);

  // Calendar navigation state (Year and Month)
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  // Selected Date (defaults to today)
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date(today);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Selected time slot
  const [selectedSlot, setSelectedSlot] = useState("20:00");
  const [use24hFormat, setUse24hFormat] = useState(true);
  const [timezone, setTimezone] = useState(bookingData.defaultTimezone);

  // Workflow steps: "calendar" | "details" | "confirmed"
  const [step, setStep] = useState("calendar");

  // Booking Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Computed days for calendar grid
  const calendarGrid = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon ...
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const cells = [];

    // Previous month filler days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(currentYear, currentMonth - 1, dayNum);
      cells.push({
        date: prevDate,
        dayNum,
        isCurrentMonth: false,
        isPast: prevDate < new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        isNextMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const cellDate = new Date(currentYear, currentMonth, d);
      const isPast = cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      cells.push({
        date: cellDate,
        dayNum: d,
        isCurrentMonth: true,
        isPast,
        isNextMonth: false,
      });
    }

    // Next month overflow days (to fill 35 or 42 grid slots)
    const totalSlots = cells.length <= 35 ? 35 : 42;
    const remaining = totalSlots - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(currentYear, currentMonth + 1, d);
      cells.push({
        date: nextDate,
        dayNum: d,
        isCurrentMonth: false,
        isPast: false,
        isNextMonth: true,
      });
    }

    return cells;
  }, [currentYear, currentMonth, today]);

  // Navigate months
  const handlePrevMonth = () => {
    // Prevent going into past months beyond current year/month
    const isMinMonth =
      currentYear === today.getFullYear() && currentMonth <= today.getMonth();
    if (isMinMonth) return;

    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Check if date is selected
  const isDateSelected = (d) => {
    if (!selectedDate) return false;
    return (
      d.getFullYear() === selectedDate.getFullYear() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getDate() === selectedDate.getDate()
    );
  };

  // Check if date is today
  const isDateToday = (d) => {
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  // Selected date weekday name and formatted day
  const selectedDayInfo = useMemo(() => {
    if (!selectedDate) return { dayName: "", dayNum: "" };
    const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "short" });
    const dayNum = getOrdinal(selectedDate.getDate());
    const monthName = selectedDate.toLocaleDateString("en-US", { month: "short" });
    const fullDate = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return { dayName, dayNum, monthName, fullDate };
  }, [selectedDate]);

  // Build Start and End dates for calendar links
  const { meetingStart, meetingEnd } = useMemo(() => {
    if (!selectedDate || !selectedSlot) return { meetingStart: today, meetingEnd: today };
    const [h, m] = selectedSlot.split(":").map(Number);
    const start = new Date(selectedDate);
    start.setHours(h, m, 0, 0);

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + (bookingData.durationMinutes || 30));
    return { meetingStart: start, meetingEnd: end };
  }, [selectedDate, selectedSlot, today]);

  // Form submission
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = "Please enter your name.";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setIsSubmitting(true);

    // Prepare mailto link for direct recipient
    const subject = `Confirmed Strategy Session: ${formData.name.trim()} & Oakshade AI (${selectedDayInfo.fullDate} at ${formatTimeSlot(selectedSlot, use24hFormat)})`;
    const body = [
      `Hi Oakshade AI Team,`,
      ``,
      `A new discovery meeting has been booked:`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Client Name: ${formData.name.trim()}`,
      `Client Email: ${formData.email.trim()}`,
      formData.phone.trim() ? `Phone: ${formData.phone.trim()}` : null,
      `Date: ${selectedDayInfo.fullDate}`,
      `Time: ${formatTimeSlot(selectedSlot, use24hFormat)} (${timezone})`,
      `Duration: 30 minutes`,
      `Platform: Google Meet`,
      ``,
      `Project Notes / Agenda:`,
      formData.notes.trim() || "No additional notes provided.",
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Sent via Oakshade AI Calendar Scheduler`,
    ]
      .filter((line) => line !== null)
      .join("\r\n");

    // Direct link for the host to add the event to their own Google Calendar in 1-click
    const hostGCalLink = getGoogleCalendarUrl({
      title: `Oakshade AI Strategy Session: ${formData.name.trim()}`,
      description: `Client: ${formData.name.trim()} (${formData.email.trim()})\nPhone: ${formData.phone.trim() || "N/A"}\n\nNotes / Agenda:\n${formData.notes.trim() || "None"}\n\nLocation: Google Meet`,
      startDate: meetingStart,
      endDate: meetingEnd,
      location: "Google Meet",
    });

    try {
      // 1. Auto-create Google Calendar event + Google Meet via Google Apps Script Webhook (Option 2)
      if (bookingData.googleScriptUrl) {
        try {
          await fetch(bookingData.googleScriptUrl, {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "text/plain",
            },
            body: JSON.stringify({
              name: formData.name.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim() || "Not provided",
              notes: formData.notes.trim() || "No additional notes provided.",
              startTime: meetingStart.toISOString(),
              endTime: meetingEnd.toISOString(),
              timezone: timezone,
              formattedDate: selectedDayInfo.fullDate,
              formattedTime: formatTimeSlot(selectedSlot, use24hFormat),
            }),
          });
        } catch (scriptErr) {
          console.warn("Google Apps Script sync notice:", scriptErr);
        }
      }

      // 2. Direct background email delivery to oakshade.business@gmail.com
      if (bookingData.web3formsKey) {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: bookingData.web3formsKey,
            subject: `New Strategy Session: ${formData.name.trim()} (${selectedDayInfo.fullDate} at ${formatTimeSlot(selectedSlot, use24hFormat)})`,
            from_name: "Oakshade AI Calendar",
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || "Not provided",
            meeting_date: selectedDayInfo.fullDate,
            meeting_time: `${formatTimeSlot(selectedSlot, use24hFormat)} (${timezone})`,
            duration: `${bookingData.durationMinutes || 30} minutes`,
            platform: bookingData.location,
            notes: formData.notes.trim() || "No additional notes provided.",
            add_to_calendar_link: hostGCalLink,
          }),
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to send booking notification");
        }
      } else if (!bookingData.googleScriptUrl) {
        // Fallback: mailto link for direct recipient
        const mailtoBody = body + `\n\nOne-click add to Google Calendar:\n${hostGCalLink}`;
        const mailtoUrl = `mailto:${bookingData.recipientEmail}?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(mailtoBody)}`;

        const link = document.createElement("a");
        link.href = mailtoUrl;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setStep("confirmed");
    } catch (err) {
      console.warn("Delivery error, using fallback confirmation:", err);
      // Still show confirmed screen so client has calendar links and experience is smooth
      setStep("confirmed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`relative w-full max-w-6xl mx-auto rounded-3xl bg-[#0c0c0e] border border-neutral-800/90 text-neutral-100 shadow-2xl overflow-hidden font-sans ${className}`}
      data-lenis-prevent
    >
      <AnimatePresence mode="wait">
        {/* ── STEP 1: CALENDAR & TIME SLOTS ──────────────────────────── */}
        {step === "calendar" && (
          <motion.div
            key="calendar-step"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-12 min-h-[580px]"
          >
            {/* ── PANEL 1: Left Info Column ────────────────────────── */}
            <div className="md:col-span-4 lg:col-span-4 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-neutral-800/80 flex flex-col justify-between bg-neutral-950/60">
              <div>
                {/* Brand / Logo */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-neutral-900 border border-neutral-700/80 flex items-center justify-center p-1.5 shadow-inner">
                    <img
                      src="/media/oakshade-mark.png"
                      alt={bookingData.brandName}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      {bookingData.brandName}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Discovery & Planning
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4 leading-snug">
                  {bookingData.sessionTitle}
                </h2>

                {/* Session description points */}
                <div className="text-sm text-neutral-300 space-y-2 mb-8 bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800/60">
                  <p className="font-semibold text-neutral-200">
                    {bookingData.descriptionList.heading}
                  </p>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-400">
                    {bookingData.descriptionList.items.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Meta items: Duration, Google Meet, Timezone */}
              <div className="space-y-3 pt-4 border-t border-neutral-800/60 text-xs sm:text-sm text-neutral-400">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-neutral-400 shrink-0" />
                  <span>{bookingData.durationLabel}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Video size={16} className="text-emerald-400 shrink-0" />
                  <span>{bookingData.location}</span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <Globe size={16} className="text-neutral-400 shrink-0" />
                  <div className="relative inline-block w-full">
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="bg-transparent text-xs text-neutral-300 border border-neutral-800 rounded-lg px-2.5 py-1.5 pr-6 cursor-pointer focus:outline-none focus:border-neutral-500 transition-colors hover:border-neutral-700 w-full appearance-none"
                    >
                      {bookingData.timezones.map((tz) => (
                        <option key={tz.value} value={tz.value} className="bg-neutral-900 text-white">
                          {tz.label}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500">
                      ▼
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── PANEL 2: Middle Month Calendar Grid ─────────────── */}
            <div className="md:col-span-5 lg:col-span-5 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-neutral-800/80 bg-[#0c0c0e]">
              {/* Header: Month Year + navigation */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    disabled={
                      currentYear === today.getFullYear() &&
                      currentMonth <= today.getMonth()
                    }
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800/60 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {WEEKDAYS.map((day) => (
                  <span
                    key={day}
                    className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider py-1"
                  >
                    {day}
                  </span>
                ))}
              </div>

              {/* Day cells grid */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {calendarGrid.map((cell, idx) => {
                  const selected = isDateSelected(cell.date);
                  const isCurrentDay = isDateToday(cell.date);
                  const disabled = cell.isPast;

                  // Label for 1st of month (e.g. "NOV 1")
                  const isFirstOfNextMonth = cell.isNextMonth && cell.dayNum === 1;

                  return (
                    <div key={idx} className="relative aspect-square flex items-center justify-center">
                      {disabled ? (
                        <span className="text-xs text-neutral-600/70 select-none">
                          {cell.dayNum}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedDate(cell.date)}
                          className={`group relative flex flex-col items-center justify-center h-full w-full rounded-xl transition-all duration-150 cursor-pointer ${
                            selected
                              ? "bg-white text-neutral-950 font-bold shadow-lg shadow-white/10 scale-100"
                              : "bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-800/60 hover:border-neutral-700"
                          }`}
                        >
                          {/* Next month prefix if 1st day */}
                          {isFirstOfNextMonth && (
                            <span
                              className={`text-[9px] uppercase tracking-tighter leading-none mb-0.5 ${
                                selected ? "text-neutral-800" : "text-neutral-400"
                              }`}
                            >
                              {MONTH_SHORT[cell.date.getMonth()]}
                            </span>
                          )}
                          <span
                            className={`text-xs sm:text-sm ${
                              selected ? "font-bold text-neutral-950" : "font-medium"
                            }`}
                          >
                            {cell.dayNum}
                          </span>

                          {/* Selected dot indicator or today ring */}
                          {selected ? (
                            <span className="w-1 h-1 rounded-full bg-neutral-950 mt-0.5" />
                          ) : isCurrentDay ? (
                            <span className="w-1 h-1 rounded-full bg-neutral-500 mt-0.5" />
                          ) : null}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── PANEL 3: Right Time Slot Column ─────────────────── */}
            <div className="md:col-span-3 lg:col-span-3 p-6 sm:p-8 flex flex-col bg-neutral-950/40">
              {/* Header: Selected day + 12h/24h toggle */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-semibold text-white">
                  {selectedDayInfo.dayName}{" "}
                  <span className="text-neutral-400">{selectedDayInfo.dayNum}</span>
                </span>

                {/* 12h | 24h Toggle */}
                <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setUse24hFormat(false)}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      !use24hFormat
                        ? "bg-neutral-800 text-white font-medium"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    12h
                  </button>
                  <button
                    type="button"
                    onClick={() => setUse24hFormat(true)}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      use24hFormat
                        ? "bg-neutral-800 text-white font-medium"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    24h
                  </button>
                </div>
              </div>

              {/* Time Slots List */}
              <div
                className="space-y-2 max-h-[400px] overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-neutral-800"
                data-lenis-prevent
              >
                {bookingData.standardSlots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  const formatted = formatTimeSlot(slot, use24hFormat);

                  return (
                    <div key={slot} className="relative">
                      <button
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all text-center border cursor-pointer ${
                          isSelected
                            ? "bg-white text-neutral-950 border-white font-bold shadow-md shadow-white/10"
                            : "bg-neutral-900/60 hover:bg-neutral-900 text-neutral-200 border-neutral-800/80 hover:border-neutral-600"
                        }`}
                      >
                        {formatted}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* "Next" button once a slot is active */}
              <div className="mt-6 pt-4 border-t border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="w-full flex items-center justify-center gap-2 bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl hover:bg-neutral-200 transition-all shadow-lg shadow-white/10 cursor-pointer active:scale-[0.99]"
                >
                  <span>Select & Continue</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: ENTER DETAILS FORM ───────────────────────────── */}
        {step === "details" && (
          <motion.div
            key="details-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="p-6 sm:p-10 max-w-2xl mx-auto"
          >
            {/* Back button */}
            <button
              type="button"
              onClick={() => setStep("calendar")}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{bookingData.form.backButton}</span>
            </button>

            {/* Selected Booking Recap Badge */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="block text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-1">
                  Selected Session
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {bookingData.sessionTitle}
                </h4>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-neutral-300">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarIcon size={14} className="text-neutral-400" />
                    {selectedDayInfo.fullDate}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} className="text-neutral-400" />
                    {formatTimeSlot(selectedSlot, use24hFormat)} ({timezone})
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400">
                    <Video size={14} />
                    Google Meet
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep("calendar")}
                className="text-xs text-neutral-400 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Change time
              </button>
            </div>

            {/* Details Form */}
            <form onSubmit={handleSubmitBooking} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">
                    {bookingData.form.nameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: "" });
                    }}
                    placeholder={bookingData.form.namePlaceholder}
                    className={`w-full px-4 py-3 bg-neutral-900 border rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 transition-all ${
                      formErrors.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-neutral-700/80 focus:border-white focus:ring-white"
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">
                    {bookingData.form.emailLabel} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: "" });
                    }}
                    placeholder={bookingData.form.emailPlaceholder}
                    className={`w-full px-4 py-3 bg-neutral-900 border rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 transition-all ${
                      formErrors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-neutral-700/80 focus:border-white focus:ring-white"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">
                  {bookingData.form.phoneLabel}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={bookingData.form.phonePlaceholder}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700/80 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">
                  {bookingData.form.notesLabel}
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={bookingData.form.notesPlaceholder}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700/80 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all resize-none"
                />
              </div>

              {/* Privacy notice */}
              <p className="text-xs text-neutral-500">
                A calendar invitation with Google Meet access details will be sent directly to your email address and to {bookingData.recipientEmail}.
              </p>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep("calendar")}
                  className="px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-white text-neutral-950 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-lg shadow-white/10 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    bookingData.form.submittingButton
                  ) : (
                    <>
                      <span>{bookingData.form.submitButton}</span>
                      <Check size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ── STEP 3: BOOKING CONFIRMATION ──────────────────────────── */}
        {step === "confirmed" && (
          <motion.div
            key="confirmed-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="p-8 sm:p-12 max-w-xl mx-auto text-center"
          >
            {/* Animated Checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="h-16 w-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10"
            >
              <Check size={32} strokeWidth={2.5} />
            </motion.div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {bookingData.confirmation.title}
            </h3>

            <p className="text-neutral-400 text-sm leading-relaxed mb-8">
              {bookingData.confirmation.subtitle}{" "}
              <span className="text-white font-medium">{bookingData.recipientEmail}</span>.
            </p>

            {/* Event Summary Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-left space-y-3 mb-8">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">
                    {bookingData.sessionTitle}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Host: Oakshade AI Team
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                  <Video size={12} />
                  Google Meet
                </span>
              </div>

              <div className="pt-3 border-t border-neutral-800 space-y-2 text-xs sm:text-sm text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <CalendarIcon size={14} className="text-neutral-400 shrink-0" />
                  <span>{selectedDayInfo.fullDate}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={14} className="text-neutral-400 shrink-0" />
                  <span>
                    {formatTimeSlot(selectedSlot, use24hFormat)} -{" "}
                    {formatTimeSlot(
                      (() => {
                        const [h, m] = selectedSlot.split(":").map(Number);
                        const endM = m + 30;
                        const finalH = endM >= 60 ? (h + 1) % 24 : h;
                        const finalM = endM >= 60 ? endM - 60 : endM;
                        return `${String(finalH).padStart(2, "0")}:${String(finalM).padStart(2, "0")}`;
                      })(),
                      use24hFormat
                    )}{" "}
                    ({timezone})
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Calendar Export Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              {/* Google Calendar Link */}
              <a
                href={getGoogleCalendarUrl({
                  title: `${bookingData.sessionTitle} (Oakshade AI & ${formData.name || "Client"})`,
                  description: `Discovery session between Oakshade AI and ${formData.name} (${formData.email}).\nAgenda: ${formData.notes || "Strategy discussion"}\nGoogle Meet link provided by Oakshade AI.`,
                  startDate: meetingStart,
                  endDate: meetingEnd,
                  location: "Google Meet",
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-700/80 hover:border-white text-white px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>{bookingData.confirmation.googleCalendarBtn}</span>
                <ExternalLink size={14} />
              </a>

              {/* Download .ics */}
              <button
                type="button"
                onClick={() =>
                  downloadIcsFile({
                    title: `${bookingData.sessionTitle} (Oakshade AI & ${formData.name || "Client"})`,
                    description: `Discovery session between Oakshade AI and ${formData.name} (${formData.email}).\nAgenda: ${formData.notes || "Strategy discussion"}`,
                    startDate: meetingStart,
                    endDate: meetingEnd,
                    location: "Google Meet",
                    organizerEmail: bookingData.recipientEmail,
                  })
                }
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-700/80 hover:border-white text-white px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>{bookingData.confirmation.downloadIcsBtn}</span>
                <Download size={14} />
              </button>
            </div>

            {/* Book Another */}
            <button
              type="button"
              onClick={() => {
                setStep("calendar");
                setFormData({ name: "", email: "", phone: "", notes: "" });
              }}
              className="text-xs text-neutral-400 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              {bookingData.confirmation.bookAnotherBtn}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
