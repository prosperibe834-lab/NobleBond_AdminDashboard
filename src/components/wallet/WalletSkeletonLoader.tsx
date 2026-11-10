import React from "react";
import { Skeleton } from "../common/SkeletonLoader";

export const WalletSkeletonLoader: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "12px",
        }}
      >
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)" }}>
            <Skeleton width="55%" height={13} style={{ marginBottom: "10px" }} />
            <Skeleton width="75%" height={24} style={{ marginBottom: "8px" }} />
            <Skeleton width="90%" height={11} />
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
        }}
      >
        {[1, 2, 3].map((card) => (
          <div
            key={card}
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
            <Skeleton width="60%" height={18} />
            <Skeleton width="100%" height={14} />
            <Skeleton width="90%" height={14} />
            <Skeleton width="100%" height={36} borderRadius="10px" />
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
          gap: "12px",
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

