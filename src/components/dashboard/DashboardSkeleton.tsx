import React from "react";
import { Skeleton } from "../common/SkeletonLoader";

export const FullDashboardSkeleton: React.FC = () => {
  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Header Skeleton */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Skeleton width="220px" height="28px" borderRadius="10px" />
            <Skeleton width="110px" height="22px" borderRadius="999px" />
          </div>
          <Skeleton width="340px" height="14px" borderRadius="6px" />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Skeleton width="160px" height="38px" borderRadius="10px" />
          <Skeleton width="100px" height="38px" borderRadius="10px" />
        </div>
      </div>

      {/* 10 KPI Cards Skeleton Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              padding: "18px 20px",
              backgroundColor: "var(--bg-card)",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Skeleton width="120px" height="14px" borderRadius="6px" />
              <Skeleton width="36px" height="36px" borderRadius="10px" />
            </div>
            <Skeleton width="140px" height="26px" borderRadius="8px" />
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "6px" }}>
              <Skeleton width="80px" height="12px" borderRadius="4px" />
              <Skeleton width="30px" height="12px" borderRadius="4px" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            padding: "22px",
            backgroundColor: "var(--bg-card)",
            borderRadius: "18px",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Skeleton width="180px" height="20px" borderRadius="6px" />
            <Skeleton width="120px" height="20px" borderRadius="6px" />
          </div>
          <Skeleton width="100%" height="220px" borderRadius="12px" />
        </div>

        <div
          style={{
            padding: "22px",
            backgroundColor: "var(--bg-card)",
            borderRadius: "18px",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Skeleton width="180px" height="20px" borderRadius="6px" />
          <Skeleton width="100%" height="45px" borderRadius="10px" />
          <Skeleton width="100%" height="45px" borderRadius="10px" />
          <Skeleton width="100%" height="45px" borderRadius="10px" />
        </div>
      </div>
    </div>
  );
};

