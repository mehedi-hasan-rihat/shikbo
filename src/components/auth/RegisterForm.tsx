"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register } from "@/server/actions/auth";
import type { AuthState } from "@/server/actions/auth";

export default function RegisterForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    register,
    null
  );

  return (
    <form action={action} noValidate style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {state?.message && (
        <div className="callout callout-danger" role="alert">
          {state.message}
        </div>
      )}

      {/* Name */}
      <div className="field">
        <label htmlFor="name" className="field-label">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          className={`input${state?.errors?.name ? " input--error" : ""}`}
          placeholder="Jane Smith"
          aria-describedby={state?.errors?.name ? "name-error" : undefined}
          aria-invalid={state?.errors?.name ? "true" : undefined}
          required
        />
        {state?.errors?.name && (
          <p id="name-error" className="field-error">
            {state.errors.name[0]}
          </p>
        )}
      </div>

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
          autoComplete="new-password"
          className={`input${state?.errors?.password ? " input--error" : ""}`}
          placeholder="At least 8 characters"
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

      {/* Role */}
      <div className="field">
        <label htmlFor="role" className="field-label">
          I am a…
        </label>
        <select
          id="role"
          name="role"
          className={`select${state?.errors?.role ? " input--error" : ""}`}
          defaultValue=""
          aria-describedby={state?.errors?.role ? "role-error" : undefined}
          aria-invalid={state?.errors?.role ? "true" : undefined}
          required
        >
          <option value="" disabled>
            Select a role
          </option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
        {state?.errors?.role && (
          <p id="role-error" className="field-error">
            {state.errors.role[0]}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </button>

      <p style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)", textAlign: "center" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--primary)" }}>
          Sign in
        </Link>
      </p>
    </form>
  );
}
