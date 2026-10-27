/**
 * Oakshade AI - Google Calendar & Google Meet Auto-Scheduler
 * ─────────────────────────────────────────────────────────────────────────────
 * This Google Apps Script automatically:
 * 1. Creates the meeting event on YOUR Google Calendar (oakshade.business@gmail.com)
 * 2. Adds the client as an attendee (Google emails them the calendar invite)
 * 3. Generates a real Google Meet video conference link
 * 4. Puts all client details and project notes right inside the calendar event
 * ─────────────────────────────────────────────────────────────────────────────
 * SETUP INSTRUCTIONS (Takes 2 minutes):
 * 1. Go to https://script.google.com/ while signed into oakshade.business@gmail.com
 * 2. Click "New Project" (name it "Oakshade AI Calendar Webhook")
 * 3. Replace all code in Code.gs with this entire file.
 * 4. (Optional but recommended for Meet): On the left sidebar, click "Services" (+),
 *    select "Google Calendar API", and click "Add".
 * 5. Click "Deploy" (top right) -> "New deployment".
 * 6. Click the gear icon next to "Select type" -> choose "Web app".
 * 7. Set:
 *    - Description: "Oakshade Calendar Webhook"
 *    - Execute as: "Me (oakshade.business@gmail.com)"
 *    - Who has access: "Anyone"  <-- IMPORTANT!
 * 8. Click "Deploy", authorize permissions with your Google account.
 * 9. Copy the generated "Web App URL" (ends in /exec).
 * 10. Paste it into your Oakshade .env file:
 *     VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var startTime = new Date(data.startTime);
    var endTime = new Date(data.endTime);

    var title = "Oakshade AI Strategy Session: " + (data.name || "Client");
    var description = "🚀 Discovery & Strategy Session\n\n" +
      "Client Name: " + data.name + "\n" +
      "Client Email: " + data.email + "\n" +
      "Client Phone: " + (data.phone || "Not provided") + "\n" +
      "Client Timezone: " + (data.timezone || "Asia/Kolkata") + "\n\n" +
      "Project Notes / Agenda:\n" + (data.notes || "No notes provided.") + "\n\n" +
      "— Booked via Oakshade AI Website Scheduler";

    // Attempt with Advanced Calendar API (Creates Google Meet link directly)
    if (typeof Calendar !== 'undefined' && Calendar.Events) {
      var resource = {
        summary: title,
        description: description,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
        attendees: [
          { email: data.email, displayName: data.name }
        ],
        conferenceData: {
          createRequest: {
            requestId: "oakshade-" + Date.now(),
            conferenceSolutionKey: { type: "hangoutsMeet" }
          }
        }
      };

      var event = Calendar.Events.insert(resource, 'primary', {
        conferenceDataVersion: 1,
        sendUpdates: 'all'
      });

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        eventId: event.id,
        meetLink: event.hangoutLink || ""
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Standard Fallback using CalendarApp
    var cal = CalendarApp.getDefaultCalendar();
    var fallbackEvent = cal.createEvent(title, startTime, endTime, {
      description: description,
      guests: data.email,
      sendInvites: true
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      eventId: fallbackEvent.getId()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
