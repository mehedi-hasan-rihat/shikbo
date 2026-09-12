"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
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
};

export function ReviewForm({
  action,
  defaultStatus = "pending",
  defaultFeedback = "",
}: ReviewFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
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
  );
}
