"use server";

import { requireInstructor } from "@/lib/auth";
import { improveAssignment } from "@/lib/ai/assignment";
import { generateFeedback } from "@/lib/ai/feedback";
import {
  assignmentImproveInputSchema,
  feedbackGenerateInputSchema,
} from "@/server/validations/ai";
import type { AssignmentImproveResult, FeedbackGenerateResult } from "@/lib/ai/types";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export type AiActionState<T> = {
  status: "idle" | "success" | "error";
  data?: T;
  error?: string;
} | null;

export type ImproveAssignmentState = AiActionState<AssignmentImproveResult>;
export type GenerateFeedbackState = AiActionState<FeedbackGenerateResult>;

// ---------------------------------------------------------------------------
// Improve assignment (SHK-031)
// ---------------------------------------------------------------------------

export async function improveAssignmentAction(
  _state: ImproveAssignmentState,
  formData: FormData
): Promise<ImproveAssignmentState> {
  await requireInstructor();

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    difficulty: formData.get("difficulty"),
  };

  const parsed = assignmentImproveInputSchema.safeParse(raw);
  if (!parsed.success) {
    const messages = Object.values(parsed.error.flatten().fieldErrors)
      .flat()
      .join("; ");
    return { status: "error", error: messages || "Invalid input." };
  }

  const result = await improveAssignment(parsed.data);

  if (!result.ok) {
    return { status: "error", error: formatAiError(result.error) };
  }

  return { status: "success", data: result.data };
}

// ---------------------------------------------------------------------------
// Generate feedback draft (SHK-033)
// ---------------------------------------------------------------------------

export async function generateFeedbackAction(
  _state: GenerateFeedbackState,
  formData: FormData
): Promise<GenerateFeedbackState> {
  await requireInstructor();

  const raw = {
    assignmentTitle: formData.get("assignmentTitle"),
    assignmentDescription: formData.get("assignmentDescription"),
    difficulty: formData.get("difficulty"),
    studentNote: formData.get("studentNote") || null,
    instructorObservations: formData.get("instructorObservations"),
    submissionStatus: formData.get("submissionStatus"),
  };

  const parsed = feedbackGenerateInputSchema.safeParse(raw);
  if (!parsed.success) {
    const messages = Object.values(parsed.error.flatten().fieldErrors)
      .flat()
      .join("; ");
    return { status: "error", error: messages || "Invalid input." };
  }

  const result = await generateFeedback(parsed.data);

  if (!result.ok) {
    return { status: "error", error: formatAiError(result.error) };
  }

  return { status: "success", data: result.data };
}

// ---------------------------------------------------------------------------
// Error message formatting (SHK-035)
// ---------------------------------------------------------------------------

function formatAiError(
  error: import("@/lib/ai/types").AiError
): string {
  switch (error.code) {
    case "missing_api_key":
      return "AI is not configured (missing API key). You can still review submissions manually.";
    case "no_credits":
      return "AI account has no credits remaining. Add credits at openrouter.ai, or continue manually.";
    case "rate_limit":
      return "AI is temporarily unavailable (rate limit reached). Please try again in a moment, or continue manually.";
    case "timeout":
      return "The AI request timed out. Please try again, or continue manually.";
    case "invalid_response":
      return "AI returned an unexpected response. Please try again, or continue manually.";
    case "api_error":
      return `AI service error: ${error.message}. You can continue manually.`;
  }
}
