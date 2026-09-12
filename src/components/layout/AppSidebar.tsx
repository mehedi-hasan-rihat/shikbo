import type { NavSection } from "./SidebarNav";
import { SidebarNav } from "./SidebarNav";
import { UserMenu } from "./UserMenu";
import { MobileSidebar } from "./MobileSidebar";

type AppSidebarProps = {
  sections: NavSection[];
  userName: string;
  role: "instructor" | "student";
};

/**
 * Desktop sidebar — server component.
 * Uses SidebarNav (client) for active-link state and UserMenu (client) for the dropdown.
 * On mobile, renders MobileSidebar (client) instead via CSS.
 */
export function AppSidebar({ sections, userName, role }: AppSidebarProps) {
  return (
    <>
      {/* Desktop sidebar — hidden on mobile via CSS */}
      <nav
        className="sidebar"
        aria-label="Main navigation"
        style={{ "--sidebar-display": "flex" } as React.CSSProperties}
      >
        {/* Logo / brand */}
        <div
          style={{
            padding: "var(--space-5) var(--space-4)",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: "var(--font-base)",
              fontWeight: "var(--font-semibold)",
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            Shikbo
          </span>
        </div>

        {/* Navigation */}
        <SidebarNav sections={sections} />

        {/* User */}
        <div
          style={{
            padding: "var(--space-2)",
            borderTop: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <UserMenu name={userName} role={role} />
        </div>
      </nav>

      {/* Mobile drawer — only rendered/visible on mobile */}
      <div className="mobile-nav-wrapper">
        <MobileSidebar
          sections={sections}
          appName="Shikbo"
          userName={userName}
          role={role}
        />
      </div>
    </>
  );
}
