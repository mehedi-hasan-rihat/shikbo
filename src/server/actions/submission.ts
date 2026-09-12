"use server";

import { redirect } from "next/navigation";
import { requireStudent } from "@/lib/auth";
import { db } from "@/lib/db";
import { submissionSchema } from "@/server/validations/submission";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SubmissionFormState = {
  errors?: {
    url?: string[];
    note?: string[];
  };
  message?: string;
} | null;

// ---------------------------------------------------------------------------
// Create submission
// ---------------------------------------------------------------------------

export async function createSubmission(
  assignmentId: string,
  _state: SubmissionFormState,
  formData: FormData
): Promise<SubmissionFormState> {
  const session = await requireStudent();

  // Verify the assignment exists, is active (not archived), and deadline has not passed
  const assignment = await db.assignment.findUnique({
    where: { id: assignmentId },
    select: { id: true, archivedAt: true, deadline: true },
  });

  if (!assignment || assignment.archivedAt !== null) {
    return { message: "Assignment not found or is no longer available." };
  }

  if (assignment.deadline < new Date()) {
    return { message: "The deadline for this assignment has passed." };
  }

  // Validate input
  const raw = {
    url: formData.get("url"),
    note: formData.get("note") || undefined,
  };

  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { url, note } = parsed.data;

  await db.submission.create({
    data: {
      assignmentId,
      studentId: session.userId,
      url,
      note: note ?? null,
      status: "pending",
    },
  });

  redirect(`/student/assignments/${assignmentId}`);
}
