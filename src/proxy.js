import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// Optimistic gate for the admin panel: bounces visitors without a valid token
// to the login page. Every admin page and action still calls requireAdmin().
export async function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  const onLogin = pathname === "/admin/login";

  if (!session && !onLogin) {
    const url = new URL("/admin/login", request.url);
    if (pathname !== "/admin") url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  // Signed-in admins visiting /admin/login are redirected by the page itself,
  // after a full check (a validly signed token can still be revoked).
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
