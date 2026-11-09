import React, { useState } from "react";
import {
  Calendar,
  RotateCw,
  ChevronDown,
  Info,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import type { DateRangePeriod } from "../../types/dashboard.types";
import { CustomDateRangeModal } from "./CustomDateRangeModal";
import { Badge } from "../common/Badge";

interface DashboardHeaderProps {
  currentPeriod: DateRangePeriod;
  periodLabel: string;
  isRefreshing: boolean;
  onSelectPeriod: (period: DateRangePeriod, customStart?: string, customEnd?: string) => void;
  onRefresh: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentPeriod,
  periodLabel,
  isRefreshing,
  onSelectPeriod,
  onRefresh,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [refreshToast, setRefreshToast] = useState(false);

  const options: { id: DateRangePeriod; label: string }[] = [
    { id: "today", label: "Today (Realtime)" },
    { id: "7d", label: "Last 7 Days" },
    { id: "30d", label: "Last 30 Days" },
    { id: "90d", label: "Last 90 Days" },
    { id: "this_month", label: "This Month (Nov 2026)" },
    { id: "last_month", label: "Last Month (Oct 2026)" },
    { id: "custom", label: "Custom Date Range..." },
  ];

  const handleSelectOption = (optId: DateRangePeriod) => {
    setIsDropdownOpen(false);
    if (optId === "custom") {
      setIsCustomModalOpen(true);
    } else {
      onSelectPeriod(optId);
    }
  };

  const handleRefreshClick = () => {
    if (isRefreshing) return;
    onRefresh();
    setRefreshToast(true);
    setTimeout(() => setRefreshToast(false), 2200);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {/* Welcome Text + Period Status */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "var(--text-main)",
                letterSpacing: "-0.4px",
              }}
            >
              Welcome back, Sarah
            </h2>

            <Badge variant="neutral">
              <Calendar size={12} />
              <span>{periodLabel}</span>
            </Badge>

            <Badge variant="champagne">
              <Info size={12} />
              <span>Development Demo Mode</span>
            </Badge>
          </div>

          <p
            style={{
              fontSize: "13.5px",
              color: "var(--text-secondary)",
              marginTop: "4px",
            }}
          >
            Here is what is happening across the NobleBond ecosystem today.
          </p>
        </div>

        {/* Controls: Date Range Selector + Refresh Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Refresh Toast Notice */}
          {refreshToast && (
            <div
              className="animate-scale-up"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                borderRadius: "10px",
                backgroundColor: "var(--status-success-bg)",
                border: "1px solid var(--status-success)",
                color: "var(--status-success)",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={14} />
              <span>Metrics refreshed</span>
            </div>
          )}

          {/* Date Range Selector Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
                transition: "border-color 0.15s ease",
              }}
            >
              <Calendar size={15} color="var(--primary)" />
              <span>{periodLabel}</span>
              <ChevronDown size={14} color="var(--text-secondary)" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  onClick={() => setIsDropdownOpen(false)}
                  style={{ position: "fixed", inset: 0, zIndex: 998 }}
                />
                <div
                  className="animate-scale-up"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    right: 0,
                    width: "220px",
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    boxShadow: "var(--shadow-md)",
                    zIndex: 999,
                    padding: "6px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  {options.map((opt) => {
                    const isSelected = currentPeriod === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(opt.id)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "none",
                          backgroundColor: isSelected ? "var(--bg-active)" : "transparent",
                          color: isSelected ? "var(--primary)" : "var(--text-main)",
                          fontSize: "12.5px",
                          fontWeight: isSelected ? 700 : 500,
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <span>{opt.label}</span>
                        {opt.id === "custom" && <SlidersHorizontal size={12} color="var(--text-secondary)" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            aria-label="Refresh dashboard data"
            title="Refresh dashboard metrics"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: isRefreshing ? "var(--text-muted)" : "var(--text-main)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: isRefreshing ? "not-allowed" : "pointer",
              boxShadow: "var(--shadow-sm)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isRefreshing) {
                e.currentTarget.style.borderColor = "var(--border-focus)";
                e.currentTarget.style.backgroundColor = "var(--bg-hover)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isRefreshing) {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.backgroundColor = "var(--bg-surface)";
              }
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: isRefreshing ? "rotate(360deg)" : "rotate(0deg)",
                transition: isRefreshing ? "transform 0.6s linear infinite" : "none",
              }}
            >
              <RotateCw size={15} color={isRefreshing ? "var(--primary)" : "currentColor"} />
            </div>
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Custom Date Range Modal */}
      <CustomDateRangeModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onApply={(start, end) => onSelectPeriod("custom", start, end)}
      />
    </div>
  );
};

