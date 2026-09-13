import "server-only";
import { generateObject } from "ai";
import { z } from "zod";
import { getAiClient, AI_MODEL } from "./client";
import { logAiRequest, logAiResponse, logAiError, summarise } from "./logger";
import type {
  AssignmentImproveInput,
  AssignmentImproveResult,
  AiError,
} from "./types";

// ---------------------------------------------------------------------------
// AI Assignment Improvement
// ---------------------------------------------------------------------------

const FEATURE = "assignment-improve" as const;

const assignmentImproveSchema = z.object({
  improvedTitle: z
    .string()
    .describe("A clearer, more specific title for the assignment"),
  improvedDescription: z
    .string()
    .describe(
      "An improved description with clear goals, requirements, and deliverables"
    ),
  missingRequirements: z
    .array(z.string())
    .describe(
      "List of requirements or constraints that appear to be missing from the original description"
    ),
  evaluationCriteria: z
    .array(z.string())
    .describe(
      "Suggested evaluation criteria or rubric items the instructor could use to assess submissions"
    ),
});

type ImproveAssignmentSuccess = { ok: true; data: AssignmentImproveResult };
type ImproveAssignmentFailure = { ok: false; error: AiError };
export type ImproveAssignmentResponse =
  | ImproveAssignmentSuccess
  | ImproveAssignmentFailure;

export async function improveAssignment(
  input: AssignmentImproveInput
): Promise<ImproveAssignmentResponse> {
  const startMs = Date.now();

  logAiRequest({
    feature: FEATURE,
    model: AI_MODEL,
    inputSummary: {
      title:       summarise(input.title),
      description: summarise(input.description),
      difficulty:  input.difficulty,
    },
  });

  try {
    const client = getAiClient();

    const { object, usage } = await generateObject({
      model: client(AI_MODEL),
      schema: assignmentImproveSchema,
      // Don't retry on billing/auth errors — fail fast instead of waiting 40s
      maxRetries: 0,
      system: `You are an experienced educator helping instructors write better programming assignments.
Your job is to improve assignment clarity, add missing requirements, and suggest evaluation criteria.
Be concrete and specific. Write in the same style as the original. Do not invent new learning objectives.
Difficulty level: ${input.difficulty}.`,
      prompt: `Please improve this assignment.

Title: ${input.title}
Description:
${input.description}`,
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
        improvedTitle:        object.improvedTitle,
        improvedDescription:  object.improvedDescription,
        missingRequirements:  object.missingRequirements,
        evaluationCriteria:   object.evaluationCriteria,
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
