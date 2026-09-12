"use server";

import { redirect } from "next/navigation";
import { requireInstructor } from "@/lib/auth";
import { db } from "@/lib/db";
import { assignmentSchema } from "@/server/validations/assignment";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AssignmentFormState = {
  errors?: {
    title?: string[];
    description?: string[];
    deadline?: string[];
    difficulty?: string[];
  };
  message?: string;
} | null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    deadline: formData.get("deadline"),
    difficulty: formData.get("difficulty"),
  };
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export async function createAssignment(
  _state: AssignmentFormState,
  formData: FormData
): Promise<AssignmentFormState> {
  const session = await requireInstructor();

  const parsed = assignmentSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { title, description, deadline, difficulty } = parsed.data;

  const assignment = await db.assignment.create({
    data: {
      title,
      description,
      deadline: new Date(deadline),
      difficulty,
      createdBy: session.userId,
    },
  });

  redirect(`/instructor/assignments/${assignment.id}`);
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export async function updateAssignment(
  id: string,
  _state: AssignmentFormState,
  formData: FormData
): Promise<AssignmentFormState> {
  const session = await requireInstructor();

  // Verify ownership before parsing — fail fast on auth
  const existing = await db.assignment.findUnique({
    where: { id },
    select: { createdBy: true, archivedAt: true },
  });

  if (!existing || existing.createdBy !== session.userId) {
    return { message: "Assignment not found or you do not have permission to edit it." };
  }

  if (existing.archivedAt !== null) {
    return { message: "Archived assignments cannot be edited." };
  }

  const parsed = assignmentSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { title, description, deadline, difficulty } = parsed.data;

  await db.assignment.update({
    where: { id },
    data: {
      title,
      description,
      deadline: new Date(deadline),
      difficulty,
    },
  });

  redirect(`/instructor/assignments/${id}`);
}

// ---------------------------------------------------------------------------
// Archive (soft-delete)
// ---------------------------------------------------------------------------

export async function archiveAssignment(id: string): Promise<{ error?: string }> {
  const session = await requireInstructor();

  const existing = await db.assignment.findUnique({
    where: { id },
    select: { createdBy: true, archivedAt: true },
  });

  if (!existing || existing.createdBy !== session.userId) {
    return { error: "Assignment not found or you do not have permission." };
  }

  if (existing.archivedAt !== null) {
    return { error: "Assignment is already archived." };
  }

  await db.assignment.update({
    where: { id },
    data: { archivedAt: new Date() },
  });

  redirect("/instructor/assignments");
}

// ---------------------------------------------------------------------------
// Restore from archive
// ---------------------------------------------------------------------------

export async function restoreAssignment(id: string): Promise<{ error?: string }> {
  const session = await requireInstructor();

  const existing = await db.assignment.findUnique({
    where: { id },
    select: { createdBy: true },
  });

  if (!existing || existing.createdBy !== session.userId) {
    return { error: "Assignment not found or you do not have permission." };
  }

  await db.assignment.update({
    where: { id },
    data: { archivedAt: null },
  });

  redirect(`/instructor/assignments/${id}`);
}
