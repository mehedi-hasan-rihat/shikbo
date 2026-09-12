import { requireStudent } from "@/lib/auth";
import { logout } from "@/server/actions/auth";

export default async function StudentDashboardPage() {
  // Server-side authorization — enforced here, not just in middleware.
  const session = await requireStudent();

  return (
    <div style={{ display: "flex", minHeight: "100dvh" }}>
      {/* Sidebar */}
      <nav className="sidebar">
        <div
          style={{
            padding: "var(--space-5) var(--space-4)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span
            style={{
              fontSize: "var(--font-base)",
              fontWeight: "var(--font-semibold)",
              color: "var(--text-primary)",
            }}
          >
            Shikbo
          </span>
        </div>

        <div className="sidebar-nav" style={{ flex: 1 }}>
          <p className="sidebar-section-label">Student</p>
          <a
            href="/student/dashboard"
            className="sidebar-nav-item active"
            aria-current="page"
          >
            Dashboard
          </a>
        </div>

        <div
          style={{
            padding: "var(--space-3) var(--space-2)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <form action={logout}>
            <button type="submit" className="sidebar-nav-item" style={{ width: "100%" }}>
              Sign out
            </button>
          </form>
        </div>
      </nav>

      {/* Main content */}
      <main className="content-area">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back, {session.userId}</p>
          </div>
        </div>

        <div className="callout callout-info">
          Student dashboard is under construction. More features coming soon.
        </div>
      </main>
    </div>
  );
}
