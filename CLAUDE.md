# Arraiá do Otto

One-page RSVP website for **Otto's 1st birthday** — a *festa junina* (Brazilian June festival) themed invitation with a confirmation form. Mobile-first; most guests open it on a phone. ~50–60 guests, short-lived (lives a few weeks around the event).

Authoritative specs live in [docs/](docs/): [docs/SPEC.md](docs/SPEC.md) (full build brief, in PT-BR) and [docs/RSVP-HANDOFF.md](docs/RSVP-HANDOFF.md) (architecture decisions). When they conflict, the decisions in this file win — they reflect choices made with the owner.

## Event facts (do not invent or change)

| Field | Value |
| --- | --- |
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
- **Copy:** base copy comes from SPEC §5 (caipirês). Run the `humanizer` skill over the **user-facing text guests actually read** before finalizing it — that's the only place humanization is applied (owner's call).
- **Images:** generated externally on **Picsart** from prompts in [docs/IMAGES.md](docs/IMAGES.md) (raw source: [docs/IMAGE-PROMPTS.md](docs/IMAGE-PROMPTS.md)). Otto's real photo is the reference for every scene. Site stitches scenes together with CSS.
- **Build order:** repo init → image prompts → website → Cloudflare backend → deploy.
- **No CI/CD yet** — revisit automation only after the site works end-to-end.
- **Package manager: pnpm** (not npm).
- **Input/spec docs live in [docs/](docs/)**; root stays lean (CLAUDE.md + project files).

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

- `pnpm dev` — Vite dev server (frontend only).
- `pnpm build` — production build to `dist/`.
- `pnpm preview` — preview the built site.
- `pnpm pages:dev` — `wrangler pages dev` (serves `dist/` + Pages Functions + D1 locally; for testing `/api/rsvp`).
- Image assets go in `public/img/*.webp` (see [docs/IMAGES.md](docs/IMAGES.md)).

## Layout

- `index.html`, `src/` — Vite + React frontend. `src/index.css` holds the Tailwind v4 `@theme` design tokens (festa palette, sky stops, fonts Rye + Nunito).
- `functions/` — Cloudflare Pages Functions (`/api/rsvp`), added in the backend phase.
- `public/img/` — generated Otto WebP assets.
- `docs/` — specs and image prompts.
