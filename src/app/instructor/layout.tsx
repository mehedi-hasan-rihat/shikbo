import { requireInstructor } from "@/lib/auth";
import { AppSidebar } from "@/components/layout/AppSidebar";
import type { NavSection } from "@/components/layout/SidebarNav";
import type React from "react";
import { db } from "@/lib/db";

const instructorNav: NavSection[] = [
  {
    label: "Instructor",
    items: [
      { label: "Dashboard", href: "/instructor/dashboard" },
      { label: "Assignments", href: "/instructor/assignments" },
      { label: "Submissions", href: "/instructor/submissions" },
      { label: "Students", href: "/instructor/students" },
      { label: "AI Assistant", href: "/instructor/ai" },
    ],
  },
];

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireInstructor();

  // Fetch the user's display name for the sidebar
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { name: true },
  });

  const displayName = user?.name ?? session.userId;

  return (
    <div className="app-shell">
      <AppSidebar
        sections={instructorNav}
        userName={displayName}
        role="instructor"
      />
      <main className="content-area" id="main-content">
        {children}
      </main>
    </div>
  );
}
