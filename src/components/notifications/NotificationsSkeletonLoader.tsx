import React from "react";

const shimmerBox: React.CSSProperties = {
  background:
    "linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-highlight) 50%, var(--skeleton-base) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.4s infinite linear",
  borderRadius: 10,
};

export const NotificationsSkeletonLoader: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))",
          gap: 12,
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 15,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ ...shimmerBox, width: "55%", height: 12 }} />
            <div style={{ ...shimmerBox, width: "40%", height: 24 }} />
            <div style={{ ...shimmerBox, width: "75%", height: 10 }} />
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 18,
            height: 290,
          }}
        >
          <div style={{ ...shimmerBox, width: "45%", height: 18, marginBottom: 14 }} />
          <div style={{ ...shimmerBox, width: "100%", height: 215 }} />
        </div>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 18,
            height: 290,
          }}
        >
          <div style={{ ...shimmerBox, width: "50%", height: 18, marginBottom: 14 }} />
          <div style={{ ...shimmerBox, width: "100%", height: 215 }} />
        </div>
      </div>
    </div>
  );
};

