// NobleBond Admin — Subscription Detail Slide-Over Drawer
// Displays Subscription Info, Subscriber Info (+ User Management link), Chronological Timeline, Billing History, and Entitlements. Zero emojis.

import React from "react";
import {
  X,
  Crown,
  User,
  Clock,
  CreditCard,
  ShieldCheck,
  ExternalLink,
  Check,
  Lock,
  Gift,
  XCircle,
} from "lucide-react";
import type {
  SubscriptionRecord,
  SubscriptionTransactionRecord,
  SubscriptionEntitlementConfig,
  AdminRolePermissions,
} from "../../../types/subscriptionManagement.types";
import { Badge } from "../../common/Badge";
import {
  formatMoney,
  formatShortDate,
  formatDateTime,
  getSubscriptionStatusMeta,
  getTransactionStatusMeta,
  getPaymentProviderLabel,
  getBillingIntervalLabel,
} from "../subscriptionUiUtils";

interface SubscriptionDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionRecord | null;
  transactions: SubscriptionTransactionRecord[];
  entitlements: SubscriptionEntitlementConfig[];
  permissions: AdminRolePermissions;
  onOpenUserProfile: (userId: string) => void;
  onInspectTransaction: (tx: SubscriptionTransactionRecord) => void;
  onRequestCancellationUpdate: (
    sub: SubscriptionRecord,
    targetStatus: "cancellation_scheduled" | "cancelled"
  ) => void;
  onRevokeComplimentary: (sub: SubscriptionRecord) => void;
}

export const SubscriptionDetailDrawer: React.FC<SubscriptionDetailDrawerProps> = ({
  isOpen,
  onClose,
  subscription,
  transactions,
  entitlements,
  permissions,
  onOpenUserProfile,
  onInspectTransaction,
  onRequestCancellationUpdate,
  onRevokeComplimentary,
}) => {
  if (!isOpen || !subscription) return null;

  const statusMeta = getSubscriptionStatusMeta(subscription.status);
  const subTransactions = transactions.filter((t) => t.subscriptionId === subscription.id);
  const accessEntitled =
    subscription.status === "active" ||
    subscription.status === "cancellation_scheduled" ||
    subscription.status === "grace_period";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "700px",
          height: "100%",
          backgroundColor: "var(--bg-card)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface-elevated)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-active)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Crown size={20} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "17px", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
                  Subscription {subscription.id}
                </h2>
                <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                {subscription.isComplimentary && (
                  <Badge variant="champagne">Complimentary VIP</Badge>
                )}
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                {subscription.planName} &bull; {subscription.userName} ({subscription.username})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
            }}
            aria-label="Close subscription details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body: Sections A - E */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* A. SUBSCRIPTION INFORMATION */}
          <section
            style={{
              padding: "16px",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-app)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
              <Crown size={14} color="var(--primary)" />
              <span>A. Subscription Contract & Billing Terms</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: "12px", fontSize: "12.5px" }}>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Plan Tier</div>
                <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{subscription.planName}</div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Agreed Billing Price</div>
                <div style={{ fontWeight: 800, color: "var(--primary)" }}>
                  {subscription.isComplimentary
                    ? "$0.00 USD (Complimentary)"
                    : `${formatMoney(subscription.agreedPrice, subscription.currencySymbol)} ${subscription.currency} / ${getBillingIntervalLabel(subscription.billingInterval)}`}
                </div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Start Date</div>
                <div style={{ fontWeight: 600 }}>{formatShortDate(subscription.startDate)}</div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Current Billing Period</div>
                <div style={{ fontWeight: 600 }}>
                  {formatShortDate(subscription.currentPeriodStart)} - {formatShortDate(subscription.currentPeriodEnd)}
                </div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Next Renewal Date</div>
                <div style={{ fontWeight: 600 }}>{formatShortDate(subscription.nextRenewalDate)}</div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Expiry Date</div>
                <div style={{ fontWeight: 600 }}>{formatShortDate(subscription.expiryDate)}</div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Auto-Renewal</div>
                <div style={{ fontWeight: 700, color: subscription.autoRenew ? "var(--status-success)" : "var(--text-secondary)" }}>
                  {subscription.autoRenew ? "Enabled" : "Disabled"}
                </div>
              </div>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Payment Provider</div>
                <div style={{ fontWeight: 600 }}>{getPaymentProviderLabel(subscription.paymentProvider)}</div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>External Provider Reference</div>
                <div style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--text-main)" }}>
                  {subscription.providerSubscriptionRef} &bull; Method: {subscription.maskedPaymentMethod}
                </div>
              </div>
              {subscription.cancellationDate && (
                <div style={{ gridColumn: "1 / -1", padding: "8px 10px", borderRadius: "8px", backgroundColor: "var(--status-warning-bg)", color: "var(--text-main)" }}>
                  <strong>Cancellation Logged:</strong> {formatDateTime(subscription.cancellationDate)} &bull; Effective: {formatShortDate(subscription.cancellationEffectiveDate)} &mdash; {subscription.cancellationReason}
                </div>
              )}
              {subscription.isComplimentary && (
                <div style={{ gridColumn: "1 / -1", padding: "8px 10px", borderRadius: "8px", backgroundColor: "var(--accent-champagne-bg)", color: "var(--text-main)" }}>
                  <Gift size={13} style={{ verticalAlign: "middle", marginRight: "5px" }} />
                  <strong>Complimentary Grant Note:</strong> {subscription.complimentaryReason} (Granted by {subscription.complimentaryGrantedBy || "Admin"})
                </div>
              )}
            </div>
          </section>

          {/* B. SUBSCRIBER INFORMATION */}
          <section
            style={{
              padding: "16px",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-app)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={subscription.avatar}
                alt={subscription.userName}
                style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }}
              />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14.5px", fontWeight: 800, color: "var(--text-main)" }}>
                  <User size={14} color="var(--primary)" />
                  <span>{subscription.userName}</span>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-muted)" }}>
                    ({subscription.username})
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  {subscription.email} &bull; {subscription.city}, {subscription.country}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "3px" }}>
                  Account: {subscription.accountStatus.toUpperCase()} &bull; Verification: {subscription.verificationStatus.toUpperCase()} &bull; Registered: {formatShortDate(subscription.registrationDate)}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenUserProfile(subscription.userId)}
              style={{
                padding: "8px 13px",
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
              <span>Open in User Management</span>
              <ExternalLink size={12} />
            </button>
          </section>

          {/* C. SUBSCRIPTION TIMELINE */}
          <section
            style={{
              padding: "16px",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-app)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
              <Clock size={14} color="var(--status-info)" />
              <span>C. Chronological Subscription Timeline</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {subscription.timeline.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    paddingLeft: "12px",
                    borderLeft: "2px solid var(--primary)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>{ev.title}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {ev.description}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                      Actor: {ev.actor}
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    {formatDateTime(ev.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* D. BILLING HISTORY */}
          <section
            style={{
              padding: "16px",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-app)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
              <CreditCard size={14} color="var(--accent-champagne)" />
              <span>D. Related Billing & Invoice History ({subTransactions.length})</span>
            </div>

            {subTransactions.length === 0 ? (
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {subscription.isComplimentary
                  ? "Complimentary access carries zero monetary billing invoices."
                  : "No individual transaction records logged in this demonstration period."}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {subTransactions.map((tx) => {
                  const tMeta = getTransactionStatusMeta(tx.status);
                  return (
                    <div
                      key={tx.id}
                      onClick={() => onInspectTransaction(tx)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "10px",
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        gap: "8px",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
                          {tx.id} ({tx.invoiceRef})
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                          {formatDateTime(tx.timestamp)} &bull; {tx.maskedPaymentMethod}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontWeight: 800, color: "var(--text-main)", fontSize: "13px" }}>
                          {formatMoney(tx.amount, tx.currencySymbol)}
                        </span>
                        <Badge variant={tMeta.variant}>{tMeta.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* E. ASSOCIATED ENTITLEMENTS */}
          <section
            style={{
              padding: "16px",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-app)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
                <ShieldCheck size={14} color="var(--status-success)" />
                <span>E. Active Plan Entitlements</span>
              </div>
              <Badge variant={accessEntitled ? "success" : "neutral"}>
                {accessEntitled ? "Entitlements Granted" : "Access Inactive"}
              </Badge>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "8px" }}>
              {entitlements.map((ent) => {
                const included = ent.associatedPlanIds.includes(subscription.planId) && accessEntitled;
                return (
                  <div
                    key={ent.key}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "9px",
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-light)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "12px",
                    }}
                  >
                    {included ? (
                      <Check size={14} color="var(--status-success)" />
                    ) : (
                      <Lock size={13} color="var(--text-muted)" />
                    )}
                    <span style={{ fontWeight: 600, color: included ? "var(--text-main)" : "var(--text-muted)" }}>
                      {ent.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Drawer Action Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface-elevated)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {subscription.isComplimentary && subscription.status === "active" && permissions.canRevokeComplimentary && (
              <button
                type="button"
                onClick={() => onRevokeComplimentary(subscription)}
                style={{
                  padding: "8px 13px",
                  borderRadius: "9px",
                  border: "1px solid rgba(201, 54, 79, 0.35)",
                  backgroundColor: "var(--status-error-bg)",
                  color: "var(--status-error)",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <XCircle size={13} /> Revoke Complimentary VIP
              </button>
            )}

            {!subscription.isComplimentary &&
              subscription.status === "active" &&
              permissions.canManagePlans && (
                <button
                  type="button"
                  onClick={() => onRequestCancellationUpdate(subscription, "cancellation_scheduled")}
                  style={{
                    padding: "8px 13px",
                    borderRadius: "9px",
                    border: "1px solid rgba(217, 119, 6, 0.35)",
                    backgroundColor: "var(--status-warning-bg)",
                    color: "var(--status-warning)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Schedule Period-End Cancellation
                </button>
              )}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "9px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
