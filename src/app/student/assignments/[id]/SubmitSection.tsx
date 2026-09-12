"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SubmissionForm } from "@/components/assignments/SubmissionForm";
import type { SubmissionFormState } from "@/server/actions/submission";

type SubmitSectionProps = {
  /** Bound server action (already has assignmentId curried in) */
  action: (
    state: SubmissionFormState,
    formData: FormData
  ) => Promise<SubmissionFormState>;
  /** Whether the assignment deadline has passed */
  isClosed: boolean;
  /** Pre-fill from last submission for resubmission convenience */
  lastUrl?: string;
  lastNote?: string;
  /** Whether this is a resubmission */
  hasExisting: boolean;
};

export function SubmitSection({
  action,
  isClosed,
  lastUrl,
  lastNote,
  hasExisting,
}: SubmitSectionProps) {
  const [open, setOpen] = useState(false);

  if (isClosed) {
    return (
      <p style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
        The deadline has passed. Submissions are closed.
      </p>
    );
  }

  if (!open) {
    return (
      <Button variant="primary" onClick={() => setOpen(true)}>
        {hasExisting ? "Resubmit" : "Submit work"}
      </Button>
    );
  }

  return (
    <SubmissionForm
      action={action}
      defaultUrl={lastUrl}
      defaultNote={lastNote}
      submitLabel={hasExisting ? "Resubmit" : "Submit"}
      onCancel={() => setOpen(false)}
    />
  );
}
