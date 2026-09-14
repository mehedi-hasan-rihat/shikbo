import Link from "next/link";
import { requireInstructor } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { DifficultyBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function InstructorAssignmentsPage() {
  const session = await requireInstructor();

  const assignments = await db.assignment.findMany({
    where: {
      createdBy: session.userId,
      archivedAt: null,
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { submissions: true } },
    },
  });

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignments</h1>
          <p className="page-subtitle">
            {assignments.length === 0
              ? "No assignments yet."
              : `${assignments.length} active assignment${assignments.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link href="/instructor/assignments/new">
          <Button variant="primary">New assignment</Button>
        </Link>
      </div>

      {assignments.length === 0 ? (
        <EmptyState
          title="No assignments"
          description="Create your first assignment to get started."
          action={
            <Link href="/instructor/assignments/new">
              <Button variant="primary">New assignment</Button>
            </Link>
          }
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
                  <th>Submissions</th>
                  <th>Status</th>
                  <th style={{ width: 1, whiteSpace: "nowrap" }}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => {
                  const now = new Date();
                  const isPast = a.deadline < now;
                  const isUpcoming =
                    !isPast &&
                    a.deadline.getTime() - now.getTime() <
                      7 * 24 * 60 * 60 * 1000;

                  return (
                    <tr key={a.id}>
                      <td data-label="Title">
                        <Link
                          href={`/instructor/assignments/${a.id}`}
                          style={{
                            fontWeight: "var(--font-medium)",
                            color: "var(--text-primary)",
                          }}
                        >
                          {a.title}
                        </Link>
                      </td>
                      <td data-label="Difficulty">
                        <DifficultyBadge difficulty={a.difficulty} />
                      </td>
                      <td data-label="Deadline">
                        <span
                          style={{
                            color: isPast
                              ? "var(--danger)"
                              : isUpcoming
                                ? "var(--warning)"
                                : "var(--text-secondary)",
                            fontSize: "var(--font-sm)",
                          }}
                        >
                          {formatDeadline(a.deadline)}
                        </span>
                      </td>
                      <td data-label="Submissions">
                        <span
                          style={{
                            fontSize: "var(--font-sm)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {a._count.submissions}
                        </span>
                      </td>
                      <td data-label="Status">
                        <span
                          style={{
                            fontSize: "var(--font-xs)",
                            fontWeight: "var(--font-medium)",
                            color: isPast
                              ? "var(--status-pending)"
                              : "var(--success)",
                          }}
                        >
                          {isPast ? "Closed" : "Open"}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/instructor/assignments/${a.id}`}
                          className={
                            a._count.submissions > 0 && !isPast
                              ? "btn btn-primary btn-sm"
                              : "btn btn-ghost btn-sm"
                          }
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {a._count.submissions > 0 && !isPast ? "Review →" : "View"}
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
