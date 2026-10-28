"use server";

import { updateTag } from "next/cache";
import { FeeStructure, GalleryImage, StudentStrength } from "@/lib/server/models";
import { TAGS } from "@/lib/server/data";
import { ValidationError, adminAction, moveInOrder, nextOrder, objectId, text } from "@/lib/server/admin";
import { deletePerson, movePerson, savePerson } from "@/lib/server/people";
import { deleteUpload, isFile, saveImage } from "@/lib/server/uploads";

/* ---------- Managing committee & faculty ---------- */

export async function savePersonAction(kind, _prevState, formData) {
  return adminAction(() => savePerson(kind, formData));
}

export async function deletePersonAction(kind, id) {
  return adminAction(() => deletePerson(kind, id));
}

export async function movePersonAction(kind, id, direction) {
  return adminAction(() => movePerson(kind, id, direction));
}

/* ---------- Gallery ---------- */

const MAX_FILES_PER_UPLOAD = 12;

export async function uploadGalleryImages(_prevState, formData) {
  return adminAction(async () => {
    const files = formData.getAll("files").filter(isFile);
    const alt = text(formData, "alt", { label: "Caption", max: 200 });
    if (!files.length) throw new ValidationError("Choose at least one photo.");
    if (files.length > MAX_FILES_PER_UPLOAD) throw new ValidationError(`Upload up to ${MAX_FILES_PER_UPLOAD} photos at a time.`);

    let order = await nextOrder(GalleryImage);
    for (const file of files) {
      const image = await saveImage(file, "gallery");
      await GalleryImage.create({ ...image, alt, order: order++ });
    }
    updateTag(TAGS.gallery);
    return files.length === 1 ? "Photo added." : `${files.length} photos added.`;
  });
}

export async function updateGalleryCaption(id, alt) {
  return adminAction(async () => {
    const caption = String(alt ?? "").trim();
    if (caption.length > 200) throw new ValidationError("Caption must be at most 200 characters.");
    await GalleryImage.updateOne({ _id: objectId(id) }, { alt: caption });
    updateTag(TAGS.gallery);
    return "Caption saved.";
  });
}

export async function deleteGalleryImage(id) {
  return adminAction(async () => {
    const doc = await GalleryImage.findByIdAndDelete(objectId(id));
    if (!doc) throw new ValidationError("This photo no longer exists.");
    await deleteUpload(doc.src);
    updateTag(TAGS.gallery);
    return "Photo deleted.";
  });
}

export async function moveGalleryImage(id, direction) {
  return adminAction(async () => {
    await moveInOrder(GalleryImage, objectId(id), direction);
    updateTag(TAGS.gallery);
    return "Order updated.";
  });
}

/* ---------- Fee structure & student strength tables ---------- */

const str = (value, label, max, required = true) => {
  const v = String(value ?? "").trim();
  if (required && !v) throw new ValidationError(`${label} can't be empty.`);
  if (v.length > max) throw new ValidationError(`${label} must be at most ${max} characters.`);
  return v;
};

const amount = (value, label, max = 10_000_000) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > max) throw new ValidationError(`${label} must be a number between 0 and ${max.toLocaleString("en-IN")}.`);
  return Math.round(n);
};

const list = (value, label, maxItems) => {
  if (!Array.isArray(value)) throw new ValidationError(`${label} is invalid.`);
  if (value.length > maxItems) throw new ValidationError(`${label}: at most ${maxItems} allowed.`);
  return value;
};

export async function saveFees(input) {
  return adminAction(async () => {
    const session = str(input?.session, "Session", 40, false);
    const columns = list(input?.columns, "Class groups", 8).map((c, i) => str(c, `Class group ${i + 1}`, 40));
    if (!columns.length) throw new ValidationError("Add at least one class group column.");

    const rows = list(input?.rows, "Fee heads", 30).map((row, i) => {
      const head = str(row?.head, `Fee head in row ${i + 1}`, 120);
      const values = list(row?.values, head, columns.length);
      if (values.length !== columns.length) throw new ValidationError(`${head}: fill in an amount for every class group.`);
      return { head, duration: str(row?.duration, `Duration for ${head}`, 40, false), values: values.map((v) => amount(v, head)), inTotal: Boolean(row?.inTotal) };
    });

    const months = list(input?.schedule?.columns, "Schedule columns", 12).map((c, i) => str(c, `Schedule column ${i + 1}`, 40));
    const scheduleRows = list(input?.schedule?.rows, "Schedule rows", 20).map((row, i) => {
      const label = str(row?.label, `Class in schedule row ${i + 1}`, 60);
      const values = list(row?.values, label, months.length);
      if (values.length !== months.length) throw new ValidationError(`${label}: fill in an amount for every schedule column.`);
      return { label, values: values.map((v) => amount(v, label)) };
    });

    await FeeStructure.findOneAndUpdate({}, { session, columns, rows, schedule: { columns: months, rows: scheduleRows } }, { upsert: true });
    updateTag(TAGS.fees);
    return "Fee structure saved.";
  });
}

export async function saveStrength(input) {
  return adminAction(async () => {
    const rows = list(input, "Classes", 20).map((row, i) => {
      const cls = str(row?.cls, `Class in row ${i + 1}`, 20);
      return {
        cls,
        sections: amount(row?.sections, `Sections for class ${cls}`, 50),
        boys: amount(row?.boys, `Boys in class ${cls}`, 2000),
        girls: amount(row?.girls, `Girls in class ${cls}`, 2000),
      };
    });

    await StudentStrength.findOneAndUpdate({}, { rows }, { upsert: true });
    // Student totals feed the home page stats too, which read this tag
    updateTag(TAGS.strength);
    return "Student strength saved.";
  });
}
