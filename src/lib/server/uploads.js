import "server-only";
import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import sharp from "sharp";
import { connectDB } from "./db";

// Uploaded images are stored in MongoDB (GridFS) rather than on disk, so they
// work on hosts without a persistent filesystem such as Vercel. Public URLs
// keep the /uploads/<folder>/<id>.webp shape and are served by
// src/app/uploads/[...path]/route.js.

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/heic", "image/heif"]);
const FOLDERS = new Set(["gallery", "committee", "faculty"]);
const UPLOAD_PATH = /^\/uploads\/(gallery|committee|faculty)\/[0-9a-f-]{36}\.webp$/;

async function bucket() {
  await connectDB();
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
}

/** The GridFS filename for a public /uploads/... path, or null if it isn't one of ours. */
function filenameFor(publicPath) {
  return typeof publicPath === "string" && UPLOAD_PATH.test(publicPath) ? publicPath.slice("/uploads/".length) : null;
}

export function isFile(value) {
  return value && typeof value === "object" && typeof value.arrayBuffer === "function" && value.size > 0;
}

/**
 * Validates an uploaded image, converts it to WebP (auto-rotated, metadata
 * stripped, at most `maxWidth` wide) and stores it under uploads/<folder>.
 */
export async function saveImage(file, folder, { maxWidth = 1920 } = {}) {
  if (!FOLDERS.has(folder)) throw new Error(`Unknown upload folder: ${folder}`);
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

  const filename = `${folder}/${randomUUID()}.webp`;
  const { width, height } = output.info;
  const files = await bucket();
  await new Promise((resolve, reject) => {
    files
      .openUploadStream(filename, { metadata: { contentType: "image/webp", width, height } })
      .once("finish", resolve)
      .once("error", reject)
      .end(output.data);
  });

  return { src: `/uploads/${filename}`, width, height };
}

/** Reads an uploaded image, or returns null if it doesn't exist. */
export async function readUpload(publicPath) {
  const filename = filenameFor(publicPath);
  if (!filename) return null;
  const files = await bucket();
  const [file] = await files.find({ filename }).limit(1).toArray();
  if (!file) return null;

  const chunks = [];
  for await (const chunk of files.openDownloadStream(file._id)) chunks.push(chunk);
  return { data: Buffer.concat(chunks), contentType: file.metadata?.contentType ?? "image/webp" };
}

export async function deleteUpload(publicPath) {
  const filename = filenameFor(publicPath);
  if (!filename) return;
  const files = await bucket();
  for (const file of await files.find({ filename }).toArray()) await files.delete(file._id);
}

export class UploadError extends Error {}
