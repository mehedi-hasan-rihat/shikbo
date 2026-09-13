# Shikbo AI

## Purpose

AI exists to reduce instructor workload.

AI must assist rather than make final academic decisions.

## Features

### Assignment Improvement (SHK-031, SHK-032)

Input:
- title
- description
- difficulty

Output:
- improved title
- improved description
- missing requirements
- suggested evaluation criteria

The instructor clicks **Improve with AI** in the assignment form (create or edit).
A preview panel renders the AI draft. The instructor can **Apply to form** or **Discard**.
AI output is never silently written to the form.

### Feedback Assistant (SHK-033, SHK-034)

Input:
- assignment title + description
- difficulty
- student note
- instructor observations (typed by instructor)
- submission status

Output:
- draft feedback text
- improvement suggestions list

The instructor opens the **AI feedback assistant** panel on the submission review page,
types their observations, and clicks **Generate draft**. The AI draft is shown for review.
Clicking **Apply to feedback** populates the feedback textarea — the instructor edits
and saves manually. AI never publishes feedback automatically.

## Implementation

### File structure

```
src/lib/ai/
  client.ts       — OpenAI provider singleton, AI_MODEL constant
  types.ts        — shared input/output types, AiError union
  assignment.ts   — improveAssignment() server function
  feedback.ts     — generateFeedback() server function

src/server/
  validations/ai.ts          — Zod schemas for AI action inputs
  actions/ai.ts              — improveAssignmentAction(), generateFeedbackAction() server actions

src/components/
  assignments/AssignmentImprovePanel.tsx  — "Improve with AI" button + preview panel
  submissions/FeedbackAssistant.tsx       — observations + draft preview + apply workflow
```

### AI provider

- Provider: OpenAI via `@ai-sdk/openai`
- SDK: Vercel AI SDK (`ai`)
- Model: `gpt-4o-mini` (defined in `src/lib/ai/client.ts`)
- Structured output via `generateObject()` with Zod schemas

### Required environment variable

```
OPENAI_API_KEY=sk-...
```

If `OPENAI_API_KEY` is not set, the AI client throws `missing_api_key`,
which is caught and shown as a user-friendly warning.
The instructor can always continue with the manual workflow.

## Rules

- AI output is always treated as a draft.
- Instructor must review feedback before publishing.
- AI cannot change submission status automatically.
- AI cannot make final grading decisions.
- Never expose API keys to the client.
- AI requests must happen server-side.
- All AI inputs are validated with Zod before calling the AI service.

## Failure Handling (SHK-035)

All errors are caught in `src/lib/ai/assignment.ts` and `src/lib/ai/feedback.ts`
and returned as typed `AiError` values. `src/server/actions/ai.ts` maps them to
human-readable messages shown as `callout-warning` banners.

| Error code       | User-facing message                                              |
|-----------------|-------------------------------------------------------------------|
| `missing_api_key` | AI is not configured. You can still review manually.           |
| `rate_limit`     | AI is temporarily unavailable (rate limit). Try again or continue manually. |
| `timeout`        | The AI request timed out. Try again or continue manually.       |
| `invalid_response` | AI returned an unexpected response. Try again or continue manually. |
| `api_error`      | AI service error: `<message>`. You can continue manually.       |

In all failure cases:
- A warning callout is shown
- The instructor's input is preserved
- The manual workflow remains fully functional