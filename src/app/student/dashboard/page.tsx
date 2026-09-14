import Link from "next/link";
import { requireStudent } from "@/lib/auth";
import { KpiCard } from "@/components/ui/Card";
import { DifficultyBadge, StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { StudentProgressChart } from "@/components/analytics/StudentProgressChart";
import {
  getStudentOverviewMetrics,
  getStudentProgressDistribution,
  getStudentRecentFeedback,
  getStudentUpcomingAssignments,
} from "@/server/lib/analytics";

export default async function StudentDashboardPage() {
  const session = await requireStudent();

  const [metrics, progress, recentFeedback, upcomingAssignments] =
    await Promise.all([
      getStudentOverviewMetrics(session.userId),
      getStudentProgressDistribution(session.userId),
      getStudentRecentFeedback(session.userId, 3),
      getStudentUpcomingAssignments(session.userId),
    ]);

  const hasSubmissions = metrics.submitted > 0;

  // Split upcoming into open and past
  const openAssignments = upcomingAssignments.filter((a) => !a.isPast);
  const pastAssignments = upcomingAssignments.filter((a) => a.isPast);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your assignment progress and upcoming work.</p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* KPI row — SHK-041                                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="kpi-grid" style={{ marginBottom: "var(--space-6)" }}>
        <KpiCard
          label="Assignments"
          value={metrics.totalActiveAssignments}
          support="available"
        />
        <KpiCard
          label="Submitted"
          value={metrics.submitted}
          support={
            metrics.totalActiveAssignments > 0
              ? `${Math.round((metrics.submitted / metrics.totalActiveAssignments) * 100)}% of total`
              : undefined
          }
        />
        <KpiCard
          label="Accepted"
          value={metrics.accepted}
          support={hasSubmissions ? `${Math.round((metrics.accepted / metrics.submitted) * 100)}% of submitted` : undefined}
        />
        <KpiCard
          label="Needs improvement"
          value={metrics.needsImprovement}
        />
        <KpiCard
          label="Pending review"
          value={metrics.pending}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Progress + Recent feedback — SHK-042                               */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="dash-grid-sidebar-right-md"
        style={{ marginBottom: "var(--space-5)" }}
      >
        {/* Progress visualization */}
        <section className="card">
          <h2
            style={{
              fontSize: "var(--font-sm)",
              fontWeight: "var(--font-semibold)",
              color: "var(--text-primary)",
              marginBottom: "var(--space-4)",
            }}
          >
            Progress
          </h2>
          <StudentProgressChart data={progress} />
          {!hasSubmissions && (
            <p
              style={{
                fontSize: "var(--font-sm)",
                color: "var(--text-muted)",
                marginTop: "var(--space-4)",
              }}
            >
              Submit your first assignment to track progress here.{" "}
              <Link
                href="/student/assignments"
                style={{ color: "var(--primary)" }}
              >
                Browse assignments
              </Link>
            </p>
          )}
        </section>

        {/* Recent feedback */}
        <section className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "var(--space-5) var(--space-5) var(--space-3)",
              borderBottom: recentFeedback.length > 0 ? "1px solid var(--border)" : undefined,
            }}
          >
            <h2
              style={{
                fontSize: "var(--font-sm)",
                fontWeight: "var(--font-semibold)",
                color: "var(--text-primary)",
              }}
            >
              Recent feedback
            </h2>
          </div>

          {recentFeedback.length === 0 ? (
            <EmptyState
              title="No feedback yet"
              description="Instructor feedback will appear here after your submissions are reviewed."
            />
          ) : (
            <div>
              {recentFeedback.map((item, i) => (
                <div
                  key={item.submissionId}
                  style={{
                    padding: "var(--space-4) var(--space-5)",
                    borderBottom:
                      i < recentFeedback.length - 1
                        ? "1px solid var(--border-subtle)"
                        : undefined,
                  }}
                >
                  {/* Assignment title + status */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "var(--space-2)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    <Link
                      href={`/student/assignments/${item.assignmentId}`}
                      style={{
                        fontSize: "var(--font-sm)",
                        fontWeight: "var(--font-medium)",
                        color: "var(--text-primary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.assignmentTitle}
                    </Link>
                    <StatusBadge status={item.status} />
                  </div>

                  {/* Feedback text — truncated */}
                  <p
                    style={{
                      fontSize: "var(--font-sm)",
                      color: "var(--text-secondary)",
                      lineHeight: "var(--leading-relaxed)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.feedback}
                  </p>

                  <p
                    style={{
                      fontSize: "var(--font-xs)",
                      color: "var(--text-muted)",
                      marginTop: "var(--space-2)",
                    }}
                  >
                    {formatDate(item.reviewedAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Upcoming deadlines — SHK-043                                       */}
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
            Upcoming deadlines
          </h2>
          <Link
            href="/student/assignments"
            style={{ fontSize: "var(--font-sm)", color: "var(--primary)" }}
          >
            All assignments
          </Link>
        </div>

        {openAssignments.length === 0 && pastAssignments.length === 0 ? (
          <div className="card" style={{ padding: 0 }}>
            <EmptyState
              title="No assignments yet"
              description="Your instructor hasn't published any assignments."
            />
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Difficulty</th>
                    <th>Deadline</th>
                    <th>Your status</th>
                    <th style={{ width: 1, whiteSpace: "nowrap" }}>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Open first, then past */}
                  {[...openAssignments, ...pastAssignments].map((a) => {
                    const isUpcomingSoon =
                      !a.isPast &&
                      a.deadline.getTime() - Date.now() <
                        7 * 24 * 60 * 60 * 1000;

                    return (
                      <tr key={a.assignmentId}>
                        <td>
                          <Link
                            href={`/student/assignments/${a.assignmentId}`}
                            style={{
                              fontWeight: "var(--font-medium)",
                              color: "var(--text-primary)",
                            }}
                          >
                            {a.title}
                          </Link>
                          {a.attemptCount > 1 && (
                            <span
                              style={{
                                display: "block",
                                fontSize: "var(--font-xs)",
                                color: "var(--text-muted)",
                                marginTop: 2,
                              }}
                            >
                              {a.attemptCount} attempts
                            </span>
                          )}
                        </td>
                        <td>
                          <DifficultyBadge difficulty={a.difficulty} />
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: "var(--font-sm)",
                              color: a.isPast
                                ? "var(--danger)"
                                : isUpcomingSoon
                                  ? "var(--warning)"
                                  : "var(--text-secondary)",
                            }}
                          >
                            {formatDeadline(a.deadline)}
                          </span>
                          <span
                            style={{
                              display: "block",
                              fontSize: "var(--font-xs)",
                              color: "var(--text-muted)",
                              marginTop: 2,
                            }}
                          >
                            {a.isPast
                              ? "Closed"
                              : isUpcomingSoon
                                ? daysUntil(a.deadline)
                                : daysUntil(a.deadline)}
                          </span>
                        </td>
                        <td>
                          {a.submissionStatus ? (
                            <StatusBadge status={a.submissionStatus} />
                          ) : (
                            <span
                              style={{
                                fontSize: "var(--font-xs)",
                                color: a.isPast
                                  ? "var(--text-muted)"
                                  : "var(--text-muted)",
                              }}
                            >
                              {a.isPast ? "Not submitted" : "Not started"}
                            </span>
                          )}
                        </td>
                        <td>
                          <Link
                            href={`/student/assignments/${a.assignmentId}`}
                            style={{
                              fontSize: "var(--font-sm)",
                              color: "var(--primary)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {!a.submissionStatus && !a.isPast
                              ? "Start"
                              : a.submissionStatus === "needs_improvement" && !a.isPast
                                ? "Resubmit"
                                : "View"}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
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
// Formatters
// ---------------------------------------------------------------------------

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDeadline(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysUntil(date: Date): string {
  const ms = date.getTime() - Date.now();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "1 day left";
  if (days < 7) return `${days} days left`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 week left" : `${weeks} weeks left`;
}
