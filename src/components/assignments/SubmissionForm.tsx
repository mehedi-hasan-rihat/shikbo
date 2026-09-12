"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { SubmissionFormState } from "@/server/actions/submission";

type SubmissionFormProps = {
  action: (
    state: SubmissionFormState,
    formData: FormData
  ) => Promise<SubmissionFormState>;
  /** Pre-fill URL for resubmission */
  defaultUrl?: string;
  /** Pre-fill note for resubmission */
  defaultNote?: string;
  submitLabel?: string;
  onCancel?: () => void;
};

export function SubmissionForm({
  action,
  defaultUrl = "",
  defaultNote = "",
  submitLabel = "Submit",
  onCancel,
}: SubmissionFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} noValidate>
      {/* Top-level server error */}
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
        <Input
          label="Project URL"
          name="url"
          id="submission-url"
          type="url"
          required
          placeholder="https://github.com/you/project"
          defaultValue={defaultUrl}
          error={state?.errors?.url?.[0]}
          autoFocus
        />

        <Textarea
          label="Note"
          name="note"
          id="submission-note"
          placeholder="Briefly describe what you built, any challenges, or questions for your instructor…"
          defaultValue={defaultNote}
          error={state?.errors?.note?.[0]}
          hint="Optional — max 2,000 characters"
          style={{ minHeight: 100 }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "var(--space-2)",
          marginTop: "var(--space-6)",
          paddingTop: "var(--space-5)",
          borderTop: "1px solid var(--border)",
        }}
      >
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={isPending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
