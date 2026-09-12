import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/session";
import { loginSchema } from "@/server/validations/auth";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { email, password } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });

  // Consistent-time comparison to prevent user enumeration
  const dummyHash = "$2b$12$invalidhashfortimingprotection00000000000000000000000";
  const valid = await bcrypt.compare(password, user?.passwordHash ?? dummyHash);

  if (!user || !valid) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  await createSession(user.id, user.role);

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
