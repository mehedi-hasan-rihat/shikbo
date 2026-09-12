"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";

type DropdownItem = {
  id: string;
  label: string;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
  disabled?: boolean;
};

type DropdownGroup = {
  items: DropdownItem[];
};

type DropdownProps = {
  trigger: React.ReactNode;
  groups: DropdownGroup[];
  align?: "left" | "right";
};

export function Dropdown({ trigger, groups, align = "right" }: DropdownProps) {
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

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <div
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {trigger}
      </div>

      {open && (
        <div
          className="dropdown-menu"
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + var(--space-1))",
            ...(align === "right" ? { right: 0 } : { left: 0 }),
          }}
        >
          {groups.map((group, gi) => (
            <div key={gi}>
              {gi > 0 && <div className="dropdown-separator" role="separator" />}
              {group.items.map((item) => {
                const cls = `dropdown-item${item.danger ? " dropdown-item-danger" : ""}`;
                if (item.href) {
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      role="menuitem"
                      className={cls}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  );
                }
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    className={cls}
                    onClick={() => {
                      item.onClick?.();
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
