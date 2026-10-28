import "server-only";
import mongoose from "mongoose";
import { unstable_rethrow as rethrow } from "next/navigation";
import { requireAdmin } from "./auth";
import { connectDB } from "./db";
import { UploadError } from "./uploads";

export class ValidationError extends Error {}

/**
 * Wraps an admin Server Action: checks the session, connects to the database,
 * and turns expected failures into a { ok, message } result for the form.
 */
export async function adminAction(fn) {
  try {
    await requireAdmin();
    await connectDB();
    const message = await fn();
    return { ok: true, message: message ?? "Saved." };
  } catch (error) {
    rethrow(error); // let redirect() and other Next.js control flow through
    if (error instanceof ValidationError || error instanceof UploadError) return { ok: false, message: error.message };
    console.error(error);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}

export function text(formData, key, { label = key, max = 120, required = false } = {}) {
  const value = String(formData.get(key) ?? "").trim();
  if (required && !value) throw new ValidationError(`${label} is required.`);
  if (value.length > max) throw new ValidationError(`${label} must be at most ${max} characters.`);
  return value;
}

export function objectId(value) {
  if (!mongoose.isValidObjectId(value)) throw new ValidationError("Item not found.");
  return String(value);
}

/** Moves a document one place up or down within a collection ordered by `order`. */
export async function moveInOrder(Model, id, direction) {
  const docs = await Model.find().sort({ order: 1, createdAt: 1 }).select("_id").lean();
  const from = docs.findIndex((d) => String(d._id) === id);
  const to = from + (direction === "up" ? -1 : 1);
  if (from < 0 || to < 0 || to >= docs.length) return;

  [docs[from], docs[to]] = [docs[to], docs[from]];
  await Model.bulkWrite(docs.map((d, order) => ({ updateOne: { filter: { _id: d._id }, update: { order } } })));
}

export async function nextOrder(Model) {
  const last = await Model.findOne().sort({ order: -1 }).select("order").lean();
  return (last?.order ?? -1) + 1;
}
