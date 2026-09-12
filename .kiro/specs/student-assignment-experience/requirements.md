# Requirements Document

## Introduction

This feature covers the complete student-facing assignment and submission experience in Shikbo (EPIC 05). Students need to discover available assignments, review their details, submit work, and track their submission history across multiple attempts. The experience spans five tickets: an assignment list (SHK-020), assignment detail view (SHK-021), a Submission data model (SHK-022), a submission form (SHK-023), and a submission history view (SHK-024).

The Submission model already exists in the database. This EPIC wires up the pages, server actions, and validations that expose it to students through the `/student/*` route tree.

---

## Glossary

- **Assignment_List**: The page at `/student/assignments` that renders all active (non-archived) assignments.
- **Assignment_Detail**: The page at `/student/assignments/[id]` that renders the full details of a single assignment.
- **Submission_Form**: The form through which a student submits or resubmits work for an assignment.
- **Submission_History**: The ordered list of all of a student's past submissions for a single assignment.
- **Submission**: A single attempt record containing a URL, optional note, status, feedback, and timestamps.
- **Current_Submission**: The most-recently created Submission for a given (assignment, student) pair.
- **System**: The Shikbo web application.
- **Student**: An authenticated user with role `student`.
- **Instructor**: An authenticated user with role `instructor`.
- **Submission_Status**: One of `pending`, `accepted`, or `needs_improvement`.
- **Difficulty**: One of `beginner`, `intermediate`, or `advanced`.
- **Deadline**: The UTC datetime after which new submissions are blocked.

---

## Requirements

---

### Requirement 1: Assignment List (SHK-020)

**User Story:** As a Student, I want to see all active assignments in a list, so that I can find work to submit.

#### Acceptance Criteria

1. THE Assignment_List SHALL display only assignments where `archivedAt` is null, ordered by `deadline` ascending.
2. WHEN the Assignment_List renders, THE System SHALL display for each assignment: title, difficulty, deadline (formatted as a human-readable date), and the Current_Submission status for the authenticated Student (or a "Not submitted" indicator when no submission exists).
3. WHEN a Student clicks an assignment row or title, THE System SHALL navigate to the Assignment_Detail page for that assignment.
4. WHILE the assignment data is loading, THE System SHALL display a loading skeleton in place of the assignment list.
5. IF no active assignments exist, THEN THE Assignment_List SHALL display an empty state with a descriptive message.
6. IF the Assignment_List data fetch fails, THEN THE System SHALL display an error state with a descriptive message and a retry affordance.
7. WHEN the authenticated user is not a Student, THE System SHALL redirect the user to `/unauthorized`.

---

### Requirement 2: Assignment Detail (SHK-021)

**User Story:** As a Student, I want to view the full details of an assignment, so that I can understand what is required before submitting.

#### Acceptance Criteria

1. WHEN a Student navigates to `/student/assignments/[id]`, THE Assignment_Detail SHALL display: assignment title, full description, difficulty, and deadline (formatted as a human-readable datetime).
2. WHEN the authenticated Student has at least one Submission for the assignment, THE Assignment_Detail SHALL display the Current_Submission status using a StatusBadge.
3. WHEN the Current_Submission status is `needs_improvement` and instructor feedback exists, THE Assignment_Detail SHALL display the feedback text in a visually distinct callout.
4. WHEN the Current_Submission status is `accepted`, THE Assignment_Detail SHALL display a success callout indicating that the assignment has been accepted.
5. IF the assignment does not exist or has been archived, THEN THE System SHALL return a 404 response.
6. IF the authenticated user is not a Student, THEN THE System SHALL redirect the user to `/unauthorized`.

---

### Requirement 3: Submission Model (SHK-022)

**User Story:** As a developer, I want a well-defined Submission schema and corresponding server-side types, so that submission data is consistently validated and persisted.

#### Acceptance Criteria

1. THE System SHALL persist Submission records with the fields: `id`, `assignmentId`, `studentId`, `url`, `note` (nullable), `status` (default `pending`), `feedback` (nullable), `submittedAt`, `reviewedAt` (nullable), `updatedAt`.
2. THE Submission_Form action SHALL validate `url` as a well-formed HTTP or HTTPS URL before persisting.
3. THE Submission_Form action SHALL validate `note`, when provided, is no longer than 1000 characters.
4. THE Submission_Form action SHALL set `studentId` exclusively from the server-side session — never from client-supplied input.
5. WHEN a Submission is created, THE System SHALL set `status` to `pending` and `reviewedAt` to null, regardless of any client-supplied values.

---

### Requirement 4: Submission Form (SHK-023)

**User Story:** As a Student, I want to submit my project URL and an optional note for an assignment, so that my instructor can review my work.

#### Acceptance Criteria

1. THE Submission_Form SHALL accept two inputs: a required `url` field and an optional `note` field (textarea).
2. WHEN a Student submits the form with a valid URL and the assignment deadline has not passed, THE System SHALL create a new Submission record with status `pending` and redirect the Student to the Assignment_Detail page.
3. IF the submitted `url` is not a well-formed HTTP or HTTPS URL, THEN THE Submission_Form SHALL display a field-level validation error and SHALL NOT persist a record.
4. IF the `note` exceeds 1000 characters, THEN THE Submission_Form SHALL display a field-level validation error and SHALL NOT persist a record.
5. IF the assignment does not exist, THEN THE Submission_Form action SHALL return an error and SHALL NOT persist a record.
6. WHEN the assignment `deadline` has passed at the time of submission, THE Submission_Form SHALL display an error indicating that the deadline has passed and SHALL NOT persist a record.
7. WHILE the form submission is in progress, THE Submission_Form SHALL disable the submit button and display a loading indicator.
8. IF a server error occurs during submission, THEN THE Submission_Form SHALL display a non-blocking error message and SHALL preserve the Student's entered values.
9. WHEN the authenticated user is not a Student, THE Submission_Form action SHALL reject the request and return an authorization error.

---

### Requirement 5: Submission History (SHK-024)

**User Story:** As a Student, I want to see all of my past submission attempts for an assignment in chronological order, so that I can track my learning progress across iterations.

#### Acceptance Criteria

1. THE Submission_History SHALL display all Submission records for the authenticated Student and the selected assignment, ordered by `submittedAt` descending (most recent first), labeled "Attempt 1", "Attempt 2", etc. (ascending by attempt number).
2. WHEN the Submission_History renders, THE System SHALL display for each Submission: the attempt label, submitted URL (as a link), submission date, Submission_Status badge, and instructor feedback (when `feedback` is not null).
3. WHEN the Submission_History for an assignment contains zero records, THE System SHALL display an empty state with a message indicating no submissions have been made.
4. WHILE the Submission_History data is loading, THE System SHALL display a loading skeleton.
5. IF the Submission_History data fetch fails, THEN THE System SHALL display an error state with a descriptive message.
6. THE Submission_History SHALL only display Submission records belonging to the authenticated Student — THE System SHALL NOT expose another student's submission data.
7. WHEN the Submission_History is shown on the Assignment_Detail page, THE System SHALL render it within a tabbed interface, separating "Details" from "My Submissions".
