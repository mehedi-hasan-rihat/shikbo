import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in — Shikbo",
};

export default function LoginPage() {
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
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6)",
        }}
      >
        {/* Header */}
        <div>
          <h1
            style={{
              fontSize: "var(--font-2xl)",
              fontWeight: "var(--font-semibold)",
              color: "var(--text-primary)",
              marginBottom: "var(--space-1)",
            }}
          >
            Sign in
          </h1>
          <p style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
            Shikbo — Assignment &amp; Learning Analytics
          </p>
        </div>

        {/* Card */}
        <div className="card">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
