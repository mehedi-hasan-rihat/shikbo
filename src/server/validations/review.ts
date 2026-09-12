import { z } from "zod";

// ---------------------------------------------------------------------------
// Review form schema
// ---------------------------------------------------------------------------

export const reviewSchema = z.object({
  status: z.enum(["pending", "accepted", "needs_improvement"], {
    error: "Status must be pending, accepted, or needs_improvement",
  }),

  feedback: z
    .string()
    .max(5000, "Feedback must be at most 5,000 characters")
    .trim()
    .optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
