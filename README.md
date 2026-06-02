# Arraiá do Otto 🎪🌽🔥

A one-page **festa-junina** (Brazilian June festival) themed RSVP website for **Otto's 1st
birthday**. Mobile-first, all copy in Brazilian Portuguese (*caipirês*), short-lived (it lives for a
few weeks around the event).

🌐 **Live:** [ottok.com.br](https://ottok.com.br) (also `www.ottok.com.br`)

> Event: Saturday **2026-06-27**, 12:00–18:00, Arena Bombinhas — Rua Araçá, 551, Sertãozinho.

> Built end-to-end with **Claude Code as a platform** — project memory + skill-invocation conventions in [`CLAUDE.md`](CLAUDE.md); [`.claude/settings.json`](.claude/settings.json) wires the `frontend-design` / `cloudflare` / `playwright` plugins; visual self-check via [`scripts/shots.mjs`](scripts/shots.mjs) (Playwright + system Chromium) so visual changes get verified during the build loop.

---

## What it is

A single, full-screen, scroll-driven invitation that travels through a day: the sky animates from
noon blue → golden hour → dusk → bonfire night as you scroll, with an illustrated Otto in every
scene, varied festa separators, and a group RSVP form that writes to a database — all on Cloudflare's
free tier ($0/month).

### Highlights

- **Dynamic sky** ([`Sky.jsx`](src/components/Sky.jsx)) — day→night gradient, a rotating warm
  sunburst that sets, drifting Simpsons-style clouds (random per session), a full moon + twinkling
  stars at the bonfire end, and a WebGL ember particle field ([`Embers.jsx`](src/components/Embers.jsx),
  Three.js/R3F, lazy-loaded and code-split).
- **Full-screen scenes** with gentle scroll-snap; 2-column on desktop, compact on mobile.
- **Group RSVP** — a responsável confirms for the whole household (add/remove acompanhantes); one row
  per person sharing a `group_id`. Honeypot + optional Turnstile anti-spam. Confetti on success.
- **Rustic touches** — wood-textured plaques/frames, garland separators (lanterns, balloons, corn,
  candy apples) built from single generated elements tiled/hung via CSS.
- **Browser chrome follows the sky** — `theme-color` + body background animate with scroll (nice on
  Android Chrome).
- **Social card** — a generated Open Graph image (`public/og.jpg`) with Otto + balloons + wood frame.
- Countdown, add-to-calendar (`.ics` + Google), Google Maps + Waze, all respecting
  `prefers-reduced-motion`.

---

## Tech stack

- **Frontend:** Vite + React 19 + Tailwind CSS v4, `motion` (idle/reveal helpers), `three` +
  `@react-three/fiber` (embers), `canvas-confetti`.
- **Hosting:** Cloudflare Pages.
- **Backend:** Cloudflare Pages Function (`POST /api/rsvp`).
- **Database:** Cloudflare D1 (SQLite), table `rsvps`.
- **Anti-spam:** hidden honeypot + Cloudflare Turnstile (server-verified).
- **Package manager:** pnpm.

---

## Directory structure

```
.
├── index.html               # Vite entry; <head> OG/Twitter meta, fonts, theme-color
├── src/
│   ├── App.jsx              # composes Sky + the full-screen scenes + FloatingCTA
│   ├── index.css            # Tailwind v4 @theme tokens + CSS keyframes (sky, garlands, reveal)
│   ├── components/          # Sky, Sun, CloudField, Embers, Scene, Hero, Detalhes, Programacao,
│   │                        #   Mapa, Rsvp, Footer, Divider, WoodSign, WoodFrame, Bunting,
│   │                        #   Countdown, Button, OttoImage, FloatingCTA, Turnstile, ErrorBoundary
│   ├── data/
│   │   ├── event.js         # event facts + caipirês copy (single source of truth)
│   │   └── clouds.js        # Simpsons-style cloud SVG silhouettes
│   └── lib/
│       ├── calendar.js      # .ics + Google Calendar links
│       ├── links.js         # Google Maps / Waze links
│       └── confetti.js      # festa-colored confetti burst
├── functions/
│   └── api/rsvp.js          # Pages Function: validate → honeypot → Turnstile → D1 batch insert
├── public/
│   └── img/                 # generated WebP assets (Otto scenes, wood, separators) + og.jpg
├── scripts/
│   ├── make-og.mjs          # builds public/og.jpg            (pnpm og)
│   ├── rsvps.mjs            # prints the RSVP list from D1     (pnpm rsvps)
│   └── shots.mjs            # Playwright screenshots for visual self-checks
├── migrations/
│   └── 0001_add_group_id.sql
├── docs/                    # SPEC.md, RSVP-HANDOFF.md, IMAGES.md, IMAGE-PROMPTS.md, DEPLOY.md
├── schema.sql               # D1 table definition
├── wrangler.jsonc           # Pages config + D1 binding
├── CLAUDE.md                # project memory / build decisions (read this!)
└── package.json
```

---

## Getting started

Prerequisites: **Node 22+** and **pnpm**.

```bash
pnpm install
```

### Frontend only (fast UI loop)

```bash
pnpm dev          # http://localhost:5173
```

You can see and exercise the whole UI here, **but** submitting the RSVP errors — the `/api/rsvp`
Function and the database don't run under Vite.

### Full stack (Functions + local D1)

```bash
# one-time: create the local table
pnpm exec wrangler d1 execute rsvp-db --local --file ./schema.sql

pnpm build
pnpm pages:dev    # http://localhost:8788  (serves dist/ + functions/ + a local D1)
```

Read the local rows:

```bash
pnpm rsvps --local
```

---

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Vite dev server (frontend only). |
| `pnpm build` | Production build to `dist/`. |
| `pnpm preview` | Preview the built `dist/`. |
| `pnpm pages:dev` | `wrangler pages dev` — full stack (Functions + local D1). Build first. |
| `pnpm og` | Regenerate the social card `public/og.jpg` (resvg + sharp). |
| `pnpm rsvps` | Pretty-print the RSVP list grouped by household (`--local` for the dev DB). |

`node scripts/shots.mjs [url]` screenshots the running dev/preview at several scroll fractions using
the system Chromium via Playwright — used to verify visual changes.

---

## RSVP backend & database

`POST /api/rsvp` accepts JSON:

```jsonc
{
  "name": "João",
  "attending": 1,                 // 1 = coming, 0 = not
  "dietary": "sem glúten",
  "companions": [{ "name": "Maria", "dietary": "" }],  // only used when attending = 1
  "fax": "",                      // honeypot — must stay empty
  "turnstileToken": "..."         // verified only if TURNSTILE_SECRET_KEY is set
}
```

It validates, drops honeypot hits, then writes **one row per person** (companions are `attending = 1`),
all sharing a `group_id` (`crypto.randomUUID()`, `NULL` when solo), via `DB.batch`. Returns
`{ ok, count }`. The old single-person payload still works.

```sql
CREATE TABLE rsvps (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  attending   INTEGER NOT NULL,   -- 1 = vem, 0 = não vem
  dietary     TEXT,
  group_id    TEXT,               -- shared per household submission; NULL = solo
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

## Images

Otto's scenes are generated **externally on the Picsart web app** (the gen-ai API rejects real-child
face references; the web app allows them) from the prompts in [docs/IMAGES.md](docs/IMAGES.md), using
Otto's real photo as the face reference. Hero/footer are **transparent cutouts** composited over the
live sky; the 4 programação scenes are framed cards. Decorative assets (wood texture, separator
elements) were generated via the Picsart **gen-ai CLI** and keyed/optimized with `sharp`. Everything
is committed as optimized WebP under `public/img/`.

---

## Working from another machine (Cloudflare auth)

`wrangler.jsonc` already points at the production resources (Pages project `arraia-do-otto`, D1
`rsvp-db` with its `database_id`), so on a fresh machine you only need to **authenticate** wrangler
with the Cloudflare account that owns them:

```bash
pnpm install
pnpm exec wrangler login      # opens the browser → authorize the account (rkuesters@gmail.com)
pnpm exec wrangler whoami     # confirm the email + account id
```

After that, deploy and the reports work as usual:

```bash
pnpm build && pnpm exec wrangler pages deploy dist --project-name arraia-do-otto
pnpm rsvps                    # read production RSVPs
```

Notes:

- **Secrets are not in git.** Copy `.env.example` → `.env` (Turnstile **site** key) and
  `.dev.vars.example` → `.dev.vars` (Turnstile **secret** key) for local full-stack dev. In prod the
  secret is a Pages secret (`wrangler pages secret put TURNSTILE_SECRET_KEY`); the site key bakes into
  the build from `.env`.
- The **local** D1 lives under `.wrangler/` (gitignored), per machine. For local full-stack dev,
  recreate it: `pnpm exec wrangler d1 execute rsvp-db --local --file ./schema.sql` (then any
  `migrations/*.sql`).
- For **CI/headless** (no browser for OAuth), set a `CLOUDFLARE_API_TOKEN` env var with **Pages**
  (edit) + **D1** (edit) permissions instead of `wrangler login`.

## Deployment

Cloudflare Pages, project `arraia-do-otto`, served on the custom domain `ottok.com.br`.

```bash
pnpm build
pnpm exec wrangler pages deploy dist --project-name arraia-do-otto
```

Full walkthrough (D1 create, remote schema, Turnstile, custom domain): [docs/DEPLOY.md](docs/DEPLOY.md).
Read RSVPs in production with `pnpm rsvps`.

---

## Built with Claude Code

This site was designed and built collaboratively in **Claude Code**. Skills/tools that shaped it:

- **`frontend-design`** — the distinctive, non-generic visual direction.
- **`cloudflare` / `wrangler` / `cloudflare-email-service`** — Pages + D1 + Functions, and exploring
  email notifications.
- **`gen-ai-use`** (Picsart gen-ai CLI) — generated the wood texture and the separator elements.
- **`humanizer`** — available for the guest-facing caipirês copy (kept manual by the owner's call).
- **Playwright + system Chromium** — screenshot-driven visual verification (`scripts/shots.mjs`).

See [CLAUDE.md](CLAUDE.md) for build decisions and a couple of gotchas (notably: the scroll-linked sky
is driven by a plain rAF state, **not** motion MotionValues, because scroll-bound `opacity` didn't
flush to the DOM in this motion v12 + React 19 setup).

---

## TODO / ideas

- [ ] **CSV export** of the guest list for the caterer (headcount) — closer to the event.
- [x] **Turnstile** anti-spam — live since 2026-06-02 (managed widget + server verification, alongside
  the honeypot).
- [ ] **Email-on-RSVP** notification — deferred; Pages Functions can't use the `send_email` binding,
  so it'd need a companion Worker or a transactional API.
- [ ] Optional `www → apex` redirect for a canonical URL.
- [ ] Refresh the OG art / swap in newer Otto renders if desired.

---

*Feito com muuuuito amô pela mamãe e pelo papai do Otto ❤️*
