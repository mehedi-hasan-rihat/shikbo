# Shikbo AI

## Purpose

AI exists to reduce instructor workload.

AI must assist rather than make final academic decisions.

## Features

### Assignment Improvement

Input:
- title
- description
- difficulty

Output:
- improved title
- improved description
- missing requirements
- suggested evaluation criteria

### Feedback Assistant

Input:
- assignment
- student note
- instructor notes
- submission status

Output:
- draft feedback
- improvement suggestions

## Rules

- AI output is always treated as a draft.
- Instructor must review feedback before publishing.
- AI cannot change submission status automatically.
- AI cannot make final grading decisions.
- Never expose API keys to the client.
- AI requests must happen server-side.

## Failure Handling

If AI is unavailable:
- show a clear error
- preserve instructor input
- allow manual workflow