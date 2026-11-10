import React from "react";

const shimmerBoxStyle: React.CSSProperties = {
  background:
    "linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-highlight) 50%, var(--skeleton-base) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.4s infinite linear",
  borderRadius: 10,
};

export const AnalyticsSkeletonLoader: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Executive KPI Cards Shimmer Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ ...shimmerBoxStyle, width: "56%", height: 14 }} />
              <div style={{ ...shimmerBoxStyle, width: 28, height: 28, borderRadius: 8 }} />
            </div>
            <div style={{ ...shimmerBoxStyle, width: "44%", height: 26 }} />
            <div style={{ ...shimmerBoxStyle, width: "68%", height: 12 }} />
          </div>
        ))}
      </div>

      {/* Main Chart Card + Secondary Card Shimmer */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ ...shimmerBoxStyle, width: "40%", height: 18 }} />
          <div style={{ ...shimmerBoxStyle, width: "100%", height: 210 }} />
        </div>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ ...shimmerBoxStyle, width: "48%", height: 18 }} />
          <div style={{ ...shimmerBoxStyle, width: "100%", height: 52 }} />
          <div style={{ ...shimmerBoxStyle, width: "100%", height: 52 }} />
          <div style={{ ...shimmerBoxStyle, width: "100%", height: 52 }} />
        </div>
      </div>

      {/* Table / Matrix Shimmer */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ ...shimmerBoxStyle, width: "30%", height: 18 }} />
        <div style={{ ...shimmerBoxStyle, width: "100%", height: 150 }} />
      </div>
    </div>
  );
};

