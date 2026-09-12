import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";

export default function AssignmentNotFound() {
  return (
    <ErrorState
      title="Assignment not found"
      message="This assignment is no longer available or doesn't exist."
      action={
        <Link href="/student/assignments">
          <Button variant="secondary">Browse assignments</Button>
        </Link>
      }
    />
  );
}
