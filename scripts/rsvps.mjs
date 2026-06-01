// Pretty-prints the RSVP list from D1, grouped by household (group_id).
// Usage:
//   pnpm rsvps            → production (remote) DB
//   pnpm rsvps --local    → local dev DB
import { execFileSync } from "node:child_process";

const local = process.argv.includes("--local");
const where = local ? "--local" : "--remote";
const SQL =
  "SELECT id, name, attending, dietary, group_id, created_at FROM rsvps ORDER BY (group_id IS NULL), group_id, id";

let raw;
try {
  raw = execFileSync(
    "pnpm",
    ["exec", "wrangler", "d1", "execute", "rsvp-db", where, "--json", "--command", SQL],
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
  );
} catch (e) {
  console.error("Erro ao consultar o D1:", e.message);
  process.exit(1);
}

// wrangler may print a banner before the JSON — slice from the first array.
const rows = JSON.parse(raw.slice(raw.indexOf("[")))[0].results;

const diet = (r) => (r.dietary ? `  ·  ${r.dietary}` : "");
const coming = rows.filter((r) => r.attending === 1);
const notComing = rows.filter((r) => r.attending !== 1);

// group rows by household; solos (group_id NULL) stand alone
const groups = new Map();
const solos = [];
for (const r of rows) {
  if (r.group_id) (groups.get(r.group_id) ?? groups.set(r.group_id, []).get(r.group_id)).push(r);
  else solos.push(r);
}
const households = groups.size + solos.filter((s) => s.attending === 1).length;

console.log(`\n🎪  RSVPs — Arraiá do Otto  ${local ? "(local)" : "(produção)"}`);
console.log("─".repeat(48));
console.log(`✅ ${coming.length} vão   ❌ ${notComing.length} não vão   👨‍👩‍👧 ${households} núcleo(s)   (${rows.length} registros)\n`);

for (const members of groups.values()) {
  const [head, ...rest] = members;
  console.log(`👨‍👩‍👧 ${head.name}${diet(head)}`);
  for (const m of rest) console.log(`     + ${m.name}${diet(m)}`);
}
for (const s of solos) {
  if (s.attending === 1) console.log(`👤 ${s.name}${diet(s)}`);
  else console.log(`🚫 ${s.name} — num vô podê`);
}
console.log("");
