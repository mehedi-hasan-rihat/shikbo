import { LoadingState } from "@/components/ui/LoadingState";

// Shown by Next.js while any instructor server component is fetching data.
// Covers /instructor/dashboard, /instructor/assignments, /instructor/submissions, etc.
export default function InstructorLoading() {
  return <LoadingState variant="kpi" rows={3} />;
}
