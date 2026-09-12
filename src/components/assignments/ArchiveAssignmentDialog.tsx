"use client";

import { useTransition } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { archiveAssignment } from "@/server/actions/assignment";

type ArchiveAssignmentDialogProps = {
  assignmentId: string;
  assignmentTitle: string;
  hasSubmissions: boolean;
  open: boolean;
  onClose: () => void;
};

export function ArchiveAssignmentDialog({
  assignmentId,
  assignmentTitle,
  hasSubmissions,
  open,
  onClose,
}: ArchiveAssignmentDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await archiveAssignment(assignmentId);
    });
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Archive assignment"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="danger" loading={isPending} onClick={handleConfirm}>
            Archive
          </Button>
        </>
      }
    >
      <p
        style={{
          fontSize: "var(--font-base)",
          color: "var(--text-secondary)",
          lineHeight: "var(--leading-normal)",
        }}
      >
        Archive{" "}
        <strong style={{ color: "var(--text-primary)", fontWeight: "var(--font-medium)" }}>
          {assignmentTitle}
        </strong>
        ? It will no longer appear in the active assignment list.
      </p>

      {hasSubmissions && (
        <div
          className="callout callout-warning"
          style={{ marginTop: "var(--space-4)" }}
        >
          This assignment has submissions. Archiving preserves all submission
          history — nothing is deleted.
        </div>
      )}
    </Dialog>
  );
}
