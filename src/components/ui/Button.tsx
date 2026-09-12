import type React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "danger-ghost";
type ButtonSize = "sm" | "default" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  ghost: "btn btn-ghost",
  danger: "btn btn-danger",
  "danger-ghost": "btn btn-danger-ghost",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "btn-sm",
  default: "",
  lg: "btn-lg",
};

export function Button({
  variant = "secondary",
  size = "default",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = [
    variantClass[variant],
    size !== "default" ? sizeClass[size] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
    >
      {loading && (
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{
            animation: "spin 0.75s linear infinite",
            flexShrink: 0,
          }}
        >
          <circle
            cx="7"
            cy="7"
            r="5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
          <path
            d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
