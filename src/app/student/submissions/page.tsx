import Link from "next/link";
import { requireStudent } from "@/lib/auth";
import { db } from "@/lib/db";
import { DifficultyBadge, StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function StudentSubmissionsPage() {
  const session = await requireStudent();

  // Fetch all submissions for this student, latest first
  const submissions = await db.submission.findMany({
    where: { studentId: session.userId },
    orderBy: { submittedAt: "desc" },
    include: {
      assignment: {
        select: {
          id: true,
          title: true,
          difficulty: true,
          deadline: true,
          archivedAt: true,
        },
      },
    },
  });

  // Group by assignmentId so we can show "N attempts" and the latest status
  const byAssignment = new Map<
    string,
    { attempts: typeof submissions; latest: (typeof submissions)[0] }
  >();

  for (const sub of submissions) {
    const existing = byAssignment.get(sub.assignmentId);
    if (!existing) {
      byAssignment.set(sub.assignmentId, { attempts: [sub], latest: sub });
    } else {
      existing.attempts.push(sub);
      // submissions are already desc-ordered, so first encountered = latest
    }
  }

  const groups = [...byAssignment.values()];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Submissions</h1>
          <p className="page-subtitle">
            {groups.length === 0
              ? "You haven't submitted any work yet."
              : `${groups.length} assignment${groups.length !== 1 ? "s" : ""} submitted`}
          </p>
        </div>
      </div>

      {groups.length === 0 ? (
        <EmptyState
          title="No submissions yet"
          description="Browse assignments and submit your work to see it here."
          action={
            <Link
              href="/student/assignments"
              style={{ fontSize: "var(--font-sm)", color: "var(--primary)" }}
            >
              Browse assignments
            </Link>
          }
        />
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Difficulty</th>
                  <th>Latest status</th>
                  <th>Attempts</th>
                  <th>Last submitted</th>
                  <th style={{ width: 1, whiteSpace: "nowrap" }}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {groups.map(({ latest, attempts }) => {
                  const a = latest.assignment;
                  const hasFeedback = latest.feedback !== null;

                  return (
                    <tr key={a.id}>
                      <td>
                        <Link
                          href={`/student/assignments/${a.id}`}
                          style={{
                            fontWeight: "var(--font-medium)",
                            color: "var(--text-primary)",
                          }}
                        >
                          {a.title}
                        </Link>
                        {hasFeedback && (
                          <span
                            style={{
                              display: "block",
                              fontSize: "var(--font-xs)",
                              color: "var(--success)",
                              marginTop: "var(--space-1)",
                            }}
                          >
                            Feedback available
                          </span>
                        )}
                      </td>
                      <td>
                        <DifficultyBadge difficulty={a.difficulty} />
                      </td>
                      <td>
                        <StatusBadge status={latest.status} />
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "var(--font-sm)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {attempts.length}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "var(--font-sm)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {formatDate(latest.submittedAt)}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/student/assignments/${a.id}/history`}
                          style={{
                            fontSize: "var(--font-sm)",
                            color: "var(--primary)",
                          }}
                        >
                          History
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
    </>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
