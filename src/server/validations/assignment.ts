import { z } from "zod";

// ---------------------------------------------------------------------------
// Assignment form schema
// ---------------------------------------------------------------------------

export const assignmentSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters")
    .trim(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(10000, "Description must be at most 10,000 characters")
    .trim(),

  // Deadline comes from a datetime-local input as a string like "2026-09-30T23:59"
  deadline: z
    .string()
    .min(1, "Deadline is required")
    .refine((val) => !isNaN(Date.parse(val)), "Deadline must be a valid date")
    .refine(
      (val) => new Date(val) > new Date(),
      "Deadline must be in the future"
    ),

  difficulty: z.enum(["beginner", "intermediate", "advanced"], {
    error: "Difficulty must be beginner, intermediate, or advanced",
  }),
});

export type AssignmentInput = z.infer<typeof assignmentSchema>;
