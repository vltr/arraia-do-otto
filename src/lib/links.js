// Outbound link builders: maps, waze, whatsapp share.
import { event } from "../data/event.js";

const QUERY = `${event.venue}, ${event.address}`;

export function googleMapsUrl() {
  const p = new URLSearchParams({ api: "1", query: QUERY });
  return `https://www.google.com/maps/search/?${p.toString()}`;
}

export function googleMapsEmbedUrl() {
  // Keyless embed (no API key needed for the basic place query).
  const p = new URLSearchParams({ q: QUERY, output: "embed" });
  return `https://maps.google.com/maps?${p.toString()}`;
}

export function wazeUrl() {
  const p = new URLSearchParams({ q: QUERY });
  return `https://waze.com/ul?${p.toString()}`;
}
