"use client";

import { useEffect, useRef } from "react";
import type React from "react";

type DialogSize = "sm" | "default" | "lg" | "xl";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: DialogSize;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const sizeClass: Record<DialogSize, string> = {
  sm: "dialog dialog-sm",
  default: "dialog",
  lg: "dialog dialog-lg",
  xl: "dialog dialog-xl",
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  size = "default",
  children,
  footer,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = `dialog-title-${title.toLowerCase().replace(/\s+/g, "-")}`;
  const descId = description ? `${titleId}-desc` : undefined;

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
      // Focus the dialog after it opens
      setTimeout(() => dialogRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onClick={(e) => {
        // Close when clicking the backdrop, not the dialog itself
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        className={sizeClass[size]}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-header">
          <div>
            <h2 id={titleId} className="dialog-title">
              {title}
            </h2>
            {description && (
              <p id={descId} className="dialog-description">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: "var(--radius-md)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text-muted)",
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="dialog-body">{children}</div>

        {footer && <div className="dialog-footer">{footer}</div>}
      </div>
    </div>
  );
}
