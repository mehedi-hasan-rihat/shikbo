import type React from "react";

type BadgeVariant =
  | "neutral"
  | "beginner"
  | "intermediate"
  | "advanced"
  | "pending"
  | "accepted"
  | "needs-improvement";

type BadgeProps = {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
};

const variantClass: Record<BadgeVariant, string> = {
  neutral: "badge badge-neutral",
  beginner: "badge badge-beginner",
  intermediate: "badge badge-intermediate",
  advanced: "badge badge-advanced",
  pending: "badge badge-pending",
  accepted: "badge badge-accepted",
  "needs-improvement": "badge badge-needs-improvement",
};

export function Badge({ variant = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span className={`${variantClass[variant]} ${className}`.trim()}>
      {children}
    </span>
  );
}

// Convenience wrappers for domain types

type DifficultyBadgeProps = {
  difficulty: "beginner" | "intermediate" | "advanced";
};

const difficultyLabel: Record<DifficultyBadgeProps["difficulty"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return <Badge variant={difficulty}>{difficultyLabel[difficulty]}</Badge>;
}

type StatusBadgeProps = {
  status: "pending" | "accepted" | "needs_improvement";
};

const statusVariant: Record<StatusBadgeProps["status"], BadgeVariant> = {
  pending: "pending",
  accepted: "accepted",
  needs_improvement: "needs-improvement",
};

const statusLabel: Record<StatusBadgeProps["status"], string> = {
  pending: "Pending",
  accepted: "Accepted",
  needs_improvement: "Needs Improvement",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>
  );
}
