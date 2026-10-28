/**
 * Builds the brand assets from the master logo (opaque, on white):
 *   public/images/brand/logo.webp    full logo, white keyed out to transparency
 *   public/images/brand/emblem.webp  palm + house mark only
 *   src/app/icon.png                 favicon / app icon
 *
 * Usage: node scripts/build-logo.mjs public/images/brand/logo.png
 */
import path from "node:path";
import sharp from "sharp";

const SOURCE = process.argv[2];
const ROOT = path.resolve(import.meta.dirname, "..");
const BRAND = path.join(ROOT, "public/images/brand");

if (!SOURCE) {
  console.error("Usage: node scripts/build-logo.mjs <logo.png>");
  process.exit(1);
}

// "Colour to alpha" against white: keeps anti-aliased edges smooth instead of
// leaving a white fringe, and restores each pixel's true colour.
async function keyOutWhite(input) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);

  for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    // Treat near-white as paper so JPEG-ish noise doesn't leave specks
    const a = Math.max(255 - r, 255 - g, 255 - b) / 255;
    const alpha = a < 0.04 ? 0 : a;
    const un = (c) => (alpha ? Math.round(255 - (255 - c) / alpha) : 0);
    out[o] = un(r);
    out[o + 1] = un(g);
    out[o + 2] = un(b);
    out[o + 3] = Math.round(alpha * 255);
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

const keyed = await sharp(await keyOutWhite(SOURCE)).trim().png().toBuffer();
const { width, height } = await sharp(keyed).metadata();

const logo = await sharp(keyed).resize({ width: 1200 }).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(path.join(BRAND, "logo.webp"));
console.log(`logo.webp    ${logo.width}x${logo.height}  ${(logo.size / 1024).toFixed(0)} KB`);

// The emblem ends at the first fully transparent column between it and the
// wordmark. Only the upper rows are scanned: the tagline underline runs on
// below and would otherwise bridge the gap.
async function emblemWidth(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const rows = Math.round(info.height * 0.75);
  for (let x = Math.round(info.width * 0.1); x < info.width; x++) {
    let empty = true;
    for (let y = 0; y < rows && empty; y++) {
      if (data[(y * info.width + x) * 4 + 3] > 8) empty = false;
    }
    if (empty) return x;
  }
  return info.width;
}

const emblemBuf = await sharp(keyed)
  .extract({ left: 0, top: 0, width: await emblemWidth(keyed), height })
  .trim()
  .png()
  .toBuffer();

const emblem = await sharp(emblemBuf).resize({ height: 360 }).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(path.join(BRAND, "emblem.webp"));
console.log(`emblem.webp  ${emblem.width}x${emblem.height}  ${(emblem.size / 1024).toFixed(0)} KB`);

// App icon: emblem without the tagline, centred on the site's ivory
const { height: eh, width: ew } = await sharp(emblemBuf).metadata();
const mark = await sharp(emblemBuf).extract({ left: 0, top: 0, width: ew, height: Math.round(eh * 0.8) }).trim().resize({ height: 210 }).toBuffer();
await sharp({ create: { width: 256, height: 256, channels: 4, background: "#f5efe3" } })
  .composite([{ input: mark, gravity: "center" }])
  .png()
  .toFile(path.join(ROOT, "src/app/icon.png"));
console.log("icon.png     256x256");
