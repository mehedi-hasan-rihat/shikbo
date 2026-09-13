import { forwardRef } from "react";
import type React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, id, className = "", ...props },
  ref
) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const hintId = hint && inputId ? `${inputId}-hint` : undefined;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <div className="field">
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label}
          {props.required && (
            <span aria-hidden="true" style={{ color: "var(--danger)", marginLeft: 2 }}>
              *
            </span>
          )}
        </label>
      )}
      <input
        {...props}
        ref={ref}
        id={inputId}
        aria-describedby={
          [hintId, errorId].filter(Boolean).join(" ") || undefined
        }
        aria-invalid={error ? true : undefined}
        className={`input${error ? " input--error" : ""} ${className}`.trim()}
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
});
