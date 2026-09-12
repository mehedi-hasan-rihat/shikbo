import { requireInstructor } from "@/lib/auth";

export default async function InstructorDashboardPage() {
  // Authorization is also enforced in the layout, but we re-check here
  // for any direct page access and to get the session data.
  await requireInstructor();

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Overview of your assignments and student activity.
          </p>
        </div>
      </div>

      <div className="callout callout-info">
        Instructor dashboard is under construction. More features coming soon.
      </div>
    </>
  );
}
