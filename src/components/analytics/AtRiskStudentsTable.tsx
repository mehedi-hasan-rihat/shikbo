"use client";

import type { AtRiskStudent } from "@/server/lib/analytics";

type AtRiskStudentsTableProps = {
  students: AtRiskStudent[];
};

export function AtRiskStudentsTable({ students }: AtRiskStudentsTableProps) {
  if (students.length === 0) {
    return (
      <div
        style={{
          padding: "var(--space-8) var(--space-5)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "var(--font-sm)",
            fontWeight: "var(--font-medium)",
            color: "var(--text-primary)",
            marginBottom: "var(--space-1)",
          }}
        >
          No at-risk students
        </p>
        <p
          style={{
            fontSize: "var(--font-sm)",
            color: "var(--text-muted)",
          }}
        >
          Students appear here when 2 or more of their latest submissions need
          improvement.
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Needs Improvement</th>
            <th>Total submissions</th>
            <th>Last active</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.studentId}>
              <td>
                <span
                  style={{
                    fontWeight: "var(--font-medium)",
                    color: "var(--text-primary)",
                    display: "block",
                  }}
                >
                  {s.name}
                </span>
                <span
                  style={{
                    fontSize: "var(--font-xs)",
                    color: "var(--text-muted)",
                  }}
                >
                  {s.email}
                </span>
              </td>
              <td>
                {/* Visual urgency indicator */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 24,
                      height: 24,
                      padding: "0 var(--space-2)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--font-xs)",
                      fontWeight: "var(--font-semibold)",
                      background: "var(--status-needs-improvement-bg)",
                      color: "var(--status-needs-improvement)",
                      border: "1px solid var(--warning-border)",
                    }}
                  >
                    {s.needsImprovementCount}
                  </span>
                  <span
                    style={{
                      fontSize: "var(--font-xs)",
                      color: "var(--text-muted)",
                    }}
                  >
                    assignment{s.needsImprovementCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </td>
              <td>
                <span
                  style={{
                    fontSize: "var(--font-sm)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {s.totalSubmissions}
                </span>
              </td>
              <td>
                <span
                  style={{
                    fontSize: "var(--font-sm)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {formatDate(s.lastSubmittedAt)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
