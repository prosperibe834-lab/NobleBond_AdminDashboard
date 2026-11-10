// NobleBond Admin — Subscription Entitlements & Plan-to-Benefit Matrix
// Uses real NobleBond mobile PremiumEntitlements only. Zero Gift Coins / Connection Points mixing. Zero emojis.

import React, { useState } from "react";
import {
  ShieldCheck,
  Check,
  X,
  Lock,
  Search,
  Crown,
} from "lucide-react";
import type {
  SubscriptionEntitlementConfig,
  SubscriptionPlanConfig,
  SubscriptionRecord,
  EntitlementKey,
  AdminRolePermissions,
} from "../../types/subscriptionManagement.types";
import { Badge } from "../common/Badge";
import { formatShortDate } from "./subscriptionUiUtils";

interface SubscriptionEntitlementsSectionProps {
  entitlements: SubscriptionEntitlementConfig[];
  plans: SubscriptionPlanConfig[];
  subscriptions: SubscriptionRecord[];
  permissions: AdminRolePermissions;
  onToggleEntitlementPlan: (entitlementKey: EntitlementKey, planIds: string[], reason: string) => void;
}

export const SubscriptionEntitlementsSection: React.FC<SubscriptionEntitlementsSectionProps> = ({
  entitlements,
  plans,
  subscriptions,
  permissions,
  onToggleEntitlementPlan,
}) => {
  const [selectedSubId, setSelectedSubId] = useState<string>(subscriptions[0]?.id || "");
  const [reasonNote, setReasonNote] = useState<string>(
    "Aligned plan entitlement matrix with NobleBond mobile Premium rules."
  );

  const inspectedSubscription = subscriptions.find((s) => s.id === selectedSubId) || subscriptions[0];

  const isSubscriptionEntitled = (sub: SubscriptionRecord | undefined): boolean => {
    if (!sub) return false;
    return (
      sub.status === "active" ||
      sub.status === "cancellation_scheduled" ||
      sub.status === "grace_period"
    );
  };

  const handleToggleCell = (ent: SubscriptionEntitlementConfig, planId: string) => {
    if (!permissions.canManageEntitlements) return;
    const exists = ent.associatedPlanIds.includes(planId);
    const updatedPlanIds = exists
      ? ent.associatedPlanIds.filter((id) => id !== planId)
      : [...ent.associatedPlanIds, planId];
    onToggleEntitlementPlan(
      ent.key,
      updatedPlanIds,
      reasonNote.trim() || "Plan-to-benefit association modified by Administrator."
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Security & Product Separation Notice */}
      <div
        style={{
          padding: "12px 16px",
          borderRadius: "12px",
          backgroundColor: "var(--bg-surface-elevated)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          fontSize: "12px",
          color: "var(--text-secondary)",
        }}
      >
        <ShieldCheck size={16} color="var(--status-success)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong>Entitlement Authority & Separation Guarantee:</strong> Access rights strictly mirror{" "}
          <code style={{ color: "var(--primary)" }}>PremiumEntitlements</code> in the NobleBond mobile client. Inactive, expired, or cancelled-beyond-period subscriptions automatically revoke access. Gift Coins, Connection Points, and Referral rewards are strictly excluded from membership entitlements. Backend enforcement remains authoritative in production.
        </div>
      </div>

      {/* Plan-to-Benefit Matrix Table */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
              Plan-to-Benefit Entitlement Matrix
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Configured Premium capabilities and availability across published & legacy tiers.
            </p>
          </div>
          {!permissions.canManageEntitlements && (
            <Badge variant="warning">Read-Only (Billing Lead / Super Admin to Edit)</Badge>
          )}
        </div>

        {permissions.canManageEntitlements && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>
              Audit Change Note:
            </span>
            <input
              type="text"
              value={reasonNote}
              onChange={(e) => setReasonNote(e.target.value)}
              placeholder="Reason recorded when toggling entitlements..."
              style={{
                flex: "1 1 280px",
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "12px",
              }}
            />
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-surface-elevated)", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "11.5px" }}>
                <th style={{ padding: "12px 14px" }}>ENTITLEMENT & KEY</th>
                <th style={{ padding: "12px 14px" }}>USAGE LIMITS</th>
                <th style={{ padding: "12px 14px" }}>STATUS</th>
                {plans.map((p) => (
                  <th key={p.id} style={{ padding: "12px 14px", textAlign: "center" }}>
                    <div>{p.name}</div>
                    <div style={{ fontSize: "10px", fontWeight: 500, color: "var(--text-muted)" }}>
                      {p.status.toUpperCase()}
                    </div>
                  </th>
                ))}
                <th style={{ padding: "12px 14px" }}>UPDATED</th>
              </tr>
            </thead>
            <tbody>
              {entitlements.map((ent) => (
                <tr key={ent.key} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "12px 14px", maxWidth: "280px" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{ent.name}</div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {ent.description}
                    </div>
                    <div style={{ fontSize: "10.5px", fontFamily: "monospace", color: "var(--primary)", marginTop: "3px" }}>
                      {ent.mobileFeatureKey}
                    </div>
                  </td>

                  <td style={{ padding: "12px 14px", fontSize: "12px", color: "var(--text-secondary)" }}>
                    {ent.usageLimitLabel}
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    <Badge variant={ent.status === "active" ? "success" : "warning"}>{ent.status}</Badge>
                  </td>

                  {plans.map((p) => {
                    const included = ent.associatedPlanIds.includes(p.id);
                    return (
                      <td key={p.id} style={{ padding: "12px 14px", textAlign: "center" }}>
                        <button
                          type="button"
                          disabled={!permissions.canManageEntitlements}
                          onClick={() => handleToggleCell(ent, p.id)}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "8px",
                            border: included ? "1px solid rgba(20, 132, 95, 0.35)" : "1px solid var(--border)",
                            backgroundColor: included ? "var(--status-success-bg)" : "var(--bg-surface-elevated)",
                            color: included ? "var(--status-success)" : "var(--text-muted)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: permissions.canManageEntitlements ? "pointer" : "not-allowed",
                          }}
                          title={
                            permissions.canManageEntitlements
                              ? `Toggle ${ent.name} for ${p.name}`
                              : "Read-only permission"
                          }
                        >
                          {included ? <Check size={14} /> : <X size={13} />}
                        </button>
                      </td>
                    );
                  })}

                  <td style={{ padding: "12px 14px", fontSize: "11.5px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    {formatShortDate(ent.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Subscriber Entitlement Verification Inspector */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Search size={17} color="var(--primary)" />
            <div>
              <h3 style={{ fontSize: "15.5px", fontWeight: 800, color: "var(--text-main)" }}>
                Subscriber Entitlement Inspector
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Inspect real-time Premium access verification for any subscription record
              </p>
            </div>
          </div>

          <select
            value={selectedSubId}
            onChange={(e) => setSelectedSubId(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 600,
              minWidth: "240px",
            }}
          >
            {subscriptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.userName} ({s.planName} — {s.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {inspectedSubscription && (
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-light)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Crown size={18} color={isSubscriptionEntitled(inspectedSubscription) ? "var(--status-success)" : "var(--text-muted)"} />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                    {inspectedSubscription.userName} ({inspectedSubscription.username})
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Plan: <strong>{inspectedSubscription.planName}</strong> &bull; Sub ID: {inspectedSubscription.id}
                  </div>
                </div>
              </div>
              <Badge variant={isSubscriptionEntitled(inspectedSubscription) ? "success" : "error"}>
                {isSubscriptionEntitled(inspectedSubscription)
                  ? "ENTITLEMENTS ACTIVE"
                  : `ACCESS REVOKED (${inspectedSubscription.status.toUpperCase()})`}
              </Badge>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
              {entitlements.map((ent) => {
                const subEntitled = isSubscriptionEntitled(inspectedSubscription);
                const planIncludes = ent.associatedPlanIds.includes(inspectedSubscription.planId);
                const active = subEntitled && planIncludes && ent.status === "active";

                return (
                  <div
                    key={ent.key}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>{ent.name}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{ent.usageLimitLabel}</div>
                    </div>
                    {active ? (
                      <Badge variant="success">Unlocked</Badge>
                    ) : (
                      <span title={!subEntitled ? "Subscription inactive" : "Not in plan tier"}>
                        <Lock size={14} color="var(--text-muted)" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

