import type React from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="empty-state__title">{title}</p>
      {description && (
        <p className="empty-state__description">{description}</p>
      )}
      {action && (
        <div style={{ marginTop: "var(--space-4)" }}>{action}</div>
      )}
    </div>
  );
}
