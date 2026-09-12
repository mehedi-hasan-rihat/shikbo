"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";

export default function InstructorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    // aria-live="assertive" announces this to screen readers when it mounts
    <div role="alert" aria-live="assertive">
      <ErrorState
        title="Something went wrong"
        message="An unexpected error occurred. Try again or reload the page."
        action={
          <Button variant="secondary" onClick={reset}>
            Try again
          </Button>
        }
      />
    </div>
  );
}
