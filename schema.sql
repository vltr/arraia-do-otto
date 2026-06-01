-- D1 schema for Otto's RSVP site. Apply with:
--   wrangler d1 execute rsvp-db --local  --file ./schema.sql   (local dev)
--   wrangler d1 execute rsvp-db --remote --file ./schema.sql   (production)
CREATE TABLE IF NOT EXISTS rsvps (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  attending   INTEGER NOT NULL,        -- 1 = vem, 0 = não vem
  dietary     TEXT,                    -- restrição alimentar (opcional)
  group_id    TEXT,                    -- mesmo id pras pessoas de um mesmo envio (núcleo); NULL = solo
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
