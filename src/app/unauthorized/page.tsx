import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unauthorized — Shikbo",
};

export default function UnauthorizedPage() {
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        padding: "var(--space-6)",
        backgroundColor: "var(--background-subtle)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        <p
          style={{
            fontSize: "var(--font-sm)",
            fontWeight: "var(--font-medium)",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          403
        </p>
        <h1
          style={{
            fontSize: "var(--font-2xl)",
            fontWeight: "var(--font-semibold)",
            color: "var(--text-primary)",
          }}
        >
          Access denied
        </h1>
        <p
          style={{
            fontSize: "var(--font-base)",
            color: "var(--text-muted)",
            lineHeight: "var(--leading-relaxed)",
          }}
        >
          You don&apos;t have permission to view this page.
        </p>
        <Link
          href="/login"
          className="btn btn-secondary"
          style={{ alignSelf: "center" }}
        >
          Go to sign in
        </Link>
      </div>
    </main>
  );
}
