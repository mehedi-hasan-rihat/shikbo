import type React from "react";

type CardVariant = "default" | "sm" | "kpi";

type CardProps = {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const variantClass: Record<CardVariant, string> = {
  default: "card",
  sm: "card-sm",
  kpi: "card-kpi",
};

export function Card({ variant = "default", className = "", children, style }: CardProps) {
  return (
    <div className={`${variantClass[variant]} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}

// KPI subcomponents for convenience
type KpiCardProps = {
  label: string;
  value: React.ReactNode;
  support?: React.ReactNode;
  className?: string;
};

export function KpiCard({ label, value, support, className = "" }: KpiCardProps) {
  return (
    <div className={`card-kpi ${className}`.trim()}>
      <span className="card-kpi__label">{label}</span>
      <span className="card-kpi__value">{value}</span>
      {support && <span className="card-kpi__support">{support}</span>}
    </div>
  );
}
