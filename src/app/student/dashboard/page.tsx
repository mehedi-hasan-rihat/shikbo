import { requireStudent } from "@/lib/auth";

export default async function StudentDashboardPage() {
  // Authorization is also enforced in the layout, but we re-check here
  // for any direct page access.
  await requireStudent();

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Your assignments and submission progress.
          </p>
        </div>
      </div>

      <div className="callout callout-info">
        Student dashboard is under construction. More features coming soon.
      </div>
    </>
  );
}
