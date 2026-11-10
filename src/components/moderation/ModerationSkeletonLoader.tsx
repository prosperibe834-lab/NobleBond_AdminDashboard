// NobleBond Admin — Moderation Skeleton Loader
// Shimmer state placeholders during data fetch, zero emojis

import React from "react";

export const ModerationSkeletonLoader: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* KPI Cards Skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              height: "88px",
              borderRadius: "14px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          />
        ))}
      </div>

      {/* Main Table / Overview Skeleton */}
      <div
        className="skeleton"
        style={{
          height: "360px",
          borderRadius: "16px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      />

      {/* Bottom Section Skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "18px",
        }}
      >
        <div
          className="skeleton"
          style={{
            height: "220px",
            borderRadius: "16px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        />
        <div
          className="skeleton"
          style={{
            height: "220px",
            borderRadius: "16px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        />
      </div>
    </div>
  );
};
