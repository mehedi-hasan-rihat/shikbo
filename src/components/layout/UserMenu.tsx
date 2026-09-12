"use client";

import { useRef, useState, useEffect } from "react";
import { logout } from "@/server/actions/auth";

type UserMenuProps = {
  name: string;
  role: "instructor" | "student";
};

export function UserMenu({ name, role }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="User menu"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          width: "100%",
          padding: "var(--space-2) var(--space-3)",
          borderRadius: "var(--radius-md)",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          textAlign: "left",
          transition: "background-color 150ms ease",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "var(--background-hover)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "transparent")
        }
      >
        {/* Avatar */}
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: "var(--radius-md)",
            background: "var(--primary-subtle)",
            color: "var(--primary)",
            fontSize: "var(--font-xs)",
            fontWeight: "var(--font-semibold)",
            flexShrink: 0,
          }}
        >
          {initials}
        </span>
        <span
          style={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "var(--font-sm)",
              fontWeight: "var(--font-medium)",
              color: "var(--text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </span>
          <span
            style={{
              display: "block",
              fontSize: "var(--font-xs)",
              color: "var(--text-muted)",
              textTransform: "capitalize",
            }}
          >
            {role}
          </span>
        </span>
        {/* Chevron */}
        <svg
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            flexShrink: 0,
            color: "var(--text-muted)",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 150ms ease",
          }}
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            bottom: "calc(100% + var(--space-1))",
            left: 0,
            right: 0,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
            zIndex: 50,
          }}
        >
          <form action={logout}>
            <button
              type="submit"
              role="menuitem"
              style={{
                display: "block",
                width: "100%",
                padding: "var(--space-2) var(--space-3)",
                textAlign: "left",
                background: "transparent",
                border: "none",
                fontSize: "var(--font-sm)",
                color: "var(--text-secondary)",
                cursor: "pointer",
                transition: "background-color 150ms ease, color 150ms ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = "var(--background-hover)";
                el.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = "transparent";
                el.style.color = "var(--text-secondary)";
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
