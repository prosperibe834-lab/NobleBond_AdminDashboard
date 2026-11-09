import React from "react";

export const UserStatsSkeleton: React.FC = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "14px",
      }}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="skeleton-pulse"
          style={{
            height: "105px",
            borderRadius: "14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        />
      ))}
    </div>
  );
};

export const UserTableSkeleton: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        overflow: "hidden",
        padding: "16px",
      }}
    >
      <div
        className="skeleton-pulse"
        style={{
          height: "44px",
          borderRadius: "8px",
          marginBottom: "16px",
          backgroundColor: "var(--bg-surface)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="skeleton-pulse"
            style={{
              height: "56px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-surface)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const UserChartsSkeleton: React.FC = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "16px",
      }}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="skeleton-pulse"
          style={{
            height: "220px",
            borderRadius: "14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        />
      ))}
    </div>
  );
};
