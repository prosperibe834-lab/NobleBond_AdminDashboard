import React from "react";
import { useNavigate } from "react-router-dom";
import { X, ExternalLink, Layers, Info } from "lucide-react";
import type { DrilldownPayload } from "../../types/analyticsManagement.types";

interface AnalyticsDrilldownDrawerProps {
  payload: DrilldownPayload | null;
  onClose: () => void;
}

export const AnalyticsDrilldownDrawer: React.FC<AnalyticsDrilldownDrawerProps> = ({
  payload,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!payload) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Analytics Drilldown: ${payload.title}`}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 85,
        background: "rgba(15, 10, 20, 0.48)",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(480px, 94vw)",
          height: "100%",
          background: "var(--bg-surface)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
          padding: 22,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflowY: "auto",
          animation: "slideInRight 0.2s ease",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              paddingBottom: 14,
              borderBottom: "1px solid var(--border-light)",
              marginBottom: 16,
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--primary)",
                  background: "var(--bg-active)",
                  padding: "3px 9px",
                  borderRadius: 999,
                  marginBottom: 8,
                }}
              >
                <Layers size={11} />
                {payload.sourceModuleLabel}
              </span>
              <h3 style={{ margin: 0, fontSize: 18, color: "var(--text-main)" }}>
                {payload.title}
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
                {payload.subtitle}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close drilldown panel"
              onClick={onClose}
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: 6,
                color: "var(--text-main)",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {payload.rows.map((row, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 12,
                  padding: "11px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)" }}>
                    {row.label}
                  </div>
                  {row.hint && (
                    <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
                      {row.hint}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text-main)",
                    textAlign: "right",
                  }}
                >
                  {row.value}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 18,
              padding: 12,
              borderRadius: 12,
              background: "var(--status-info-bg)",
              border: "1px solid var(--border-light)",
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <Info size={15} style={{ color: "var(--status-info)", flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              <strong>Calculation Methodology:</strong> {payload.methodologyNote}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            paddingTop: 16,
            borderTop: "1px solid var(--border-light)",
            marginTop: 20,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "9px 14px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg-surface)",
              color: "var(--text-main)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate(payload.targetRoute);
            }}
            style={{
              flex: 1.5,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              padding: "9px 14px",
              borderRadius: 10,
              border: "none",
              background: "var(--primary)",
              color: "var(--primary-text)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <span>Open {payload.sourceModuleLabel}</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

