"use client";

import Link from "next/link";
import { DifficultyBadge } from "@/components/ui/Badge";
import type { AssignmentDifficultyRow } from "@/server/lib/analytics";

type AssignmentAnalysisTableProps = {
  rows: AssignmentDifficultyRow[];
};

// Inline progress bar for a metric
function MiniBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      <div
        style={{
          flex: 1,
          height: 6,
          borderRadius: 3,
          background: "var(--background-muted)",
          overflow: "hidden",
          minWidth: 60,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 3,
            transition: "width 300ms ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "var(--font-xs)",
          color: "var(--text-muted)",
          minWidth: 24,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function AssignmentAnalysisTable({ rows }: AssignmentAnalysisTableProps) {
  if (rows.length === 0) {
    return (
      <p
        style={{
          fontSize: "var(--font-sm)",
          color: "var(--text-muted)",
          padding: "var(--space-8) var(--space-5)",
          textAlign: "center",
        }}
      >
        No assignments yet.
      </p>
    );
  }

  // Sort by most needs_improvement first (most struggle)
  const sorted = [...rows].sort(
    (a, b) => b.needsImprovementCount - a.needsImprovementCount
  );

  const maxStudents = Math.max(...sorted.map((r) => r.uniqueStudents), 1);

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Assignment</th>
            <th>Difficulty</th>
            <th>Students</th>
            <th>Needs Improvement</th>
            <th>Accepted</th>
            <th>Acceptance Rate</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.assignmentId}>
              <td data-label="Assignment">
                <Link
                  href={`/instructor/assignments/${row.assignmentId}`}
                  style={{
                    fontSize: "var(--font-sm)",
                    fontWeight: "var(--font-medium)",
                    color: "var(--text-primary)",
                  }}
                >
                  {row.title}
                </Link>
              </td>
              <td data-label="Difficulty">
                <DifficultyBadge difficulty={row.difficulty} />
              </td>
              <td data-label="Students">
                <MiniBar
                  value={row.uniqueStudents}
                  max={maxStudents}
                  color="var(--primary)"
                />
              </td>
              <td data-label="Needs Improvement">
                <MiniBar
                  value={row.needsImprovementCount}
                  max={row.uniqueStudents || 1}
                  color="#d97706"
                />
              </td>
              <td data-label="Accepted">
                <MiniBar
                  value={row.acceptedCount}
                  max={row.uniqueStudents || 1}
                  color="#16a34a"
                />
              </td>
              <td data-label="Acceptance Rate">
                <span
                  style={{
                    fontSize: "var(--font-sm)",
                    fontWeight: "var(--font-medium)",
                    color:
                      row.acceptanceRate >= 70
                        ? "var(--success)"
                        : row.acceptanceRate >= 40
                          ? "var(--warning)"
                          : row.uniqueStudents === 0
                            ? "var(--text-muted)"
                            : "var(--danger)",
                  }}
                >
                  {row.uniqueStudents === 0 ? "—" : `${row.acceptanceRate}%`}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
