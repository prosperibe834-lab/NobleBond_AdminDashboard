import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "../components/common/Badge";

export const ReferralManagementPage: React.FC = () => {
  const [rewardAmount, setRewardAmount] = useState(50);
  const [isSaved, setIsSaved] = useState(false);

  const topReferrers = [
    { name: "Emily Carter", code: "EMILY88", referralsCount: 142, pointsEarned: 7100, conversionRate: "68%" },
    { name: "David King", code: "DK99", referralsCount: 98, pointsEarned: 4900, conversionRate: "62%" },
    { name: "Zara Love", code: "ZARA_NYC", referralsCount: 76, pointsEarned: 3800, conversionRate: "71%" },
    { name: "Amara Bliss", code: "AMARA_B", referralsCount: 54, pointsEarned: 2700, conversionRate: "59%" },
  ];

  const handleSaveReward = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>
          Referral Management (NobleBond Invite & Earn)
        </h2>
        <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
          Track viral user referrals, configure the Connection Points incentive, and review qualified registrations.
        </p>
      </div>

      {/* Program Business Rules & Configuration Box */}
      <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
              Referral Program Parameters
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
              Rules: Referrer qualifies for reward upon new user phone/email verification. (New user receives 0 bonus points).
            </p>
          </div>

          {isSaved && (
            <Badge variant="success">
              <CheckCircle2 size={13} /> Saved & Synchronized
            </Badge>
          )}
        </div>

        <form onSubmit={handleSaveReward} style={{ display: "flex", gap: "16px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ width: "240px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
              REWARD PER QUALIFIED INVITE (PTS)
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="number"
                min={10}
                max={500}
                value={rewardAmount}
                onChange={(e) => setRewardAmount(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "15px",
                  fontWeight: 700,
                }}
              />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--primary)" }}>Pts</span>
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              fontSize: "13.5px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 14px var(--primary-glow)",
            }}
          >
            Update Global Incentive
          </button>
        </form>
      </div>

      {/* Referral KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div style={{ padding: "18px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontWeight: 600 }}>Total Qualified Referrals</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-main)", marginTop: "4px" }}>14,820</div>
          <div style={{ fontSize: "12px", color: "var(--status-success)", marginTop: "4px" }}>Verified via SMS / Email</div>
        </div>
        <div style={{ padding: "18px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontWeight: 600 }}>Total Points Credited</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--status-success)", marginTop: "4px" }}>✨ 741,000 Pts</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>50 Pts per referral</div>
        </div>
        <div style={{ padding: "18px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontWeight: 600 }}>Invite Conversion Rate</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--primary)", marginTop: "4px" }}>64.2%</div>
          <div style={{ fontSize: "12px", color: "var(--status-success)", marginTop: "4px" }}>Top viral channel</div>
        </div>
      </div>

      {/* Top Referrers Table */}
      <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", marginBottom: "14px" }}>
          Top NobleBond Community Ambassadors
        </h3>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "12px" }}>
                <th style={{ padding: "10px 12px" }}>AMBASSADOR</th>
                <th style={{ padding: "10px 12px" }}>REFERRAL CODE</th>
                <th style={{ padding: "10px 12px" }}>SUCCESSFUL INVITES</th>
                <th style={{ padding: "10px 12px" }}>POINTS EARNED</th>
                <th style={{ padding: "10px 12px" }}>CONVERSION</th>
              </tr>
            </thead>
            <tbody>
              {topReferrers.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border-light)", fontSize: "13px" }}>
                  <td style={{ padding: "12px", fontWeight: 700, color: "var(--text-main)" }}>{r.name}</td>
                  <td style={{ padding: "12px" }}>
                    <code style={{ padding: "2px 6px", borderRadius: "4px", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border)", color: "var(--primary)", fontSize: "12px" }}>
                      {r.code}
                    </code>
                  </td>
                  <td style={{ padding: "12px", fontWeight: 600, color: "var(--text-main)" }}>{r.referralsCount} users</td>
                  <td style={{ padding: "12px", fontWeight: 700, color: "var(--status-success)" }}>✨ {r.pointsEarned.toLocaleString()} Pts</td>
                  <td style={{ padding: "12px", fontWeight: 600, color: "var(--primary)" }}>{r.conversionRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
