import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../theme/useTheme";

interface ThemeToggleProps {
  variant?: "header" | "sidebar";
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "header",
  showLabel = false,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: variant === "sidebar" && showLabel ? "8px 14px" : "8px",
        height: "38px",
        minWidth: variant === "sidebar" && showLabel ? "auto" : "38px",
        borderRadius: "10px",
        border: "1px solid var(--border)",
        backgroundColor: "var(--bg-surface)",
        color: isDark ? "var(--accent-champagne)" : "var(--primary)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: "var(--shadow-sm)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-focus)";
        e.currentTarget.style.backgroundColor = "var(--bg-hover)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.backgroundColor = "var(--bg-surface)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: isDark ? "rotate(0deg)" : "rotate(360deg)",
          transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {isDark ? (
          <Sun size={18} strokeWidth={2.2} color="var(--accent-champagne)" />
        ) : (
          <Moon size={18} strokeWidth={2.2} color="var(--primary)" />
        )}
      </div>

      {showLabel && (
        <span
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--text-main)",
            whiteSpace: "nowrap",
          }}
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
};
