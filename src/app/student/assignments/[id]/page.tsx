import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStudent } from "@/lib/auth";
import { db } from "@/lib/db";
import { DifficultyBadge, StatusBadge } from "@/components/ui/Badge";
import { createSubmission } from "@/server/actions/submission";
import { SubmitSection } from "./SubmitSection";

type Params = Promise<{ id: string }>;

export default async function StudentAssignmentDetailPage({
  params,
}: {
  params: Params;
}) {
  const session = await requireStudent();
  const { id } = await params;

  const assignment = await db.assignment.findUnique({
    where: { id, archivedAt: null },
    include: {
      submissions: {
        where: { studentId: session.userId },
        orderBy: { submittedAt: "desc" },
      },
    },
  });

  if (!assignment) {
    notFound();
  }

  const now = new Date();
  const isPast = assignment.deadline < now;
  const isUpcoming =
    !isPast &&
    assignment.deadline.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000;

  const latestSubmission = assignment.submissions[0] ?? null;

  // Bind the server action with the assignment ID
  const boundAction = createSubmission.bind(null, assignment.id);

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
              href="/student/assignments"
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
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="dash-grid-sidebar-right">
        {/* Left: description + submission form */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}
        >
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

          {/* Current submission status + feedback */}
          {latestSubmission && (
            <section className="card">
              <h2
                style={{
                  fontSize: "var(--font-sm)",
                  fontWeight: "var(--font-medium)",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "var(--space-4)",
                }}
              >
                Latest submission
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                  }}
                >
                  <StatusBadge status={latestSubmission.status} />
                  <span
                    style={{
                      fontSize: "var(--font-sm)",
                      color: "var(--text-muted)",
                    }}
                  >
                    Submitted {formatDate(latestSubmission.submittedAt)}
                  </span>
                </div>

                <div>
                  <span
                    style={{
                      fontSize: "var(--font-xs)",
                      color: "var(--text-muted)",
                      display: "block",
                      marginBottom: "var(--space-1)",
                    }}
                  >
                    Project URL
                  </span>
                  <a
                    href={latestSubmission.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "var(--font-sm)",
                      color: "var(--primary)",
                      wordBreak: "break-all",
                    }}
                  >
                    {latestSubmission.url}
                  </a>
                </div>

                {latestSubmission.note && (
                  <div>
                    <span
                      style={{
                        fontSize: "var(--font-xs)",
                        color: "var(--text-muted)",
                        display: "block",
                        marginBottom: "var(--space-1)",
                      }}
                    >
                      Your note
                    </span>
                    <p
                      style={{
                        fontSize: "var(--font-sm)",
                        color: "var(--text-secondary)",
                        lineHeight: "var(--leading-relaxed)",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {latestSubmission.note}
                    </p>
                  </div>
                )}

                {latestSubmission.feedback && (
                  <div
                    style={{
                      marginTop: "var(--space-1)",
                      paddingTop: "var(--space-4)",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "var(--font-xs)",
                        fontWeight: "var(--font-medium)",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        display: "block",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      Instructor feedback
                    </span>
                    <p
                      style={{
                        fontSize: "var(--font-sm)",
                        color: "var(--text-secondary)",
                        lineHeight: "var(--leading-relaxed)",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {latestSubmission.feedback}
                    </p>
                    {latestSubmission.reviewedAt && (
                      <p
                        style={{
                          fontSize: "var(--font-xs)",
                          color: "var(--text-muted)",
                          marginTop: "var(--space-2)",
                        }}
                      >
                        Reviewed {formatDate(latestSubmission.reviewedAt)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Submission form */}
          <section className="card">
            <h2
              style={{
                fontSize: "var(--font-sm)",
                fontWeight: "var(--font-medium)",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "var(--space-4)",
              }}
            >
              {latestSubmission ? "Resubmit" : "Submit your work"}
            </h2>
            <SubmitSection
              action={boundAction}
              isClosed={isPast}
              lastUrl={latestSubmission?.url}
              lastNote={latestSubmission?.note ?? undefined}
              hasExisting={latestSubmission !== null}
            />
          </section>
        </div>

        {/* Right: metadata */}
        <aside
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
        >
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
              {isPast
                ? "Closed"
                : isUpcoming
                  ? `Open · ${daysUntil(assignment.deadline)}`
                  : `Open · ${daysUntil(assignment.deadline)}`}
            </p>
          </div>

          {/* Submission count */}
          {assignment.submissions.length > 0 && (
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
                Your attempts
              </p>
              <p
                style={{
                  fontSize: "var(--font-2xl)",
                  fontWeight: "var(--font-semibold)",
                  color: "var(--text-primary)",
                }}
              >
                {assignment.submissions.length}
              </p>
              <p
                style={{
                  fontSize: "var(--font-xs)",
                  color: "var(--text-secondary)",
                  marginTop: "var(--space-1)",
                }}
              >
                {assignment.submissions.length === 1
                  ? "1 submission"
                  : `${assignment.submissions.length} submissions`}
              </p>
              <Link
                href={`/student/assignments/${assignment.id}/history`}
                style={{
                  display: "block",
                  marginTop: "var(--space-3)",
                  fontSize: "var(--font-sm)",
                  color: "var(--primary)",
                }}
              >
                View history
              </Link>
            </div>
          )}
        </aside>
      </div>
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
