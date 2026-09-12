"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import {
  registerSchema,
  loginSchema,
} from "@/server/validations/auth";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AuthState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
  };
  message?: string;
} | null;

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------

export async function register(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };

  const parsed = registerSchema.safeParse(raw);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password, role } = parsed.data;

  // Check for existing account
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { errors: { email: ["An account with this email already exists"] } };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: { name, email, passwordHash, role },
  });

  await createSession(user.id, user.role);

  redirect(user.role === "instructor" ? "/instructor/dashboard" : "/student/dashboard");
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export async function login(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });

  // Use a consistent-time compare regardless of whether the user exists
  // to prevent user enumeration via timing attacks.
  const dummyHash = "$2b$12$invalidhashfortimingprotection00000000000000000000000";
  const valid = await bcrypt.compare(
    password,
    user?.passwordHash ?? dummyHash
  );

  if (!user || !valid) {
    return { message: "Invalid email or password" };
  }

  await createSession(user.id, user.role);

  redirect(user.role === "instructor" ? "/instructor/dashboard" : "/student/dashboard");
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
