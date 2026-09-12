import "server-only";
import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "@/lib/session";

// ---------------------------------------------------------------------------
// Authorization helpers
// Each helper verifies the session server-side and redirects on failure.
// Hiding UI elements is NOT authorization — these must be called in server code.
// ---------------------------------------------------------------------------

/**
 * Require an authenticated session.
 * Redirects to /login if no valid session exists.
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/**
 * Require a specific role.
 * Redirects to /login if unauthenticated, /unauthorized if wrong role.
 */
export async function requireRole(
  role: "instructor" | "student"
): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== role) redirect("/unauthorized");
  return session;
}

/**
 * Require instructor role.
 */
export async function requireInstructor(): Promise<SessionPayload> {
  return requireRole("instructor");
}

/**
 * Require student role.
 */
export async function requireStudent(): Promise<SessionPayload> {
  return requireRole("student");
}
