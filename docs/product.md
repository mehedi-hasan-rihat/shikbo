# Shikbo — Product Specification

## Product Goal

Shikbo helps instructors create assignments, review student work,
provide feedback, and identify learning problems through analytics.

---

## User Roles

### Instructor

Can:
- Create assignments
- Edit own assignments
- Delete own assignments
- View all submissions
- Review submissions and provide feedback
- Change submission status
- View learning analytics
- Use AI assistant
- View student progress

Cannot:
- Submit assignments as a student

### Student

Can:
- View published assignments and assignment details
- Submit work with a URL and optional note
- View own submissions and feedback
- Resubmit improved work
- Track own progress

Cannot:
- Create or edit assignments
- Review submissions
- Access instructor analytics
- Access another student's submissions
- Modify instructor feedback

---

## Assignment

Fields:
- title
- description
- deadline
- difficulty: `beginner` | `intermediate` | `advanced`

---

## Submission

Fields:
- assignment reference
- student reference
- submission URL
- student note
- status: `pending` | `accepted` | `needs_improvement`
- instructor feedback
- submittedAt
- reviewedAt

A student may submit multiple times for the same assignment.
Only the latest active submission is considered the current submission.
Submission history is preserved.

---

## Permissions & Security

Authorization must be enforced server-side.

Hiding UI elements is not authorization.

Every protected mutation must verify:
1. Authenticated user
2. User role
3. Resource ownership where applicable

---

## Product Principles

1. Learning progress over data collection.
2. Instructor actions should be fast.
3. Feedback should be actionable.
4. Analytics should lead to decisions.
5. AI assists instructors; it does not replace instructor judgment.
