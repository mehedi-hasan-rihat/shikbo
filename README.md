# Shikbo

An Assignment & Learning Analytics SaaS for instructors and students. Instructors create assignments, review student submissions, draft AI-assisted feedback, and monitor learning progress through analytics. Students submit work, receive feedback, and track their own progress.

---

## Features

### Instructor
- Create, edit, and archive assignments with difficulty levels (beginner / intermediate / advanced)
- Review submissions and set status: `pending`, `accepted`, or `needs_improvement`
- AI-assisted feedback drafting and assignment improvement
- Analytics dashboard: overview metrics, status distribution, per-assignment analysis, at-risk students, action items

### Student
- Browse active assignments with deadlines and difficulty indicators
- Submit work by URL with an optional note
- Resubmit after receiving `needs_improvement` feedback
- Personal progress dashboard: status across all assignments, submission history, recent feedback, upcoming deadlines

---

## AI Implementation

AI is used in two instructor-only flows. All AI requests run server-side; no API keys are ever exposed to the client.

### 1. Assignment Improvement

Located in `src/lib/ai/assignment.ts`

The instructor clicks **Improve with AI** while creating or editing an assignment. The current form values (title, description, difficulty) are sent to a server action, which calls the AI service and returns a structured draft:

| Output field | Description |
|---|---|
| `improvedTitle` | A clearer, more specific assignment title |
| `improvedDescription` | Rewritten description with explicit goals, requirements, and deliverables |
| `missingRequirements` | Requirements that appear absent from the original |
| `evaluationCriteria` | Suggested rubric items the instructor could adopt |

The result is shown in a preview panel (`AssignmentImprovePanel`). The instructor can **Apply to form** or **Discard** — the form is never silently overwritten.

### 2. Feedback Assistant

Located in `src/lib/ai/feedback.ts`

On the submission review page, the instructor opens the **AI Feedback Assistant** panel, types their own observations, and clicks **Generate draft**. The AI returns:

| Output field | Description |
|---|---|
| `feedback` | A draft feedback message (max 3 sentences, plain prose) |
| `improvementSuggestions` | Up to 3 concrete, actionable suggestions for the student |

The draft populates the feedback textarea via **Apply to feedback** — the instructor reviews and saves it manually. AI never publishes feedback automatically.

### Provider & SDK

```
Provider:  OpenRouter (openrouter.ai)
SDK:       Vercel AI SDK — generateObject() with Zod schemas
Model:     dots-studio/dots-3-note-preview:free  (free tier, no credits required)
```

Structured output is enforced with Zod schemas at the AI SDK level, so every response is validated before it reaches the UI.

### Error Handling

All AI errors are caught, classified, and returned as typed `AiError` values. The instructor always sees a human-readable message and can continue manually.

| Error code | User-facing message |
|---|---|
| `missing_api_key` | AI is not configured. You can still review manually. |
| `no_credits` | AI account has no credits. Add credits or continue manually. |
| `rate_limit` | AI is temporarily unavailable (rate limit). Try again or continue manually. |
| `timeout` | The AI request timed out. Try again or continue manually. |
| `invalid_response` | AI returned an unexpected response. Try again or continue manually. |
| `api_error` | AI service error: `<message>`. You can continue manually. |

In every failure case: the warning is shown, instructor input is preserved, and the manual workflow remains fully functional.

### AI Debug Logger

`src/lib/ai/logger.ts` emits colored, structured logs to the server console in development or when `AI_DEBUG=true`. It logs request summaries (truncated — never full prompts), token usage, response previews, and error details. Nothing is logged to the client.

---

## Bonus Logic

All bonus logic lives in `src/server/lib/analytics.ts` and is rendered on the instructor dashboard at `/instructor/dashboard`.

### 1. At-Risk Student Detection

`getAtRiskStudents(instructorId)` flags students who are currently stuck — defined as having their **latest submission** at `needs_improvement` on two or more assignments.

Key design decisions:
- Uses the **latest attempt per assignment**, not total attempt count. A student who resubmitted and got `accepted` is not flagged even if an earlier attempt was `needs_improvement`.
- Threshold is ≥ 2 assignments (not submissions), so one bad submission doesn't trigger it.
- Results are sorted by `needsImprovementCount` descending — most at-risk student first.
- Rendered as a dedicated table on the dashboard: student name, email, count badge, total submissions, last active date.

### 2. Instructor Action Items

`getActionItems(instructorId)` computes four real-time signals shown as a "Needs your attention" panel at the top of the dashboard — only rendered when at least one signal is active:

| Signal | Logic |
|---|---|
| Pending reviews | Count of all submissions with `status: pending` across the instructor's assignments |
| At-risk students | Count from `getAtRiskStudents()` — links to the at-risk table on the same page |
| Low acceptance assignments | Assignments where acceptance rate < 50% **and** at least 3 unique students have submitted — sorted worst-first |
| Deadlines this week | Active assignments with a deadline between now and +7 days — includes per-assignment pending submission count |

The deadlines this week data is also rendered as a standalone table (title, deadline with urgency coloring, pending count badge) alongside the assignment breakdown.

### 3. Latest-Submission Semantics

Students may resubmit as many times as they want. Every analytics function resolves to the **latest submission per student per assignment** — not total submission count. This is applied consistently across:

- `getAssignmentAnalysis()` — acceptance rate and status breakdown per assignment
- `getAtRiskStudents()` — needs_improvement count per student
- `getStudentOverviewMetrics()` — student KPIs (accepted / needs_improvement / pending / not_started)
- `getActionItems()` — low acceptance threshold and deadline pending counts

This means a student's progress is always judged on their most recent work, and resubmitting is never penalized in the analytics.

### 4. Soft Delete for Assignments

Assignments with submissions are never hard-deleted. The `archivedAt` field is set instead, hiding the assignment from active lists while preserving full submission history. Every analytics query filters `archivedAt: null` so archived assignments are excluded from all metrics, rates, and tables.

### 5. Server-Only AI Module Boundary

`src/lib/ai/client.ts` and both AI feature files (`assignment.ts`, `feedback.ts`) import `server-only` at the top. This causes a build-time error if any client component ever tries to import them — the API key cannot leak to the browser regardless of developer error.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.3 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4.3 + CSS custom properties design system |
| Database | PostgreSQL 15+ |
| ORM | Prisma 7.10 |
| Authentication | JWT sessions via `jose` |
| Validation | Zod 4.6 |
| AI SDK | Vercel AI SDK (`ai`) |
| AI Provider | OpenRouter (`@openrouter/ai-sdk-provider`) |
| Charts | Recharts 3.10 |
| Passwords | bcryptjs |

---

## Project Structure

```
src/
  app/                   # Next.js App Router — pages and layouts
    (auth)/              # Login and register pages
    instructor/          # Instructor-only routes
    student/             # Student-only routes
    api/                 # REST route handlers
  components/
    ui/                  # Reusable design system components
    assignments/         # Assignment-specific components
    submissions/         # Submission review + feedback components
    analytics/           # Charts and analytics tables
    layout/              # Sidebar, nav, user menu
  lib/
    ai/                  # AI client, feature functions, logger, types
    auth.ts              # Session helpers
    db.ts                # Prisma client singleton
  server/
    actions/             # Server actions (mutations)
    lib/                 # Business logic and analytics service
    validations/         # Zod schemas for form and action inputs
prisma/
  schema/                # Split Prisma schema files
  seed.ts                # Demo data seed script
docs/                    # Project documentation (source of truth)
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+

### 1. Clone and install

```bash
git clone <repo-url>
cd shikbo
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/shikbo"

# JWT signing secret — generate with: openssl rand -base64 32
SESSION_SECRET="your-secret-key-here"

# OpenRouter API key — free tier available at https://openrouter.ai
OPENROUTER_API_KEY="sk-or-v1-..."
```

The `OPENROUTER_API_KEY` is optional to get started — the app works fully without it; AI features show a warning and fall back to the manual workflow.

### 3. Run database migrations

```bash
npx prisma migrate deploy
```

### 4. Seed demo data (optional)

```bash
npm run seed
```

Creates one instructor, three students, five assignments (including one archived and one past-deadline), and ten submissions in various states.

**Demo credentials** (password: `password123`):

| Role | Email |
|---|---|
| Instructor | `instructor@shikbo.dev` |
| Student | `mehedi@shikbo.dev` |
| Student | `sara@shikbo.dev` |
| Student | `james@shikbo.dev` |

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed demo data |

---

## Documentation

Full documentation lives in the [`docs/`](docs/) folder.

| File | Contents |
|---|---|
| [`docs/product.md`](docs/product.md) | Product goals, roles, permissions, domain constraints |
| [`docs/engineering.md`](docs/engineering.md) | Stack, architecture, coding standards, request flow |
| [`docs/data-model.md`](docs/data-model.md) | Database schema: User, Assignment, Submission |
| [`docs/api.md`](docs/api.md) | API route contracts and server action signatures |
| [`docs/ai.md`](docs/ai.md) | AI feature rules, flows, and failure handling |
| [`docs/design-system.md`](docs/design-system.md) | Design tokens, component library, CSS class reference |
