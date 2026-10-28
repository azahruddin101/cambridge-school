"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/server/db";
import { AdminUser } from "@/lib/server/models";
import { endSession, requireAdmin, startSession } from "@/lib/server/auth";
import { ValidationError, adminAction } from "@/lib/server/admin";

// Basic brute-force protection: 5 failed attempts per IP+username per 15 minutes.
// In-memory, so it resets on restart and isn't shared across server instances.
const failures = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

// Compared against when the username doesn't exist, so response time doesn't reveal valid usernames
const DUMMY_HASH = bcrypt.hashSync("no-such-user", 12);

function attemptsKey(ip, username) {
  return `${ip}|${username}`;
}

function isLocked(key) {
  const entry = failures.get(key);
  if (!entry || Date.now() - entry.first > WINDOW_MS) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

function recordFailure(key) {
  const entry = failures.get(key);
  if (!entry || Date.now() - entry.first > WINDOW_MS) failures.set(key, { count: 1, first: Date.now() });
  else entry.count += 1;
}

export async function login(_prevState, formData) {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");
  if (!username || !password) return { ok: false, message: "Enter your username and password." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const key = attemptsKey(ip, username);
  if (isLocked(key)) return { ok: false, message: "Too many attempts. Please wait 15 minutes and try again." };

  await connectDB();
  const user = await AdminUser.findOne({ username });
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid) {
    recordFailure(key);
    return { ok: false, message: "Incorrect username or password." };
  }

  failures.delete(key);
  await startSession(user);
  // Only follow internal admin paths, never an arbitrary URL
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export async function changePassword(_prevState, formData) {
  return adminAction(async () => {
    const admin = await requireAdmin();
    const current = String(formData.get("current") ?? "");
    const next = String(formData.get("next") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    if (next.length < 10) throw new ValidationError("The new password must be at least 10 characters.");
    if (next !== confirm) throw new ValidationError("The new passwords don't match.");

    const user = await AdminUser.findById(admin.id);
    if (!user || !(await bcrypt.compare(current, user.passwordHash))) throw new ValidationError("Your current password is incorrect.");

    user.passwordHash = await bcrypt.hash(next, 12);
    user.tokenVersion += 1; // signs out every other session
    await user.save();
    await startSession(user);
    return "Password changed. Other devices have been signed out.";
  });
}

