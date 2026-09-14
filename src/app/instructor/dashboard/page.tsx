import Link from "next/link";
import { requireInstructor } from "@/lib/auth";
import { KpiCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusDonutChart } from "@/components/analytics/StatusDonutChart";
import { AssignmentAnalysisTable } from "@/components/analytics/AssignmentAnalysisTable";
import { AtRiskStudentsTable } from "@/components/analytics/AtRiskStudentsTable";
import {
  getOverviewMetrics,
  getStatusDistribution,
  getAssignmentAnalysis,
  getAtRiskStudents,
  getActionItems,
} from "@/server/lib/analytics";
import { db } from "@/lib/db";

export default async function InstructorDashboardPage() {
  const session = await requireInstructor();

  const [overview, statusDist, assignmentRows, atRisk, actions, recentSubmissions] =
    await Promise.all([
      getOverviewMetrics(session.userId),
      getStatusDistribution(session.userId),
      getAssignmentAnalysis(session.userId),
      getAtRiskStudents(session.userId),
      getActionItems(session.userId),
      db.submission.findMany({
        where: { assignment: { createdBy: session.userId } },
        orderBy: { submittedAt: "desc" },
        take: 5,
        include: {
          student: { select: { name: true } },
          assignment: { select: { title: true } },
        },
      }),
    ]);

  const hasData = overview.totalSubmissions > 0;
  const now = Date.now();

  const totalActionCount =
    (actions.pendingReviewCount > 0 ? 1 : 0) +
    (actions.atRiskStudentCount > 0 ? 1 : 0) +
    actions.lowAcceptanceAssignments.length +
    (actions.deadlinesThisWeek.length > 0 ? 1 : 0);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Submission outcomes and student progress across your assignments.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Action center — SHK-045                                            */}
      {/* ------------------------------------------------------------------ */}
      {totalActionCount > 0 && (
        <section style={{ marginBottom: "var(--space-6)" }}>
          <h2
            style={{
              fontSize: "var(--font-sm)",
              fontWeight: "var(--font-semibold)",
              color: "var(--text-primary)",
              marginBottom: "var(--space-3)",
            }}
          >
            Needs your attention
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
            }}
          >
            {/* Pending reviews */}
            {actions.pendingReviewCount > 0 && (
              <ActionItem
                href="/instructor/submissions?status=pending"
                label={`${actions.pendingReviewCount} submission${actions.pendingReviewCount !== 1 ? "s" : ""} waiting for review`}
                kind="pending"
                cta="Review now"
              />
            )}

            {/* At-risk students */}
            {actions.atRiskStudentCount > 0 && (
              <ActionItem
                href="#students-needing-attention"
                label={`${actions.atRiskStudentCount} student${actions.atRiskStudentCount !== 1 ? "s" : ""} ${actions.atRiskStudentCount !== 1 ? "have" : "has"} repeated needs improvement`}
                kind="warning"
                cta="View students"
              />
            )}

            {/* Low acceptance assignments */}
            {actions.lowAcceptanceAssignments.map((a: typeof actions.lowAcceptanceAssignments[number]) => (
              <ActionItem
                key={a.assignmentId}
                href={`/instructor/assignments/${a.assignmentId}`}
                label={`"${a.title}" has a ${a.acceptanceRate}% acceptance rate`}
                kind="warning"
                cta="View assignment"
              />
            ))}

            {/* Assignments with deadlines this week */}
            {actions.deadlinesThisWeek.length > 0 && (
              <ActionItem
                href="/instructor/assignments"
                label={`${actions.deadlinesThisWeek.length} assignment${actions.deadlinesThisWeek.length !== 1 ? "s have" : " has"} a deadline this week${actions.deadlinesThisWeek.reduce((n: number, a: typeof actions.deadlinesThisWeek[number]) => n + a.pendingCount, 0) > 0 ? ` · ${actions.deadlinesThisWeek.reduce((n: number, a: typeof actions.deadlinesThisWeek[number]) => n + a.pendingCount, 0)} submission${actions.deadlinesThisWeek.reduce((n: number, a: typeof actions.deadlinesThisWeek[number]) => n + a.pendingCount, 0) !== 1 ? "s" : ""} pending` : ""}`}
                kind="info"
                cta="View assignments"
              />
            )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* KPI row — SHK-044                                                  */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "var(--space-4)",
          marginBottom: "var(--space-6)",
        }}
      >
        <KpiCard label="Active assignments" value={overview.totalAssignments} />
        <KpiCard label="Total submissions" value={overview.totalSubmissions} />
        <KpiCard
          label="Acceptance rate"
          value={hasData ? `${overview.acceptanceRate}%` : "—"}
          support={hasData ? `${statusDist.accepted} accepted` : undefined}
        />
        <KpiCard
          label="Needs improvement"
          value={hasData ? `${overview.needsImprovementRate}%` : "—"}
          support={
            hasData ? `${statusDist.needs_improvement} submissions` : undefined
          }
        />
        <KpiCard
          label="Pending reviews"
          value={actions.pendingReviewCount}
          support={hasData ? "awaiting review" : undefined}
        />
        <KpiCard
          label="Avg. review time"
          value={
            overview.avgReviewTimeHours !== null
              ? formatReviewTime(overview.avgReviewTimeHours)
              : "—"
          }
          support={
            overview.avgReviewTimeHours !== null ? "after submission" : undefined
          }
        />
      </div>

      {!hasData && (
        <div
          className="callout callout-info"
          style={{ marginBottom: "var(--space-6)" }}
        >
          Analytics will populate once students start submitting work.
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Status chart + at-risk students                                    */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="grid-cols-responsive"
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "var(--space-5)",
          marginBottom: "var(--space-5)",
          alignItems: "start",
        }}
      >
        {/* Status donut */}
        <section className="card">
          <h2
            style={{
              fontSize: "var(--font-sm)",
              fontWeight: "var(--font-semibold)",
              color: "var(--text-primary)",
              marginBottom: "var(--space-4)",
            }}
          >
            Submission status
          </h2>

          <StatusDonutChart data={statusDist} />

          {hasData && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
                marginTop: "var(--space-4)",
                paddingTop: "var(--space-4)",
                borderTop: "1px solid var(--border)",
              }}
            >
              <StatusRow
                label="Accepted"
                count={statusDist.accepted}
                total={statusDist.total}
                color="var(--status-accepted)"
              />
              <StatusRow
                label="Needs improvement"
                count={statusDist.needs_improvement}
                total={statusDist.total}
                color="var(--status-needs-improvement)"
              />
              <StatusRow
                label="Pending"
                count={statusDist.pending}
                total={statusDist.total}
                color="var(--status-pending)"
              />
            </div>
          )}
        </section>

        {/* At-risk students */}
        <section
          id="students-needing-attention"
          className="card"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <div style={{ padding: "var(--space-5) var(--space-5) var(--space-4)" }}>
            <h2
              style={{
                fontSize: "var(--font-sm)",
                fontWeight: "var(--font-semibold)",
                color: "var(--text-primary)",
                marginBottom: "var(--space-1)",
              }}
            >
              Students needing attention
            </h2>
            <p style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
              Students with 2+ assignments currently at &ldquo;Needs Improvement&rdquo;.
            </p>
          </div>
          <AtRiskStudentsTable students={atRisk} />
        </section>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Assignment breakdown + Deadlines this week                        */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="grid-cols-responsive"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "var(--space-5)",
          marginBottom: "var(--space-5)",
          alignItems: "start",
        }}
      >
        <section className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-5) var(--space-5) var(--space-4)" }}>
            <h2
              style={{
                fontSize: "var(--font-sm)",
                fontWeight: "var(--font-semibold)",
                color: "var(--text-primary)",
                marginBottom: "var(--space-1)",
              }}
            >
              Assignment breakdown
            </h2>
            <p style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
              Based on each student&apos;s latest submission. Sorted by most improvement needed.
            </p>
          </div>
          <AssignmentAnalysisTable rows={assignmentRows} />
        </section>

        {/* Deadlines this week */}
        <section className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-5) var(--space-5) var(--space-4)" }}>
            <h2
              style={{
                fontSize: "var(--font-sm)",
                fontWeight: "var(--font-semibold)",
                color: "var(--text-primary)",
                marginBottom: "var(--space-1)",
              }}
            >
              Deadlines this week
            </h2>
            <p style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
              Assignments due in the next 7 days.
            </p>
          </div>

          {actions.deadlinesThisWeek.length === 0 ? (
            <div style={{ padding: "var(--space-5)", textAlign: "center" }}>
              <p style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
                No deadlines in the next 7 days.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Deadline</th>
                    <th>Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {actions.deadlinesThisWeek.map((a: typeof actions.deadlinesThisWeek[number]) => {
                    const daysLeft = Math.ceil(
                      (a.deadline.getTime() - now) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <tr key={a.assignmentId}>
                        <td>
                          <Link
                            href={`/instructor/assignments/${a.assignmentId}`}
                            style={{
                              fontSize: "var(--font-sm)",
                              fontWeight: "var(--font-medium)",
                              color: "var(--text-primary)",
                            }}
                          >
                            {a.title}
                          </Link>
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: "var(--font-sm)",
                              color:
                                daysLeft <= 1
                                  ? "var(--danger)"
                                  : daysLeft <= 3
                                    ? "var(--warning)"
                                    : "var(--text-secondary)",
                            }}
                          >
                            {formatDate(a.deadline)}
                          </span>
                          <span
                            style={{
                              display: "block",
                              fontSize: "var(--font-xs)",
                              color: "var(--text-muted)",
                              marginTop: 2,
                            }}
                          >
                            {daysLeft <= 0 ? "Today" : daysLeft === 1 ? "1 day left" : `${daysLeft} days left`}
                          </span>
                        </td>
                        <td>
                          {a.pendingCount > 0 ? (
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
                                background: "var(--status-pending-bg)",
                                color: "var(--status-pending)",
                                border: "1px solid var(--border)",
                              }}
                            >
                              {a.pendingCount}
                            </span>
                          ) : (
                            <span style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Recent submissions                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "var(--space-3)",
          }}
        >
          <h2
            style={{
              fontSize: "var(--font-sm)",
              fontWeight: "var(--font-semibold)",
              color: "var(--text-primary)",
            }}
          >
            Recent submissions
          </h2>
          <Link
            href="/instructor/submissions"
            style={{ fontSize: "var(--font-sm)", color: "var(--primary)" }}
          >
            View all
          </Link>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="card" style={{ padding: 0 }}>
            <EmptyState
              title="No submissions yet"
              description="Students will appear here once they submit work."
            />
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Assignment</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th style={{ width: 1 }}>
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((sub: typeof recentSubmissions[number]) => (
                    <tr key={sub.id}>
                      <td>
                        <span
                          style={{
                            fontSize: "var(--font-sm)",
                            fontWeight: "var(--font-medium)",
                            color: "var(--text-primary)",
                          }}
                        >
                          {sub.student.name}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "var(--font-sm)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {sub.assignment.title}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={sub.status} />
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "var(--font-sm)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {formatDate(sub.submittedAt)}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/instructor/submissions/${sub.id}`}
                          style={{
                            fontSize: "var(--font-sm)",
                            color: "var(--primary)",
                          }}
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Action item row
// ---------------------------------------------------------------------------

type ActionKind = "pending" | "warning" | "info";

const kindStyles: Record<
  ActionKind,
  { border: string; bg: string; dot: string; textColor: string }
> = {
  pending: {
    border: "var(--border)",
    bg:     "var(--surface)",
    dot:    "var(--status-pending)",
    textColor: "var(--text-primary)",
  },
  warning: {
    border: "var(--warning-border)",
    bg:     "var(--warning-subtle)",
    dot:    "var(--warning)",
    textColor: "var(--warning-foreground)",
  },
  info: {
    border: "var(--info-border)",
    bg:     "var(--info-subtle)",
    dot:    "var(--info)",
    textColor: "var(--info-foreground)",
  },
};

function ActionItem({
  href,
  label,
  kind,
  cta,
}: {
  href: string;
  label: string;
  kind: ActionKind;
  cta: string;
}) {
  const s = kindStyles[kind];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-4)",
        padding: "var(--space-3) var(--space-4)",
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "var(--radius-lg)",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", minWidth: 0 }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: s.dot,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: "var(--font-sm)",
            color: s.textColor,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
      <Link
        href={href}
        style={{
          fontSize: "var(--font-sm)",
          fontWeight: "var(--font-medium)",
          color: kind === "pending" ? "var(--primary)" : s.textColor,
          whiteSpace: "nowrap",
          flexShrink: 0,
          textDecoration: "none",
          opacity: 0.9,
        }}
      >
        {cta} →
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusRow({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "var(--space-1)",
        }}
      >
        <span style={{ fontSize: "var(--font-xs)", color: "var(--text-secondary)" }}>
          {label}
        </span>
        <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)" }}>
          {count} · {pct}%
        </span>
      </div>
      <div
        style={{
          height: 4,
          borderRadius: 2,
          background: "var(--background-muted)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 2,
            transition: "width 300ms ease",
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatReviewTime(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${Math.round(hours)}h`;
  return `${(hours / 24).toFixed(1)}d`;
}
