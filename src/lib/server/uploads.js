import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Uploads are runtime data: the turbopackIgnore hints stop the build from tracing the whole project
export const UPLOAD_ROOT = path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.UPLOAD_DIR || "uploads");
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/heic", "image/heif"]);

/** Resolves a public /uploads/... path to a file inside UPLOAD_ROOT, or null if it escapes it. */
export function resolveUpload(publicPath) {
  if (typeof publicPath !== "string" || !publicPath.startsWith("/uploads/")) return null;
  const file = path.resolve(/*turbopackIgnore: true*/ UPLOAD_ROOT, "." + publicPath.slice("/uploads".length));
  return file.startsWith(UPLOAD_ROOT + path.sep) ? file : null;
}

export function isFile(value) {
  return value && typeof value === "object" && typeof value.arrayBuffer === "function" && value.size > 0;
}

/**
 * Validates an uploaded image, converts it to WebP (auto-rotated, metadata
 * stripped, at most `maxWidth` wide) and stores it under uploads/<folder>.
 */
export async function saveImage(file, folder, { maxWidth = 1920 } = {}) {
  if (!ACCEPTED_TYPES.has(file.type)) throw new UploadError(`${file.name}: unsupported file type. Use JPG, PNG or WebP.`);
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError(`${file.name}: larger than 8 MB.`);

  let output;
  try {
    output = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    throw new UploadError(`${file.name}: could not be read as an image.`);
  }

  const dir = path.join(/*turbopackIgnore: true*/ UPLOAD_ROOT, folder);
  const name = `${randomUUID()}.webp`;
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(/*turbopackIgnore: true*/ dir, name), output.data);

  return { src: `/uploads/${folder}/${name}`, width: output.info.width, height: output.info.height };
}

export async function deleteUpload(publicPath) {
  const file = resolveUpload(publicPath);
  if (!file) return;
  await unlink(file).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
}

export class UploadError extends Error {}
