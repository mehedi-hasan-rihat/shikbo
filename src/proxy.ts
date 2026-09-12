import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

// Routes that require a logged-in user
const PROTECTED_PREFIXES = ["/instructor", "/student"];

// Routes that require a specific role
const ROLE_ROUTES: Record<string, "instructor" | "student"> = {
  "/instructor": "instructor",
  "/student": "student",
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("session")?.value;
  const session = await decrypt(token);

  // Not authenticated → login
  if (!session) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Wrong role → unauthorized
  for (const [prefix, role] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix) && session.role !== role) {
      const unauthorizedUrl = req.nextUrl.clone();
      unauthorizedUrl.pathname = "/unauthorized";
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/instructor/:path*", "/student/:path*"],
};
