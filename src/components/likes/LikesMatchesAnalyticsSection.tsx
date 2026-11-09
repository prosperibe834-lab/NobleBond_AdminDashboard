// NobleBond Admin — Likes & Matches Analytics & Relationship Charts
// SVG-based trends, conversion rate, interaction distribution, zero emojis

import React, { useState } from "react";
import {
  TrendingUp,
  HeartHandshake,
  PieChart,
  UserX,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import type { LikeRecord, MatchRecord } from "../../types/likesMatches.types";

interface LikesMatchesAnalyticsSectionProps {
  likes: LikeRecord[];
  matches: MatchRecord[];
}

export const LikesMatchesAnalyticsSection: React.FC<LikesMatchesAnalyticsSectionProps> = ({
  likes,
  matches,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const totalLikes = likes.length || 1;
  const regularLikesCount = likes.filter((l) => l.type === "regular").length;
  const superLikesCount = likes.filter((l) => l.type === "super_like").length;

  const totalMatches = matches.length;
  const activeMatchesCount = matches.filter((m) => m.status === "active").length;
  const unmatchedCount = matches.filter((m) => m.status === "unmatched").length;

  // Conversion rate: Total matches formed divided by total pairs of likes (totalLikes / 2)
  const conversionRate = Math.round((totalMatches / (totalLikes / 2 || 1)) * 100);

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
            <TrendingUp size={18} />
          </div>
          <div>
            <div style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--text-main)" }}>
              Likes & Match Conversion Analytics
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Interaction velocity, mutual match conversion rate, Super Like efficacy, and retention
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
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "18px",
          }}
        >
          {/* Chart 1: Likes & Matches Creation Trend */}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                Weekly Interaction & Match Volume
              </span>
              <span style={{ fontSize: "11px", color: "var(--status-success)", fontWeight: 700 }}>
                +16.8% MoM
              </span>
            </div>

            {/* SVG Bars */}
            <div style={{ height: "110px", display: "flex", alignItems: "flex-end", gap: "10px", paddingTop: "10px" }}>
              {[
                { week: "W1 Oct", likes: 38, matches: 8, h1: "40%", h2: "20%" },
                { week: "W2 Oct", likes: 52, matches: 12, h1: "55%", h2: "30%" },
                { week: "W3 Oct", likes: 64, matches: 18, h1: "70%", h2: "45%" },
                { week: "W4 Oct", likes: 78, matches: 22, h1: "85%", h2: "55%" },
                { week: "W1 Nov", likes: 95, matches: 28, h1: "100%", h2: "70%" },
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
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", width: "100%", justifyContent: "center" }}>
                    <div
                      style={{
                        width: "12px",
                        height: item.h1,
                        backgroundColor: "var(--primary)",
                        borderRadius: "3px 3px 0 0",
                      }}
                      title={`${item.week}: ${item.likes} Likes`}
                    />
                    <div
                      style={{
                        width: "12px",
                        height: item.h2,
                        backgroundColor: "var(--status-success)",
                        borderRadius: "3px 3px 0 0",
                      }}
                      title={`${item.week}: ${item.matches} Confirmed Matches`}
                    />
                  </div>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 600 }}>
                    {item.week}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "16px", fontSize: "11px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "2px", backgroundColor: "var(--primary)" }} />
                <span style={{ color: "var(--text-secondary)" }}>Likes Sent</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "2px", backgroundColor: "var(--status-success)" }} />
                <span style={{ color: "var(--text-secondary)" }}>Confirmed Matches</span>
              </div>
            </div>
          </div>

          {/* Chart 2: Match Conversion Funnel */}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <HeartHandshake size={16} color="var(--status-success)" />
                <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                  Reciprocal Conversion Rate
                </span>
              </div>
              <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--status-success)" }}>
                {conversionRate}%
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", marginBottom: "4px" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Total Outgoing & Incoming Likes</span>
                  <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{likes.length} records</span>
                </div>
                <div style={{ height: "6px", width: "100%", backgroundColor: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "100%", backgroundColor: "var(--primary)", borderRadius: "3px" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", marginBottom: "4px" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Confirmed Mutual Matches</span>
                  <span style={{ fontWeight: 700, color: "var(--status-success)" }}>
                    {totalMatches} matches ({conversionRate}%)
                  </span>
                </div>
                <div style={{ height: "6px", width: "100%", backgroundColor: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${conversionRate}%`, backgroundColor: "var(--status-success)", borderRadius: "3px" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", marginBottom: "4px" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Conversations Started</span>
                  <span style={{ fontWeight: 700, color: "var(--status-info)" }}>
                    {matches.filter((m) => m.conversation.exists).length} conversations (100%)
                  </span>
                </div>
                <div style={{ height: "6px", width: "100%", backgroundColor: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "100%", backgroundColor: "var(--status-info)", borderRadius: "3px" }} />
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "4px",
              }}
            >
              <Info size={13} color="var(--text-muted)" />
              <span>Conversion measures mutually confirmed likes against valid candidate interactions.</span>
            </div>
          </div>

          {/* Chart 3: Interaction Distribution & Unmatches */}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <PieChart size={16} color="var(--primary)" />
                <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                  Interaction Type & Lifecycle
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div style={{ padding: "10px", borderRadius: "8px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Regular Likes</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                  {regularLikesCount}
                </div>
                <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                  {Math.round((regularLikesCount / totalLikes) * 100)}% of interactions
                </div>
              </div>

              <div style={{ padding: "10px", borderRadius: "8px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Super Likes</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--accent-lavender)", marginTop: "2px" }}>
                  {superLikesCount}
                </div>
                <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                  {Math.round((superLikesCount / totalLikes) * 100)}% boosted
                </div>
              </div>

              <div style={{ padding: "10px", borderRadius: "8px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Active Matches</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--status-success)", marginTop: "2px" }}>
                  {activeMatchesCount}
                </div>
                <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Retained</div>
              </div>

              <div style={{ padding: "10px", borderRadius: "8px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Unmatched</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#6B7280", marginTop: "2px" }}>
                  {unmatchedCount}
                </div>
                <div style={{ fontSize: "10.5px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "2px" }}>
                  <UserX size={10} /> Disconnected
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

