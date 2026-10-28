import "server-only";
import { updateTag } from "next/cache";
import { CommitteeMember, Faculty } from "./models";
import { TAGS } from "./data";
import { ValidationError, moveInOrder, nextOrder, objectId, text } from "./admin";
import { deleteUpload, isFile, saveImage } from "./uploads";

// Managing committee and faculty share the same shape: name, role, an optional
// photo, plus one extra text field each.
const KINDS = {
  committee: { Model: CommitteeMember, tag: TAGS.committee, folder: "committee", extra: { key: "place", label: "Place" } },
  faculty: { Model: Faculty, tag: TAGS.faculty, folder: "faculty", extra: { key: "qualification", label: "Qualification" } },
};

function kindOf(kind) {
  const config = KINDS[kind];
  if (!config) throw new ValidationError("Unknown section.");
  return config;
}

export async function savePerson(kind, formData) {
  const { Model, tag, folder, extra } = kindOf(kind);
  const id = formData.get("id") ? objectId(formData.get("id")) : null;

  const fields = {
    name: text(formData, "name", { label: "Name", required: true }),
    role: text(formData, "role", { label: kind === "faculty" ? "Designation" : "Role", max: 80, required: true }),
    [extra.key]: text(formData, extra.key, { label: extra.label }),
  };

  const existing = id ? await Model.findById(id) : null;
  if (id && !existing) throw new ValidationError("This entry no longer exists.");

  const photo = formData.get("photo");
  const oldPhoto = existing?.photo;
  if (isFile(photo)) {
    fields.photo = (await saveImage(photo, folder, { maxWidth: 600 })).src;
  } else if (formData.get("removePhoto") === "on") {
    fields.photo = "";
  }

  if (existing) {
    await Model.updateOne({ _id: id }, fields);
  } else {
    await Model.create({ ...fields, order: await nextOrder(Model) });
  }
  if (oldPhoto && fields.photo !== undefined && fields.photo !== oldPhoto) await deleteUpload(oldPhoto);

  updateTag(tag);
  return existing ? `${fields.name} updated.` : `${fields.name} added.`;
}

export async function deletePerson(kind, id) {
  const { Model, tag } = kindOf(kind);
  const doc = await Model.findByIdAndDelete(objectId(id));
  if (!doc) throw new ValidationError("This entry no longer exists.");
  if (doc.photo) await deleteUpload(doc.photo);
  updateTag(tag);
  return `${doc.name} removed.`;
}

export async function movePerson(kind, id, direction) {
  const { Model, tag } = kindOf(kind);
  await moveInOrder(Model, objectId(id), direction);
  updateTag(tag);
  return "Order updated.";
}
