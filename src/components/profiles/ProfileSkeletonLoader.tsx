// NobleBond Admin — Profile Management Skeleton Loader
// Shimmer placeholders for loading feedback, zero emojis

import React from "react";

export const ProfileSkeletonLoader: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* KPI Skeleton Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
          gap: "14px",
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              height: "90px",
              borderRadius: "14px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          />
        ))}
      </div>

      {/* Analytics Skeleton */}
      <div
        className="skeleton"
        style={{
          height: "180px",
          borderRadius: "16px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      />

      {/* Table Skeleton */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              height: "46px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-main)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

