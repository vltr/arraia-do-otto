// Add-to-calendar helpers: Google Calendar URL + downloadable .ics file.
import { event } from "../data/event.js";

// ICS/Google want UTC basic format: YYYYMMDDTHHMMSSZ
function toICSDate(iso) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

const SUMMARY = `${event.title} — 1 aninho do Otto`;
const LOCATION = `${event.venue}, ${event.address}`;
const DETAILS = `${event.welcome} ${event.recados.espera}`;

export function googleCalendarUrl() {
  const dates = `${toICSDate(event.start)}/${toICSDate(event.end)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: SUMMARY,
    dates,
    location: LOCATION,
    details: DETAILS,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function icsContent() {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Arraia do Otto//PT-BR//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:arraia-do-otto-2026@arraia-do-otto`,
    `DTSTAMP:${toICSDate(event.start)}`,
    `DTSTART:${toICSDate(event.start)}`,
    `DTEND:${toICSDate(event.end)}`,
    `SUMMARY:${SUMMARY}`,
    `LOCATION:${LOCATION}`,
    `DESCRIPTION:${DETAILS}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs() {
  const blob = new Blob([icsContent()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "arraia-do-otto.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
