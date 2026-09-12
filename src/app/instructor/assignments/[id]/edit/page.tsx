import Link from "next/link";
import { notFound } from "next/navigation";
import { requireInstructor } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateAssignment } from "@/server/actions/assignment";
import { AssignmentForm } from "@/components/assignments/AssignmentForm";

type Params = Promise<{ id: string }>;

export default async function EditAssignmentPage({ params }: { params: Params }) {
  const session = await requireInstructor();
  const { id } = await params;

  const assignment = await db.assignment.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      deadline: true,
      difficulty: true,
      createdBy: true,
      archivedAt: true,
    },
  });

  // 404 if not found, belongs to someone else, or archived
  if (
    !assignment ||
    assignment.createdBy !== session.userId ||
    assignment.archivedAt !== null
  ) {
    notFound();
  }

  // Bind the assignment id into the server action
  const updateAction = updateAssignment.bind(null, id);

  return (
    <>
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
              href="/instructor/assignments"
              style={{ color: "var(--text-muted)" }}
            >
              Assignments
            </Link>
            {" / "}
            <Link
              href={`/instructor/assignments/${id}`}
              style={{ color: "var(--text-muted)" }}
            >
              {assignment.title}
            </Link>
            {" / "}
            <span>Edit</span>
          </nav>
          <h1 className="page-title">Edit assignment</h1>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <AssignmentForm
          action={updateAction}
          defaultValues={{
            title: assignment.title,
            description: assignment.description,
            deadline: assignment.deadline.toISOString(),
            difficulty: assignment.difficulty,
          }}
          submitLabel="Save changes"
        />
      </div>
    </>
  );
}
