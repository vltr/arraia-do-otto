// Dev-only visual check. Screenshots the running dev server at several scroll
// fractions using the system Chromium. Usage: node scripts/shots.mjs [url]
import { chromium } from "playwright";

const URL = process.argv[2] || "http://localhost:5173/";
const OUT = "/tmp";
const FRACTIONS = [0, 0.25, 0.5, 0.72, 0.85, 1];

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium" });
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(800);

for (const f of FRACTIONS) {
  await page.evaluate((frac) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.round(max * frac));
  }, f);
  await page.waitForTimeout(1100); // let scroll-linked + idle anims settle
  const name = `${OUT}/shot-${String(Math.round(f * 100)).padStart(3, "0")}.png`;
  // animations:"disabled" fast-forwards CSS animations to their end state.
  // Headless Chromium freezes CSS-animation timelines at frame 0, so without
  // this our `.reveal` (opacity 0→1) entrances would screenshot as invisible.
  await page.screenshot({ path: name, animations: "disabled" });
  const prog = await page.evaluate(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max ? +(window.scrollY / max).toFixed(3) : 0;
  });
  console.log(`${name}  scrollYProgress=${prog}`);
}

await browser.close();
