import React from "react";
import { Skeleton } from "../common/SkeletonLoader";

interface SupportSkeletonLoaderProps {
  variant?: "overview" | "inbox" | "table";
}

export const SupportSkeletonLoader: React.FC<SupportSkeletonLoaderProps> = ({
  variant = "overview",
}) => {
  if (variant === "inbox") {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "14px",
        }}
      >
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <Skeleton width="65%" height={18} />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width="100%" height={72} borderRadius="11px" />
          ))}
        </div>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <Skeleton width="55%" height={20} />
          <Skeleton width="80%" height={56} borderRadius="12px" />
          <Skeleton width="75%" height={56} borderRadius="12px" style={{ alignSelf: "flex-end" }} />
          <Skeleton width="100%" height={86} borderRadius="12px" />
        </div>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <Skeleton width="48px" height={48} borderRadius="50%" />
          <Skeleton width="70%" height={16} />
          <Skeleton width="90%" height={13} />
          <Skeleton width="100%" height={95} borderRadius="11px" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))", gap: "12px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "14px" }}>
            <Skeleton width="60%" height={13} style={{ marginBottom: "10px" }} />
            <Skeleton width="45%" height={24} style={{ marginBottom: "8px" }} />
            <Skeleton width="85%" height={11} />
          </div>
        ))}
      </div>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <Skeleton width="210px" height={18} />
        {[1, 2, 3, 4, 5].map((r) => (
          <Skeleton key={r} width="100%" height={44} borderRadius="10px" />
        ))}
      </div>
    </div>
  );
};

