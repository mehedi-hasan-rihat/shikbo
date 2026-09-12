import type React from "react";

type ErrorStateProps = {
  title?: string;
  message?: string;
  action?: React.ReactNode;
};

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  action,
}: ErrorStateProps) {
  return (
    <div className="empty-state" role="region" aria-label={title}>
      <p className="empty-state__title" style={{ color: "var(--danger)" }}>
        {title}
      </p>
      <p className="empty-state__description">{message}</p>
      {action && (
        <div style={{ marginTop: "var(--space-4)" }}>{action}</div>
      )}
    </div>
  );
}
