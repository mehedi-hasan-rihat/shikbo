import Link from "next/link";
import { requireInstructor } from "@/lib/auth";
import { db } from "@/lib/db";
import { DifficultyBadge, StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

type SearchParams = Promise<{ status?: string }>;

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "needs_improvement", label: "Needs Improvement" },
  { value: "accepted", label: "Accepted" },
] as const;

type FilterValue = (typeof STATUS_FILTERS)[number]["value"];

function isValidFilter(value: string | undefined): value is FilterValue {
  return STATUS_FILTERS.some((f) => f.value === value);
}

export default async function InstructorSubmissionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await requireInstructor();
  const { status: rawStatus } = await searchParams;
  const activeFilter: FilterValue = isValidFilter(rawStatus) ? rawStatus : "all";

  // Fetch latest submission per student per assignment, only for this instructor's assignments
  const submissions = await db.submission.findMany({
    where: {
      assignment: { createdBy: session.userId },
      ...(activeFilter !== "all" ? { status: activeFilter } : {}),
    },
    orderBy: { submittedAt: "desc" },
    include: {
      student: { select: { id: true, name: true, email: true } },
      assignment: {
        select: {
          id: true,
          title: true,
          difficulty: true,
        },
      },
    },
  });

  // Count per status for filter labels
  const allCounts = await db.submission.groupBy({
    by: ["status"],
    where: { assignment: { createdBy: session.userId } },
    _count: { status: true },
  });

  const countMap: Record<string, number> = { all: 0 };
  for (const row of allCounts) {
    countMap[row.status] = row._count.status;
    countMap.all = (countMap.all ?? 0) + row._count.status;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Submissions</h1>
          <p className="page-subtitle">
            {submissions.length === 0
              ? "No submissions match the current filter."
              : `${submissions.length} submission${submissions.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-1)",
          marginBottom: "var(--space-5)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {STATUS_FILTERS.map((filter) => {
          const isActive = filter.value === activeFilter;
          const count = countMap[filter.value] ?? 0;
          return (
            <Link
              key={filter.value}
              href={
                filter.value === "all"
                  ? "/instructor/submissions"
                  : `/instructor/submissions?status=${filter.value}`
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-3)",
                fontSize: "var(--font-sm)",
                fontWeight: isActive ? "var(--font-medium)" : "var(--font-regular)",
                color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                borderBottom: isActive
                  ? "2px solid var(--primary)"
                  : "2px solid transparent",
                marginBottom: -1,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              {filter.label}
              {count > 0 && (
                <span
                  style={{
                    fontSize: "var(--font-xs)",
                    color: isActive ? "var(--primary)" : "var(--text-muted)",
                    background: isActive
                      ? "var(--primary-subtle)"
                      : "var(--background-muted)",
                    padding: "0 var(--space-2)",
                    borderRadius: "var(--radius-md)",
                    lineHeight: "18px",
                  }}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {submissions.length === 0 ? (
        <EmptyState
          title="No submissions"
          description={
            activeFilter === "all"
              ? "No students have submitted work yet."
              : `No submissions with status "${STATUS_FILTERS.find((f) => f.value === activeFilter)?.label}".`
          }
        />
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Assignment</th>
                  <th>Difficulty</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th style={{ width: 1, whiteSpace: "nowrap" }}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <span
                        style={{
                          fontWeight: "var(--font-medium)",
                          color: "var(--text-primary)",
                          display: "block",
                        }}
                      >
                        {sub.student.name}
                      </span>
                      <span
                        style={{
                          fontSize: "var(--font-xs)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {sub.student.email}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/instructor/assignments/${sub.assignment.id}`}
                        style={{
                          fontSize: "var(--font-sm)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {sub.assignment.title}
                      </Link>
                    </td>
                    <td>
                      <DifficultyBadge difficulty={sub.assignment.difficulty} />
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
                      <StatusBadge status={sub.status} />
                    </td>
                    <td>
                      <Link
                        href={`/instructor/submissions/${sub.id}`}
                        style={{
                          fontSize: "var(--font-sm)",
                          color: "var(--primary)",
                          whiteSpace: "nowrap",
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
