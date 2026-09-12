import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";

export default function AssignmentNotFound() {
  return (
    <ErrorState
      title="Assignment not found"
      message="This assignment doesn't exist or you don't have permission to view it."
      action={
        <Link href="/instructor/assignments">
          <Button variant="secondary">Back to assignments</Button>
        </Link>
      }
    />
  );
}
