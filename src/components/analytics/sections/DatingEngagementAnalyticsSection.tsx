import React from "react";
import { UserCheck, Heart, MessageCircle, ShieldCheck, AlertTriangle, PhoneCall } from "lucide-react";
import type { PlatformAnalyticsSnapshot } from "../../../data/platformAnalyticsDataService";
import type { DrilldownPayload } from "../../../types/analyticsManagement.types";
import { formatPercent } from "../analyticsUiUtils";
import { AnalyticsMetricTooltip } from "../AnalyticsMetricTooltip";

interface DatingEngagementAnalyticsSectionProps {
  snapshot: PlatformAnalyticsSnapshot;
  mode: "profile_analytics" | "likes_matches_analytics" | "chat_engagement_analytics";
  onDrilldown: (payload: DrilldownPayload) => void;
}

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "var(--shadow-sm)",
};

export const DatingEngagementAnalyticsSection: React.FC<
  DatingEngagementAnalyticsSectionProps
> = ({ snapshot, mode, onDrilldown }) => {
  if (mode === "profile_analytics") {
    const profCount = snapshot.profiles.length;
    const verifiedProfiles = snapshot.profiles.filter(
      (p) => p.verification.overallStatus === "verified"
    ).length;
    const pendingProfiles = snapshot.profiles.filter(
      (p) => p.verification.overallStatus === "pending"
    ).length;
    const visibleProfiles = snapshot.profiles.filter((p) => p.visibility === "discoverable").length;
    const hiddenProfiles = snapshot.profiles.filter((p) => p.visibility !== "discoverable").length;
    const reportedProfiles = snapshot.profiles.filter((p) => p.reportsCount > 0).length;

    const avgField = (
      key: keyof (typeof snapshot.profiles)[number]["qualityBreakdown"]["sectionScores"]
    ) => {
      if (profCount === 0) return 0;
      return Math.round(
        snapshot.profiles.reduce((s, p) => s + p.qualityBreakdown.sectionScores[key], 0) / profCount
      );
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <UserCheck size={18} style={{ color: "var(--primary)" }} />
                <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
                  Section 4: Profile Analytics & Verification Health
                </h2>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
                Measured solely from collected profile fields (Photos, Bio, Personal Info,
                Interests, Lifestyle, Prompts). No artificial compatibility scores.
              </p>
            </div>
            <AnalyticsMetricTooltip metricId="profile_completion_rate" />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
              gap: 12,
              marginBottom: 18,
            }}
          >
            {[
              { label: "Total Member Profiles", val: profCount, sub: `${snapshot.completeProfiles.length} >=80% complete` },
              { label: "Average Completion", val: `${snapshot.avgProfileCompletion}%`, sub: "Across all profile pillars" },
              { label: "Verified Profiles", val: verifiedProfiles, sub: `${pendingProfiles} awaiting review` },
              { label: "Discovery Visible", val: visibleProfiles, sub: `${hiddenProfiles} hidden/restricted` },
              { label: "Flagged Profiles", val: reportedProfiles, sub: "Profiles with >=1 moderation report" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 12,
                  padding: 13,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 23, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                  {item.val}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.sub}</div>
              </div>
            ))}
          </div>

          {/* Real Profile Section Breakdown Bars */}
          <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
            Average Completion Across Actual Collected NobleBond Fields
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            {[
              { label: "Photos & Media", score: avgField("photos"), color: "var(--primary)" },
              { label: "Written Bio", score: avgField("bio"), color: "var(--accent-lavender)" },
              { label: "Personal Information", score: avgField("personalInfo"), color: "var(--status-info)" },
              { label: "Interests & Hobbies", score: avgField("interests"), color: "var(--status-success)" },
              { label: "Lifestyle Attributes", score: avgField("lifestyle"), color: "var(--accent-champagne)" },
              { label: "Profile Prompts", score: avgField("prompts"), color: "var(--status-warning)" },
            ].map((field) => (
              <div
                key={field.label}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
                  <strong style={{ color: "var(--text-main)" }}>{field.label}</strong>
                  <span style={{ fontWeight: 700, color: field.color }}>{field.score}%</span>
                </div>
                <div style={{ height: 7, borderRadius: 999, background: "var(--bg-card)" }}>
                  <div
                    style={{
                      width: `${Math.min(100, field.score)}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: field.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "likes_matches_analytics") {
    const likes = snapshot.likesCurrent;
    const superLikesCount = likes.filter((l) => l.type === "super_like").length;
    const regularLikesCount = likes.length - superLikesCount;
    const matches = snapshot.matchesCurrent;
    const unmatchedCount = matches.filter((m) => m.status === "unmatched").length;
    const chatConvertedMatches = matches.filter((m) => m.conversation.exists).length;
    const matchConversion =
      likes.length > 0 ? (matches.length / likes.length) * 100 : 0;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Heart size={18} style={{ color: "var(--status-error)" }} />
                <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
                  Section 5: Likes & Mutual Matches Analytics
                </h2>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
                Strictly distinguishes one-way directional likes from confirmed two-way mutual
                matches.
              </p>
            </div>
            <AnalyticsMetricTooltip metricId="match_creation_rate" />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
              gap: 12,
              marginBottom: 18,
            }}
          >
            {[
              { label: "Total 1-Way Likes", val: likes.length, sub: `${regularLikesCount} regular • ${superLikesCount} super` },
              { label: "Confirmed Mutual Matches", val: matches.length, sub: "Both users reciprocated" },
              { label: "Like -> Match Conversion", val: formatPercent(matchConversion), sub: "Mutual matches / total likes" },
              { label: "Matches Leading to Chat", val: chatConvertedMatches, sub: `${matches.length > 0 ? formatPercent((chatConvertedMatches / matches.length) * 100) : "0%"} engaged` },
              { label: "Unmatched Relationships", val: unmatchedCount, sub: "Closed post-match" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 12,
                  padding: 13,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 23, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                  {item.val}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.sub}</div>
              </div>
            ))}
          </div>

          {/* 6-Stage Discovery-to-Conversation Funnel */}
          <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
            6-Stage Discovery to Conversation Conversion Funnel
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { step: "1. Eligible Active Discovery Audience", val: snapshot.activeUsersWindow.length },
              { step: "2. Profiles >=80% Discovery Ready", val: snapshot.completeProfiles.length },
              { step: "3. Outgoing Likes Initiated", val: likes.length },
              { step: "4. Priority Super Likes Dispatched", val: superLikesCount },
              { step: "5. Confirmed Mutual Matches Created", val: matches.length },
              { step: "6. Mutual Matches Opening Chat", val: chatConvertedMatches },
            ].map((stage, idx) => (
              <button
                key={stage.step}
                type="button"
                onClick={() =>
                  onDrilldown({
                    title: stage.step,
                    subtitle: "Dating funnel progression",
                    sourceModuleLabel: "Likes & Matches",
                    targetRoute: "/matches",
                    rows: [
                      { label: "Measured Stage Volume", value: `${stage.val}` },
                      { label: "Unmatched After Match", value: `${unmatchedCount}` },
                    ],
                    methodologyNote:
                      "One-way likes are counted only at steps 3-4; step 5 requires mutual acceptance.",
                  })
                }
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)" }}>
                  {stage.step}
                </span>
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 800,
                    color: idx >= 4 ? "var(--status-success)" : "var(--primary)",
                  }}
                >
                  {stage.val.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // mode === "chat_engagement_analytics"
  const convos = snapshot.convosCurrent;
  const optimalDelivery = convos.filter((c) => c.deliveryHealth === "optimal").length;
  const deliveryRate = convos.length > 0 ? (optimalDelivery / convos.length) * 100 : 100;
  const reportedConvos = convos.filter((c) => c.hasActiveReports).length;
  const calls = snapshot.callsCurrent;
  const connectedCalls = calls.filter((c) => c.status === "completed").length;
  const avgCallDuration =
    calls.length > 0
      ? Math.round(calls.reduce((s, c) => s + c.durationSeconds, 0) / calls.length)
      : 0;
  const avgLatency =
    calls.length > 0
      ? Math.round(calls.reduce((s, c) => s + c.avgLatencyMs, 0) / calls.length)
      : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MessageCircle size={18} style={{ color: "var(--status-info)" }} />
              <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
                Section 6: Chat, Messaging & Call Engagement Analytics
              </h2>
            </div>
            <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
              Privacy-preserving communication telemetry: message volume, delivery health, and
              audio/video call reliability without exposing private conversation content.
            </p>
          </div>
          <AnalyticsMetricTooltip metricId="message_delivery_rate" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
            gap: 12,
            marginBottom: 16,
          }}
        >
          {[
            { label: "Active Conversations", val: convos.length, sub: "In active window" },
            { label: "Messages Recorded", val: snapshot.messagesSentCurrent.toLocaleString(), sub: "Aggregated volume" },
            { label: "Optimal Delivery Rate", val: formatPercent(deliveryRate), sub: `${optimalDelivery} healthy channels` },
            { label: "Audio / Video Calls", val: calls.length, sub: `${connectedCalls} completed/active` },
            { label: "Mean Call Duration", val: `${avgCallDuration}s`, sub: `Avg latency: ${avgLatency} ms` },
            { label: "Flagged Threads", val: reportedConvos, sub: "Reported conversations only" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 12,
                padding: 13,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                {item.label}
              </div>
              <div style={{ fontSize: 23, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                {item.val}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          <div
            style={{
              padding: 14,
              borderRadius: 12,
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-light)",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <ShieldCheck size={17} style={{ color: "var(--status-success)", flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              <strong>Privacy Redaction Enforced:</strong> NobleBond Analytics aggregates message
              throughput, unread backlog, and call connection QoS exclusively. Full message texts
              and attachments remain restricted to reported Chat Investigation workflows.
            </div>
          </div>

          <div
            style={{
              padding: 14,
              borderRadius: 12,
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-light)",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            {avgLatency > 160 ? (
              <AlertTriangle size={17} style={{ color: "var(--status-warning)", flexShrink: 0, marginTop: 2 }} />
            ) : (
              <PhoneCall size={17} style={{ color: "var(--status-info)", flexShrink: 0, marginTop: 2 }} />
            )}
            <div style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              <strong>Voice & Video Call Transport Health:</strong> Average call round-trip latency
              measured across logged sessions is <strong>{avgLatency} ms</strong>. Sessions with
              degraded bitrate or missed signals trigger automated moderation & QA alerts in Chat
              Management.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

