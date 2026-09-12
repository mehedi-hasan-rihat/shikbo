import { LoadingState } from "@/components/ui/LoadingState";

// Shown by Next.js while any student server component is fetching data.
// Covers /student/dashboard, /student/assignments, /student/submissions, etc.
export default function StudentLoading() {
  return <LoadingState variant="kpi" rows={3} />;
}
