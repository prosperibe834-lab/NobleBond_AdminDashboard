import React from "react";

export type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "live"
  | "champagne";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "sm",
  dot = false,
}) => {
  const getColors = () => {
    switch (variant) {
      case "primary":
        return {
          bg: "rgba(193, 47, 102, 0.12)",
          color: "var(--primary)",
          border: "rgba(193, 47, 102, 0.25)",
        };
      case "success":
        return {
          bg: "var(--status-success-bg)",
          color: "var(--status-success)",
          border: "rgba(20, 132, 95, 0.25)",
        };
      case "warning":
        return {
          bg: "var(--status-warning-bg)",
          color: "var(--status-warning)",
          border: "rgba(217, 119, 6, 0.25)",
        };
      case "error":
        return {
          bg: "var(--status-error-bg)",
          color: "var(--status-error)",
          border: "rgba(201, 54, 79, 0.25)",
        };
      case "info":
        return {
          bg: "var(--status-info-bg)",
          color: "var(--status-info)",
          border: "rgba(37, 99, 235, 0.25)",
        };
      case "live":
        return {
          bg: "rgba(239, 68, 68, 0.14)",
          color: "#EF4444",
          border: "rgba(239, 68, 68, 0.35)",
        };
      case "champagne":
        return {
          bg: "var(--accent-champagne-bg)",
          color: "var(--accent-champagne)",
          border: "rgba(181, 139, 66, 0.25)",
        };
      case "neutral":
      default:
        return {
          bg: "var(--bg-surface-elevated)",
          color: "var(--text-secondary)",
          border: "var(--border)",
        };
    }
  };

  const style = getColors();

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: size === "sm" ? "2px 8px" : "4px 10px",
        fontSize: size === "sm" ? "11px" : "12px",
        fontWeight: 600,
        borderRadius: "999px",
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        lineHeight: 1.3,
        letterSpacing: "0.2px",
        whiteSpace: "nowrap",
      }}
    >
      {dot && (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: style.color,
          }}
          className={variant === "live" ? "animate-pulse-live" : undefined}
        />
      )}
      {children}
    </span>
  );
};

