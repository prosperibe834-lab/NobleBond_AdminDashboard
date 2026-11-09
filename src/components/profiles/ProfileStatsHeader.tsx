// NobleBond Admin — Profile Management KPI Header
// 10 Interactive KPI cards with dynamic filtering, zero emojis, light & dark theme tokens

import React from "react";
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Camera,
  ShieldCheck,
  Flag,
  EyeOff,
  FileX,
  Sparkles,
} from "lucide-react";
import type { ProfileStatsKpis } from "../../types/profileManagement.types";

interface ProfileStatsHeaderProps {
  kpis: ProfileStatsKpis;
  activeFilterKey?: string;
  onSelectKpiFilter: (filterKey: string) => void;
}

export const ProfileStatsHeader: React.FC<ProfileStatsHeaderProps> = ({
  kpis,
  activeFilterKey,
  onSelectKpiFilter,
}) => {
  const cards = [
    {
      key: "all",
      label: "Total Profiles",
      value: kpis.totalProfiles,
      subtext: "100% of member registry",
      icon: Users,
      color: "var(--primary)",
      bg: "rgba(139, 29, 65, 0.08)",
    },
    {
      key: "complete",
      label: "Complete Profiles",
      value: kpis.completeProfiles,
      subtext: `${Math.round((kpis.completeProfiles / (kpis.totalProfiles || 1)) * 100)}% completeness >= 90%`,
      icon: CheckCircle2,
      color: "var(--status-success)",
      bg: "var(--status-success-bg)",
    },
    {
      key: "incomplete",
      label: "Incomplete Profiles",
      value: kpis.incompleteProfiles,
      subtext: "Needs prompt or photo depth",
      icon: AlertCircle,
      color: "var(--status-warning)",
      bg: "var(--status-warning-bg)",
    },
    {
      key: "pending_reviews",
      label: "Pending Profile Reviews",
      value: kpis.pendingProfileReviews,
      subtext: "Awaiting moderator sign-off",
      icon: Clock,
      color: "#F59E0B",
      bg: "rgba(245, 158, 11, 0.1)",
    },
    {
      key: "pending_photos",
      label: "Pending Photo Reviews",
      value: kpis.pendingPhotoReviews,
      subtext: "Media queued for visual review",
      icon: Camera,
      color: "#8B5CF6",
      bg: "rgba(139, 92, 246, 0.1)",
    },
    {
      key: "verified",
      label: "Verified Profiles",
      value: kpis.verifiedProfiles,
      subtext: `${Math.round((kpis.verifiedProfiles / (kpis.totalProfiles || 1)) * 100)}% verified with badge`,
      icon: ShieldCheck,
      color: "var(--status-info)",
      bg: "var(--status-info-bg)",
    },
    {
      key: "reported",
      label: "Reported Profiles",
      value: kpis.reportedProfiles,
      subtext: "Flagged by community members",
      icon: Flag,
      color: "var(--status-error)",
      bg: "var(--status-error-bg)",
    },
    {
      key: "hidden",
      label: "Hidden / Restricted",
      value: kpis.hiddenProfiles,
      subtext: "Excluded from public discovery",
      icon: EyeOff,
      color: "#6B7280",
      bg: "rgba(107, 114, 128, 0.1)",
    },
    {
      key: "rejected_content",
      label: "Rejected Content",
      value: kpis.rejectedContent,
      subtext: "Prohibited media & bio items",
      icon: FileX,
      color: "var(--status-error)",
      bg: "var(--status-error-bg)",
    },
    {
      key: "updated_recently",
      label: "Updated Recently",
      value: kpis.profilesUpdatedRecently,
      subtext: "Active in last 48 hours",
      icon: Sparkles,
      color: "var(--status-success)",
      bg: "var(--status-success-bg)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
        gap: "14px",
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilterKey === card.key;
        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelectKpiFilter(card.key)}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: isActive
                ? `2px solid ${card.color}`
                : "1px solid var(--border)",
              borderRadius: "14px",
              textAlign: "left",
              cursor: "pointer",
              transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
              boxShadow: isActive ? "0 4px 14px rgba(0,0,0,0.08)" : "var(--shadow-sm)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
              <span
                style={{
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                }}
              >
                {card.label}
              </span>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "9px",
                  backgroundColor: card.bg,
                  color: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} />
              </div>
            </div>

            <div style={{ marginTop: "10px" }}>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "var(--text-main)",
                  lineHeight: "1.1",
                }}
              >
                {card.value}
              </div>
              <div
                style={{
                  fontSize: "11.5px",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {card.subtext}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
