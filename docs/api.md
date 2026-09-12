# Shikbo API Contract

## Authentication

POST /api/auth/register
POST /api/auth/login

## Assignments

GET /api/assignments
POST /api/assignments

GET /api/assignments/:id
PATCH /api/assignments/:id
DELETE /api/assignments/:id

## Submissions

POST /api/assignments/:id/submissions
GET /api/submissions/my

GET /api/instructor/submissions
PATCH /api/submissions/:id/review

### Server Actions (instructor)

`reviewSubmission(submissionId, state, formData)` — updates `status`, `feedback`, and `reviewedAt`
on a Submission. Verifies authenticated instructor owns the assignment before writing.
Status must be one of `pending | accepted | needs_improvement`. Feedback optional, max 5,000 chars.
On success redirects to `/instructor/submissions/:id`.

### Server Actions (student)

`createSubmission(assignmentId, state, formData)` — creates a new Submission record for the
authenticated student. Validates: authenticated student, assignment exists + active + deadline
not passed, URL required and must be http/https, note optional max 2,000 chars. On success
redirects to `/student/assignments/:id`.

## Analytics

GET /api/instructor/analytics

### Analytics data service (`src/server/lib/analytics.ts`)

Server-only module. All functions require `instructorId` and scope queries to that instructor's assignments.

| Function | Returns |
|----------|---------|
| `getOverviewMetrics(instructorId)` | `OverviewMetrics`: totalAssignments, totalSubmissions, acceptanceRate, needsImprovementRate, pendingRate, avgReviewTimeHours |
| `getStatusDistribution(instructorId)` | `StatusDistribution`: accepted/pending/needs_improvement/total counts |
| `getAssignmentAnalysis(instructorId)` | `AssignmentDifficultyRow[]`: per-assignment student counts, status breakdown, acceptance rate (based on latest submission per student) |
| `getAtRiskStudents(instructorId)` | `AtRiskStudent[]`: students with ≥2 assignments currently at needs_improvement on their latest submission |

## AI

POST /api/ai/assignment-improve
POST /api/ai/generate-feedback

All request bodies must be validated.

All protected endpoints require authentication.

Role restrictions are defined in permissions.md.