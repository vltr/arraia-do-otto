# Arraiá do Otto

One-page RSVP website for **Otto's 1st birthday** — a *festa junina* (Brazilian June festival) themed invitation with a confirmation form. Mobile-first; most guests open it on a phone. ~50–60 guests, short-lived (lives a few weeks around the event).

Authoritative specs: [SPEC.md](SPEC.md) (full build brief, in PT-BR) and [RSVP-HANDOFF.md](RSVP-HANDOFF.md) (architecture decisions). When they conflict, the decisions in this file win — they reflect choices made with the owner.

## Event facts (do not invent or change)

| Field | Value |
|---|---|
| Birthday boy | Otto (turning 1) |
| Date | Saturday, **2026-06-27** |
| Time | **12:00–18:00** |
| Venue | **Arena Bombinhas** (salão) |
| Address | **Rua Araçá, 551, Sertãozinho** |
| Theme | Festa junina |
| Timezone (countdown/calendar) | America/Sao_Paulo |

## Stack & hosting

- **Frontend:** Vite + React + Tailwind CSS, mobile-first.
- **Hosting:** Cloudflare Pages (Vite build output).
- **RSVP backend:** Cloudflare Pages Function — `POST /api/rsvp`.
- **Database:** Cloudflare D1 (SQLite), table `rsvps`.
- **Anti-spam:** Cloudflare Turnstile (server-verified) + hidden honeypot field.
- **Cost target:** $0/month, all within Cloudflare free tier.

## Decisions made with the owner (override the spec docs)

- **RSVP fields are MINIMAL** (per RSVP-HANDOFF, not SPEC §8): `name`, `attending` (yes/no), `dietary` (optional). Plus a hidden honeypot + Turnstile. Do not add adultos/crianças/status-talvez/recado unless the owner asks.
- **Copy:** use/refine the caipirês copy already in SPEC §5 directly. The `humanizer` skill is available but humanization is skipped for now (owner's call) — can be run later on request.
- **Images:** generated externally on **Picsart** from prompts in [IMAGES.md](IMAGES.md) (derived from SPEC §7). Otto's real photo is the reference for every scene. Site stitches scenes together with CSS.
- **Build order:** repo init → image prompts → website → Cloudflare backend → deploy.

## D1 schema

```sql
CREATE TABLE IF NOT EXISTS rsvps (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  attending   INTEGER NOT NULL,        -- 1 = yes, 0 = no
  dietary     TEXT,                    -- optional, nullable
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Conventions

- Never put secrets (Turnstile secret key, admin token) in client code — use Wrangler/Pages env vars / `.dev.vars` (gitignored).
- Images optimized to WebP, descriptive `alt` text, lazy-loaded.
- Visual spine: scroll-linked background gradient noon→golden-hour→dusk/bonfire, CSS bunting (bandeirinhas) between sections.

## Commands

(Filled in once the project is scaffolded — `npm run dev`, `npm run build`, `wrangler pages dev`, `wrangler d1 ...`.)
