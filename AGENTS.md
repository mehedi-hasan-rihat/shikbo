<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Shikbo — Agent Guide

This is an Assignment & Learning Analytics SaaS for instructors and students.
Read this file before making any changes.

## Documentation Index

All documentation lives in the [`docs/`](docs/) folder.
Read the relevant file before working on any area of the codebase.

| File                                           | What it covers                                        |
|-----------------------------------------------|-------------------------------------------------------|
| [`docs/product.md`](docs/product.md)           | Product goals, user roles, domain models, permissions |
| [`docs/engineering.md`](docs/engineering.md)   | Stack, architecture, coding standards, request flow   |
| [`docs/data-model.md`](docs/data-model.md)     | Database schema: User, Assignment, Submission         |
| [`docs/api.md`](docs/api.md)                   | API route contract                                    |
| [`docs/ai.md`](docs/ai.md)                     | AI feature rules, flows, and failure handling         |
| [`docs/design-system.md`](docs/design-system.md) | Design tokens, component guidelines, layout rules   |

> **Docs are the source of truth.**
> If you change a role, permission, status, field, route, or rule anywhere in the codebase,
> you must update the corresponding file in `docs/` in the same change.
> Never let the docs fall out of sync with the implementation.

### Which doc to update for common changes

| Change type                                       | Update this file                              |
|--------------------------------------------------|-----------------------------------------------|
| New or modified user role or permission          | `docs/product.md`                             |
| New API route or changed request/response shape  | `docs/api.md`                                 |
| Schema field added, removed, or renamed          | `docs/data-model.md`                          |
| New status or difficulty enum value              | `docs/product.md` + `docs/data-model.md`      |
| Architecture decision or coding standard change  | `docs/engineering.md`                         |
| AI feature, rule, or flow change                 | `docs/ai.md`                                  |
| Design token or component guideline change       | `docs/design-system.md`                       |

---

## Product Summary

Two roles: **instructor** and **student**.

- Instructors create and manage assignments, review submissions, provide feedback, and view analytics.
- Students submit work, receive feedback, and track their own progress.
- AI assists instructors only — it never makes final decisions or changes submission status.

---

## Hard Rules

These are non-negotiable. Violating any of them is a bug.

### Security & Authorization
- Authorization is always enforced server-side.
- Never trust role or identity from the client.
- Every protected mutation must verify: authenticated user → role → resource ownership.
- Never expose API keys or secrets to client components.
- Hiding a UI element is not authorization.

### Architecture
- Server Components by default. Client Components only when interactivity is required.
- Database access (Prisma) only from server-side code.
- Business logic belongs in `server/lib`, not inside UI components.
- All external input must be validated with Zod.

### AI
- AI output is always a draft. Instructors must review before publishing.
- AI cannot change submission status or make grading decisions.
- All AI requests happen server-side.
- If AI is unavailable: show an error, preserve input, allow manual workflow.

---

## Domain Constraints

- Submission `status`: `pending` | `accepted` | `needs_improvement`
- Assignment `difficulty`: `beginner` | `intermediate` | `advanced`
- A student may submit multiple times; only the latest active submission is current.
- Submission history must be preserved.
- Only instructors create assignments. Only students create submissions.

---

## Design Rules

The UI is a professional internal tool — not a marketing page.
Full token system is in `docs/design-system.md`.

Key rules:
- Use CSS custom property tokens. Do not hardcode hex values, spacing, or radii.
- White/light gray base. Semantic colors for state only.
- No gradients, glassmorphism, neon colors, or decorative shadows.
- No oversized typography, giant icons, or pill-shaped everything.
- Cards: `background + border`, not `background + shadow`.
- Body text: 14px. Page titles: 24–28px.
- Spacing from the 4px base scale only.
- Every visual decision must improve information hierarchy or usability. If it doesn't, remove it.

---

## Pre-completion Checklist

Before marking any feature done:

- [ ] Typecheck passes
- [ ] Lint passes
- [ ] Authorization verified server-side
- [ ] Loading, empty, and error states handled
- [ ] Design tokens used (no hardcoded values)
- [ ] Relevant logic tested
