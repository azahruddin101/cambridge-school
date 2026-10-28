import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectDB } from "./db";
import { CommitteeMember, Faculty, FeeStructure, GalleryImage, StudentStrength } from "./models";

// Cache tags: admin Server Actions call updateTag() with these after saving,
// so public pages are prerendered from the database yet update immediately.
export const TAGS = {
  committee: "committee",
  faculty: "faculty",
  fees: "fees",
  strength: "strength",
  gallery: "gallery",
};

// Cached results must be plain, serializable objects
const plain = ({ _id, __v, createdAt, updatedAt, ...rest }) => ({ id: String(_id), ...rest });
const byOrder = { order: 1, createdAt: 1 };

export async function getCommittee() {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.committee);
  await connectDB();
  return (await CommitteeMember.find().sort(byOrder).lean()).map(plain);
}

export async function getFaculty() {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.faculty);
  await connectDB();
  return (await Faculty.find().sort(byOrder).lean()).map(plain);
}

export async function getGallery() {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.gallery);
  await connectDB();
  return (await GalleryImage.find().sort(byOrder).lean()).map(plain);
}

const EMPTY_FEES = { session: "", columns: [], rows: [], schedule: { columns: [], rows: [] } };

export async function getFees() {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.fees);
  await connectDB();
  const doc = await FeeStructure.findOne().lean();
  if (!doc) return EMPTY_FEES;
  const { session, columns, rows, schedule } = doc;
  return {
    session,
    columns,
    rows: rows.map(({ head, duration, values, inTotal }) => ({ head, duration, values, inTotal })),
    schedule: {
      columns: schedule?.columns ?? [],
      rows: (schedule?.rows ?? []).map(({ label, values }) => ({ label, values })),
    },
  };
}

export async function getStrength() {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.strength);
  await connectDB();
  const doc = await StudentStrength.findOne().lean();
  return (doc?.rows ?? []).map(({ cls, sections, boys, girls }) => ({ cls, sections, boys, girls }));
}

export function sumStrength(rows) {
  return rows.reduce(
    (acc, r) => ({ sections: acc.sections + r.sections, boys: acc.boys + r.boys, girls: acc.girls + r.girls }),
    { sections: 0, boys: 0, girls: 0 },
  );
}

/** Headline numbers for the home and About pages, derived from live data. */
export async function getStats() {
  const [strength, faculty] = await Promise.all([getStrength(), getFaculty()]);
  const totals = sumStrength(strength);
  const students = totals.boys + totals.girls;
  const teachers = faculty.length;

  return [
    { value: students, label: "Students enrolled" },
    { value: teachers, label: "Dedicated educators" },
    { value: strength.length, label: strength.length ? `Classes, ${strength[0].cls} to ${strength.at(-1).cls}` : "Classes", pad: true },
    ...(teachers ? [{ value: Math.round(students / teachers), prefix: "1:", label: "Teacher–student ratio" }] : []),
  ];
}
