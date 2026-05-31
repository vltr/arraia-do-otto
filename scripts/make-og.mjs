// Generates the social-share preview (public/og.jpg). Matches the site's rustic
// identity: a wood-framed card, a real balloon garland across the top, the
// woodtype title on the left, and the "número 1" Otto on the right. Re-run: pnpm og
//
// Assets (gitignored sources): fonts in assets-raw/fonts, og-otto.png the
// transparent Otto. Committed reusables: public/img/wood.webp, sep-balao.webp.

import { writeFile, mkdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const fontDir = join(root, "assets-raw", "fonts");
const OTTO = join(root, "assets-raw", "og-otto.png");
const WOOD = join(root, "public", "img", "wood.webp");
const BALAO = join(root, "public", "img", "sep-balao.webp");

const W = 1200, H = 630, FRAME = 14;
const IW = W - FRAME * 2, IH = H - FRAME * 2; // inner card size

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
      const res = await fetch(f.url);
      if (!res.ok) throw new Error(`falha ao baixar ${f.file}: ${res.status}`);
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    }
  }
  return FONTS.map((f) => join(fontDir, f.file));
}

const C = { corn: "#f6c544", red: "#d2382c", cream: "#fff5e1", wood: "#4a2c18" };
const X = 60;
const WELCOME = "Cês tão tudo convidado, sô!";
const SUBTITLE = "O Otto vai fazê 1 aninho!";
const INFO = "27 de junho de 2026  ·  12h às 18h  ·  Arena Bombinhas";

function titleLine(text, y) {
  return `
    <text x="${X + 4}" y="${y + 4}" font-family="Rye" font-size="92" fill="${C.wood}">${text}</text>
    <text x="${X + 2}" y="${y + 2}" font-family="Rye" font-size="92" fill="${C.red}">${text}</text>
    <text x="${X}" y="${y}" font-family="Rye" font-size="92" fill="${C.corn}">${text}</text>`;
}

// inner card (gradient + ember + garland string + text). Garland balloons and
// Otto are composited on top with sharp.
function svg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${IW}" height="${IH}" viewBox="0 0 ${IW} ${IH}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1f6f9e"/><stop offset="42%" stop-color="#f0a23a"/><stop offset="100%" stop-color="#a8322a"/>
    </linearGradient>
    <radialGradient id="ember" cx="50%" cy="118%" r="75%">
      <stop offset="0%" stop-color="#ffd06b" stop-opacity="0.95"/><stop offset="45%" stop-color="#f0852a" stop-opacity="0.35"/><stop offset="100%" stop-color="#f0852a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${IW}" height="${IH}" fill="url(#sky)"/>
  <rect width="${IW}" height="${IH}" fill="url(#ember)"/>

  <line x1="14" y1="40" x2="${IW - 14}" y2="40" stroke="${C.wood}" stroke-width="3" opacity="0.5"/>

  <text x="${X}" y="170" font-family="Caveat" font-weight="700" font-size="50" fill="${C.cream}" opacity="0.96">${WELCOME}</text>
  ${titleLine("ARRAIÁ", 278)}
  ${titleLine("DO OTTO", 372)}
  <text x="${X}" y="428" font-family="Nunito" font-weight="800" font-size="33" fill="${C.cream}">${SUBTITLE}</text>

  <rect x="${X - 4}" y="470" width="640" height="62" rx="31" fill="${C.wood}" opacity="0.92"/>
  <text x="${X + 18}" y="509" font-family="Nunito" font-weight="700" font-size="23" fill="${C.cream}">${INFO}</text>
</svg>`;
}

async function main() {
  const fontFiles = await ensureFonts();
  const resvg = new Resvg(svg(), {
    fitTo: { mode: "width", value: IW },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Nunito" },
  });
  const inner = resvg.render().asPng();

  // balloon garland across the top of the inner card (Otto covers the right end)
  const balaoBuf = await sharp(BALAO).resize({ height: 76 }).png().toBuffer();
  const bw = (await sharp(balaoBuf).metadata()).width;
  const N = 8;
  const step = IW / N;
  const garland = Array.from({ length: N }, (_, i) => ({
    input: balaoBuf,
    top: 6,
    left: Math.round(step * (i + 0.5) - bw / 2),
  }));
  const card = await sharp(inner).composite(garland).png().toBuffer();

  // wood frame: wood texture base with the card inset
  const base = await sharp(WOOD).resize({ width: W, height: H, fit: "cover" }).toBuffer();
  const framed = await sharp(base)
    .composite([{ input: card, top: FRAME, left: FRAME }])
    .png()
    .toBuffer();

  // Otto (número 1) on the right
  const ottoH = 576;
  const ottoBuf = await sharp(OTTO).resize({ height: ottoH }).png().toBuffer();
  const ow = (await sharp(ottoBuf).metadata()).width;
  await sharp(framed)
    .composite([{ input: ottoBuf, left: W - ow - FRAME - 2, top: H - ottoH - FRAME }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(join(root, "public", "og.jpg"));
  console.log("✔ public/og.jpg gerado — Otto do '1' + guirlanda + moldura");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
