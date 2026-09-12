import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not found — Shikbo",
};

export default function GlobalNotFound() {
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
          404
        </p>
        <h1
          style={{
            fontSize: "var(--font-2xl)",
            fontWeight: "var(--font-semibold)",
            color: "var(--text-primary)",
          }}
        >
          Page not found
        </h1>
        <p
          style={{
            fontSize: "var(--font-base)",
            color: "var(--text-muted)",
            lineHeight: "var(--leading-relaxed)",
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="btn btn-secondary"
          style={{ alignSelf: "center" }}
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
