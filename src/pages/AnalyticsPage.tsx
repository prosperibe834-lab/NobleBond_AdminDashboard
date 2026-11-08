import React from "react";
import { Calendar } from "lucide-react";
import { Badge } from "../components/common/Badge";

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>
            Platform Analytics & Growth Intelligence
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
            High-level metrics on retention cohorts, daily active users (DAU), revenue mix, and live engagement.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Badge variant="primary">
            <Calendar size={12} /> Last 30 Days
          </Badge>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div style={{ padding: "18px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 700 }}>DAU / MAU RATIO</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-main)", marginTop: "4px" }}>48.6%</div>
          <div style={{ fontSize: "12px", color: "var(--status-success)", marginTop: "4px" }}>Top decile engagement</div>
        </div>
        <div style={{ padding: "18px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 700 }}>AVERAGE SESSION DURATION</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--primary)", marginTop: "4px" }}>24m 18s</div>
          <div style={{ fontSize: "12px", color: "var(--status-success)", marginTop: "4px" }}>+4.8m since Live launch</div>
        </div>
        <div style={{ padding: "18px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 700 }}>MONTHLY GROSS REVENUE</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--accent-champagne)", marginTop: "4px" }}>$384,950</div>
          <div style={{ fontSize: "12px", color: "var(--status-success)", marginTop: "4px" }}>81% Subscriptions / 19% Coins</div>
        </div>
        <div style={{ padding: "18px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 700 }}>D30 USER RETENTION</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--accent-lavender)", marginTop: "4px" }}>62.4%</div>
          <div style={{ fontSize: "12px", color: "var(--status-success)", marginTop: "4px" }}>Above target threshold</div>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "20px" }}>
        {/* Revenue Breakdown */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
            Revenue Diversification Split
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                <span>👑 NobleBond Premium Memberships</span>
                <span style={{ color: "var(--primary)" }}>$312,450 (81.2%)</span>
              </div>
              <div style={{ width: "100%", height: "10px", backgroundColor: "var(--bg-surface-elevated)", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ width: "81.2%", height: "100%", backgroundColor: "var(--primary)", borderRadius: "999px" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                <span>🪙 Live Stream Gift Coin Store</span>
                <span style={{ color: "var(--accent-champagne)" }}>$72,500 (18.8%)</span>
              </div>
              <div style={{ width: "100%", height: "10px", backgroundColor: "var(--bg-surface-elevated)", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ width: "18.8%", height: "100%", backgroundColor: "var(--accent-champagne)", borderRadius: "999px" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Global Regional Distribution */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
            Active Registrations by Region
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { region: "North America (US & Canada)", pct: "42%", users: "539,500 users", color: "var(--primary)" },
              { region: "Sub-Saharan Africa (Nigeria, Ghana, Kenya)", pct: "34%", users: "436,700 users", color: "var(--accent-lavender)" },
              { region: "Europe (UK, France, Germany)", pct: "18%", users: "231,200 users", color: "var(--accent-champagne)" },
              { region: "Other Territories", pct: "6%", users: "77,120 users", color: "var(--text-muted)" },
            ].map((reg, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: reg.color }} />
                  <span style={{ color: "var(--text-main)", fontWeight: 500 }}>{reg.region}</span>
                </div>
                <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                  {reg.pct} <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>({reg.users})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
