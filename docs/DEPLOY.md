# Deploy — Arraiá do Otto (Cloudflare Pages)

Step-by-step to put the site live on `arraia-do-otto.pages.dev`, $0/month.
Run these from the repo root. All commands use the project-local wrangler via `pnpm exec`.
Where a command opens a browser or prompts you, follow the prompt — values below are the answers.

> You can deploy **now** with placeholder images and Turnstile off, then redeploy once
> Otto's WebPs and the Turnstile keys are ready. Each `pages deploy` is independent.

---

## 0. One-time: log in

```bash
pnpm exec wrangler login
```

Opens the browser; authorize. Confirm with `pnpm exec wrangler whoami`.

---

## 1. Create the D1 database

```bash
pnpm exec wrangler d1 create rsvp-db
```

It prints a block like:

```
[[d1_databases]]
binding = "DB"
database_name = "rsvp-db"
database_id = "abcd1234-...."
```

Copy that **`database_id`** and paste it into [`../wrangler.jsonc`](../wrangler.jsonc),
replacing `"PLACEHOLDER_AFTER_D1_CREATE"`. (Binding name stays `DB`.)

---

## 2. Create the table (remote)

```bash
pnpm exec wrangler d1 execute rsvp-db --remote --file ./schema.sql
```

Verify:

```bash
pnpm exec wrangler d1 execute rsvp-db --remote --command "SELECT name FROM sqlite_master WHERE type='table'"
```

You should see `rsvps`.

---

## 3. (Optional but recommended) Turnstile anti-spam

Skip this whole step to deploy without the captcha — the honeypot still protects you,
and the form submits fine. Add it later by repeating step 5 after a rebuild.

1. Cloudflare dashboard → **Turnstile** → **Add widget**.
   - Domains: add `arraia-do-otto.pages.dev` (and `localhost` if you want to test locally).
   - Mode: **Managed**.
2. Copy the **Site Key** (public) and **Secret Key** (private).
3. Put the **site key** in a local `.env` so it gets baked into the build:

   ```bash
   cp .env.example .env
   # edit .env: VITE_TURNSTILE_SITE_KEY=0x....your-site-key
   ```

   (The site key is public — safe in client code. The secret key goes to Pages in step 6, never in the repo.)

---

## 4. Build

```bash
pnpm build
```

Builds `dist/`. If you set `VITE_TURNSTILE_SITE_KEY` in `.env`, the widget is baked in now.

---

## 5. Deploy

```bash
pnpm exec wrangler pages deploy dist --project-name arraia-do-otto
```

First run creates the Pages project — when prompted:
- **Project name:** `arraia-do-otto`
- **Production branch:** `main`

It uploads `dist/` and the `functions/` (the `/api/rsvp` handler) and applies the
D1 binding from `wrangler.jsonc`. At the end it prints your live URL
(`https://arraia-do-otto.pages.dev`).

---

## 6. Set the Turnstile secret (only if you did step 3)

```bash
pnpm exec wrangler pages secret put TURNSTILE_SECRET_KEY --project-name arraia-do-otto
# paste the SECRET key when prompted
```

The Function enforces Turnstile only when this secret exists, so set it **after** the
site key is baked into the deployed build. Redeploy is not required for the secret to take effect.

---

## 7. Smoke-test production

1. Open `https://arraia-do-otto.pages.dev`, scroll through (sky transition, sections).
2. Submit a real RSVP. You should get the confetti + "Tá confirmado, ó!" message.
3. Confirm it landed:

   ```bash
   pnpm exec wrangler d1 execute rsvp-db --remote --command "SELECT id,name,attending,dietary,created_at FROM rsvps ORDER BY id DESC"
   ```

---

## Viewing RSVPs (host)

No admin page was built (owner's call — dashboard/CLI is enough). To read the guest list / headcount:

```bash
# Everyone, newest first:
pnpm exec wrangler d1 execute rsvp-db --remote --command "SELECT name,attending,dietary,created_at FROM rsvps ORDER BY created_at DESC"

# Headcount of confirmed (attending = 1):
pnpm exec wrangler d1 execute rsvp-db --remote --command "SELECT COUNT(*) AS confirmados FROM rsvps WHERE attending=1"
```

Or run the same `SELECT` in the Cloudflare dashboard → D1 → rsvp-db → Console.

---

## Updating the site later (new images, copy tweaks)

```bash
pnpm build
pnpm exec wrangler pages deploy dist --project-name arraia-do-otto
```

That's the whole loop. Drop new `public/img/*.webp`, rebuild, redeploy.

---

## Custom domain (later)

Cloudflare dashboard → Pages → arraia-do-otto → **Custom domains** → add the domain.
If it's registered at Cloudflare (or you move DNS there), SSL is automatic. No code change needed.
