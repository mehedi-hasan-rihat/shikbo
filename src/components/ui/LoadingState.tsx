type LoadingStateProps = {
  /** Number of skeleton rows/cards to show. Default: 3 */
  rows?: number;
  /**
   * list   — stacked skeleton rows (tables, feeds)
   * page   — page header + block skeletons (general route loading)
   * kpi    — row of KPI card skeletons + block skeletons (dashboard)
   */
  variant?: "list" | "page" | "kpi";
};

export function LoadingState({ rows = 3, variant = "list" }: LoadingStateProps) {
  if (variant === "kpi") {
    return (
      <div
        role="status"
        aria-label="Loading"
        style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}
      >
        {/* Page header */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <div className="skeleton" style={{ height: 28, width: 180 }} aria-hidden="true" />
          <div className="skeleton" style={{ height: 16, width: 280 }} aria-hidden="true" />
        </div>
        {/* KPI card row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: 88, borderRadius: "var(--radius-lg)" }}
              aria-hidden="true"
            />
          ))}
        </div>
        {/* Content blocks */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 120, width: "100%", borderRadius: "var(--radius-lg)" }}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div
        role="status"
        aria-label="Loading"
        style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}
      >
        {/* Page header skeleton */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <div className="skeleton" style={{ height: 28, width: 200 }} aria-hidden="true" />
          <div className="skeleton" style={{ height: 16, width: 320 }} aria-hidden="true" />
        </div>
        {/* Content skeleton blocks */}
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

  // list variant — table/feed rows
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: 52, width: "100%", opacity: 1 - i * 0.15 }}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
