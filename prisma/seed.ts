/**
 * Seed script — creates demo data for development.
 *
 * Run with:  npm run seed
 *
 * Creates:
 *   1 instructor account
 *   3 student accounts
 *   4 assignments (mix of difficulties, one past deadline, one archived)
 *   ~10 submissions across students (mix of statuses, some with feedback)
 *
 * Safe to re-run — upserts by email / unique fields so duplicates are skipped.
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// ---------------------------------------------------------------------------
// DB client (standalone — no server-only guard)
// ---------------------------------------------------------------------------

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const db = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const PASSWORD = "password123"; // same password for all demo accounts

const INSTRUCTOR = {
  name: "Alex Carter",
  email: "instructor@shikbo.dev",
  role: "instructor" as const,
};

const STUDENTS = [
  { name: "Mehedi Hasan", email: "mehedi@shikbo.dev" },
  { name: "Sara Khan",    email: "sara@shikbo.dev"   },
  { name: "James Liu",    email: "james@shikbo.dev"  },
];

const now = new Date();
const future = (days: number) => new Date(now.getTime() + days * 86_400_000);
const past   = (days: number) => new Date(now.getTime() - days * 86_400_000);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("🌱 Seeding database…\n");

  const hash = await bcrypt.hash(PASSWORD, 12);

  // --- Instructor ---
  const instructor = await db.user.upsert({
    where:  { email: INSTRUCTOR.email },
    update: {},
    create: { ...INSTRUCTOR, passwordHash: hash },
  });
  console.log(`✓ Instructor: ${instructor.email}`);

  // --- Students ---
  const students = await Promise.all(
    STUDENTS.map((s) =>
      db.user.upsert({
        where:  { email: s.email },
        update: {},
        create: { ...s, role: "student", passwordHash: hash },
      })
    )
  );
  students.forEach((s) => console.log(`✓ Student:    ${s.email}`));

  const [mehedi, sara, james] = students;

  // --- Assignments ---
  const assignments = await Promise.all([
    db.assignment.upsert({
      where:  { id: "seed-assignment-1" },
      update: {},
      create: {
        id:          "seed-assignment-1",
        title:       "Build a REST API",
        description:
          "Design and implement a RESTful API using Node.js and Express. " +
          "The API should support CRUD operations for a resource of your choice. " +
          "Include proper error handling, input validation, and at least one authenticated route.",
        difficulty:  "advanced",
        deadline:    future(14),
        createdBy:   instructor.id,
      },
    }),
    db.assignment.upsert({
      where:  { id: "seed-assignment-2" },
      update: {},
      create: {
        id:          "seed-assignment-2",
        title:       "Todo App with React",
        description:
          "Build a fully functional Todo application using React. " +
          "Requirements: add/remove/toggle todos, filter by status, " +
          "persist state with localStorage, and write at least 3 unit tests.",
        difficulty:  "intermediate",
        deadline:    future(7),
        createdBy:   instructor.id,
      },
    }),
    db.assignment.upsert({
      where:  { id: "seed-assignment-3" },
      update: {},
      create: {
        id:          "seed-assignment-3",
        title:       "HTML & CSS Portfolio Page",
        description:
          "Create a personal portfolio page using only HTML and CSS. " +
          "Must include: a header with your name, an about section, a projects grid, " +
          "and a contact form. The layout must be responsive.",
        difficulty:  "beginner",
        deadline:    future(3),
        createdBy:   instructor.id,
      },
    }),
    db.assignment.upsert({
      where:  { id: "seed-assignment-4" },
      update: {},
      create: {
        id:          "seed-assignment-4",
        title:       "SQL Database Design",
        description:
          "Design a relational database schema for a library management system. " +
          "Include ERD, at least 5 tables with proper relationships, " +
          "and write 5 non-trivial SQL queries demonstrating JOINs and aggregations.",
        difficulty:  "intermediate",
        deadline:    past(2),   // past deadline
        createdBy:   instructor.id,
      },
    }),
    // Archived assignment
    db.assignment.upsert({
      where:  { id: "seed-assignment-5" },
      update: {},
      create: {
        id:          "seed-assignment-5",
        title:       "Command Line Calculator",
        description: "Build a CLI calculator that supports +, -, *, / and handles edge cases.",
        difficulty:  "beginner",
        deadline:    past(30),
        archivedAt:  past(10),
        createdBy:   instructor.id,
      },
    }),
  ]);

  const [restApi, todoApp, portfolio, sqlDesign] = assignments;
  console.log(`\n✓ ${assignments.length} assignments seeded`);

  // --- Submissions ---
  // Helper to upsert by unique (assignmentId, studentId, submittedAt) isn't
  // available, so we check existence first then create if missing.

  async function seedSubmission(data: {
    id:           string;
    assignmentId: string;
    studentId:    string;
    url:          string;
    note?:        string;
    status:       "pending" | "accepted" | "needs_improvement";
    feedback?:    string;
    submittedAt:  Date;
    reviewedAt?:  Date;
  }) {
    const existing = await db.submission.findUnique({ where: { id: data.id } });
    if (existing) return existing;
    return db.submission.create({ data });
  }

  // Mehedi — REST API: needs_improvement then pending (resubmit)
  await seedSubmission({
    id:           "seed-sub-1",
    assignmentId: restApi.id,
    studentId:    mehedi.id,
    url:          "https://github.com/mehedi/rest-api-v1",
    note:         "First attempt. Added basic CRUD for /users endpoint.",
    status:       "needs_improvement",
    feedback:     "Good start on the user endpoint. Missing error handling on 404 routes and the auth route is not implemented yet. Please add input validation with a library like Joi or Zod.",
    submittedAt:  past(5),
    reviewedAt:   past(4),
  });
  await seedSubmission({
    id:           "seed-sub-2",
    assignmentId: restApi.id,
    studentId:    mehedi.id,
    url:          "https://github.com/mehedi/rest-api-v2",
    note:         "Added error handling and Zod validation. Still working on the auth route.",
    status:       "pending",
    submittedAt:  past(1),
  });

  // Sara — REST API: accepted
  await seedSubmission({
    id:           "seed-sub-3",
    assignmentId: restApi.id,
    studentId:    sara.id,
    url:          "https://github.com/sara/rest-api",
    note:         "Implemented CRUD for /products with JWT auth on write routes.",
    status:       "accepted",
    feedback:     "Excellent work. Clean code structure, proper error handling, and good test coverage.",
    submittedAt:  past(3),
    reviewedAt:   past(2),
  });

  // James — REST API: pending
  await seedSubmission({
    id:           "seed-sub-4",
    assignmentId: restApi.id,
    studentId:    james.id,
    url:          "https://github.com/james/rest-api",
    note:         "Built /tasks resource with full CRUD.",
    status:       "pending",
    submittedAt:  past(1),
  });

  // Mehedi — Todo App: accepted
  await seedSubmission({
    id:           "seed-sub-5",
    assignmentId: todoApp.id,
    studentId:    mehedi.id,
    url:          "https://github.com/mehedi/todo-app",
    note:         "Used useReducer for state. Added unit tests with Vitest.",
    status:       "accepted",
    feedback:     "Well structured and the filter logic is clean. Tests are comprehensive.",
    submittedAt:  past(6),
    reviewedAt:   past(5),
  });

  // Sara — Todo App: needs_improvement
  await seedSubmission({
    id:           "seed-sub-6",
    assignmentId: todoApp.id,
    studentId:    sara.id,
    url:          "https://github.com/sara/todo-app",
    note:         "I struggled with localStorage persistence.",
    status:       "needs_improvement",
    feedback:     "The UI looks good but localStorage is not implemented and there are no tests. Please add both before resubmitting.",
    submittedAt:  past(4),
    reviewedAt:   past(3),
  });

  // James — Todo App: pending
  await seedSubmission({
    id:           "seed-sub-7",
    assignmentId: todoApp.id,
    studentId:    james.id,
    url:          "https://github.com/james/todo-react",
    status:       "pending",
    submittedAt:  past(1),
  });

  // Mehedi — Portfolio: needs_improvement (at-risk candidate)
  await seedSubmission({
    id:           "seed-sub-8",
    assignmentId: portfolio.id,
    studentId:    mehedi.id,
    url:          "https://mehedi.netlify.app",
    note:         "Basic layout done.",
    status:       "needs_improvement",
    feedback:     "The page is not responsive. The projects section is missing. Please revisit the requirements.",
    submittedAt:  past(2),
    reviewedAt:   past(1),
  });

  // Sara — Portfolio: accepted
  await seedSubmission({
    id:           "seed-sub-9",
    assignmentId: portfolio.id,
    studentId:    sara.id,
    url:          "https://sara.dev",
    status:       "accepted",
    feedback:     "Great responsive design and clean HTML semantics.",
    submittedAt:  past(3),
    reviewedAt:   past(2),
  });

  // James — SQL Design: pending
  await seedSubmission({
    id:           "seed-sub-10",
    assignmentId: sqlDesign.id,
    studentId:    james.id,
    url:          "https://github.com/james/sql-design",
    note:         "ERD and schema included. 5 queries in queries.sql.",
    status:       "pending",
    submittedAt:  past(3),
  });

  console.log(`✓ Submissions seeded\n`);

  console.log("━".repeat(48));
  console.log("Demo accounts (password: password123)");
  console.log("━".repeat(48));
  console.log(`Instructor  ${INSTRUCTOR.email}`);
  STUDENTS.forEach((s) => console.log(`Student     ${s.email}`));
  console.log("━".repeat(48));
  console.log("✅ Done\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
