"use client";

import { useActionState, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { generateFeedbackAction } from "@/server/actions/ai";
import type { FeedbackGenerateResult } from "@/lib/ai/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Props = {
  /** Context passed as hidden inputs to the AI action */
  assignmentTitle: string;
  assignmentDescription: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  studentNote: string | null;
  submissionStatus: "pending" | "accepted" | "needs_improvement";
  /**
   * Called when the instructor clicks "Apply to feedback".
   * The parent should set the feedback textarea value with this string.
   */
  onApply: (feedback: string) => void;
};

// ---------------------------------------------------------------------------
// FeedbackAssistant
//
// Inline AI assistant for the review form. The instructor types observations,
// clicks "Generate draft", reviews the AI output, then applies it if useful.
// AI-generated content is never published automatically.
// ---------------------------------------------------------------------------

export function FeedbackAssistant({
  assignmentTitle,
  assignmentDescription,
  difficulty,
  studentNote,
  submissionStatus,
  onApply,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    generateFeedbackAction,
    null
  );

  const formRef = useRef<HTMLFormElement>(null);
  const observationsRef = useRef<HTMLTextAreaElement>(null);

  function handleGenerate() {
    formRef.current?.requestSubmit();
  }

  const result: FeedbackGenerateResult | undefined =
    state?.status === "success" ? state.data : undefined;
  const error = state?.status === "error" ? state.error : null;

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontSize: "var(--font-sm)",
          color: "var(--primary)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontWeight: "var(--font-medium)",
        }}
        aria-expanded="false"
      >
        <AiSparkIcon />
        AI feedback assistant
      </button>
    );
  }

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
      role="region"
      aria-label="AI feedback assistant"
    >
      {/* Panel header */}
      <div
        style={{
          padding: "var(--space-3) var(--space-4)",
          borderBottom: "1px solid var(--border)",
          background: "var(--background-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <AiSparkIcon />
          <span
            style={{
              fontSize: "var(--font-sm)",
              fontWeight: "var(--font-semibold)",
              color: "var(--text-primary)",
            }}
          >
            AI feedback assistant
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close AI assistant"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--text-muted)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div style={{ padding: "var(--space-4)" }}>
        {/* Workflow note */}
        <p
          style={{
            fontSize: "var(--font-xs)",
            color: "var(--text-muted)",
            marginBottom: "var(--space-4)",
            lineHeight: "var(--leading-normal)",
          }}
        >
          Enter your observations, generate a draft, review it, then apply if useful.
          The AI draft is never published automatically.
        </p>

        {/* Hidden form with context data */}
        <form ref={formRef} action={formAction}>
          <input type="hidden" name="assignmentTitle" value={assignmentTitle} />
          <input
            type="hidden"
            name="assignmentDescription"
            value={assignmentDescription}
          />
          <input type="hidden" name="difficulty" value={difficulty} />
          <input
            type="hidden"
            name="studentNote"
            value={studentNote ?? ""}
          />
          <input
            type="hidden"
            name="submissionStatus"
            value={submissionStatus}
          />

          {/* Observations textarea */}
          <Textarea
            ref={observationsRef}
            label="Your observations"
            name="instructorObservations"
            id="ai-observations"
            required
            placeholder="What did you notice about this submission? What stood out — good or bad?"
            hint="Max 5,000 characters"
            style={{ minHeight: 100 }}
          />
        </form>

        {/* Generate button */}
        <div style={{ marginTop: "var(--space-3)", display: "flex", gap: "var(--space-2)" }}>
          <Button
            type="button"
            variant="primary"
            size="sm"
            loading={isPending}
            onClick={handleGenerate}
          >
            {isPending ? "Generating…" : "Generate draft"}
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div
            className="callout callout-warning"
            style={{ marginTop: "var(--space-4)" }}
            role="alert"
          >
            {error}
          </div>
        )}

        {/* AI result */}
        {result && (
          <FeedbackDraft
            result={result}
            onApply={() => onApply(result.feedback)}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FeedbackDraft
// ---------------------------------------------------------------------------

function FeedbackDraft({
  result,
  onApply,
}: {
  result: FeedbackGenerateResult;
  onApply: () => void;
}) {
  const [applied, setApplied] = useState(false);

  function handleApply() {
    onApply();
    setApplied(true);
    // Reset label after 2s
    setTimeout(() => setApplied(false), 2000);
  }
  return (
    <div
      style={{
        marginTop: "var(--space-4)",
        border: "1px solid var(--info-border)",
        borderRadius: "var(--radius-lg)",
        background: "var(--info-subtle)",
        overflow: "hidden",
      }}
    >
      {/* Draft header */}
      <div
        style={{
          padding: "var(--space-3) var(--space-4)",
          borderBottom: "1px solid var(--info-border)",
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
      </div>

      <div
        style={{
          padding: "var(--space-4)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        {/* Feedback text */}
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
            Draft feedback
          </p>
          <p
            style={{
              fontSize: "var(--font-sm)",
              color: "var(--text-secondary)",
              lineHeight: "var(--leading-relaxed)",
              whiteSpace: "pre-wrap",
            }}
          >
            {result.feedback}
          </p>
        </div>

        {/* Improvement suggestions */}
        {result.improvementSuggestions.length > 0 && (
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
              Improvement suggestions
            </p>
            <ul
              style={{
                margin: 0,
                paddingLeft: "var(--space-4)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-1)",
              }}
            >
              {result.improvementSuggestions.map((s, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: "var(--font-sm)",
                    color: "var(--text-secondary)",
                    lineHeight: "var(--leading-normal)",
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
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
        <Button
          type="button"
          variant={applied ? "secondary" : "primary"}
          size="sm"
          onClick={handleApply}
          disabled={applied}
        >
          {applied ? "Applied ✓" : "Apply to feedback"}
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Icon
// ---------------------------------------------------------------------------

function AiSparkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
