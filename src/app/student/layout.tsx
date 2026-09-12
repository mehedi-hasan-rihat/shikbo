import { requireStudent } from "@/lib/auth";
import { AppSidebar } from "@/components/layout/AppSidebar";
import type { NavSection } from "@/components/layout/SidebarNav";
import type React from "react";
import { db } from "@/lib/db";

const studentNav: NavSection[] = [
  {
    label: "Student",
    items: [
      { label: "Dashboard", href: "/student/dashboard" },
      { label: "Assignments", href: "/student/assignments" },
      { label: "My Submissions", href: "/student/submissions" },
    ],
  },
];

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireStudent();

  // Fetch the user's display name for the sidebar
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { name: true },
  });

  const displayName = user?.name ?? session.userId;

  return (
    <div className="app-shell">
      <AppSidebar
        sections={studentNav}
        userName={displayName}
        role="student"
      />
      <main className="content-area" id="main-content">
        {children}
      </main>
    </div>
  );
}
