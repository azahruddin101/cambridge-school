/**
 * Creates the first admin account and imports the initial content.
 * Safe to re-run: it only fills collections that are still empty, so it never
 * overwrites changes made in the admin panel.
 *
 * Usage: npm run seed   (reads MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD from .env.local)
 */
import { randomUUID } from "node:crypto";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { AdminUser, CommitteeMember, Faculty, FeeStructure, GalleryImage, StudentStrength } from "../src/lib/server/models.js";
import * as data from "./seed-data.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const UPLOAD_ROOT = path.resolve(ROOT, process.env.UPLOAD_DIR || "uploads");
const { MONGODB_URI, ADMIN_USERNAME = "admin", ADMIN_PASSWORD } = process.env;

if (!MONGODB_URI) throw new Error("MONGODB_URI is not set (see .env.example).");

await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
console.log(`Connected to ${mongoose.connection.name}`);

const withOrder = (items) => items.map((item, order) => ({ ...item, order }));

async function seedIfEmpty(Model, label, create) {
  if ((await Model.estimatedDocumentCount()) > 0) return console.log(`  ${label.padEnd(18)} already has data, skipped`);
  const count = await create();
  console.log(`  ${label.padEnd(18)} added ${count}`);
}

// Admin account
const username = ADMIN_USERNAME.toLowerCase();
if (await AdminUser.exists({ username })) {
  console.log(`  ${"admin user".padEnd(18)} "${username}" exists, skipped`);
} else {
  if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 10) throw new Error("Set ADMIN_PASSWORD (10+ characters) in .env.local.");
  await AdminUser.create({ username, passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12) });
  console.log(`  ${"admin user".padEnd(18)} created "${username}"`);
}

await seedIfEmpty(CommitteeMember, "managing committee", async () => (await CommitteeMember.insertMany(withOrder(data.committee))).length);
await seedIfEmpty(Faculty, "faculty", async () => (await Faculty.insertMany(withOrder(data.faculty))).length);
await seedIfEmpty(FeeStructure, "fee structure", async () => (await FeeStructure.create(data.fees), 1));
await seedIfEmpty(StudentStrength, "student strength", async () => (await StudentStrength.create({ rows: data.strength }), 1));

await seedIfEmpty(GalleryImage, "gallery", async () => {
  // Copy the starter photos into uploads/ so they're managed like any upload
  const dir = path.join(UPLOAD_ROOT, "gallery");
  await mkdir(dir, { recursive: true });
  const docs = [];
  for (const [order, image] of data.gallery.entries()) {
    const name = `${randomUUID()}.webp`;
    await copyFile(path.join(ROOT, "public", image.src), path.join(dir, name));
    docs.push({ src: `/uploads/gallery/${name}`, alt: image.alt, width: image.width, height: image.height, order });
  }
  return (await GalleryImage.insertMany(docs)).length;
});

await mongoose.disconnect();
console.log("Done.");
