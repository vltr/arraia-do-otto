# Otto's Invitation — RSVP Site: Project Handoff

> Handoff doc for a Claude Code session. Captures the decisions made in planning so you can start building. Read top to bottom; the "Build tasks" section at the end is the actionable checklist.

## Goal

A very simple event website: an invitation page for **Otto** plus a secure **RSVP form** where guests indicate whether they're attending.

## Requirements

- **Scale:** ~50–60 guests total. Low traffic, short-lived (lives for a few weeks around the event).
- **RSVP fields:** guest name, attending yes/no, and an optional dietary preference/notes field.
- **Security:** HTTPS only; spam/abuse protection on the public form; RSVP data stored safely.
- **Custom domain:** yes — **not chosen yet** (TBD). Needs to be pointed at the site.
- **SSL:** Let's Encrypt (or equivalent) — handled automatically by the host, no manual certbot.
- **Owner stack preference:** main strength is Python, but the chosen architecture uses a small JS Worker for the dynamic glue (acceptable tradeoff for staying $0 and all-in-one).
- **Budget:** free tier strongly preferred; a few $/month acceptable. Chosen design is **$0/month**.

## Decided architecture (everything on Cloudflare, one roof)

Chosen to keep maintenance simple by keeping hosting, the form endpoint, the database, and spam protection all within Cloudflare.

- **Static invitation page** → **Cloudflare Pages** (custom domain + automatic SSL, no bandwidth cap on the free tier).
- **RSVP form endpoint** → a **Cloudflare Pages Function / Worker** handling `POST /rsvp`: validates input, verifies the Turnstile token, writes a row to D1.
- **Database** → **Cloudflare D1** (serverless SQLite). Free tier is far more than enough for ~60 rows.
- **Spam protection** → **Cloudflare Turnstile** (invisible CAPTCHA alternative, free) **+ a hidden honeypot field**. Reject submissions that fill the honeypot or fail Turnstile.

### Why Cloudflare over the alternatives (for context)
- **GitHub Pages** — viable for the static page, but static-only, so the form still needs an external handler. Chosen against to avoid splitting hosting across GH + a separate form service.
- **Netlify** — good built-in Forms, but free Forms cap is 100/mo and exceeding any free limit can pause *all* sites on the account.
- **Vercel Hobby** — non-commercial only; serverless functions not a long-running Python server.
- **PythonAnywhere ($5/mo)** — the nicest path *if writing Python mattered most* (one-click Let's Encrypt, no cold starts). Kept as fallback if the project grows.
- **Render free** — runs Python (Flask/FastAPI) but sleeps after 15 min (~1-min cold start); its free Postgres expires after 30 days. Use Neon for storage if going this route.
- **VPS (Hetzner CX22 ~€4–8/mo, or Oracle Always Free $0)** — most control, manual nginx + certbot; more maintenance than this short-lived site warrants.

## Data model

A single table is enough:

```sql
CREATE TABLE IF NOT EXISTS rsvps (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  attending   INTEGER NOT NULL,        -- 1 = yes, 0 = no
  dietary     TEXT,                    -- optional, nullable
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Collect only what's needed (name, yes/no, dietary). Avoid extra PII. Keep all secrets (Turnstile secret key, admin token) in Worker/Pages environment variables — never in client HTML.

## How RSVP records will be viewed

Decided approach: **start with the dashboard console; add an `/admin` CSV view if a shareable/exportable list is wanted.** All read the same `rsvps` table — no lock-in.

1. **Cloudflare dashboard D1 console** (zero code) — run `SELECT * FROM rsvps ORDER BY created_at DESC` in the browser. Sufficient for the owner alone.
2. **Wrangler CLI** (zero code) — `wrangler d1 execute rsvp-db --remote --command "SELECT * FROM rsvps"`; easy to export CSV for the caterer headcount.
3. **Token-protected `/admin` page** (small build) — a route that renders an HTML table and/or returns a CSV download, gated by a secret URL token (checked against a Worker secret) or HTTP Basic Auth. Pick this if a non-technical co-host (e.g. Otto) needs to check the list without a Cloudflare login.
4. **Email-on-submit backstop** (optional) — Worker also emails each RSVP (Resend free tier / MailChannels) as a safety net. Not a viewer, just redundancy.

## Spam / abuse protection (layered, all free)

- **Honeypot:** a hidden input real users never fill; reject any submission that populates it.
- **Cloudflare Turnstile:** Managed mode, verify the token server-side in the Function before writing to D1.
- **Server-side validation:** enforce field presence/length/types; reject malformed payloads.
- **Rate limiting (optional):** cap submissions per IP at the edge or via KV counts. Light limits are plenty at this scale.

## Open items / TBD

- **Custom domain not yet chosen.** Once picked: add it in Cloudflare Pages (Cloudflare manages DNS + auto SSL). If the domain is registered elsewhere, move DNS to Cloudflare or add the records they specify.
- Decide whether the `/admin` view and email backstop are wanted, or whether the dashboard console alone suffices.
- Invitation page content/design (Otto's details: date, time, location, any theme) — not yet specified.

## Build tasks (for the Claude Code session)

1. **Scaffold** a Cloudflare Pages project with a Pages Function (Wrangler). Suggested layout: `/public` (or framework output) for the static invite, `/functions/rsvp.js` for the POST handler, `/functions/admin.js` (optional) for the viewer.
2. **Create the D1 database** (`wrangler d1 create rsvp-db`), apply the schema migration above, and bind it in `wrangler.toml`.
3. **Build the invitation page** — static HTML/CSS for Otto's invite, including the RSVP `<form>` with: name, attending (yes/no), dietary (optional), a hidden honeypot field, and the Turnstile widget.
4. **Implement `POST /rsvp`** — validate fields, check honeypot, verify Turnstile token server-side, insert into D1, return a success/confirmation response.
5. **(Optional) Implement `/admin`** — token-protected; render an HTML table of RSVPs and a CSV export endpoint.
6. **(Optional) Email backstop** — send each RSVP to the owner via Resend/MailChannels.
7. **Configure secrets** — Turnstile site key (client) + secret key (server), admin token, email API key. Use `wrangler secret put` / Pages environment variables.
8. **Custom domain + SSL** — once the domain is chosen, add it in Pages; confirm automatic SSL is active.
9. **Test** — submit valid/invalid/honeypot-tripped/failed-Turnstile cases; confirm rows land in D1 and the chosen viewer shows them; do a CSV export dry run.

## Cost summary

**$0/month.** Cloudflare Pages (unlimited static bandwidth), Workers/Functions free tier (100k req/day), D1 free tier (5 GB, generous read/write/day), and Turnstile (free) all sit far below their limits at 50–60 guests. Only a custom domain registration (~$10–15/year, separate) is a real cost.
