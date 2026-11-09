// NobleBond Admin — Suspicious Activity & Interaction Risk Indicators
// Surfaces abnormal swiping velocity, coordinated patterns, zero emojis

import React, { useState } from "react";
import { ShieldAlert, ChevronRight, X } from "lucide-react";
import type { SuspiciousActivityFlag } from "../../types/likesMatches.types";
import { INITIAL_SUSPICIOUS_FLAGS } from "../../data/likesMatchesDataService";

interface SuspiciousIndicatorsSectionProps {
  onInvestigateUser?: (userId: string) => void;
}

export const SuspiciousIndicatorsSection: React.FC<SuspiciousIndicatorsSectionProps> = ({
  onInvestigateUser,
}) => {
  const [flags, setFlags] = useState<SuspiciousActivityFlag[]>(INITIAL_SUSPICIOUS_FLAGS);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || flags.length === 0) return null;

  const handleDismissFlag = (id: string) => {
    setFlags((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(245, 158, 11, 0.08)",
        border: "1px solid rgba(245, 158, 11, 0.25)",
        borderRadius: "16px",
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "rgba(245, 158, 11, 0.15)",
              color: "#F59E0B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldAlert size={18} />
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
              Suspicious Interaction Risk Flags ({flags.length} Detected)
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Algorithmic pattern triggers for investigation. Verification required before administrative action.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            padding: "4px",
          }}
          title="Dismiss warning banner"
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px" }}>
        {flags.map((flag) => (
          <div
            key={flag.id}
            style={{
              backgroundColor: "var(--bg-card)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <img
                    src={flag.user.avatar}
                    alt={flag.user.name}
                    style={{ width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <strong style={{ fontSize: "12.5px", color: "var(--text-main)" }}>{flag.user.name}</strong>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{flag.user.username}</span>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor: flag.severity === "high" ? "var(--status-error-bg)" : "rgba(245, 158, 11, 0.15)",
                    color: flag.severity === "high" ? "var(--status-error)" : "#F59E0B",
                  }}
                >
                  {flag.severity} risk
                </span>
              </div>

              <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "6px", lineHeight: "1.4" }}>
                {flag.description}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "6px", borderTop: "1px solid var(--border)" }}>
              <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                {new Date(flag.detectedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>

              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => handleDismissFlag(flag.id)}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    backgroundColor: "transparent",
                    color: "var(--text-secondary)",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  Dismiss
                </button>

                <button
                  type="button"
                  onClick={() => onInvestigateUser?.(flag.user.id)}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "var(--primary)",
                    color: "#FFFFFF",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  Investigate <ChevronRight size={11} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
