"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArchiveAssignmentDialog } from "@/components/assignments/ArchiveAssignmentDialog";
import { restoreAssignment } from "@/server/actions/assignment";
import { useTransition } from "react";

type AssignmentActionsProps = {
  assignmentId: string;
  assignmentTitle: string;
  hasSubmissions: boolean;
  isArchived: boolean;
};

export function AssignmentActions({
  assignmentId,
  assignmentTitle,
  hasSubmissions,
  isArchived,
}: AssignmentActionsProps) {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleRestore() {
    startTransition(async () => {
      await restoreAssignment(assignmentId);
    });
  }

  if (isArchived) {
    return (
      <div
        style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
      >
        <span
          style={{
            fontSize: "var(--font-xs)",
            fontWeight: "var(--font-medium)",
            color: "var(--text-muted)",
            padding: "var(--space-1) var(--space-2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
          }}
        >
          Archived
        </span>
        <Button
          variant="secondary"
          size="sm"
          loading={isPending}
          onClick={handleRestore}
        >
          Restore
        </Button>
      </div>
    );
  }

  return (
    <>
      <div
        style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
      >
        <Link href={`/instructor/assignments/${assignmentId}/edit`}>
          <Button variant="secondary" size="sm">
            Edit
          </Button>
        </Link>
        <Button
          variant="danger-ghost"
          size="sm"
          onClick={() => setShowArchiveDialog(true)}
        >
          Archive
        </Button>
      </div>

      <ArchiveAssignmentDialog
        assignmentId={assignmentId}
        assignmentTitle={assignmentTitle}
        hasSubmissions={hasSubmissions}
        open={showArchiveDialog}
        onClose={() => setShowArchiveDialog(false)}
      />
    </>
  );
}
