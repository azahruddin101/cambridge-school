"use server";

import { headers } from "next/headers";
import { connectDB } from "@/lib/server/db";
import { Enquiry } from "@/lib/server/models";
import { enquiryClasses } from "@/data/site";

// Light spam protection, no CAPTCHA:
// - a hidden "website" field that people never see but bots tend to fill in
// - a minimum time between the form appearing and being submitted
// - at most 5 enquiries per IP per hour (in memory, per server instance)
const MIN_FILL_MS = 2500;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map();

function overLimit(ip) {
  const now = Date.now();
  const times = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.set(ip, times);
  if (times.length >= MAX_PER_WINDOW) return true;
  times.push(now);
  return false;
}

/** Accepts Indian numbers with or without +91 / 0, returning "+91 XXXXX XXXXX". */
function normalisePhone(raw) {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (!/^[6-9]\d{9}$/.test(digits)) return null;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

const OK = { ok: true, message: "Thank you! We've received your enquiry and will call you soon." };

export async function submitEnquiry(_prevState, formData) {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    studentClass: String(formData.get("studentClass") ?? ""),
    message: String(formData.get("message") ?? "").trim(),
  };

  // Likely a bot: report success without saving anything
  const startedAt = Number(formData.get("startedAt"));
  if (formData.get("website") || !startedAt || Date.now() - startedAt < MIN_FILL_MS) return OK;

  const errors = {};
  if (values.name.length < 2) errors.name = "Please enter your name.";
  else if (values.name.length > 100) errors.name = "Name is too long.";
  const phone = normalisePhone(values.phone);
  if (!phone) errors.phone = "Please enter a valid 10-digit mobile number.";
  if (values.email && (values.email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))) errors.email = "Please enter a valid email address.";
  if (!enquiryClasses.includes(values.studentClass)) errors.studentClass = "Please choose a class.";
  if (values.message.length > 1000) errors.message = "Please keep your message under 1000 characters.";
  if (Object.keys(errors).length) return { ok: false, message: "Please check the highlighted fields.", errors, values };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (overLimit(ip)) return { ok: false, message: "You've sent several enquiries recently. Please call us instead.", values };

  try {
    await connectDB();
    await Enquiry.create({ ...values, phone });
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Sorry, we couldn't send your enquiry. Please try again or call us.", values };
  }
  return OK;
}
