import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";

export default function SubmissionNotFound() {
  return (
    <ErrorState
      title="Submission not found"
      message="This submission doesn't exist or you don't have permission to review it."
      action={
        <Link href="/instructor/submissions">
          <Button variant="secondary">Back to submissions</Button>
        </Link>
      }
    />
  );
}
