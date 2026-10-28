/**
 * One-off: copies images from the old local uploads/ folder into MongoDB
 * (GridFS) under the same paths, so existing /uploads/... URLs keep working.
 * Skips files that are already stored. Safe to re-run.
 *
 * Usage: npm run migrate-uploads
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..", process.env.UPLOAD_DIR || "uploads");
const FOLDERS = ["gallery", "committee", "faculty"];

await mongoose.connect(process.env.MONGODB_URI);
const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });

let copied = 0;
let skipped = 0;
for (const folder of FOLDERS) {
  const names = await readdir(path.join(ROOT, folder)).catch(() => []);
  for (const name of names.filter((n) => n.endsWith(".webp"))) {
    const filename = `${folder}/${name}`;
    if (await bucket.find({ filename }).limit(1).hasNext()) {
      skipped++;
      continue;
    }
    const data = await readFile(path.join(ROOT, folder, name));
    const { width, height } = await sharp(data).metadata();
    await new Promise((resolve, reject) => {
      bucket.openUploadStream(filename, { metadata: { contentType: "image/webp", width, height } }).once("finish", resolve).once("error", reject).end(data);
    });
    copied++;
  }
}

console.log(`Copied ${copied} image(s) to MongoDB, ${skipped} already there.`);
await mongoose.disconnect();
