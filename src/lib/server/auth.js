import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "./db";
import { AdminUser } from "./models";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "@/lib/session";

export async function startSession(user) {
  const token = await signSession({ userId: String(user._id), username: user.username, tokenVersion: user.tokenVersion });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/**
 * The signed-in admin, or null. Unlike the proxy's quick signature check,
 * this confirms the account still exists and the password hasn't changed.
 */
export async function getAdmin() {
  const payload = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!payload?.sub) return null;

  await connectDB();
  const user = await AdminUser.findById(payload.sub).lean();
  if (!user || user.tokenVersion !== payload.ver) return null;
  return { id: String(user._id), username: user.username };
}

/** Use at the top of every admin page and Server Action. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
