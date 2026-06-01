-- Additive, backward-compatible migration: tag rows from the same submission
-- (a household/núcleo) with a shared group_id. Existing rows stay NULL (solo).
-- Apply once to each DB:
--   wrangler d1 execute rsvp-db --local  --file ./migrations/0001_add_group_id.sql
--   wrangler d1 execute rsvp-db --remote --file ./migrations/0001_add_group_id.sql
ALTER TABLE rsvps ADD COLUMN group_id TEXT;
