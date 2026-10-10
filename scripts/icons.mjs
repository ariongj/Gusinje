// Renders the home-screen icons from src/app/icon.svg's artwork:
// public/icons/icon-192.png, icon-512.png (rounded, as in the favicon),
// icon-maskable-512.png and src/app/apple-icon.png (full-bleed, artwork inside
// the safe zone, because Android and iOS crop the corners themselves).
// Run: node scripts/icons.mjs
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const svg = readFileSync(new URL("../src/app/icon.svg", import.meta.url), "utf8");
const art = svg.replace(/^.*?<rect[^>]*\/>/s, "").replace(/<\/svg>\s*$/, "");
const fullBleed = (scale) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#0F3B3F"/><g transform="translate(${50 - 50 * scale} ${50 - 50 * scale}) scale(${scale})">${art}</g></svg>`;

const outputs = [
  { file: "public/icons/icon-192.png", size: 192, svg },
  { file: "public/icons/icon-512.png", size: 512, svg },
  { file: "public/icons/icon-maskable-512.png", size: 512, svg: fullBleed(0.7) },
  { file: "src/app/apple-icon.png", size: 180, svg: fullBleed(0.8) },
];

const browser = await chromium.launch();
for (const { file, size, svg: markup } of outputs) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${markup}`);
  await page.screenshot({ path: new URL(`../${file}`, import.meta.url).pathname, omitBackground: true });
  await page.close();
  console.log(`${file} (${size}px)`);
}
await browser.close();
