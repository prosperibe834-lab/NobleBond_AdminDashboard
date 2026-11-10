import React, { useState, useRef, useEffect } from "react";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { METRIC_DEFINITIONS } from "../../data/platformAnalyticsDataService";

interface AnalyticsMetricTooltipProps {
  metricId: string;
}

export const AnalyticsMetricTooltip: React.FC<AnalyticsMetricTooltipProps> = ({
  metricId,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const def = METRIC_DEFINITIONS[metricId];

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  if (!def) return null;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
    >
      <button
        type="button"
        aria-label={`Metric definition for ${def.name}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: "1px solid var(--border)",
          background: open ? "var(--bg-active)" : "var(--bg-surface-elevated)",
          color: open ? "var(--primary)" : "var(--text-secondary)",
          cursor: "pointer",
          padding: 0,
          transition: "all 0.15s ease",
        }}
      >
        <Info size={12} />
      </button>

      {open && (
        <div
          role="tooltip"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 60,
            width: 290,
            padding: 12,
            borderRadius: 12,
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text-main)",
              marginBottom: 4,
            }}
          >
            {def.name}
          </div>
          <div
            style={{
              fontSize: 11.5,
              color: "var(--text-secondary)",
              lineHeight: 1.45,
              marginBottom: 6,
            }}
          >
            {def.formula}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              paddingTop: 6,
              borderTop: "1px solid var(--border-light)",
              fontSize: 11,
            }}
          >
            <span style={{ color: "var(--primary)", fontWeight: 600 }}>
              Source: {def.sourceModule}
            </span>
            {def.caveat && (
              <span style={{ color: "var(--text-muted)" }}>
                Note: {def.caveat}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface MetricDeltaPillProps {
  deltaPercent: number | null;
  invertGoodBad?: boolean;
  compareLabel?: string;
}

export const MetricDeltaPill: React.FC<MetricDeltaPillProps> = ({
  deltaPercent,
  invertGoodBad = false,
  compareLabel,
}) => {
  if (deltaPercent === null || Number.isNaN(deltaPercent)) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontSize: 11,
          fontWeight: 600,
          color: "var(--text-muted)",
          background: "var(--bg-surface-elevated)",
          padding: "2px 8px",
          borderRadius: 999,
        }}
      >
        <Minus size={11} />
        No prior baseline
      </span>
    );
  }

  const isPositive = deltaPercent > 0;
  const isNeutral = deltaPercent === 0;
  const isGood = invertGoodBad ? !isPositive : isPositive;

  const color = isNeutral
    ? "var(--text-secondary)"
    : isGood
      ? "var(--status-success)"
      : "var(--status-error)";
  const bg = isNeutral
    ? "var(--bg-surface-elevated)"
    : isGood
      ? "var(--status-success-bg)"
      : "var(--status-error-bg)";

  return (
    <span
      title={compareLabel ? `Compared against ${compareLabel}` : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontWeight: 700,
        color,
        background: bg,
        padding: "2px 8px",
        borderRadius: 999,
      }}
    >
      {isPositive ? (
        <TrendingUp size={11} />
      ) : isNeutral ? (
        <Minus size={11} />
      ) : (
        <TrendingDown size={11} />
      )}
      {isPositive ? `+${deltaPercent}%` : `${deltaPercent}%`}
      {compareLabel ? ` vs ${compareLabel}` : ""}
    </span>
  );
};

