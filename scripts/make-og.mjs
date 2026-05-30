// Generates the social-share preview image (Open Graph card) at public/og.jpg.
// Renders a themed 1200×630 SVG with the real Rye/Nunito/Caveat fonts via resvg,
// then compresses to JPG with sharp. Re-run with: pnpm og
//
// Fonts are downloaded once into assets-raw/fonts/ (gitignored).

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const fontDir = join(root, "assets-raw", "fonts");

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

// festa palette
const C = {
  corn: "#f6c544",
  red: "#d2382c",
  green: "#3f9e54",
  orange: "#f08a24",
  cream: "#fff5e1",
  wood: "#4a2c18",
};

function bunting() {
  const flags = [C.red, C.corn, C.green, C.orange, C.cream];
  const n = 17;
  const W = 1200;
  const step = W / n;
  const w = step * 0.78;
  let out = `<line x1="0" y1="34" x2="${W}" y2="34" stroke="${C.wood}" stroke-width="4" opacity="0.55"/>`;
  for (let i = 0; i < n; i++) {
    const cx = i * step + step / 2;
    const x0 = cx - w / 2;
    const x1 = cx + w / 2;
    out += `<polygon points="${x0},34 ${x1},34 ${cx},${34 + w * 0.95}" fill="${flags[i % flags.length]}" stroke="rgba(0,0,0,0.12)" stroke-width="1"/>`;
  }
  return out;
}

const TITLE = "ARRAIÁ DO OTTO";
const WELCOME = "Cês tão tudo convidado, sô!";
const SUBTITLE = "O Otto vai fazê 1 aninho!";
const INFO = "27 de junho de 2026  ·  12h às 18h  ·  Arena Bombinhas";

function svg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1f6f9e"/>
      <stop offset="42%" stop-color="#f0a23a"/>
      <stop offset="100%" stop-color="#a8322a"/>
    </linearGradient>
    <radialGradient id="ember" cx="50%" cy="118%" r="75%">
      <stop offset="0%" stop-color="#ffd06b" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="#f0852a" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#f0852a" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#sky)"/>
  <rect width="1200" height="630" fill="url(#ember)"/>
  <rect width="1200" height="630" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="16"/>

  ${bunting()}

  <text x="600" y="248" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="52" fill="${C.cream}" opacity="0.95">${WELCOME}</text>

  <!-- woodtype title, layered for chunky depth -->
  <g font-family="Rye" font-size="118" text-anchor="middle">
    <text x="604" y="392" fill="${C.wood}">${TITLE}</text>
    <text x="602" y="388" fill="${C.red}">${TITLE}</text>
    <text x="600" y="385" fill="${C.corn}">${TITLE}</text>
  </g>

  <text x="600" y="452" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="40" fill="${C.cream}">${SUBTITLE}</text>

  <!-- info pill -->
  <rect x="270" y="506" width="660" height="74" rx="37" fill="${C.wood}" opacity="0.92"/>
  <text x="600" y="553" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="29" fill="${C.cream}">${INFO}</text>
</svg>`;
}

async function main() {
  const fontFiles = await ensureFonts();
  const resvg = new Resvg(svg(), {
    fitTo: { mode: "width", value: 1200 },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Nunito" },
  });
  const png = resvg.render().asPng();
  await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(join(root, "public", "og.jpg"));
  console.log("✔ public/og.jpg gerado (1200×630)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
