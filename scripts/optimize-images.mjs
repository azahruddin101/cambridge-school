/**
 * Converts the original assets from easterncambridgeschool.co.in into
 * optimised WebP files with semantic names under public/images.
 * Brand assets (logo, emblem, icon) are built separately by build-logo.mjs.
 *
 * Usage: node scripts/optimize-images.mjs <path-to-original-downloads>
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE = process.argv[2];
const OUT = path.resolve(import.meta.dirname, "../public/images");

if (!SOURCE) {
  console.error("Usage: node scripts/optimize-images.mjs <source-dir>");
  process.exit(1);
}

// [source file, output path, max width, extra pipeline step]
const MAP = [
  ["Building1.jpeg", "campus/main-building.webp", 1920],
  ["WhatsApp-Image-2019-12-13-at-10.38.08-AM.jpeg", "campus/senior-wing.webp", 1920],
  ["Infra-2.jpeg", "campus/reception.webp", 1600],

  ["Infra-1.jpeg", "life/morning-assembly.webp", 1920],
  ["WhatsApp-Image-2019-12-13-at-10.36.35-AM.jpeg", "life/sports-champions.webp", 1920],
  ["Pr-Sec.jpeg", "life/annual-day-primary.webp", 1920],
  ["M-Sec.jpeg", "life/annual-day-middle.webp", 1920],

  ["Sr-Sec.jpeg", "facilities/science-lab.webp", 1600],
  ["Infra-3.jpeg", "facilities/computer-lab.webp", 1600],

  ["swami-vivekanand.jpg", "people/swami-vivekananda.webp", 400],
  ["Dr-S-Radhakrishnan.jpg", "people/dr-s-radhakrishnan.webp", 400],
  ["Rabindranath_Tagore-scaled.jpg", "people/rabindranath-tagore.webp", 800],
];

for (const [src, out, maxWidth, transform] of MAP) {
  const dest = path.join(OUT, out);
  await mkdir(path.dirname(dest), { recursive: true });

  let img = sharp(path.join(SOURCE, src));
  if (transform) img = transform(img);

  const info = await img
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(dest);

  console.log(`${out.padEnd(40)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
