import { z } from "zod";

// ---------------------------------------------------------------------------
// Assignment improvement input
// ---------------------------------------------------------------------------

export const assignmentImproveInputSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200)
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(10000)
    .trim(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
});

// ---------------------------------------------------------------------------
// Feedback generation input
// ---------------------------------------------------------------------------

export const feedbackGenerateInputSchema = z.object({
  assignmentTitle: z.string().min(1).max(200).trim(),
  assignmentDescription: z.string().min(1).max(10000).trim(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  studentNote: z.string().max(2000).trim().nullable(),
  instructorObservations: z
    .string()
    .min(1, "Observations are required")
    .max(5000, "Observations must be at most 5,000 characters")
    .trim(),
  submissionStatus: z.enum(["pending", "accepted", "needs_improvement"]),
});
