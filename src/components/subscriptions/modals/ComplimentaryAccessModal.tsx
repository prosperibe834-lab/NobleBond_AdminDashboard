// NobleBond Admin — Grant / Extend Complimentary VIP Access Modal
// Explicitly separates non-monetary VIP grants ($0.00 revenue) from paid subscriptions and store-managed agreements. Zero emojis.

import React, { useState } from "react";
import { X, Gift, ShieldAlert } from "lucide-react";
import type {
  SubscriptionPlanConfig,
  SubscriberSummaryRecord,
} from "../../../types/subscriptionManagement.types";
import { loadUsersFromStorage } from "../../../data/userManagementDataService";

interface ComplimentaryAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: SubscriptionPlanConfig[];
  preselectedSubscriber?: SubscriberSummaryRecord | null;
  onConfirmGrant: (params: {
    userId: string;
    userName: string;
    username: string;
    email: string;
    avatar: string;
    country: string;
    countryCode: string;
    city: string;
    planId: string;
    planName: string;
    startDate: string;
    expiryDate: string;
    reason: string;
  }) => void;
}

export const ComplimentaryAccessModal: React.FC<ComplimentaryAccessModalProps> = ({
  isOpen,
  onClose,
  plans,
  preselectedSubscriber,
  onConfirmGrant,
}) => {
  const allUsers = loadUsersFromStorage();

  const [selectedUserId, setSelectedUserId] = useState<string>(
    preselectedSubscriber?.userId || allUsers.find((u) => !u.premium.isPremium)?.id || allUsers[0]?.id || ""
  );
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    plans.find((p) => p.status === "active")?.id || "1-month"
  );
  const [startDate, setStartDate] = useState<string>("2026-11-10");
  const [durationDays, setDurationDays] = useState<string>("30");
  const [reason, setReason] = useState<string>("");
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const targetUser = allUsers.find((u) => u.id === selectedUserId) || allUsers[0];
  const targetPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const computeExpiryDate = () => {
    const d = new Date(startDate);
    if (isNaN(d.getTime())) return "2026-12-10";
    d.setDate(d.getDate() + (Number(durationDays) || 30));
    return d.toISOString().slice(0, 10);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!targetUser) {
      setErrorMsg("Select a valid NobleBond member.");
      return;
    }
    if (!reason.trim()) {
      setErrorMsg("Mandatory justification reason is required for complimentary grants.");
      return;
    }
    if (!confirmed) {
      setErrorMsg("Check the confirmation acknowledgment box to proceed.");
      return;
    }

    onConfirmGrant({
      userId: targetUser.id,
      userName: targetUser.name,
      username: targetUser.username,
      email: targetUser.email,
      avatar: targetUser.avatar,
      country: targetUser.country,
      countryCode: targetUser.countryCode,
      city: targetUser.city,
      planId: targetPlan.id,
      planName: targetPlan.name,
      startDate,
      expiryDate: computeExpiryDate(),
      reason: reason.trim(),
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        className="animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface-elevated)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Gift size={20} color="var(--accent-champagne)" />
            <div>
              <h2 style={{ fontSize: "16.5px", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
                Grant Complimentary Premium Access
              </h2>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>
                Non-monetary administrative access ($0.00 revenue impact)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "22px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px" }}>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              backgroundColor: "var(--accent-champagne-bg)",
              border: "1px solid rgba(181, 139, 66, 0.35)",
              display: "flex",
              gap: "8px",
              fontSize: "12px",
              color: "var(--text-main)",
            }}
          >
            <ShieldAlert size={15} color="var(--accent-champagne)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              Complimentary VIP access never creates fake payment transactions, never adds to paid MRR/ARR totals, and never overwrites active Apple/Google/Stripe paid billing agreements.
            </div>
          </div>

          {errorMsg && (
            <div style={{ padding: "9px 12px", borderRadius: "8px", backgroundColor: "var(--status-error-bg)", color: "var(--status-error)", fontSize: "12px", fontWeight: 600 }}>
              {errorMsg}
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
              SELECT NOBLEBOND MEMBER *
            </label>
            <select
              value={selectedUserId}
              disabled={Boolean(preselectedSubscriber)}
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.username}) - Current: {u.premium.tier.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
              ENTITLEMENT TEMPLATE TIER *
            </label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              {plans.filter((p) => p.status !== "archived").map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.entitlementKeys.length} Premium Entitlements)
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
                START DATE *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
                DURATION (EXPIRY: {computeExpiryDate()})
              </label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                }}
              >
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="30">30 Days (1 Month)</option>
                <option value="90">90 Days (3 Months)</option>
                <option value="180">180 Days (6 Months)</option>
                <option value="365">365 Days (12 Months)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
              MANDATORY AUDIT REASON *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="e.g. Service recovery gesture following verified verification delay, or Beta Creator Ambassador showcase..."
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "13px",
                resize: "none",
              }}
            />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            <span style={{ color: "var(--text-main)", fontWeight: 600 }}>
              Confirm non-monetary complimentary grant ($0.00 revenue) and log to immutable audit history.
            </span>
          </label>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "9px 16px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "9px 18px",
                borderRadius: "9px",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "#FFFFFF",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Confirm Complimentary VIP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

