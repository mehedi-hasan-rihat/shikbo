# Shikbo — Data Model

## User

| Field        | Type     | Notes                  |
|-------------|----------|------------------------|
| id          | string   | Primary key            |
| name        | string   |                        |
| email       | string   | Unique                 |
| passwordHash| string   |                        |
| role        | enum     | `instructor` \| `student` |
| createdAt   | datetime |                        |
| updatedAt   | datetime |                        |

---

## Assignment

| Field      | Type     | Notes                                                    |
|-----------|----------|----------------------------------------------------------|
| id        | string   | Primary key                                              |
| title     | string   |                                                          |
| description | text   |                                                          |
| deadline  | datetime |                                                          |
| difficulty | enum    | `beginner` \| `intermediate` \| `advanced`               |
| createdBy | string   | FK → User (instructor)                                   |
| createdAt | datetime |                                                          |
| updatedAt | datetime |                                                          |
| archivedAt | datetime | Nullable. Null = active; set = soft-deleted/archived.   |

Assignments with submissions are never hard-deleted. Setting `archivedAt` hides them
from the active list while preserving submission history.

---

## Submission

| Field       | Type     | Notes                                              |
|------------|----------|----------------------------------------------------|
| id         | string   | Primary key                                        |
| assignmentId | string | FK → Assignment                                   |
| studentId  | string   | FK → User (student)                                |
| url        | string   | Submitted work URL (max 2,000 chars, must be http/https) |
| note       | text     | Optional student note (max 2,000 chars)            |
| status     | enum     | `pending` \| `accepted` \| `needs_improvement`; defaults to `pending` |
| feedback   | text     | Nullable. Instructor feedback                      |
| submittedAt | datetime | Defaults to `now()`                               |
| reviewedAt | datetime | Nullable                                           |
| updatedAt  | datetime |                                                   |

---

## Relationships

- `User` 1 → N `Assignment` (only instructors create assignments)
- `User` 1 → N `Submission` (only students create submissions)
- `Assignment` 1 → N `Submission`

A student may submit multiple times per assignment.
Only the latest active submission is treated as current.
Submission history is preserved.
