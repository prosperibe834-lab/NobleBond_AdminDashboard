// NobleBond Admin — Subscription Skeleton Loaders
// Closely mimics KPI cards, Plan cards, Overview panels, and Table rows during loading/refresh. Zero emojis.

import React from "react";
import { Skeleton } from "../common/SkeletonLoader";

export const SubscriptionSkeletonLoader: React.FC<{ variant?: "overview" | "plans" | "table" }> = ({
  variant = "table",
}) => {
  if (variant === "plans") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "18px" }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              padding: "22px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <Skeleton width="60%" height="20px" />
            <Skeleton width="45%" height="30px" />
            <Skeleton width="100%" height="36px" />
            <Skeleton width="80%" height="14px" />
            <Skeleton width="75%" height="14px" />
            <Skeleton width="100%" height="34px" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "overview") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px" }}>
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              padding: "22px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <Skeleton width="55%" height="20px" />
            <Skeleton width="100%" height="160px" />
            <Skeleton width="100%" height="44px" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {[1, 2, 3, 4, 5, 6].map((r) => (
        <div key={r} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <Skeleton width="36px" height="36px" borderRadius="50%" />
          <Skeleton width="22%" height="14px" />
          <Skeleton width="18%" height="14px" />
          <Skeleton width="14%" height="14px" />
          <Skeleton width="15%" height="22px" borderRadius="999px" />
        </div>
      ))}
    </div>
  );
};

