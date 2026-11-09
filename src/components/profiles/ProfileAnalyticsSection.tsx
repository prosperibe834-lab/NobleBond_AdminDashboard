// NobleBond Admin — Profile Analytics & Content Intelligence Section
// Visual charts, distributions, and moderation breakdown, zero emojis

import React, { useState } from "react";
import {
  TrendingUp,
  PieChart,
  ShieldCheck,
  Eye,
  Camera,
  Flag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { AdminProfile } from "../../types/profileManagement.types";

interface ProfileAnalyticsSectionProps {
  profiles: AdminProfile[];
  onSelectFilter?: (category: string, value: string) => void;
}

export const ProfileAnalyticsSection: React.FC<ProfileAnalyticsSectionProps> = ({
  profiles,
  onSelectFilter,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // 1. Completion distribution buckets
  const total = profiles.length || 1;
  const b0_25 = profiles.filter((p) => p.completionPercentage <= 25).length;
  const b26_50 = profiles.filter((p) => p.completionPercentage > 25 && p.completionPercentage <= 50).length;
  const b51_75 = profiles.filter((p) => p.completionPercentage > 50 && p.completionPercentage <= 75).length;
  const b76_99 = profiles.filter((p) => p.completionPercentage > 75 && p.completionPercentage < 100).length;
  const b100 = profiles.filter((p) => p.completionPercentage === 100).length;

  // 2. Verification breakdown
  const verifiedCount = profiles.filter((p) => p.verification.overallStatus === "verified").length;
  const partialCount = profiles.filter((p) => p.verification.overallStatus === "partially_verified").length;
  const pendingVerifyCount = profiles.filter((p) => p.verification.overallStatus === "pending").length;
  const rejectedVerifyCount = profiles.filter((p) => p.verification.overallStatus === "rejected").length;
  const unverifiedCount = profiles.filter((p) => p.verification.overallStatus === "unverified").length;

  // 3. Visibility split
  const discoverableCount = profiles.filter((p) => p.visibility === "discoverable").length;
  const pausedCount = profiles.filter((p) => p.visibility === "paused_by_user").length;
  const hiddenCount = profiles.filter((p) => p.visibility === "hidden").length;
  const restrictedCount = profiles.filter((p) => p.visibility === "restricted").length;

  // 4. Media Moderation Split
  let mediaApproved = 0;
  let mediaPending = 0;
  let mediaFlagged = 0;
  let mediaRejected = 0;

  profiles.forEach((p) => {
    p.photos.forEach((ph) => {
      if (ph.reviewStatus === "approved") mediaApproved++;
      else if (ph.reviewStatus === "pending") mediaPending++;
      else if (ph.reviewStatus === "flagged") mediaFlagged++;
      else if (ph.reviewStatus === "rejected") mediaRejected++;
    });
    p.videos.forEach((v) => {
      if (v.reviewStatus === "approved") mediaApproved++;
      else if (v.reviewStatus === "pending") mediaPending++;
      else if (v.reviewStatus === "flagged") mediaFlagged++;
      else if (v.reviewStatus === "rejected") mediaRejected++;
    });
  });
  const totalMedia = mediaApproved + mediaPending + mediaFlagged + mediaRejected || 1;

  // 5. Reports Status
  let reportsNew = 0;
  let reportsInvestigating = 0;
  let reportsResolved = 0;
  let reportsEscalated = 0;

  profiles.forEach((p) => {
    p.reports.forEach((r) => {
      if (r.status === "new") reportsNew++;
      else if (r.status === "investigating") reportsInvestigating++;
      else if (r.status === "resolved") reportsResolved++;
      else if (r.status === "escalated") reportsEscalated++;
    });
  });

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          borderBottom: isExpanded ? "1px solid var(--border)" : "none",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "rgba(139, 29, 65, 0.08)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PieChart size={18} />
          </div>
          <div>
            <div style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--text-main)" }}>
              Profile Intelligence & Content Analytics
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Quality distributions, verification status, media safety, and moderation queues
            </div>
          </div>
        </div>

        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12.5px",
            fontWeight: 600,
          }}
        >
          {isExpanded ? (
            <>
              Hide Analytics <ChevronUp size={16} />
            </>
          ) : (
            <>
              View Analytics <ChevronDown size={16} />
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div
          style={{
            padding: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Card 1: Profile Creation Trend */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-main)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp size={16} color="var(--primary)" />
                <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                  Registration & Profile Trend
                </span>
              </div>
              <span style={{ fontSize: "11px", color: "var(--status-success)", fontWeight: 700 }}>
                +18.4% this month
              </span>
            </div>

            {/* Mini SVG Bar Chart */}
            <div style={{ height: "110px", display: "flex", alignItems: "flex-end", gap: "8px", paddingTop: "10px" }}>
              {[
                { month: "Jun", count: 18, h: "45%" },
                { month: "Jul", count: 24, h: "60%" },
                { month: "Aug", count: 32, h: "80%" },
                { month: "Sep", count: 28, h: "70%" },
                { month: "Oct", count: 36, h: "90%" },
                { month: "Nov", count: 40, h: "100%" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    height: "100%",
                    justifyContent: "flex-end",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "28px",
                      height: item.h,
                      backgroundColor: idx === 5 ? "var(--primary)" : "rgba(139, 29, 65, 0.25)",
                      borderRadius: "6px 6px 2px 2px",
                      transition: "height 0.3s ease",
                    }}
                    title={`${item.month}: ${item.count} profiles registered`}
                  />
                  <span style={{ fontSize: "10.5px", color: "var(--text-muted)", fontWeight: 600 }}>
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", textAlign: "center" }}>
              Consistent organic influx across Lagos, London, New York & Accra.
            </div>
          </div>

          {/* Card 2: Completion Distribution */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-main)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                Profile Completion Breakdown
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Mean: 86.4%
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { label: "100% (Fully Complete)", count: b100, color: "var(--status-success)", bucket: "100" },
                { label: "76 - 99% (High Quality)", count: b76_99, color: "var(--primary)", bucket: "76_99" },
                { label: "51 - 75% (Adequate)", count: b51_75, color: "#F59E0B", bucket: "51_75" },
                { label: "26 - 50% (Basic)", count: b26_50, color: "#EC4899", bucket: "26_50" },
                { label: "0 - 25% (Incomplete)", count: b0_25, color: "var(--status-error)", bucket: "0_25" },
              ].map((row, idx) => {
                const pct = Math.round((row.count / total) * 100);
                return (
                  <div
                    key={idx}
                    style={{ cursor: onSelectFilter ? "pointer" : "default" }}
                    onClick={() => onSelectFilter?.("completionBucket", row.bucket)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", marginBottom: "3px" }}>
                      <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{row.label}</span>
                      <span style={{ fontWeight: 700, color: "var(--text-main)" }}>
                        {row.count} ({pct}%)
                      </span>
                    </div>
                    <div style={{ height: "6px", width: "100%", backgroundColor: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          backgroundColor: row.color,
                          borderRadius: "3px",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Verification Breakdown */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-main)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldCheck size={16} color="var(--status-info)" />
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                Verification Safeguards
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
              {[
                { label: "Fully Verified (Biometric + ID)", count: verifiedCount, color: "var(--status-success)", key: "verified" },
                { label: "Partially Verified (Phone / Email)", count: partialCount, color: "var(--status-info)", key: "partially_verified" },
                { label: "Pending Document Review", count: pendingVerifyCount, color: "#F59E0B", key: "pending" },
                { label: "Rejected / Tampered Submissions", count: rejectedVerifyCount, color: "var(--status-error)", key: "rejected" },
                { label: "Unverified Members", count: unverifiedCount, color: "var(--text-muted)", key: "unverified" },
              ].map((row, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 8px",
                    borderRadius: "8px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    cursor: onSelectFilter ? "pointer" : "default",
                  }}
                  onClick={() => onSelectFilter?.("verificationStatus", row.key)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: row.color }} />
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>
                      {row.label}
                    </span>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-main)" }}>
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Visibility Split */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-main)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Eye size={16} color="var(--primary)" />
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                Profile Visibility Split
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--status-success)" }}>Discoverable</div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-secondary)" }}>Active in recommendation feed</div>
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--status-success)" }}>
                  {discoverableCount}
                </div>
              </div>

              <div
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(59, 130, 246, 0.08)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--status-info)" }}>Paused by User</div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-secondary)" }}>Voluntary snooze (good standing)</div>
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--status-info)" }}>
                  {pausedCount}
                </div>
              </div>

              <div
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--status-error)" }}>Restricted & Hidden</div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-secondary)" }}>Policy enforcement actions</div>
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--status-error)" }}>
                  {restrictedCount + hiddenCount}
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Media Moderation Status */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-main)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Camera size={16} color="#8B5CF6" />
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                Media Moderation Pipeline
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div style={{ padding: "10px", borderRadius: "8px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Approved Media</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--status-success)", marginTop: "2px" }}>
                  {mediaApproved}
                </div>
                <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                  {Math.round((mediaApproved / totalMedia) * 100)}% of total
                </div>
              </div>

              <div style={{ padding: "10px", borderRadius: "8px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Pending Review</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#F59E0B", marginTop: "2px" }}>
                  {mediaPending}
                </div>
                <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>In queue now</div>
              </div>

              <div style={{ padding: "10px", borderRadius: "8px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Flagged by AI</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#EC4899", marginTop: "2px" }}>
                  {mediaFlagged}
                </div>
                <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Needs decision</div>
              </div>

              <div style={{ padding: "10px", borderRadius: "8px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Rejected Media</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--status-error)", marginTop: "2px" }}>
                  {mediaRejected}
                </div>
                <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Policy violations</div>
              </div>
            </div>
          </div>

          {/* Card 6: Reported Profiles Status */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-main)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Flag size={16} color="var(--status-error)" />
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                Community Safety Reports
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: "6px", backgroundColor: "var(--bg-card)" }}>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>New Incoming</span>
                <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--status-error)" }}>{reportsNew}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: "6px", backgroundColor: "var(--bg-card)" }}>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Under Investigation</span>
                <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#F59E0B" }}>{reportsInvestigating}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: "6px", backgroundColor: "var(--bg-card)" }}>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Escalated to Legal</span>
                <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--primary)" }}>{reportsEscalated}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: "6px", backgroundColor: "var(--bg-card)" }}>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Resolved & Closed</span>
                <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--status-success)" }}>{reportsResolved}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
