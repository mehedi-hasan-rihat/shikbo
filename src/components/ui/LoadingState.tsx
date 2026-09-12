type LoadingStateProps = {
  /** Number of skeleton rows to show (for list/table contexts). Default: 3 */
  rows?: number;
  /** Variant: 'list' renders rows, 'page' renders a full page skeleton */
  variant?: "list" | "page";
};

export function LoadingState({ rows = 3, variant = "list" }: LoadingStateProps) {
  if (variant === "page") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {/* Page header skeleton */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <div
            className="skeleton"
            style={{ height: 28, width: 200 }}
            aria-hidden="true"
          />
          <div
            className="skeleton"
            style={{ height: 16, width: 320 }}
            aria-hidden="true"
          />
        </div>
        {/* Content skeleton rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 80, width: "100%", borderRadius: "var(--radius-lg)" }}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height: 52,
            width: "100%",
            opacity: 1 - i * 0.15,
          }}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
