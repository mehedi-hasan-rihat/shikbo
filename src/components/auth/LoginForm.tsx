"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/server/actions/auth";
import type { AuthState } from "@/server/actions/auth";

export default function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    login,
    null
  );

  return (
    <form action={action} noValidate style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {state?.message && (
        <div className="callout callout-danger" role="alert">
          {state.message}
        </div>
      )}

      {/* Email */}
      <div className="field">
        <label htmlFor="email" className="field-label">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={`input${state?.errors?.email ? " input--error" : ""}`}
          placeholder="jane@example.com"
          aria-describedby={state?.errors?.email ? "email-error" : undefined}
          aria-invalid={state?.errors?.email ? "true" : undefined}
          required
        />
        {state?.errors?.email && (
          <p id="email-error" className="field-error">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="field">
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className={`input${state?.errors?.password ? " input--error" : ""}`}
          placeholder="Your password"
          aria-describedby={state?.errors?.password ? "password-error" : undefined}
          aria-invalid={state?.errors?.password ? "true" : undefined}
          required
        />
        {state?.errors?.password && (
          <p id="password-error" className="field-error">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <p style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)", textAlign: "center" }}>
        Don&apos;t have an account?{" "}
        <Link href="/register" style={{ color: "var(--primary)" }}>
          Create one
        </Link>
      </p>
    </form>
  );
}
