import React from "react";
import { Heart, Sparkles } from "lucide-react";
import { Badge } from "../components/common/Badge";

export const LikesMatchesPage: React.FC = () => {
  const matches = [
    {
      id: "m_1",
      user1: { name: "Sarah James", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120" },
      user2: { name: "David King", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120" },
      matchedAt: "12m ago",
      compatibility: "96%",
      interactionType: "Mutual Super Like",
    },
    {
      id: "m_2",
      user1: { name: "Emily Carter", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120" },
      user2: { name: "Jayden Taylor", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120" },
      matchedAt: "45m ago",
      compatibility: "91%",
      interactionType: "Mutual Swipe",
    },
    {
      id: "m_3",
      user1: { name: "Amara Bliss", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120" },
      user2: { name: "Zara Love", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120" },
      matchedAt: "2h ago",
      compatibility: "94%",
      interactionType: "Mutual Swipe",
    },
  ];

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>
          Likes & Matches
        </h2>
        <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
          Monitor match statistics, swiping algorithms, mutual connections, and abnormal velocity spikes.
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div style={{ padding: "18px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontWeight: 600 }}>Total Swipes Today</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-main)", marginTop: "4px" }}>1,482,900</div>
          <div style={{ fontSize: "12px", color: "var(--status-success)", marginTop: "4px" }}>+14.2% vs yesterday</div>
        </div>
        <div style={{ padding: "18px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontWeight: 600 }}>Mutual Matches Made</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--primary)", marginTop: "4px" }}>48,250</div>
          <div style={{ fontSize: "12px", color: "var(--status-success)", marginTop: "4px" }}>3.25% swipe-to-match rate</div>
        </div>
        <div style={{ padding: "18px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontWeight: 600 }}>Super Likes Used</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--accent-lavender)", marginTop: "4px" }}>8,920</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Point and Pro tier boosts</div>
        </div>
      </div>

      {/* Real-time Match Feed */}
      <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", marginBottom: "16px" }}>
          Recent Successful Mutual Matches
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {matches.map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={m.user1.avatar}
                    alt={m.user1.name}
                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }}
                  />
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 -8px",
                      zIndex: 2,
                    }}
                  >
                    <Heart size={12} color="#FFFFFF" fill="#FFFFFF" />
                  </div>
                  <img
                    src={m.user2.avatar}
                    alt={m.user2.name}
                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }}
                  />
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-main)" }}>
                    {m.user1.name} & {m.user2.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Matched {m.matchedAt} • {m.interactionType}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Badge variant="primary">
                  <Sparkles size={12} /> {m.compatibility} Match
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
