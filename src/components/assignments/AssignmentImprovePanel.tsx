"use client";

import { useActionState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { improveAssignmentAction } from "@/server/actions/ai";
import type { AssignmentImproveResult } from "@/lib/ai/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Props = {
  /** Current values from the assignment form — used to populate the AI input. */
  getFormValues: () => {
    title: string;
    description: string;
    difficulty: string;
  };
  /** Called when the instructor accepts the AI suggestions. */
  onApply: (result: AssignmentImproveResult) => void;
};

// ---------------------------------------------------------------------------
// AssignmentImprovePanel
//
// Renders an "Improve with AI" button. When clicked, it reads the current
// assignment form values, submits them to the server action, then shows a
// preview panel so the instructor can review before applying.
// ---------------------------------------------------------------------------

export function AssignmentImprovePanel({ getFormValues, onApply }: Props) {
  const [state, formAction, isPending] = useActionState(
    improveAssignmentAction,
    null
  );

  const formRef = useRef<HTMLFormElement>(null);

  function handleImprove() {
    const values = getFormValues();
    // Populate hidden inputs and submit
    const form = formRef.current;
    if (!form) return;
    (form.elements.namedItem("title") as HTMLInputElement).value = values.title;
    (form.elements.namedItem("description") as HTMLInputElement).value =
      values.description;
    (form.elements.namedItem("difficulty") as HTMLInputElement).value =
      values.difficulty;
    form.requestSubmit();
  }

  const result = state?.status === "success" ? state.data : null;
  const error = state?.status === "error" ? state.error : null;

  return (
    <div>
      {/* Hidden form that sends values to the server action */}
      <form ref={formRef} action={formAction} style={{ display: "none" }}>
        <input type="hidden" name="title" />
        <input type="hidden" name="description" />
        <input type="hidden" name="difficulty" />
      </form>

      {/* Trigger button */}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        loading={isPending}
        onClick={handleImprove}
        aria-label="Use AI to improve this assignment"
      >
        {isPending ? "Improving…" : "Improve with AI"}
      </Button>

      {/* Error state */}
      {error && (
        <div
          className="callout callout-warning"
          style={{ marginTop: "var(--space-4)" }}
          role="alert"
        >
          {error}
        </div>
      )}

      {/* AI result preview */}
      {result && (
        <AiPreview
          result={result}
          onApply={() => onApply(result)}
          onDiscard={() => {
            /* state resets naturally on next action; just close visually */
          }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AiPreview — shows the AI suggestions before the instructor applies them
// ---------------------------------------------------------------------------

type AiPreviewProps = {
  result: AssignmentImproveResult;
  onApply: () => void;
  onDiscard: () => void;
};

function AiPreview({ result, onApply, onDiscard }: AiPreviewProps) {
  return (
    <div
      style={{
        marginTop: "var(--space-4)",
        border: "1px solid var(--info-border)",
        borderRadius: "var(--radius-lg)",
        background: "var(--info-subtle)",
        overflow: "hidden",
      }}
      role="region"
      aria-label="AI improvement suggestions"
    >
      {/* Header */}
      <div
        style={{
          padding: "var(--space-3) var(--space-4)",
          borderBottom: "1px solid var(--info-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-3)",
        }}
      >
        <span
          style={{
            fontSize: "var(--font-sm)",
            fontWeight: "var(--font-semibold)",
            color: "var(--info-foreground)",
          }}
        >
          AI Draft — Review before applying
        </span>
        <span
          style={{
            fontSize: "var(--font-xs)",
            color: "var(--info-foreground)",
            opacity: 0.7,
          }}
        >
          This is a suggestion only. You decide what to use.
        </span>
      </div>

      <div
        style={{
          padding: "var(--space-4)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        {/* Improved title */}
        <PreviewSection label="Improved title">
          <p
            style={{
              fontSize: "var(--font-base)",
              fontWeight: "var(--font-medium)",
              color: "var(--text-primary)",
            }}
          >
            {result.improvedTitle}
          </p>
        </PreviewSection>

        {/* Improved description */}
        <PreviewSection label="Improved description">
          <p
            style={{
              fontSize: "var(--font-base)",
              color: "var(--text-secondary)",
              lineHeight: "var(--leading-relaxed)",
              whiteSpace: "pre-wrap",
            }}
          >
            {result.improvedDescription}
          </p>
        </PreviewSection>

        {/* Missing requirements */}
        {result.missingRequirements.length > 0 && (
          <PreviewSection label="Potentially missing requirements">
            <ul
              style={{
                margin: 0,
                paddingLeft: "var(--space-4)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-1)",
              }}
            >
              {result.missingRequirements.map((req, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: "var(--font-sm)",
                    color: "var(--text-secondary)",
                    lineHeight: "var(--leading-normal)",
                  }}
                >
                  {req}
                </li>
              ))}
            </ul>
          </PreviewSection>
        )}

        {/* Evaluation criteria */}
        {result.evaluationCriteria.length > 0 && (
          <PreviewSection label="Suggested evaluation criteria">
            <ul
              style={{
                margin: 0,
                paddingLeft: "var(--space-4)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-1)",
              }}
            >
              {result.evaluationCriteria.map((crit, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: "var(--font-sm)",
                    color: "var(--text-secondary)",
                    lineHeight: "var(--leading-normal)",
                  }}
                >
                  {crit}
                </li>
              ))}
            </ul>
          </PreviewSection>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          padding: "var(--space-3) var(--space-4)",
          borderTop: "1px solid var(--info-border)",
          display: "flex",
          gap: "var(--space-2)",
          justifyContent: "flex-end",
        }}
      >
        <Button type="button" variant="ghost" size="sm" onClick={onDiscard}>
          Discard
        </Button>
        <Button type="button" variant="primary" size="sm" onClick={onApply}>
          Apply to form
        </Button>
      </div>
    </div>
  );
}

function PreviewSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: "var(--font-xs)",
          fontWeight: "var(--font-medium)",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "var(--space-2)",
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}
