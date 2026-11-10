import React from "react";
import type { AdminReferralRecord } from "../../types/referralManagement.types";
import { Badge } from "../common/Badge";
import {
  formatDateTime,
  formatReferralPoints,
  getPrimaryReferralStatusMeta,
  getQualificationStatusMeta,
  getRewardStatusMeta,
} from "./referralUiUtils";

interface ReferralMobileCardsProps {
  referrals: AdminReferralRecord[];
  onInspectReferral: (ref: AdminReferralRecord) => void;
}

export const ReferralMobileCards: React.FC<ReferralMobileCardsProps> = ({
  referrals,
  onInspectReferral,
}) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "12px" }}>
      {referrals.map((r) => {
        const stMeta = getPrimaryReferralStatusMeta(r.status);
        const qMeta = getQualificationStatusMeta(r.qualificationStatus);
        const rwMeta = getRewardStatusMeta(r.rewardStatus);

        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onInspectReferral(r)}
            style={{
              textAlign: "left",
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "14px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              transition: "border-color 0.16s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
              <div>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)" }}>{r.id}</span>
                <span style={{ marginLeft: "6px", fontSize: "0.73rem", color: "var(--text-muted)" }}>
                  • {r.referralCode}
                </span>
              </div>
              <Badge variant={stMeta.variant} size="sm">{stMeta.label}</Badge>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img
                src={r.referrer.avatar}
                alt={r.referrer.name}
                style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div style={{ fontSize: "0.79rem", minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{r.referrer.name}</div>
                <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>
                  Invited -&gt; {r.referredUser.name} ({r.referredUser.username})
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              <Badge variant={qMeta.variant} size="sm">{qMeta.label}</Badge>
              <Badge variant={rwMeta.variant} size="sm">{rwMeta.label}</Badge>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "8px",
                borderTop: "1px solid var(--border-light)",
                fontSize: "0.74rem",
              }}
            >
              <span style={{ fontWeight: 800, color: "var(--accent-lavender)" }}>
                +{formatReferralPoints(r.rewardAmount)} (Referrer Only)
              </span>
              <span style={{ color: "var(--text-muted)" }}>{formatDateTime(r.createdAt)}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

