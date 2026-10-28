import mongoose, { Schema } from "mongoose";

// `models.X ??` guards against re-registering a model on hot reload
const model = (name, schema) => mongoose.models[name] ?? mongoose.model(name, schema);

const person = {
  name: { type: String, required: true, trim: true, maxlength: 120 },
  role: { type: String, required: true, trim: true, maxlength: 80 },
  photo: { type: String, default: "" },
  order: { type: Number, default: 0, index: true },
};

export const CommitteeMember = model(
  "CommitteeMember",
  new Schema({ ...person, place: { type: String, trim: true, maxlength: 120, default: "" } }, { timestamps: true }),
);

export const Faculty = model(
  "Faculty",
  new Schema({ ...person, qualification: { type: String, trim: true, maxlength: 120, default: "" } }, { timestamps: true }),
);

export const GalleryImage = model(
  "GalleryImage",
  new Schema(
    {
      src: { type: String, required: true },
      alt: { type: String, trim: true, maxlength: 200, default: "" },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      order: { type: Number, default: 0, index: true },
    },
    { timestamps: true },
  ),
);

// Fee structure and student strength are single documents, each edited as a whole table
export const FeeStructure = model(
  "FeeStructure",
  new Schema(
    {
      session: { type: String, trim: true, default: "" },
      columns: [{ type: String, trim: true }],
      rows: [
        {
          _id: false,
          head: { type: String, trim: true },
          duration: { type: String, trim: true },
          values: [Number],
          inTotal: { type: Boolean, default: true },
        },
      ],
      schedule: {
        columns: [{ type: String, trim: true }],
        rows: [{ _id: false, label: { type: String, trim: true }, values: [Number] }],
      },
    },
    { timestamps: true },
  ),
);

export const StudentStrength = model(
  "StudentStrength",
  new Schema(
    {
      rows: [
        {
          _id: false,
          cls: { type: String, trim: true },
          sections: { type: Number, min: 0 },
          boys: { type: Number, min: 0 },
          girls: { type: Number, min: 0 },
        },
      ],
    },
    { timestamps: true },
  ),
);

export const AdminUser = model(
  "AdminUser",
  new Schema(
    {
      username: { type: String, required: true, unique: true, trim: true, lowercase: true },
      passwordHash: { type: String, required: true },
      // Bumped on password change so existing sessions stop working
      tokenVersion: { type: Number, default: 0 },
    },
    { timestamps: true },
  ),
);

export const ENQUIRY_STATUSES = ["new", "contacted", "closed"];

// Admission enquiries submitted through the contact form
export const Enquiry = model(
  "Enquiry",
  new Schema(
    {
      name: { type: String, required: true, trim: true, maxlength: 100 },
      phone: { type: String, required: true, trim: true, maxlength: 20 },
      email: { type: String, trim: true, lowercase: true, maxlength: 120, default: "" },
      studentClass: { type: String, trim: true, maxlength: 40, default: "" },
      message: { type: String, trim: true, maxlength: 1000, default: "" },
      status: { type: String, enum: ENQUIRY_STATUSES, default: "new", index: true },
    },
    { timestamps: true },
  ),
);
