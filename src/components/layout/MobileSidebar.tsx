"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavSection } from "./SidebarNav";
import { logout } from "@/server/actions/auth";

type MobileSidebarProps = {
  sections: NavSection[];
  appName: string;
  userName: string;
  role: "instructor" | "student";
};

export function MobileSidebar({
  sections,
  appName,
  userName,
  role,
}: MobileSidebarProps) {
  // Pair open state with the pathname it was opened on.
  // When the route changes, derivedOpen is false — no setState in effects needed.
  const pathname = usePathname();
  const [{ open, trackedPath }, setDrawerState] = useState({
    open: false,
    trackedPath: pathname,
  });
  const derivedOpen = trackedPath === pathname && open;

  const drawerRef = useRef<HTMLElement>(null);

  function openDrawer() {
    setDrawerState({ open: true, trackedPath: pathname });
  }

  function closeDrawer() {
    setDrawerState((s) => ({ ...s, open: false }));
  }

  // Escape key + body scroll lock
  useEffect(() => {
    if (!derivedOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [derivedOpen]);

  return (
    <>
      {/* Mobile top bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 var(--space-4)",
          height: 52,
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <span
          style={{
            fontSize: "var(--font-base)",
            fontWeight: "var(--font-semibold)",
            color: "var(--text-primary)",
          }}
        >
          {appName}
        </span>
        <button
          type="button"
          onClick={openDrawer}
          aria-label="Open navigation menu"
          aria-expanded={derivedOpen}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: "var(--radius-md)",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--text-secondary)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 4.5h14M2 9h14M2 13.5h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      {/* Backdrop */}
      {derivedOpen && (
        <div
          aria-hidden="true"
          onClick={closeDrawer}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 40,
          }}
        />
      )}

      {/* Drawer */}
      <nav
        ref={drawerRef}
        aria-label="Navigation drawer"
        aria-hidden={!derivedOpen}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 260,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          transform: derivedOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 200ms ease",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "var(--space-5) var(--space-4)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span
            style={{
              fontSize: "var(--font-base)",
              fontWeight: "var(--font-semibold)",
              color: "var(--text-primary)",
            }}
          >
            {appName}
          </span>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close navigation menu"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "var(--radius-md)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Nav sections */}
        <div className="sidebar-nav" style={{ flex: 1 }}>
          {sections.map((section, i) => (
            <div key={i}>
              {section.label && (
                <p className="sidebar-section-label">{section.label}</p>
              )}
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-nav-item${isActive ? " active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.icon && (
                      <span aria-hidden="true" style={{ flexShrink: 0 }}>
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User footer */}
        <div
          style={{
            padding: "var(--space-3)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              padding: "var(--space-2) var(--space-3)",
              fontSize: "var(--font-sm)",
              color: "var(--text-secondary)",
              marginBottom: "var(--space-1)",
            }}
          >
            <span
              style={{
                display: "block",
                fontWeight: "var(--font-medium)",
                color: "var(--text-primary)",
              }}
            >
              {userName}
            </span>
            <span
              style={{
                fontSize: "var(--font-xs)",
                color: "var(--text-muted)",
                textTransform: "capitalize",
              }}
            >
              {role}
            </span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="sidebar-nav-item"
              style={{ width: "100%" }}
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>
    </>
  );
}
