import "server-only";
import { generateObject } from "ai";
import { z } from "zod";
import { getAiClient, AI_MODEL } from "./client";
import { logAiRequest, logAiResponse, logAiError, summarise } from "./logger";
import type {
  FeedbackGenerateInput,
  FeedbackGenerateResult,
  AiError,
} from "./types";

// ---------------------------------------------------------------------------
// AI Feedback Assistant
// ---------------------------------------------------------------------------

const FEATURE = "feedback-generate" as const;

const feedbackSchema = z.object({
  feedback: z
    .string()
    .describe(
      "Draft feedback for the student. Maximum 3 sentences. Plain prose only — no markdown, no bullet points, no headers."
    ),
  improvementSuggestions: z
    .array(z.string())
    .max(3)
    .describe(
      "Up to 3 concrete, actionable suggestions the student can act on. One sentence each."
    ),
});

type GenerateFeedbackSuccess = { ok: true; data: FeedbackGenerateResult };
type GenerateFeedbackFailure = { ok: false; error: AiError };
export type GenerateFeedbackResponse =
  | GenerateFeedbackSuccess
  | GenerateFeedbackFailure;

export async function generateFeedback(
  input: FeedbackGenerateInput
): Promise<GenerateFeedbackResponse> {
  const startMs = Date.now();

  logAiRequest({
    feature: FEATURE,
    model: AI_MODEL,
    inputSummary: {
      assignment:   summarise(input.assignmentTitle),
      difficulty:   input.difficulty,
      status:       input.submissionStatus,
      studentNote:  summarise(input.studentNote),
      observations: summarise(input.instructorObservations),
    },
  });

  try {
    const client = getAiClient();

    const { object, usage } = await generateObject({
      model: client(AI_MODEL),
      schema: feedbackSchema,
      // Don't retry on billing/auth errors — fail fast instead of waiting 40s
      maxRetries: 0,
      system: `You are assisting an instructor reviewing a student's programming assignment submission.
Draft short, direct feedback the instructor will review before sending.
Rules:
- feedback: maximum 3 sentences. Plain prose, no markdown, no bullet points.
- improvementSuggestions: maximum 3 items, one sentence each.
- Do not make grading decisions or promise grade changes.
- Status is "${input.submissionStatus}". Difficulty: ${input.difficulty}.`,
      prompt: `Assignment: ${input.assignmentTitle}

Assignment description:
${input.assignmentDescription}

${input.studentNote ? `Student's note: ${input.studentNote}` : "The student did not leave a note."}

Instructor's observations:
${input.instructorObservations}

Please draft feedback for this student.`,
    });

    logAiResponse({
      feature: FEATURE,
      model: AI_MODEL,
      durationMs: Date.now() - startMs,
      usage: {
        promptTokens:     usage?.inputTokens,
        completionTokens: usage?.outputTokens,
        totalTokens:      usage?.totalTokens,
      },
      outputPreview: {
        feedback:             object.feedback,
        improvementSuggestions: object.improvementSuggestions,
      },
    });

    return { ok: true, data: object };
  } catch (err) {
    const error = classifyError(err);
    logAiError({
      feature:      FEATURE,
      model:        AI_MODEL,
      durationMs:   Date.now() - startMs,
      errorCode:    error.code,
      errorMessage: "message" in error ? error.message : undefined,
    });
    return { ok: false, error };
  }
}

// ---------------------------------------------------------------------------
// Error classification
// ---------------------------------------------------------------------------

function classifyError(err: unknown): AiError {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();

    if (msg === "missing_api_key" || msg.includes("api key")) {
      return { code: "missing_api_key" };
    }
    if (msg.includes("no credits") || msg.includes("insufficient_quota") || msg.includes("billing")) {
      return { code: "no_credits" };
    }
    if (msg.includes("rate limit") || msg.includes("429")) {
      return { code: "rate_limit" };
    }
    if (msg.includes("timeout") || msg.includes("timed out")) {
      return { code: "timeout" };
    }
    if (msg.includes("invalid") || msg.includes("parse")) {
      return { code: "invalid_response" };
    }
    return { code: "api_error", message: err.message };
  }
  return { code: "api_error", message: "An unexpected error occurred." };
}
