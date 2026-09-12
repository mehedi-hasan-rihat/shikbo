"use server";

import { redirect } from "next/navigation";
import { requireInstructor } from "@/lib/auth";
import { db } from "@/lib/db";
import { reviewSchema } from "@/server/validations/review";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ReviewFormState = {
  errors?: {
    status?: string[];
    feedback?: string[];
  };
  message?: string;
} | null;

// ---------------------------------------------------------------------------
// Review a submission
// ---------------------------------------------------------------------------

export async function reviewSubmission(
  submissionId: string,
  _state: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const session = await requireInstructor();

  // Load the submission and verify the instructor owns the assignment
  const submission = await db.submission.findUnique({
    where: { id: submissionId },
    include: {
      assignment: { select: { createdBy: true } },
    },
  });

  if (!submission) {
    return { message: "Submission not found." };
  }

  if (submission.assignment.createdBy !== session.userId) {
    return { message: "You do not have permission to review this submission." };
  }

  const raw = {
    status: formData.get("status"),
    feedback: formData.get("feedback") || undefined,
  };

  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { status, feedback } = parsed.data;

  await db.submission.update({
    where: { id: submissionId },
    data: {
      status,
      feedback: feedback ?? null,
      reviewedAt: new Date(),
    },
  });

  redirect(`/instructor/submissions/${submissionId}`);
}
