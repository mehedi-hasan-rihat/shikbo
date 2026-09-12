import Link from "next/link";
import { requireStudent } from "@/lib/auth";
import { db } from "@/lib/db";
import { DifficultyBadge, StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function StudentAssignmentsPage() {
  const session = await requireStudent();

  // Fetch all active assignments (not archived), ordered by deadline ascending
  const assignments = await db.assignment.findMany({
    where: { archivedAt: null },
    orderBy: { deadline: "asc" },
    include: {
      submissions: {
        where: { studentId: session.userId },
        orderBy: { submittedAt: "desc" },
        take: 1,
        select: { status: true, submittedAt: true },
      },
    },
  });

  const now = new Date();

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignments</h1>
          <p className="page-subtitle">
            {assignments.length === 0
              ? "No assignments available."
              : `${assignments.length} assignment${assignments.length !== 1 ? "s" : ""} available`}
          </p>
        </div>
      </div>

      {assignments.length === 0 ? (
        <EmptyState
          title="No assignments yet"
          description="Your instructor hasn't published any assignments. Check back soon."
        />
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Difficulty</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th style={{ width: 1, whiteSpace: "nowrap" }}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => {
                  const isPast = a.deadline < now;
                  const isUpcoming =
                    !isPast &&
                    a.deadline.getTime() - now.getTime() <
                      7 * 24 * 60 * 60 * 1000;
                  const latestSubmission = a.submissions[0] ?? null;

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
                      </td>
                      <td>
                        <DifficultyBadge difficulty={a.difficulty} />
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "var(--font-sm)",
                            color: isPast
                              ? "var(--danger)"
                              : isUpcoming
                                ? "var(--warning)"
                                : "var(--text-secondary)",
                          }}
                        >
                          {formatDeadline(a.deadline)}
                        </span>
                        {isPast && (
                          <span
                            style={{
                              display: "block",
                              fontSize: "var(--font-xs)",
                              color: "var(--text-muted)",
                            }}
                          >
                            Closed
                          </span>
                        )}
                      </td>
                      <td>
                        {latestSubmission ? (
                          <StatusBadge status={latestSubmission.status} />
                        ) : (
                          <span
                            style={{
                              fontSize: "var(--font-xs)",
                              color: "var(--text-muted)",
                            }}
                          >
                            Not submitted
                          </span>
                        )}
                      </td>
                      <td>
                        <Link
                          href={`/student/assignments/${a.id}`}
                          style={{
                            fontSize: "var(--font-sm)",
                            color: "var(--primary)",
                          }}
                        >
                          View
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

function formatDeadline(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
