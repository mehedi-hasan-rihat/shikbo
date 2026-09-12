import { z } from "zod";

// ---------------------------------------------------------------------------
// Submission form schema
// ---------------------------------------------------------------------------

export const submissionSchema = z.object({
  url: z
    .string()
    .min(1, "Project URL is required")
    .max(2000, "URL must be at most 2,000 characters")
    .trim()
    .refine((val) => {
      try {
        const u = new URL(val);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    }, "Must be a valid URL (e.g. https://github.com/you/project)"),

  note: z
    .string()
    .max(2000, "Note must be at most 2,000 characters")
    .trim()
    .optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
