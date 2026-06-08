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
- **Anti-spam:** hidden honeypot field. (Turnstile is wired but **disabled** — see deploy notes.)
- **Cost target:** $0/month, all within Cloudflare free tier.

## Decisions made with the owner (override the spec docs)

- **Language: pt-BR ONLY.** Every guest-facing string is Brazilian Portuguese (caipirês). Never introduce English UI text, labels, or alt text. `<html lang="pt-BR">`.

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
  group_id    TEXT,                    -- shared per household submission; NULL = solo
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Visual / animation notes

- **Sky** ([src/components/Sky.jsx](src/components/Sky.jsx)) is the signature scroll piece: day→night gradient, parallax clouds, pulsing sun that sets, and a moon + stars at the bonfire end. It's driven by a **plain rAF-throttled scroll-progress state + direct inline styles**, NOT by motion's `useScroll`/`useTransform`. Reason: in this motion v12 + React 19 setup, a scroll-derived MotionValue bound to `opacity` did **not** flush to the DOM (transform flushed, opacity stayed frozen at its initial value), which froze the sun/moon/gradient. Don't reintroduce motion MotionValues for scroll-linked **opacity**. Idle motion (cloud drift, sun pulse, twinkle, moon bob) is pure CSS keyframes; everything respects `prefers-reduced-motion`.
- **Embers** ([src/components/Embers.jsx](src/components/Embers.jsx)) is the one WebGL touch (Three.js + R3F), lazy-loaded via IntersectionObserver (separate chunk; off the initial bundle). Anchored `absolute` INSIDE the footer so it scrolls with the page. Per-particle size + alpha via a custom ShaderMaterial; each ember fades fully before the top. Guarded by reduced-motion + `ErrorBoundary` (no-op without WebGL).
- **Visual self-check:** `node scripts/shots.mjs [url]` screenshots the running dev/preview at several scroll fractions using the system Chromium (`/usr/bin/chromium`) via Playwright. Use it to verify visual changes.

## Conventions

- Never put secrets (Turnstile secret key, admin token) in client code — use Wrangler/Pages env vars / `.dev.vars` (gitignored).
- Images optimized to WebP, descriptive `alt` text, lazy-loaded.
- Visual spine: scroll-linked background gradient noon→golden-hour→dusk/bonfire, CSS bunting (bandeirinhas) between sections.

## Commands

- `pnpm dev` — Vite dev server (frontend only).
- `pnpm build` — production build to `dist/`.
- `pnpm preview` — preview the built site.
- `pnpm pages:dev` — `wrangler pages dev` (serves `dist/` + Pages Functions + D1 locally; for testing `/api/rsvp`). Build first.
- `wrangler d1 execute rsvp-db --local --file ./schema.sql` — apply schema to the local D1.
- `wrangler d1 execute rsvp-db --local --command "SELECT * FROM rsvps"` — read local rows.
- Image assets go in `public/img/*.webp` (see [docs/IMAGES.md](docs/IMAGES.md)).
- `pnpm og` — regenerate the social-share card `public/og.jpg` (1200×630) from `scripts/make-og.mjs` (wood frame + balloon garland + "número 1" Otto from `assets-raw/og-otto.png`). Fonts auto-download to `assets-raw/fonts/` (gitignored). The OG/Twitter `<meta>` URLs in `index.html` are absolute — currently `https://ottok.com.br` (the custom domain). Update them if the domain changes.
- pnpm build-script approvals live in `pnpm-workspace.yaml` (`allowBuilds:` esbuild/workerd/sharp).

## RSVP backend (`functions/api/rsvp.js`)

`POST /api/rsvp` accepts JSON `{ name, attending (1|0), dietary, companions:[{name,dietary}],
fax (honeypot), turnstileToken }`. Order: reject bad JSON (400) → honeypot `fax` non-empty returns
`{ok:true}` with NO insert → validate primary name (400 if empty / >120) → keep companions only when
attending=1 (drop blanks, cap 8) → verify Turnstile **only if `TURNSTILE_SECRET_KEY` is set** (403 on
fail) → **one row per person** (primary + companions=attending 1), all sharing a `group_id`
(`crypto.randomUUID()`; NULL when solo), inserted via `DB.batch` → `{ok:true, count}`. The old
single-person payload still works (no companions → group_id NULL). Tested locally: group (count 3,
shared id) + solo-não-vem (count 1, companion dropped); honeypot/validation/405/400 all pass.
Migration `migrations/0001_add_group_id.sql` applied to local + remote.

### Deploy — LIVE ✅

Custom domain: **ottok.com.br** + **www.ottok.com.br** (external registrar, nameservers moved to
Cloudflare; added as Pages custom domains). OG/Twitter meta + `og:url` point to `https://ottok.com.br`.
Deployed 2026-05-31 to **[arraia-do-otto.pages.dev](https://arraia-do-otto.pages.dev)** (Pages project `arraia-do-otto`,
production branch `main`). D1 `rsvp-db` id `1fd48f81-a469-459e-862a-f3b5a3eb7368`, binding `DB`,
schema applied remote. Full prod round-trip verified (POST /api/rsvp → D1 write → delete).
**Turnstile DISABLED (2026-06-03) — honeypot only.** It was live 2026-06-02 but the managed widget
**blocked legitimate guests** on Safari, Samsung Internet, and other browsers (no token → backend 403),
so it was rolled back. To disable: prod Pages secret deleted
(`wrangler pages secret delete TURNSTILE_SECRET_KEY --project-name arraia-do-otto`) so the backend
gate `if (env.TURNSTILE_SECRET_KEY)` is skipped, and rebuilt with `VITE_TURNSTILE_SITE_KEY` commented
out in `.env` so the widget never renders. Verified: tokenless POST /api/rsvp → 200. The code path is
intact — to re-enable, restore both keys (set the secret + uncomment the site key, rebuild, deploy).
**Both gates must move together**: a secret with no widget would 403 every submission.
Update loop: `pnpm build && pnpm exec wrangler pages deploy dist --project-name arraia-do-otto`.

Full copy-pasteable guide: **[docs/DEPLOY.md](docs/DEPLOY.md)**. Summary: `wrangler login` →
`d1 create rsvp-db` (paste id into `wrangler.jsonc`) → `d1 execute --remote --file schema.sql` →
optional Turnstile (site key in `.env` before build, secret via `pages secret put`) →
`pnpm build` → `wrangler pages deploy dist --project-name arraia-do-otto`. Ships on
`arraia-do-otto.pages.dev`; custom domain later. **Owner runs the deploy** (their CF account).

## Layout

- `index.html`, `src/` — Vite + React frontend. `src/index.css` holds the Tailwind v4 `@theme` design tokens (festa palette, sky stops, fonts Rye + Nunito).
- `functions/` — Cloudflare Pages Functions (`/api/rsvp`), added in the backend phase.
- `public/img/` — generated Otto WebP assets.
- `docs/` — specs and image prompts.
