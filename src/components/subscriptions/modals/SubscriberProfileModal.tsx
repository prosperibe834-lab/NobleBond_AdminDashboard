// NobleBond Admin — Subscriber 360 Profile Modal (9 Dedicated Tabs)
// Displays Overview, Subscription Details, Billing History, Benefits, Renewals, Cancellations, Refunds, Account Info, and Admin History. Zero emojis.

import React, { useState } from "react";
import {
  X,
  User,
  Crown,
  CreditCard,
  ShieldCheck,
  RefreshCw,
  XCircle,
  RotateCcw,
  FileText,
  History,
  ExternalLink,
  Check,
  Lock,
  Gift,
} from "lucide-react";
import type {
  SubscriberSummaryRecord,
  SubscriptionTransactionRecord,
  SubscriptionRefundDisputeRecord,
  SubscriptionEntitlementConfig,
  SubscriptionAuditEvent,
  AdminRolePermissions,
} from "../../../types/subscriptionManagement.types";
import { Badge } from "../../common/Badge";
import {
  formatMoney,
  formatShortDate,
  formatDateTime,
  getSubscriptionStatusMeta,
  getTransactionStatusMeta,
  getRefundStatusMeta,
  getPaymentProviderLabel,
} from "../subscriptionUiUtils";

interface SubscriberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriber: SubscriberSummaryRecord | null;
  transactions: SubscriptionTransactionRecord[];
  refunds: SubscriptionRefundDisputeRecord[];
  entitlements: SubscriptionEntitlementConfig[];
  auditHistory: SubscriptionAuditEvent[];
  permissions: AdminRolePermissions;
  onOpenUserProfile: (userId: string) => void;
  onGrantComplimentary: (sub: SubscriberSummaryRecord) => void;
}

const TABS = [
  { id: 0, label: "1. Overview", icon: User },
  { id: 1, label: "2. Subscription Details", icon: Crown },
  { id: 2, label: "3. Billing History", icon: CreditCard },
  { id: 3, label: "4. Premium Benefits", icon: ShieldCheck },
  { id: 4, label: "5. Renewal History", icon: RefreshCw },
  { id: 5, label: "6. Cancellation History", icon: XCircle },
  { id: 6, label: "7. Refund History", icon: RotateCcw },
  { id: 7, label: "8. Account Info", icon: FileText },
  { id: 8, label: "9. Admin History", icon: History },
];

export const SubscriberProfileModal: React.FC<SubscriberProfileModalProps> = ({
  isOpen,
  onClose,
  subscriber,
  transactions,
  refunds,
  entitlements,
  auditHistory,
  permissions,
  onOpenUserProfile,
  onGrantComplimentary,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  if (!isOpen || !subscriber) return null;

  const subHistory = subscriber.subscriptionsHistory;
  const primarySub = subHistory[0];
  const statusMeta = getSubscriptionStatusMeta(subscriber.subscriptionStatus);

  const userTxs = transactions.filter((t) => t.userId === subscriber.userId);
  const userRenewals = userTxs.filter((t) => t.transactionType === "renewal");
  const userCancellations = subHistory.filter(
    (s) => s.status === "cancelled" || s.status === "cancellation_scheduled" || s.status === "expired"
  );
  const userRefunds = refunds.filter((r) => r.userId === subscriber.userId);
  const userAudits = auditHistory.filter(
    (a) =>
      a.targetId === subscriber.subscriptionId ||
      a.targetLabel.toLowerCase().includes(subscriber.username.toLowerCase()) ||
      a.targetLabel.toLowerCase().includes(subscriber.name.toLowerCase())
  );

  const isEntitled =
    subscriber.subscriptionStatus === "active" ||
    subscriber.subscriptionStatus === "cancellation_scheduled" ||
    subscriber.subscriptionStatus === "grace_period";

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
          maxWidth: "880px",
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
        {/* Top Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface-elevated)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <img
              src={subscriber.avatar}
              alt={subscriber.name}
              style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }}
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
                  {subscriber.name}
                </h2>
                <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                {subscriber.isComplimentary && <Badge variant="champagne">Complimentary VIP</Badge>}
              </div>
              <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                {subscriber.username} &bull; {subscriber.email} &bull; {subscriber.country}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={() => onOpenUserProfile(subscriber.userId)}
              style={{
                padding: "7px 12px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--primary)",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              User Profile <ExternalLink size={12} />
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "6px",
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 9 Tabs Strip */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            padding: "8px 18px 0",
            borderBottom: "1px solid var(--border)",
            overflowX: "auto",
            backgroundColor: "var(--bg-card)",
            flexShrink: 0,
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 11px",
                  border: "none",
                  borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent",
                  backgroundColor: "transparent",
                  color: active ? "var(--primary)" : "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px" }}>
          {/* 1. Overview */}
          {activeTab === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "12px" }}>
                <div style={{ padding: "14px", borderRadius: "12px", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>CURRENT PLAN</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-main)", marginTop: "3px" }}>
                    {subscriber.currentPlanName}
                  </div>
                </div>
                <div style={{ padding: "14px", borderRadius: "12px", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>LIFETIME PREMIUM SPEND</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--primary)", marginTop: "3px" }}>
                    {formatMoney(subscriber.lifetimeSubscriptionSpend)} {subscriber.currency}
                  </div>
                </div>
                <div style={{ padding: "14px", borderRadius: "12px", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>SUCCESSFUL PAYMENTS</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--status-success)", marginTop: "3px" }}>
                    {subscriber.totalSuccessfulPayments}
                  </div>
                </div>
                <div style={{ padding: "14px", borderRadius: "12px", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>NEXT RENEWAL</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", marginTop: "3px" }}>
                    {subscriber.nextRenewalDate ? formatShortDate(subscriber.nextRenewalDate) : "Not Scheduled"}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", padding: "12px 14px", borderRadius: "10px", backgroundColor: "var(--bg-app)", border: "1px solid var(--border-light)" }}>
                <strong>Note:</strong> Gift Coins (Live Streaming Currency) and Connection Points (Referral Rewards) are excluded from Premium subscription lifetime spend.
              </div>
            </div>
          )}

          {/* 2. Subscription Details */}
          {activeTab === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {subHistory.map((s) => {
                const sMeta = getSubscriptionStatusMeta(s.status);
                return (
                  <div
                    key={s.id}
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      backgroundColor: "var(--bg-app)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ color: "var(--primary)", fontFamily: "monospace" }}>
                        {s.id} &mdash; {s.planName}
                      </strong>
                      <Badge variant={sMeta.variant}>{sMeta.label}</Badge>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "8px", fontSize: "12px" }}>
                      <div>Provider: <strong>{getPaymentProviderLabel(s.paymentProvider)}</strong></div>
                      <div>Price: <strong>{s.isComplimentary ? "$0.00 (Complimentary)" : formatMoney(s.agreedPrice, s.currencySymbol)}</strong></div>
                      <div>Start: <strong>{formatShortDate(s.startDate)}</strong></div>
                      <div>Expiry: <strong>{formatShortDate(s.expiryDate)}</strong></div>
                      <div>Ref: <code style={{ fontSize: "11px" }}>{s.providerSubscriptionRef}</code></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. Billing History */}
          {activeTab === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {userTxs.length === 0 ? (
                <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                  No monetary billing transactions recorded for this member.
                </div>
              ) : (
                userTxs.map((tx) => {
                  const tMeta = getTransactionStatusMeta(tx.status);
                  return (
                    <div
                      key={tx.id}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "10px",
                        backgroundColor: "var(--bg-app)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "13px" }}>
                          {tx.id} ({tx.invoiceRef}) &bull; {tx.planName}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                          {formatDateTime(tx.timestamp)} &bull; {tx.maskedPaymentMethod}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontWeight: 800 }}>{formatMoney(tx.amount, tx.currencySymbol)}</span>
                        <Badge variant={tMeta.variant}>{tMeta.label}</Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 4. Premium Benefits */}
          {activeTab === 3 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
              {entitlements.map((ent) => {
                const active = isEntitled && ent.associatedPlanIds.includes(subscriber.currentPlanId);
                return (
                  <div
                    key={ent.key}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      backgroundColor: "var(--bg-app)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "12.5px", color: "var(--text-main)" }}>{ent.name}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{ent.usageLimitLabel}</div>
                    </div>
                    {active ? (
                      <Check size={16} color="var(--status-success)" />
                    ) : (
                      <Lock size={15} color="var(--text-muted)" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 5. Renewal History */}
          {activeTab === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {userRenewals.length === 0 ? (
                <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                  No automated renewal billing cycles logged yet for this member.
                </div>
              ) : (
                userRenewals.map((tx) => {
                  const tMeta = getTransactionStatusMeta(tx.status);
                  return (
                    <div
                      key={tx.id}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "10px",
                        backgroundColor: "var(--bg-app)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "13px" }}>{tx.billingPeriodLabel}</div>
                        <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                          {formatDateTime(tx.timestamp)} &bull; {tx.failureReason || "Succeeded"}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 700 }}>{formatMoney(tx.amount, tx.currencySymbol)}</span>
                        <Badge variant={tMeta.variant}>{tMeta.label}</Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 6. Cancellation History */}
          {activeTab === 5 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {userCancellations.length === 0 ? (
                <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                  No cancellation or expiration records exist for this subscriber.
                </div>
              ) : (
                userCancellations.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "10px",
                      backgroundColor: "var(--bg-app)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "13px" }}>
                      {s.id} ({s.planName}) &mdash; {s.status.replace(/_/g, " ").toUpperCase()}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "3px" }}>
                      Reason: {s.cancellationReason || "Period ended without auto-renew"}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                      Effective Date: {formatShortDate(s.cancellationEffectiveDate || s.expiryDate)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 7. Refund History */}
          {activeTab === 6 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {userRefunds.length === 0 ? (
                <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                  No refund requests or payment disputes exist for this member.
                </div>
              ) : (
                userRefunds.map((r) => {
                  const rMeta = getRefundStatusMeta(r.status);
                  return (
                    <div
                      key={r.id}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "10px",
                        backgroundColor: "var(--bg-app)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "13px" }}>
                          {r.id} &bull; {formatMoney(r.requestedAmount, r.currencySymbol)}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>{r.reason}</div>
                      </div>
                      <Badge variant={rMeta.variant}>{rMeta.label}</Badge>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 8. Account Information */}
          {activeTab === 7 && primarySub && (
            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-app)",
                border: "1px solid var(--border)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                fontSize: "12.5px",
              }}
            >
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>User ID</div>
                <div style={{ fontFamily: "monospace", fontWeight: 700 }}>{subscriber.userId}</div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Email</div>
                <div style={{ fontWeight: 600 }}>{subscriber.email}</div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Location</div>
                <div style={{ fontWeight: 600 }}>{subscriber.city}, {subscriber.country}</div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Verification Status</div>
                <div style={{ fontWeight: 700, textTransform: "uppercase" }}>{subscriber.verificationStatus}</div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Account Standing</div>
                <div style={{ fontWeight: 700, textTransform: "uppercase" }}>{subscriber.accountStatus}</div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Registered</div>
                <div style={{ fontWeight: 600 }}>{formatShortDate(subscriber.registrationDate)}</div>
              </div>
            </div>
          )}

          {/* 9. Administrative History */}
          {activeTab === 8 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {userAudits.length === 0 ? (
                <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                  No manual administrative adjustments recorded for this subscriber.
                </div>
              ) : (
                userAudits.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "10px",
                      backgroundColor: "var(--bg-app)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                      <strong style={{ color: "var(--primary)" }}>{a.actionType.replace(/_/g, " ").toUpperCase()}</strong>
                      <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>{formatDateTime(a.timestamp)}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-main)", marginTop: "3px" }}>{a.reason}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                      By {a.adminName} ({a.adminRole}) &bull; {a.previousValue} &rarr; {a.newValue}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface-elevated)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {permissions.canGrantComplimentary && (
            <button
              type="button"
              onClick={() => onGrantComplimentary(subscriber)}
              style={{
                padding: "8px 14px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--accent-champagne-bg)",
                color: "var(--accent-champagne)",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Gift size={14} /> {subscriber.isComplimentary ? "Extend Complimentary VIP" : "Grant Complimentary VIP"}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            style={{
              marginLeft: "auto",
              padding: "8px 18px",
              borderRadius: "9px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

