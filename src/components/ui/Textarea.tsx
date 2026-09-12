import type React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Textarea({
  label,
  hint,
  error,
  id,
  className = "",
  ...props
}: TextareaProps) {
  const textareaId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const hintId = hint && textareaId ? `${textareaId}-hint` : undefined;
  const errorId = error && textareaId ? `${textareaId}-error` : undefined;

  return (
    <div className="field">
      {label && (
        <label htmlFor={textareaId} className="field-label">
          {label}
          {props.required && (
            <span aria-hidden="true" style={{ color: "var(--danger)", marginLeft: 2 }}>
              *
            </span>
          )}
        </label>
      )}
      <textarea
        {...props}
        id={textareaId}
        aria-describedby={
          [hintId, errorId].filter(Boolean).join(" ") || undefined
        }
        aria-invalid={error ? true : undefined}
        className={`textarea${error ? " input--error" : ""} ${className}`.trim()}
      />
      {hint && !error && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
