import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Shikbo — Assignment & Learning Analytics",
  description:
    "Shikbo helps instructors create assignments, review student work, and identify learning problems through analytics.",
};

export default async function LandingPage() {
  const session = await getSession();

  if (session?.role === "instructor") redirect("/instructor/dashboard");
  if (session?.role === "student") redirect("/student/dashboard");

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--background)",
      }}
    >
      {/* ── Nav ─────────────────────────────────────────────── */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 var(--space-6)",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "var(--font-lg)",
              fontWeight: "var(--font-semibold)",
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            Shikbo
          </span>

          <nav style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <Link href="/login" className="btn btn-secondary btn-sm">
              Sign in
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <main style={{ flex: 1 }}>
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "var(--space-16) var(--space-6) var(--space-12)",
          }}
        >
          <div style={{ maxWidth: "640px" }}>
            {/* Eyebrow */}
            <p
              style={{
                fontSize: "var(--font-xs)",
                fontWeight: "var(--font-medium)",
                color: "var(--primary)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "var(--space-4)",
              }}
            >
              Assignment &amp; Learning Analytics
            </p>

            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: "var(--font-semibold)",
                color: "var(--text-primary)",
                lineHeight: "var(--leading-snug)",
                letterSpacing: "-0.02em",
                marginBottom: "var(--space-5)",
              }}
            >
              Where instructors teach
              <br />
              and students grow.
            </h1>

            <p
              style={{
                fontSize: "var(--font-md)",
                color: "var(--text-secondary)",
                lineHeight: "var(--leading-relaxed)",
                marginBottom: "var(--space-8)",
                maxWidth: "520px",
              }}
            >
              Create assignments, review submissions, provide actionable
              feedback, and spot learning gaps — all in one focused tool built
              for educators.
            </p>

            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
              <Link href="/register" className="btn btn-primary btn-lg">
                Create an account
              </Link>
              <Link href="/login" className="btn btn-secondary btn-lg">
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* ── Feature grid ────────────────────────────────────── */}
        <section
          style={{
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--background-subtle)",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "var(--space-12) var(--space-6)",
            }}
          >
            <p
              style={{
                fontSize: "var(--font-xs)",
                fontWeight: "var(--font-medium)",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "var(--space-8)",
              }}
            >
              What&apos;s included
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {FEATURES.map((f) => (
                <div key={f.title} className="card-sm">
                  <p
                    style={{
                      fontSize: "var(--font-sm)",
                      fontWeight: "var(--font-medium)",
                      color: "var(--text-primary)",
                      marginBottom: "var(--space-1)",
                    }}
                  >
                    {f.title}
                  </p>
                  <p
                    style={{
                      fontSize: "var(--font-sm)",
                      color: "var(--text-muted)",
                      lineHeight: "var(--leading-relaxed)",
                    }}
                  >
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Roles ───────────────────────────────────────────── */}
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "var(--space-12) var(--space-6)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "var(--space-6)",
          }}
        >
          <RoleCard
            role="Instructor"
            description="Create and manage assignments, review every submission, provide written feedback, and track student progress with analytics."
            items={[
              "Create beginner → advanced assignments",
              "Review submissions and update status",
              "Write and publish feedback",
              "View class-wide analytics",
              "AI-assisted feedback drafts",
            ]}
            cta="Join as instructor"
            href="/register?role=instructor"
          />
          <RoleCard
            role="Student"
            description="Browse published assignments, submit your work with a URL and note, receive instructor feedback, and track your own improvement."
            items={[
              "View all available assignments",
              "Submit work and optional notes",
              "Resubmit after feedback",
              "Track your submission history",
              "See feedback and status updates",
            ]}
            cta="Join as student"
            href="/register?role=student"
          />
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          backgroundColor: "var(--background-subtle)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "var(--space-6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "var(--space-4)",
          }}
        >
          <span
            style={{
              fontSize: "var(--font-sm)",
              fontWeight: "var(--font-medium)",
              color: "var(--text-primary)",
            }}
          >
            Shikbo
          </span>
          <p style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)" }}>
            Assignment &amp; Learning Analytics Platform
          </p>
        </div>
      </footer>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────

function RoleCard({
  role,
  description,
  items,
  cta,
  href,
}: {
  role: string;
  description: string;
  items: string[];
  cta: string;
  href: string;
}) {
  return (
    <div
      className="card"
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}
    >
      <div>
        <p
          style={{
            fontSize: "var(--font-xs)",
            fontWeight: "var(--font-medium)",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "var(--space-2)",
          }}
        >
          {role}
        </p>
        <p
          style={{
            fontSize: "var(--font-sm)",
            color: "var(--text-secondary)",
            lineHeight: "var(--leading-relaxed)",
          }}
        >
          {description}
        </p>
      </div>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
          flex: 1,
        }}
      >
        {items.map((item) => (
          <li
            key={item}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "var(--space-2)",
              fontSize: "var(--font-sm)",
              color: "var(--text-secondary)",
              lineHeight: "var(--leading-normal)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                marginTop: "2px",
                color: "var(--success)",
                fontWeight: "var(--font-bold)",
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      <Link href={href} className="btn btn-secondary" style={{ alignSelf: "flex-start" }}>
        {cta}
      </Link>
    </div>
  );
}

// ── Static data ──────────────────────────────────────────────

const FEATURES = [
  {
    title: "Assignment management",
    description:
      "Instructors create assignments with title, description, deadline, and difficulty level.",
  },
  {
    title: "Submission workflow",
    description:
      "Students submit a URL and optional note. Multiple resubmissions are supported; history is preserved.",
  },
  {
    title: "Feedback & review",
    description:
      "Instructors mark submissions as accepted or needs improvement, with written feedback visible to students.",
  },
  {
    title: "Learning analytics",
    description:
      "Instructors get an overview of submission rates, statuses, and progress trends across the class.",
  },
  {
    title: "AI-assisted feedback",
    description:
      "AI can draft feedback for instructor review. The instructor always decides what gets published.",
  },
  {
    title: "Role-based access",
    description:
      "Instructors and students each see only what they need. Authorization is enforced server-side.",
  },
];
