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
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header style={{
        backgroundColor: "var(--brand)",
        borderBottom: "1px solid #1a1a1a",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 var(--space-6)",
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--font-xl)",
            fontWeight: "var(--font-semibold)",
            color: "#ffffff",
            letterSpacing: "-0.02em",
          }}>
            Shikbo
          </span>

          <nav style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <Link
              href="/login"
              style={{
                fontSize: "var(--font-sm)",
                fontWeight: "var(--font-medium)",
                color: "rgba(255,255,255,0.65)",
                textDecoration: "none",
                padding: "6px var(--space-3)",
                borderRadius: "var(--radius)",
                transition: "color 150ms ease",
              }}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "32px",
                padding: "0 var(--space-4)",
                backgroundColor: "#ffffff",
                color: "var(--brand)",
                borderRadius: "var(--radius)",
                fontSize: "var(--font-sm)",
                fontWeight: "var(--font-medium)",
                textDecoration: "none",
                transition: "opacity 150ms ease",
              }}
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" style={{ flex: 1 }}>

        {/* ── Hero band ──────────────────────────────────────────────── */}
        <section style={{
          backgroundColor: "var(--brand)",
          padding: "var(--space-16) var(--space-6) var(--space-12)",
        }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

            {/* Eyebrow */}
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--font-xs)",
              fontWeight: "var(--font-medium)",
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "var(--space-5)",
            }}>
              Assignment &amp; Learning Analytics
            </p>

            {/* Headline */}
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: "var(--font-semibold)",
              color: "#ffffff",
              lineHeight: "1.1",
              letterSpacing: "-0.03em",
              marginBottom: "var(--space-6)",
              maxWidth: "720px",
            }}>
              Where instructors teach
              <br />
              <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.75)" }}>
                and students grow.
              </em>
            </h1>

            <p style={{
              fontSize: "var(--font-md)",
              color: "rgba(255,255,255,0.6)",
              lineHeight: "var(--leading-relaxed)",
              maxWidth: "480px",
              marginBottom: "var(--space-8)",
            }}>
              Create assignments, review submissions, provide actionable feedback,
              and spot learning gaps — all in one focused tool built for educators.
            </p>

            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
              <Link
                href="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "40px",
                  padding: "0 var(--space-5)",
                  backgroundColor: "#ffffff",
                  color: "var(--brand)",
                  borderRadius: "var(--radius)",
                  fontSize: "var(--font-base)",
                  fontWeight: "var(--font-medium)",
                  textDecoration: "none",
                  transition: "opacity 150ms ease",
                  whiteSpace: "nowrap",
                }}
              >
                Create an account
              </Link>
              <Link
                href="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "40px",
                  padding: "0 var(--space-5)",
                  backgroundColor: "transparent",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "var(--radius)",
                  fontSize: "var(--font-base)",
                  fontWeight: "var(--font-medium)",
                  textDecoration: "none",
                  transition: "border-color 150ms ease, color 150ms ease",
                  whiteSpace: "nowrap",
                }}
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* ── White framed column ─────────────────────────────────────── */}
        <div style={{ backgroundColor: "var(--page-surface)" }}>
          <div style={{
            maxWidth: "1280px",
            margin: "0 auto",
            backgroundColor: "var(--panel)",
            borderLeft: "1px solid var(--border)",
            borderRight: "1px solid var(--border)",
          }}>

            {/* ── Feature grid ──────────────────────────────────────── */}
            <section style={{ padding: "var(--space-12) var(--space-8)" }}>

              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--font-xs)",
                fontWeight: "var(--font-medium)",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "var(--space-8)",
              }}>
                What&apos;s included
              </p>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "0",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                overflow: "hidden",
              }}>
                {FEATURES.map((f, i) => (
                  <div
                    key={f.title}
                    style={{
                      padding: "var(--space-5)",
                      borderRight: (i + 1) % 3 !== 0 ? "1px solid var(--border)" : undefined,
                      borderBottom: i < FEATURES.length - 3 ? "1px solid var(--border)" : undefined,
                      backgroundColor: "var(--panel)",
                    }}
                  >
                    <p style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--font-xs)",
                      fontWeight: "var(--font-medium)",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: "var(--space-2)",
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p style={{
                      fontSize: "var(--font-base)",
                      fontWeight: "var(--font-medium)",
                      color: "var(--text-primary)",
                      marginBottom: "var(--space-2)",
                      letterSpacing: "-0.01em",
                    }}>
                      {f.title}
                    </p>
                    <p style={{
                      fontSize: "var(--font-sm)",
                      color: "var(--text-muted)",
                      lineHeight: "var(--leading-relaxed)",
                    }}>
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Divider ───────────────────────────────────────────── */}
            <div style={{
              height: "1px",
              backgroundColor: "var(--border)",
              marginInline: "var(--space-8)",
            }} />

            {/* ── Role cards ────────────────────────────────────────── */}
            <section style={{ padding: "var(--space-12) var(--space-8)" }}>

              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--font-xs)",
                fontWeight: "var(--font-medium)",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "var(--space-8)",
              }}>
                Two roles
              </p>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "var(--space-4)",
              }}>
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
              </div>
            </section>

          </div>
        </div>

      </main>

      {/* ── Footer band ─────────────────────────────────────────────── */}
      <footer style={{
        backgroundColor: "var(--brand)",
        borderTop: "1px solid #1a1a1a",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "var(--space-6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--font-base)",
            fontWeight: "var(--font-semibold)",
            color: "#ffffff",
            letterSpacing: "-0.01em",
          }}>
            Shikbo
          </span>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--font-xs)",
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>
            Assignment &amp; Learning Analytics
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ── RoleCard ──────────────────────────────────────────────────────────── */

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
    <div style={{
      backgroundColor: "var(--soft-panel)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "var(--space-6)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)",
    }}>
      {/* Role label */}
      <div>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-xs)",
          fontWeight: "var(--font-medium)",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "var(--space-3)",
        }}>
          {role}
        </p>
        <p style={{
          fontSize: "var(--font-sm)",
          color: "var(--text-secondary)",
          lineHeight: "var(--leading-relaxed)",
        }}>
          {description}
        </p>
      </div>

      {/* Feature list */}
      <ul style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        flex: 1,
      }}>
        {items.map((item) => (
          <li key={item} style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "var(--space-2)",
            fontSize: "var(--font-sm)",
            color: "var(--text-secondary)",
            lineHeight: "var(--leading-normal)",
          }}>
            <span aria-hidden="true" style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              marginTop: "1px",
              flexShrink: 0,
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius)",
              backgroundColor: "var(--panel)",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpolyline points='2,6 5,9 10,3' fill='none' stroke='%2352525b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }} />
            {item}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={href}
        style={{
          display: "inline-flex",
          alignItems: "center",
          height: "32px",
          padding: "0 var(--space-3)",
          backgroundColor: "var(--brand)",
          color: "#ffffff",
          borderRadius: "var(--radius)",
          fontSize: "var(--font-sm)",
          fontWeight: "var(--font-medium)",
          textDecoration: "none",
          alignSelf: "flex-start",
          transition: "opacity 150ms ease",
        }}
      >
        {cta} →
      </Link>
    </div>
  );
}

/* ── Static data ────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    title: "Assignment management",
    description:
      "Instructors create assignments with title, description, deadline, and difficulty level.",
  },
  {
    title: "Submission workflow",
    description:
      "Students submit a URL and optional note. Multiple resubmissions are supported — history is always preserved.",
  },
  {
    title: "Feedback & review",
    description:
      "Instructors mark submissions as accepted or needs improvement, with written feedback visible to students.",
  },
  {
    title: "Learning analytics",
    description:
      "Submission rates, status distributions, and at-risk student identification — in one view.",
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
