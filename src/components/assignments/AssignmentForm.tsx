"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import type { AssignmentFormState } from "@/server/actions/assignment";

const DIFFICULTY_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

type AssignmentFormProps = {
  /** Server action to bind to the form */
  action: (state: AssignmentFormState, formData: FormData) => Promise<AssignmentFormState>;
  /** Pre-filled values for edit mode */
  defaultValues?: {
    title?: string;
    description?: string;
    /** ISO string or datetime-local string */
    deadline?: string;
    difficulty?: string;
  };
  submitLabel?: string;
};

export function AssignmentForm({
  action,
  defaultValues,
  submitLabel = "Create assignment",
}: AssignmentFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  // Format deadline for datetime-local input (strip seconds/ms)
  const deadlineValue = defaultValues?.deadline
    ? defaultValues.deadline.slice(0, 16)
    : "";

  return (
    <form action={formAction} noValidate>
      {/* Top-level server error */}
      {state?.message && (
        <div className="callout callout-danger" style={{ marginBottom: "var(--space-5)" }}>
          {state.message}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        <Input
          label="Title"
          name="title"
          id="assignment-title"
          required
          placeholder="e.g. Build a REST API"
          defaultValue={defaultValues?.title ?? ""}
          error={state?.errors?.title?.[0]}
          autoFocus
        />

        <Textarea
          label="Description"
          name="description"
          id="assignment-description"
          required
          placeholder="Describe the assignment goals, requirements, and deliverables…"
          defaultValue={defaultValues?.description ?? ""}
          error={state?.errors?.description?.[0]}
          style={{ minHeight: 160 }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-4)",
          }}
        >
          <div className="field">
            <label htmlFor="assignment-deadline" className="field-label">
              Deadline
              <span aria-hidden="true" style={{ color: "var(--danger)", marginLeft: 2 }}>
                *
              </span>
            </label>
            <input
              type="datetime-local"
              id="assignment-deadline"
              name="deadline"
              required
              defaultValue={deadlineValue}
              className={`input${state?.errors?.deadline ? " input--error" : ""}`}
              aria-invalid={state?.errors?.deadline ? true : undefined}
              aria-describedby={
                state?.errors?.deadline ? "assignment-deadline-error" : undefined
              }
            />
            {state?.errors?.deadline && (
              <p id="assignment-deadline-error" className="field-error" role="alert">
                {state.errors.deadline[0]}
              </p>
            )}
          </div>

          <Select
            label="Difficulty"
            name="difficulty"
            id="assignment-difficulty"
            required
            options={DIFFICULTY_OPTIONS}
            placeholder="Select difficulty"
            defaultValue={defaultValues?.difficulty ?? ""}
            error={state?.errors?.difficulty?.[0]}
          />
        </div>
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
        <Button
          type="button"
          variant="secondary"
          onClick={() => history.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isPending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
