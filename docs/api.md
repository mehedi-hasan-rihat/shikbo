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

## Analytics

GET /api/instructor/analytics

## AI

POST /api/ai/assignment-improve
POST /api/ai/generate-feedback

All request bodies must be validated.

All protected endpoints require authentication.

Role restrictions are defined in permissions.md.