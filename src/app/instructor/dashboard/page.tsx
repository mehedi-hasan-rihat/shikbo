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
} from "@/server/lib/analytics";
import { db } from "@/lib/db";

export default async function InstructorDashboardPage() {
  const session = await requireInstructor();

  const [overview, statusDist, assignmentRows, atRisk, recentSubmissions] =
    await Promise.all([
      getOverviewMetrics(session.userId),
      getStatusDistribution(session.userId),
      getAssignmentAnalysis(session.userId),
      getAtRiskStudents(session.userId),
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
      {/* KPI row                                                             */}
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
          label="Pending review"
          value={hasData ? `${overview.pendingRate}%` : "—"}
          support={hasData ? `${statusDist.pending} unreviewed` : undefined}
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
      {/* Status chart + at-risk students                                     */}
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
              Students needing attention
            </h2>
            <p style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
              Students with 2+ assignments currently at "Needs Improvement".
            </p>
          </div>
          <AtRiskStudentsTable students={atRisk} />
        </section>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Assignment breakdown                                                */}
      {/* ------------------------------------------------------------------ */}
      <section
        className="card"
        style={{ padding: 0, overflow: "hidden", marginBottom: "var(--space-5)" }}
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
            Assignment breakdown
          </h2>
          <p style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
            Based on each student's latest submission. Sorted by most
            improvement needed.
          </p>
        </div>
        <AssignmentAnalysisTable rows={assignmentRows} />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Recent submissions                                                  */}
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
                  {recentSubmissions.map((sub) => (
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
