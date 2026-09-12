import Link from "next/link";
import { notFound } from "next/navigation";
import { requireInstructor } from "@/lib/auth";
import { db } from "@/lib/db";
import { DifficultyBadge, StatusBadge } from "@/components/ui/Badge";
import { KpiCard } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { AssignmentActions } from "./AssignmentActions";

type Params = Promise<{ id: string }>;

export default async function AssignmentDetailPage({ params }: { params: Params }) {
  const session = await requireInstructor();
  const { id } = await params;

  const assignment = await db.assignment.findUnique({
    where: { id },
    include: {
      submissions: {
        orderBy: { submittedAt: "desc" },
        include: {
          student: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  if (!assignment || assignment.createdBy !== session.userId) {
    notFound();
  }

  const now = new Date();
  const isPast = assignment.deadline < now;
  const isArchived = assignment.archivedAt !== null;

  // Submission stats — count unique students, dedupe to latest per student
  const latestByStudent = new Map<
    string,
    (typeof assignment.submissions)[number]
  >();
  for (const sub of assignment.submissions) {
    const existing = latestByStudent.get(sub.studentId);
    if (!existing || sub.submittedAt > existing.submittedAt) {
      latestByStudent.set(sub.studentId, sub);
    }
  }
  const latestSubmissions = [...latestByStudent.values()];

  const totalStudents = latestByStudent.size;
  const totalSubmissions = assignment.submissions.length;
  const pendingCount = latestSubmissions.filter(
    (s) => s.status === "pending"
  ).length;
  const acceptedCount = latestSubmissions.filter(
    (s) => s.status === "accepted"
  ).length;
  const needsImprovementCount = latestSubmissions.filter(
    (s) => s.status === "needs_improvement"
  ).length;

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          <nav
            aria-label="Breadcrumb"
            style={{
              fontSize: "var(--font-sm)",
              color: "var(--text-muted)",
              marginBottom: "var(--space-1)",
            }}
          >
            <Link
              href="/instructor/assignments"
              style={{ color: "var(--text-muted)" }}
            >
              Assignments
            </Link>
            {" / "}
            <span>{assignment.title}</span>
          </nav>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              flexWrap: "wrap",
            }}
          >
            <h1 className="page-title" style={{ marginBottom: 0 }}>
              {assignment.title}
            </h1>
            <DifficultyBadge difficulty={assignment.difficulty} />
            {isArchived && (
              <span
                style={{
                  fontSize: "var(--font-xs)",
                  fontWeight: "var(--font-medium)",
                  color: "var(--text-muted)",
                  padding: "2px var(--space-2)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                Archived
              </span>
            )}
          </div>
        </div>

        <AssignmentActions
          assignmentId={assignment.id}
          assignmentTitle={assignment.title}
          hasSubmissions={totalSubmissions > 0}
          isArchived={isArchived}
        />
      </div>

      {/* Details + stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "var(--space-6)",
          alignItems: "start",
        }}
      >
        {/* Left: assignment info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          {/* Description */}
          <section className="card">
            <h2
              style={{
                fontSize: "var(--font-sm)",
                fontWeight: "var(--font-medium)",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "var(--space-3)",
              }}
            >
              Description
            </h2>
            <p
              style={{
                fontSize: "var(--font-base)",
                color: "var(--text-secondary)",
                lineHeight: "var(--leading-relaxed)",
                whiteSpace: "pre-wrap",
              }}
            >
              {assignment.description}
            </p>
          </section>

          {/* Submissions table */}
          <section>
            <h2
              style={{
                fontSize: "var(--font-sm)",
                fontWeight: "var(--font-semibold)",
                color: "var(--text-primary)",
                marginBottom: "var(--space-3)",
              }}
            >
              Submissions
            </h2>

            {latestSubmissions.length === 0 ? (
              <div className="card" style={{ padding: 0 }}>
                <EmptyState
                  title="No submissions yet"
                  description="Students haven't submitted work for this assignment."
                />
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Status</th>
                        <th>Submitted</th>
                        <th>Attempts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestSubmissions.map((sub) => {
                        const attempts = assignment.submissions.filter(
                          (s) => s.studentId === sub.studentId
                        ).length;
                        return (
                          <tr key={sub.id}>
                            <td>
                              <span
                                style={{
                                  fontWeight: "var(--font-medium)",
                                  color: "var(--text-primary)",
                                }}
                              >
                                {sub.student.name}
                              </span>
                              <span
                                style={{
                                  display: "block",
                                  fontSize: "var(--font-xs)",
                                  color: "var(--text-muted)",
                                }}
                              >
                                {sub.student.email}
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
                              <span
                                style={{
                                  fontSize: "var(--font-sm)",
                                  color: "var(--text-muted)",
                                }}
                              >
                                {attempts}
                              </span>
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
        </div>

        {/* Right: metadata + stats */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {/* Deadline */}
          <div className="card">
            <p
              style={{
                fontSize: "var(--font-xs)",
                fontWeight: "var(--font-medium)",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "var(--space-2)",
              }}
            >
              Deadline
            </p>
            <p
              style={{
                fontSize: "var(--font-base)",
                fontWeight: "var(--font-medium)",
                color: isPast ? "var(--danger)" : "var(--text-primary)",
              }}
            >
              {formatDeadlineFull(assignment.deadline)}
            </p>
            <p
              style={{
                fontSize: "var(--font-xs)",
                color: "var(--text-muted)",
                marginTop: "var(--space-1)",
              }}
            >
              {isPast ? "Closed" : `Open · ${daysUntil(assignment.deadline)}`}
            </p>
          </div>

          {/* KPI stats */}
          <KpiCard
            label="Students submitted"
            value={totalStudents}
            support={`${totalSubmissions} total attempt${totalSubmissions !== 1 ? "s" : ""}`}
          />

          {totalStudents > 0 && (
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <p
                style={{
                  fontSize: "var(--font-xs)",
                  fontWeight: "var(--font-medium)",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Status breakdown
              </p>
              <StatRow
                label="Pending review"
                count={pendingCount}
                total={totalStudents}
                color="var(--status-pending)"
              />
              <StatRow
                label="Accepted"
                count={acceptedCount}
                total={totalStudents}
                color="var(--status-accepted)"
              />
              <StatRow
                label="Needs improvement"
                count={needsImprovementCount}
                total={totalStudents}
                color="var(--status-needs-improvement)"
              />
            </div>
          )}

          {/* Created metadata */}
          <div
            style={{
              fontSize: "var(--font-xs)",
              color: "var(--text-muted)",
              lineHeight: "var(--leading-relaxed)",
            }}
          >
            Created {formatDate(assignment.createdAt)}
            {assignment.updatedAt > assignment.createdAt && (
              <>
                <br />
                Updated {formatDate(assignment.updatedAt)}
              </>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatRow({
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
          alignItems: "center",
          marginBottom: "var(--space-1)",
        }}
      >
        <span style={{ fontSize: "var(--font-xs)", color: "var(--text-secondary)" }}>
          {label}
        </span>
        <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)" }}>
          {count} / {total}
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

function formatDeadlineFull(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function daysUntil(date: Date): string {
  const ms = date.getTime() - Date.now();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  if (days === 1) return "1 day left";
  if (days < 7) return `${days} days left`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 week left" : `${weeks} weeks left`;
}
