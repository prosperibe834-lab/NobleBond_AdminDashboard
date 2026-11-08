import React, { useState } from "react";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "right" | "top" | "bottom" | "left";
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "right",
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (disabled || !content) {
    return <>{children}</>;
  }

  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case "right":
        return {
          left: "calc(100% + 10px)",
          top: "50%",
          transform: "translateY(-50%)",
        };
      case "left":
        return {
          right: "calc(100% + 10px)",
          top: "50%",
          transform: "translateY(-50%)",
        };
      case "top":
        return {
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "bottom":
        return {
          top: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
        };
    }
  };

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className="animate-fade-in"
          style={{
            position: "absolute",
            zIndex: 9999,
            pointerEvents: "none",
            backgroundColor: "var(--bg-surface-elevated)",
            color: "var(--text-main)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            boxShadow: "var(--shadow-md)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            ...getPositionStyles(),
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

