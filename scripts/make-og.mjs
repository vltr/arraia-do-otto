// Generates the social-share preview image (Open Graph card) at public/og.jpg.
// Renders a themed 1200×630 card (Rye/Nunito/Caveat via resvg) with the title on
// the left, then composites the real Otto cutout (assets-raw/og-otto.png — Otto
// pointing at the viewer) on the right with sharp. Re-run with: pnpm og
//
// Fonts download once into assets-raw/fonts/ (gitignored). og-otto.png is the
// transparent Otto export (also gitignored); only public/og.jpg is committed.

import { writeFile, mkdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const fontDir = join(root, "assets-raw", "fonts");
const OTTO = join(root, "assets-raw", "og-otto.png");

const FONTS = [
  { file: "Rye-Regular.ttf", url: "https://github.com/google/fonts/raw/main/ofl/rye/Rye-Regular.ttf" },
  { file: "Nunito.ttf", url: "https://github.com/google/fonts/raw/main/ofl/nunito/Nunito%5Bwght%5D.ttf" },
  { file: "Caveat.ttf", url: "https://github.com/google/fonts/raw/main/ofl/caveat/Caveat%5Bwght%5D.ttf" },
];

async function ensureFonts() {
  await mkdir(fontDir, { recursive: true });
  for (const f of FONTS) {
    const dest = join(fontDir, f.file);
    try {
      await access(dest);
    } catch {
      process.stdout.write(`baixando ${f.file}… `);
      const res = await fetch(f.url);
      if (!res.ok) throw new Error(`falha ao baixar ${f.file}: ${res.status}`);
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
      console.log("ok");
    }
  }
  return FONTS.map((f) => join(fontDir, f.file));
}

const C = { corn: "#f6c544", red: "#d2382c", green: "#3f9e54", orange: "#f08a24", cream: "#fff5e1", wood: "#4a2c18" };

function bunting() {
  const flags = [C.red, C.corn, C.green, C.orange, C.cream];
  const n = 17, W = 1200, step = W / n, w = step * 0.78;
  let out = `<line x1="0" y1="34" x2="${W}" y2="34" stroke="${C.wood}" stroke-width="4" opacity="0.55"/>`;
  for (let i = 0; i < n; i++) {
    const cx = i * step + step / 2;
    out += `<polygon points="${cx - w / 2},34 ${cx + w / 2},34 ${cx},${34 + w * 0.95}" fill="${flags[i % flags.length]}" stroke="rgba(0,0,0,0.12)" stroke-width="1"/>`;
  }
  return out;
}

const WELCOME = "Cês tão tudo convidado, sô!";
const SUBTITLE = "O Otto vai fazê 1 aninho!";
const INFO = "27 de junho de 2026  ·  12h às 18h  ·  Arena Bombinhas";
const X = 64; // left margin for the text block

// layered woodtype line, left-aligned
function titleLine(text, y) {
  return `
    <text x="${X + 4}" y="${y + 4}" font-family="Rye" font-size="96" fill="${C.wood}">${text}</text>
    <text x="${X + 2}" y="${y + 2}" font-family="Rye" font-size="96" fill="${C.red}">${text}</text>
    <text x="${X}" y="${y}" font-family="Rye" font-size="96" fill="${C.corn}">${text}</text>`;
}

function svg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1f6f9e"/><stop offset="42%" stop-color="#f0a23a"/><stop offset="100%" stop-color="#a8322a"/>
    </linearGradient>
    <radialGradient id="ember" cx="50%" cy="118%" r="75%">
      <stop offset="0%" stop-color="#ffd06b" stop-opacity="0.95"/><stop offset="45%" stop-color="#f0852a" stop-opacity="0.35"/><stop offset="100%" stop-color="#f0852a" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#sky)"/>
  <rect width="1200" height="630" fill="url(#ember)"/>
  ${bunting()}

  <text x="${X}" y="150" font-family="Caveat" font-weight="700" font-size="50" fill="${C.cream}" opacity="0.96">${WELCOME}</text>
  ${titleLine("ARRAIÁ", 268)}
  ${titleLine("DO OTTO", 366)}
  <text x="${X}" y="424" font-family="Nunito" font-weight="800" font-size="34" fill="${C.cream}">${SUBTITLE}</text>

  <rect x="${X - 4}" y="470" width="648" height="64" rx="32" fill="${C.wood}" opacity="0.92"/>
  <text x="${X + 18}" y="510" font-family="Nunito" font-weight="700" font-size="24" fill="${C.cream}">${INFO}</text>

  <rect width="1200" height="630" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="16"/>
</svg>`;
}

async function main() {
  const fontFiles = await ensureFonts();
  const resvg = new Resvg(svg(), {
    fitTo: { mode: "width", value: 1200 },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Nunito" },
  });
  const card = resvg.render().asPng();

  // Otto pointing — bottom-right, feet near the bottom edge (must fit the card).
  const ottoH = 600;
  const ottoBuf = await sharp(OTTO).resize({ height: ottoH }).png().toBuffer();
  const { width: ow } = await sharp(ottoBuf).metadata();
  const left = 1200 - ow - 8;
  const top = 630 - ottoH;

  await sharp(card)
    .composite([{ input: ottoBuf, left, top }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(join(root, "public", "og.jpg"));
  console.log("✔ public/og.jpg gerado (1200×630) com o Otto");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
