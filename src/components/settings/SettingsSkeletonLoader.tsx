import React from "react";

const shimmerBox: React.CSSProperties = {
  background:
    "linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-highlight) 50%, var(--skeleton-base) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.4s infinite linear",
  borderRadius: 10,
};

export const SettingsSkeletonLoader: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header Form Card Shimmer */}
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
        <div style={{ ...shimmerBox, width: "42%", height: 20 }} />
        <div style={{ ...shimmerBox, width: "68%", height: 13 }} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            marginTop: 6,
          }}
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ ...shimmerBox, width: "45%", height: 12 }} />
              <div style={{ ...shimmerBox, width: "100%", height: 38 }} />
            </div>
          ))}
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
          gap: 12,
        }}
      >
        <div style={{ ...shimmerBox, width: "36%", height: 18 }} />
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} style={{ ...shimmerBox, width: "100%", height: 48 }} />
        ))}
      </div>
    </div>
  );
};

