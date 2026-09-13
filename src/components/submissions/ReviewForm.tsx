"use client";

import { useActionState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { FeedbackAssistant } from "@/components/submissions/FeedbackAssistant";
import type { ReviewFormState } from "@/server/actions/review";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "needs_improvement", label: "Needs Improvement" },
];

type ReviewFormProps = {
  action: (
    state: ReviewFormState,
    formData: FormData
  ) => Promise<ReviewFormState>;
  defaultStatus?: string;
  defaultFeedback?: string;
  /** AI assistant context — if omitted, AI assistant is not shown */
  aiContext?: {
    assignmentTitle: string;
    assignmentDescription: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    studentNote: string | null;
    submissionStatus: "pending" | "accepted" | "needs_improvement";
  };
};

export function ReviewForm({
  action,
  defaultStatus = "pending",
  defaultFeedback = "",
  aiContext,
}: ReviewFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const feedbackRef = useRef<HTMLTextAreaElement>(null);

  const handleApplyAiFeedback = useCallback((feedback: string) => {
    if (feedbackRef.current) {
      // Strip markdown before populating — the model returns **bold**, - bullets etc.
      feedbackRef.current.value = stripMarkdown(feedback);
      feedbackRef.current.dispatchEvent(new Event("input", { bubbles: true }));
      // Scroll to and focus the feedback field so the instructor sees it immediately
      feedbackRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      feedbackRef.current.focus({ preventScroll: true });
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      {/* AI Feedback Assistant (SHK-033, SHK-034) — instructor only, above the form */}
      {aiContext && (
        <FeedbackAssistant
          assignmentTitle={aiContext.assignmentTitle}
          assignmentDescription={aiContext.assignmentDescription}
          difficulty={aiContext.difficulty}
          studentNote={aiContext.studentNote}
          submissionStatus={aiContext.submissionStatus}
          onApply={handleApplyAiFeedback}
        />
      )}

      <form action={formAction} noValidate>
        {state?.message && (
          <div
            className="callout callout-danger"
            style={{ marginBottom: "var(--space-5)" }}
          >
            {state.message}
          </div>
        )}

        <div
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}
        >
          <Select
            label="Status"
            name="status"
            id="review-status"
            required
            options={STATUS_OPTIONS}
            defaultValue={defaultStatus}
            error={state?.errors?.status?.[0]}
          />

          <Textarea
            ref={feedbackRef}
            label="Feedback"
            name="feedback"
            id="review-feedback"
            placeholder="Write actionable feedback for the student…"
            defaultValue={defaultFeedback}
            error={state?.errors?.feedback?.[0]}
            hint="Optional — max 5,000 characters"
            style={{ minHeight: 120 }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "var(--space-6)",
            paddingTop: "var(--space-5)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <Button type="submit" variant="primary" loading={isPending}>
            Save review
          </Button>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Markdown stripper
// The AI model returns markdown. Strip to plain text before putting it in the
// feedback textarea so it reads naturally without raw syntax characters.
// ---------------------------------------------------------------------------

function stripMarkdown(text: string): string {
  return text
    // Headers: ## Heading → Heading
    .replace(/^#{1,6}\s+/gm, "")
    // Bold+italic: ***text***
    .replace(/\*{3}([\s\S]+?)\*{3}/g, "$1")
    .replace(/_{3}([\s\S]+?)_{3}/g, "$1")
    // Bold: **text** or __text__
    .replace(/\*{2}([\s\S]+?)\*{2}/g, "$1")
    .replace(/_{2}([\s\S]+?)_{2}/g, "$1")
    // Italic: *text* or _text_ (single, not touching word boundaries to avoid false matches)
    .replace(/\*([^*\n]+?)\*/g, "$1")
    .replace(/_([^_\n]+?)_/g, "$1")
    // Inline code: `code`
    .replace(/`([^`]+)`/g, "$1")
    // Unordered list markers: keep the dash but normalise spacing
    .replace(/^[ \t]*[-*+]\s+/gm, "- ")
    // Ordered list markers: keep the number
    .replace(/^[ \t]*\d+\.\s+/gm, (m) => m.trim() + " ")
    // Horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, "")
    // Blockquotes
    .replace(/^>\s*/gm, "")
    // Collapse 3+ blank lines to 2
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
