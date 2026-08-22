import { NextResponse } from "next/server";

// Protects /admin with a simple username/password prompt (HTTP Basic Auth).
// Good enough for launch; swap for Supabase Auth + a real login page later
// if you want per-organizer accounts or an audit trail.
export function middleware(req) {
  const authHeader = req.headers.get("authorization");
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  if (authHeader) {
    const encoded = authHeader.split(" ")[1] || "";
    const decoded = Buffer.from(encoded, "base64").toString();
    const [u, p] = decoded.split(":");
    if (u === user && p === pass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Phoenix Admin"' },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
