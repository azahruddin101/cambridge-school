// JWT helpers shared by proxy.js and server code. No database access here,
// so this stays light enough to run on every admin request.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "ecs_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) throw new Error("JWT_SECRET must be set to a random string of at least 32 characters.");
  return new TextEncoder().encode(value);
}

export async function signSession({ userId, username, tokenVersion }) {
  return new SignJWT({ username, ver: tokenVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret());
}

/** Returns the token payload, or null if it is missing, tampered with or expired. */
export async function verifySession(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null;
  }
}
