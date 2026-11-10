import React from "react";
import { Skeleton } from "../common/SkeletonLoader";

export const ReferralSkeletonLoader: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))",
          gap: "12px",
        }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "14px",
            }}
          >
            <Skeleton width="60%" height={13} style={{ marginBottom: "10px" }} />
            <Skeleton width="45%" height={24} style={{ marginBottom: "8px" }} />
            <Skeleton width="85%" height={11} />
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
          gap: "16px",
        }}
      >
        {[1, 2].map((panel) => (
          <div
            key={panel}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Skeleton width="55%" height={18} />
            <Skeleton width="100%" height={140} borderRadius="12px" />
          </div>
        ))}
      </div>

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton width="220px" height={18} />
        {[1, 2, 3, 4, 5].map((row) => (
          <Skeleton key={row} width="100%" height={42} borderRadius="10px" />
        ))}
      </div>
    </div>
  );
};

