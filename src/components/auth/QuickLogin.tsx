"use client";

const ACCOUNTS = [
  {
    label: "Instructor",
    email: "instructor@shikbo.dev",
    description: "Alex Carter",
  },
  {
    label: "Student",
    email: "mehedi@shikbo.dev",
    description: "Mehedi Hasan",
  },
] as const;

const PASSWORD = "password123";

// Sets a controlled React input's value by going through the native setter
// so React's synthetic event system sees the change.
function setNativeValue(input: HTMLInputElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  );
  descriptor?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

export default function QuickLogin() {
  function loginAs(email: string) {
    // Find the login form on the page — it has email + password inputs
    const form = document.querySelector<HTMLFormElement>("form[novalidate]");
    if (!form) return;

    const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
    const passwordInput = form.querySelector<HTMLInputElement>('input[name="password"]');
    if (!emailInput || !passwordInput) return;

    setNativeValue(emailInput, email);
    setNativeValue(passwordInput, PASSWORD);

    // Small delay so React state settles before submit
    requestAnimationFrame(() => form.requestSubmit());
  }

  return (
    <div>
      {/* Divider */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        marginBottom: "var(--space-3)",
      }}>
        <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-xs)",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          whiteSpace: "nowrap",
        }}>
          Demo accounts
        </span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
      </div>

      {/* Buttons */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "var(--space-2)",
      }}>
        {ACCOUNTS.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => loginAs(account.email)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "var(--space-3)",
              backgroundColor: "var(--soft-panel)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              textAlign: "left",
              transition: "border-color 150ms ease, background-color 150ms ease",
              gap: "2px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-strong)";
              e.currentTarget.style.backgroundColor = "var(--background-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.backgroundColor = "var(--soft-panel)";
            }}
          >
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--font-xs)",
              fontWeight: "var(--font-medium)",
              color: "var(--text-primary)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}>
              {account.label}
            </span>
            <span style={{
              fontSize: "var(--font-xs)",
              color: "var(--text-muted)",
            }}>
              {account.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
