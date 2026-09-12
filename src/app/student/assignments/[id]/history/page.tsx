import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStudent } from "@/lib/auth";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

type Params = Promise<{ id: string }>;

export default async function AssignmentHistoryPage({
  params,
}: {
  params: Params;
}) {
  const session = await requireStudent();
  const { id } = await params;

  const assignment = await db.assignment.findUnique({
    where: { id, archivedAt: null },
    select: { id: true, title: true },
  });

  if (!assignment) {
    notFound();
  }

  const submissions = await db.submission.findMany({
    where: {
      assignmentId: id,
      studentId: session.userId,
    },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div>
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
            <Link
              href={`/student/assignments/${id}`}
              style={{ color: "var(--text-muted)" }}
            >
              {assignment.title}
            </Link>
            {" / "}
            <span>History</span>
          </nav>
          <h1 className="page-title">Submission history</h1>
          <p className="page-subtitle">{assignment.title}</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <EmptyState
          title="No submissions yet"
          description="You haven't submitted anything for this assignment."
          action={
            <Link
              href={`/student/assignments/${id}`}
              style={{ fontSize: "var(--font-sm)", color: "var(--primary)" }}
            >
              Go to assignment
            </Link>
          }
        />
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
        >
          {submissions.map((sub, index) => {
            const attemptNumber = submissions.length - index;
            const isLatest = index === 0;

            return (
              <div key={sub.id} className="card">
                {/* Attempt header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-3)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "var(--font-sm)",
                        fontWeight: "var(--font-semibold)",
                        color: "var(--text-primary)",
                      }}
                    >
                      Attempt {attemptNumber}
                    </span>
                    {isLatest && (
                      <span
                        style={{
                          fontSize: "var(--font-xs)",
                          fontWeight: "var(--font-medium)",
                          color: "var(--primary)",
                          padding: "2px var(--space-2)",
                          border: "1px solid var(--primary)",
                          borderRadius: "var(--radius-md)",
                        }}
                      >
                        Latest
                      </span>
                    )}
                  </div>
                  <StatusBadge status={sub.status} />
                </div>

                {/* Submission fields */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-3)",
                  }}
                >
                  {/* URL */}
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
                      href={sub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "var(--font-sm)",
                        color: "var(--primary)",
                        wordBreak: "break-all",
                      }}
                    >
                      {sub.url}
                    </a>
                  </div>

                  {/* Date */}
                  <div>
                    <span
                      style={{
                        fontSize: "var(--font-xs)",
                        color: "var(--text-muted)",
                        display: "block",
                        marginBottom: "var(--space-1)",
                      }}
                    >
                      Submitted
                    </span>
                    <span
                      style={{
                        fontSize: "var(--font-sm)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {formatDateFull(sub.submittedAt)}
                    </span>
                  </div>

                  {/* Student note */}
                  {sub.note && (
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
                        {sub.note}
                      </p>
                    </div>
                  )}

                  {/* Instructor feedback */}
                  {sub.feedback && (
                    <div
                      style={{
                        paddingTop: "var(--space-3)",
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
                        {sub.feedback}
                      </p>
                      {sub.reviewedAt && (
                        <p
                          style={{
                            fontSize: "var(--font-xs)",
                            color: "var(--text-muted)",
                            marginTop: "var(--space-2)",
                          }}
                        >
                          Reviewed {formatDate(sub.reviewedAt)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Not yet reviewed */}
                  {!sub.feedback && sub.status === "pending" && (
                    <p
                      style={{
                        fontSize: "var(--font-xs)",
                        color: "var(--text-muted)",
                        fontStyle: "italic",
                      }}
                    >
                      Awaiting instructor review.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
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
