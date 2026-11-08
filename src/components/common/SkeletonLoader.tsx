import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "20px",
  borderRadius = "8px",
  style,
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: `linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-highlight) 50%, var(--skeleton-base) 75%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s infinite",
        ...style,
      }}
    />
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Stats 4-grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              padding: "20px",
              backgroundColor: "var(--bg-card)",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Skeleton width="100px" height="14px" />
              <Skeleton width="32px" height="32px" borderRadius="8px" />
            </div>
            <Skeleton width="140px" height="28px" />
            <Skeleton width="80px" height="12px" />
          </div>
        ))}
      </div>

      {/* Main Chart + Feed */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            padding: "24px",
            backgroundColor: "var(--bg-card)",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Skeleton width="160px" height="20px" />
            <Skeleton width="90px" height="28px" borderRadius="6px" />
          </div>
          <Skeleton width="100%" height="220px" borderRadius="10px" />
        </div>

        <div
          style={{
            padding: "24px",
            backgroundColor: "var(--bg-card)",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <Skeleton width="140px" height="20px" />
          {[1, 2, 3, 4].map((j) => (
            <div key={j} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Skeleton width="38px" height="38px" borderRadius="50%" />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <Skeleton width="70%" height="14px" />
                <Skeleton width="40%" height="11px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "var(--bg-card)",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton width="180px" height="22px" />
        <Skeleton width="220px" height="36px" borderRadius="8px" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Skeleton width="100%" height="40px" borderRadius="6px" />
        {Array.from({ length: rows }).map((_, idx) => (
          <Skeleton key={idx} width="100%" height="52px" borderRadius="8px" />
        ))}
      </div>
    </div>
  );
};

