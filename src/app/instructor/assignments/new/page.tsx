import Link from "next/link";
import { requireInstructor } from "@/lib/auth";
import { createAssignment } from "@/server/actions/assignment";
import { AssignmentForm } from "@/components/assignments/AssignmentForm";

export default async function NewAssignmentPage() {
  await requireInstructor();

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
            <span>New</span>
          </nav>
          <h1 className="page-title">New assignment</h1>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <AssignmentForm action={createAssignment} submitLabel="Create assignment" />
      </div>
    </>
  );
}
