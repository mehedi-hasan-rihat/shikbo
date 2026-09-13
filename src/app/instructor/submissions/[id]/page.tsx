import Link from "next/link";
import { notFound } from "next/navigation";
import { requireInstructor } from "@/lib/auth";
import { db } from "@/lib/db";
import { DifficultyBadge, StatusBadge } from "@/components/ui/Badge";
import { reviewSubmission } from "@/server/actions/review";
import { ReviewForm } from "@/components/submissions/ReviewForm";

type Params = Promise<{ id: string }>;

export default async function SubmissionReviewPage({
  params,
}: {
  params: Params;
}) {
  const session = await requireInstructor();
  const { id } = await params;

  const submission = await db.submission.findUnique({
    where: { id },
    include: {
      student: { select: { id: true, name: true, email: true } },
      assignment: {
        select: {
          id: true,
          title: true,
          description: true,
          difficulty: true,
          deadline: true,
          createdBy: true,
        },
      },
    },
  });

  if (!submission || submission.assignment.createdBy !== session.userId) {
    notFound();
  }

  // All submissions from this student for this assignment, for history
  const allSubmissions = await db.submission.findMany({
    where: {
      assignmentId: submission.assignmentId,
      studentId: submission.studentId,
    },
    orderBy: { submittedAt: "desc" },
  });

  const attemptNumber =
    allSubmissions.length -
    allSubmissions.findIndex((s) => s.id === submission.id);

  const isLatest = allSubmissions[0]?.id === submission.id;

  const boundAction = reviewSubmission.bind(null, submission.id);

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
              href="/instructor/submissions"
              style={{ color: "var(--text-muted)" }}
            >
              Submissions
            </Link>
            {" / "}
            <Link
              href={`/instructor/assignments/${submission.assignment.id}`}
              style={{ color: "var(--text-muted)" }}
            >
              {submission.assignment.title}
            </Link>
            {" / "}
            <span>{submission.student.name}</span>
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
              {submission.student.name}
            </h1>
            <StatusBadge status={submission.status} />
            {!isLatest && (
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
                Earlier attempt
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "var(--space-6)",
          alignItems: "start",
        }}
      >
        {/* Left: submission content + review form */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}
        >
          {/* Submission details */}
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
              Submission · Attempt {attemptNumber}
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-4)",
              }}
            >
              {/* URL */}
              <div>
                <p
                  style={{
                    fontSize: "var(--font-xs)",
                    color: "var(--text-muted)",
                    marginBottom: "var(--space-1)",
                  }}
                >
                  Project URL
                </p>
                <a
                  href={submission.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "var(--font-sm)",
                    color: "var(--primary)",
                    wordBreak: "break-all",
                  }}
                >
                  {submission.url}
                </a>
              </div>

              {/* Student note */}
              {submission.note ? (
                <div>
                  <p
                    style={{
                      fontSize: "var(--font-xs)",
                      color: "var(--text-muted)",
                      marginBottom: "var(--space-1)",
                    }}
                  >
                    Student note
                  </p>
                  <p
                    style={{
                      fontSize: "var(--font-sm)",
                      color: "var(--text-secondary)",
                      lineHeight: "var(--leading-relaxed)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {submission.note}
                  </p>
                </div>
              ) : (
                <p
                  style={{
                    fontSize: "var(--font-sm)",
                    color: "var(--text-muted)",
                    fontStyle: "italic",
                  }}
                >
                  No note from student.
                </p>
              )}

              {/* Submitted at */}
              <p
                style={{
                  fontSize: "var(--font-xs)",
                  color: "var(--text-muted)",
                }}
              >
                Submitted {formatDateFull(submission.submittedAt)}
              </p>
            </div>
          </section>

          {/* Review form */}
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
              Review
            </h2>
            <ReviewForm
              action={boundAction}
              defaultStatus={submission.status}
              defaultFeedback={submission.feedback ?? ""}
              aiContext={{
                assignmentTitle: submission.assignment.title,
                assignmentDescription: submission.assignment.description,
                difficulty: submission.assignment.difficulty as "beginner" | "intermediate" | "advanced",
                studentNote: submission.note,
                submissionStatus: submission.status as "pending" | "accepted" | "needs_improvement",
              }}
            />
          </section>

          {/* Submission history (other attempts) */}
          {allSubmissions.length > 1 && (
            <section>
              <h2
                style={{
                  fontSize: "var(--font-sm)",
                  fontWeight: "var(--font-semibold)",
                  color: "var(--text-primary)",
                  marginBottom: "var(--space-3)",
                }}
              >
                All attempts
              </h2>
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Attempt</th>
                        <th>Submitted</th>
                        <th>Status</th>
                        <th style={{ width: 1, whiteSpace: "nowrap" }}>
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allSubmissions.map((s, index) => {
                        const num = allSubmissions.length - index;
                        const isCurrent = s.id === submission.id;
                        return (
                          <tr
                            key={s.id}
                            style={
                              isCurrent
                                ? { background: "var(--background-subtle)" }
                                : undefined
                            }
                          >
                            <td>
                              <span
                                style={{
                                  fontSize: "var(--font-sm)",
                                  fontWeight: isCurrent
                                    ? "var(--font-medium)"
                                    : undefined,
                                  color: isCurrent
                                    ? "var(--text-primary)"
                                    : "var(--text-secondary)",
                                }}
                              >
                                Attempt {num}
                              </span>
                              {index === 0 && (
                                <span
                                  style={{
                                    marginLeft: "var(--space-2)",
                                    fontSize: "var(--font-xs)",
                                    color: "var(--primary)",
                                  }}
                                >
                                  Latest
                                </span>
                              )}
                            </td>
                            <td>
                              <span
                                style={{
                                  fontSize: "var(--font-sm)",
                                  color: "var(--text-secondary)",
                                }}
                              >
                                {formatDate(s.submittedAt)}
                              </span>
                            </td>
                            <td>
                              <StatusBadge status={s.status} />
                            </td>
                            <td>
                              {isCurrent ? (
                                <span
                                  style={{
                                    fontSize: "var(--font-sm)",
                                    color: "var(--text-muted)",
                                  }}
                                >
                                  Current
                                </span>
                              ) : (
                                <Link
                                  href={`/instructor/submissions/${s.id}`}
                                  style={{
                                    fontSize: "var(--font-sm)",
                                    color: "var(--primary)",
                                  }}
                                >
                                  View
                                </Link>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right sidebar: assignment + student info */}
        <aside
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
        >
          {/* Student */}
          <div className="card">
            <p
              style={{
                fontSize: "var(--font-xs)",
                fontWeight: "var(--font-medium)",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "var(--space-3)",
              }}
            >
              Student
            </p>
            <p
              style={{
                fontSize: "var(--font-base)",
                fontWeight: "var(--font-medium)",
                color: "var(--text-primary)",
              }}
            >
              {submission.student.name}
            </p>
            <p
              style={{
                fontSize: "var(--font-sm)",
                color: "var(--text-muted)",
                marginTop: "var(--space-1)",
              }}
            >
              {submission.student.email}
            </p>
            <p
              style={{
                fontSize: "var(--font-xs)",
                color: "var(--text-muted)",
                marginTop: "var(--space-3)",
              }}
            >
              {allSubmissions.length} attempt
              {allSubmissions.length !== 1 ? "s" : ""} on this assignment
            </p>
          </div>

          {/* Assignment */}
          <div className="card">
            <p
              style={{
                fontSize: "var(--font-xs)",
                fontWeight: "var(--font-medium)",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "var(--space-3)",
              }}
            >
              Assignment
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "var(--space-2)",
                marginBottom: "var(--space-2)",
              }}
            >
              <Link
                href={`/instructor/assignments/${submission.assignment.id}`}
                style={{
                  fontSize: "var(--font-base)",
                  fontWeight: "var(--font-medium)",
                  color: "var(--text-primary)",
                  lineHeight: "var(--leading-snug)",
                }}
              >
                {submission.assignment.title}
              </Link>
              <DifficultyBadge difficulty={submission.assignment.difficulty} />
            </div>
            <p
              style={{
                fontSize: "var(--font-xs)",
                color: "var(--text-muted)",
              }}
            >
              Deadline: {formatDate(submission.assignment.deadline)}
            </p>
          </div>

          {/* Review status */}
          {submission.reviewedAt && (
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
                Last reviewed
              </p>
              <p
                style={{
                  fontSize: "var(--font-sm)",
                  color: "var(--text-secondary)",
                }}
              >
                {formatDateFull(submission.reviewedAt)}
              </p>
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

function formatDateFull(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
