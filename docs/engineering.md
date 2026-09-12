# Shikbo — Engineering Guide

## Stack

- Next.js (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- PostgreSQL
- Prisma
- Auth.js / NextAuth
- Zod
- Recharts
- AI provider (server-side only)

---

## Application Structure

```
app/          # Routes, layouts, pages
components/   # Shared UI components
lib/          # Shared utilities
server/       # Server-only logic, services, db access
prisma/       # Schema and migrations
docs/         # Project documentation
```

---

## Architectural Rules

- Server Components by default. Use Client Components only when interactivity is required.
- Database access must stay on the server. Never query the database from Client Components.
- Authorization must happen server-side. Never trust role information from the client.
- Validate all external input with Zod: forms, API input, Server Action input, AI structured responses.
- Business logic must not live inside UI components.
- Reusable domain logic belongs in `server/lib` modules.
- Never expose secrets or API keys to client components.

---

## Request Flow

```
UI
↓
Server Action / Route Handler
↓
Validation (Zod)
↓
Authorization
↓
Business Logic
↓
Database (Prisma)
↓
Response
```

## AI Request Flow

```
Instructor
↓
AI Assistant UI
↓
Server Action
↓
Validate Input
↓
AI Service (server-side)
↓
Structured AI Response
↓
Instructor reviews and decides
```

---

## Coding Standards

### TypeScript

- Strict mode enabled. Avoid `any`.
- Prefer small, composable functions.
- Avoid premature abstraction.

### Next.js

- Server Components by default.
- Use Client Components only when necessary.
- Use Server Actions for appropriate mutations.

### Validation

Use Zod for:
- Forms
- API input
- Server Action input
- AI responses where structured output is expected

### UI

- Consistent spacing using design tokens.
- Accessible interactive elements (keyboard, ARIA).
- Always handle: loading state, empty state, error state.
- Responsive layouts.

### Forms

Every important form must handle:
- `idle`
- `loading`
- `success`
- `validation error`
- `server error`

---

## Pre-completion Checklist

Before considering a feature complete:

- [ ] Typecheck passes
- [ ] Lint passes
- [ ] Relevant logic is tested
- [ ] Authorization is verified server-side
- [ ] Loading, empty, and error states are handled
