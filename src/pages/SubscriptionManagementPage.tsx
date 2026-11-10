// NobleBond Admin — Complete Subscription Management Redesign & Functional Implementation
// Manages NobleBond Premium plans, subscribers, billing transactions, renewals, cancellations, failed payments, refunds, entitlements, analytics, and audit logs. Zero emojis.

import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Layers,
  List,
  Users,
  CreditCard,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  BarChart3,
  History,
  Search,
  Filter,
  Download,
  Gift,
  LayoutGrid,
  CheckCircle2,
  X,
  Shield,
  Calendar,
} from "lucide-react";

// Types
import type {
  SubscriptionTabKey,
  SubscriptionPlanConfig,
  SubscriptionRecord,
  SubscriptionTransactionRecord,
  SubscriptionRefundDisputeRecord,
  SubscriptionEntitlementConfig,
  SubscriptionAuditEvent,
  StagedPromotionDraft,
  SubscriberSummaryRecord,
  SubscriptionFilterState,
  SubscriptionSortCriteria,
  SubscriptionSortField,
  SubscriptionDateRange,
  SubscriptionStatus,
  AdminRoleKey,
  PlanStatus,
  EntitlementKey,
} from "../types/subscriptionManagement.types";

// Data Service
import {
  ADMIN_ROLE_PERMISSIONS,
  loadSubscriptionPlans,
  loadSubscriptions,
  loadSubscriptionTransactions,
  loadRefundsAndDisputes,
  loadEntitlementConfigs,
  loadSubscriptionAuditHistory,
  loadStagedPromotions,
  calculateSubscriptionKPIs,
  buildSubscriberDirectory,
  filterAndSortSubscriptions,
  saveOrUpdatePlan,
  changePlanStatus,
  grantComplimentaryAccess,
  revokeComplimentaryAccess,
  updateSubscriptionCancellationState,
  processRefundDecision,
  addRefundInternalNote,
  refreshFailedPaymentStatus,
  updateEntitlementPlanMapping,
  saveStagedPromotionDraft,
  resetSubscriptionManagementData,
  exportSubscriptionsCsv,
  exportTransactionsCsv,
  exportSubscribersCsv,
  exportRefundsCsv,
  exportAuditHistoryCsv,
} from "../data/subscriptionManagementDataService";

// Subcomponents
import { ProductSeparationBanner } from "../components/subscriptions/ProductSeparationBanner";
import { SubscriptionStatsHeader } from "../components/subscriptions/SubscriptionStatsHeader";
import { SubscriptionOverviewSection } from "../components/subscriptions/SubscriptionOverviewSection";
import { PlansPricingSection } from "../components/subscriptions/PlansPricingSection";
import { AllSubscriptionsTable } from "../components/subscriptions/AllSubscriptionsTable";
import { SubscribersSection } from "../components/subscriptions/SubscribersSection";
import { PaymentsTransactionsSection } from "../components/subscriptions/PaymentsTransactionsSection";
import { RenewalsCancellationsSection } from "../components/subscriptions/RenewalsCancellationsSection";
import { FailedPaymentsSection } from "../components/subscriptions/FailedPaymentsSection";
import { RefundsDisputesSection } from "../components/subscriptions/RefundsDisputesSection";
import { SubscriptionEntitlementsSection } from "../components/subscriptions/SubscriptionEntitlementsSection";
import { SubscriptionAnalyticsSection } from "../components/subscriptions/SubscriptionAnalyticsSection";
import { SubscriptionAuditHistorySection } from "../components/subscriptions/SubscriptionAuditHistorySection";
import { SubscriptionFilterDrawer } from "../components/subscriptions/SubscriptionFilterDrawer";
import { SubscriptionPagination } from "../components/subscriptions/SubscriptionPagination";
import { SubscriptionSkeletonLoader } from "../components/subscriptions/SubscriptionSkeletonLoader";
import { SubscriptionMobileCards } from "../components/subscriptions/SubscriptionMobileCards";

// Modals & Drawers
import { SubscriptionDetailDrawer } from "../components/subscriptions/modals/SubscriptionDetailDrawer";
import { SubscriberProfileModal } from "../components/subscriptions/modals/SubscriberProfileModal";
import { PlanFormModal } from "../components/subscriptions/modals/PlanFormModal";
import { PlanDetailPreviewModal } from "../components/subscriptions/modals/PlanDetailPreviewModal";
import { ComplimentaryAccessModal } from "../components/subscriptions/modals/ComplimentaryAccessModal";
import { TransactionDetailModal } from "../components/subscriptions/modals/TransactionDetailModal";
import { RefundDisputeModal } from "../components/subscriptions/modals/RefundDisputeModal";
import { ConfirmSubscriptionActionModal } from "../components/subscriptions/modals/ConfirmSubscriptionActionModal";

const DEFAULT_FILTERS: SubscriptionFilterState = {
  searchQuery: "",
  status: "all",
  planId: "all",
  billingInterval: "all",
  currency: "all",
  country: "all",
  paymentProvider: "all",
  autoRenew: "all",
  complimentaryFilter: "all",
  dateRange: "all",
};

interface PendingConfirmAction {
  title: string;
  description: string;
  confirmLabel: string;
  variant: "primary" | "warning" | "danger";
  requireReason: boolean;
  onExecute: (reason: string) => void;
}

export const SubscriptionManagementPage: React.FC = () => {
  const navigate = useNavigate();

  // Persistent State (Lazy Initializers)
  const [plans, setPlans] = useState<SubscriptionPlanConfig[]>(() => loadSubscriptionPlans());
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(() => loadSubscriptions());
  const [transactions, setTransactions] = useState<SubscriptionTransactionRecord[]>(() =>
    loadSubscriptionTransactions()
  );
  const [refunds, setRefunds] = useState<SubscriptionRefundDisputeRecord[]>(() =>
    loadRefundsAndDisputes()
  );
  const [entitlements, setEntitlements] = useState<SubscriptionEntitlementConfig[]>(() =>
    loadEntitlementConfigs()
  );
  const [auditHistory, setAuditHistory] = useState<SubscriptionAuditEvent[]>(() =>
    loadSubscriptionAuditHistory()
  );
  const [stagedPromos, setStagedPromos] = useState<StagedPromotionDraft[]>(() =>
    loadStagedPromotions()
  );

  // Navigation, Role Permission Context & UI State
  const [activeTab, setActiveTab] = useState<SubscriptionTabKey>("overview");
  const [adminRole, setAdminRole] = useState<AdminRoleKey>("super_admin");
  const permissions = ADMIN_ROLE_PERMISSIONS[adminRole];

  const [globalDateRange, setGlobalDateRange] = useState<SubscriptionDateRange>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("2026-01-01");
  const [customEndDate, setCustomEndDate] = useState<string>("2026-11-10");

  const [filters, setFilters] = useState<SubscriptionFilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SubscriptionSortCriteria>({ field: "newest", direction: "desc" });
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & Drawers Selection State
  const [inspectingSub, setInspectingSub] = useState<SubscriptionRecord | null>(null);
  const [inspectingSubscriber, setInspectingSubscriber] = useState<SubscriberSummaryRecord | null>(null);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanConfig | null>(null);
  const [isPlanFormOpen, setIsPlanFormOpen] = useState<boolean>(false);
  const [previewingPlan, setPreviewingPlan] = useState<{
    plan: SubscriptionPlanConfig;
    mode: "specs" | "preview";
  } | null>(null);
  const [isComplimentaryModalOpen, setIsComplimentaryModalOpen] = useState<boolean>(false);
  const [complimentaryTarget, setComplimentaryTarget] = useState<SubscriberSummaryRecord | null>(null);
  const [inspectingTransaction, setInspectingTransaction] = useState<SubscriptionTransactionRecord | null>(null);
  const [inspectingRefund, setInspectingRefund] = useState<SubscriptionRefundDisputeRecord | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirmAction | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  // Computed Aggregates
  const kpis = useMemo(
    () =>
      calculateSubscriptionKPIs(
        subscriptions,
        transactions,
        refunds,
        globalDateRange,
        customStartDate,
        customEndDate
      ),
    [subscriptions, transactions, refunds, globalDateRange, customStartDate, customEndDate]
  );

  const subscriberDirectory = useMemo(
    () => buildSubscriberDirectory(subscriptions, transactions),
    [subscriptions, transactions]
  );

  const countries = useMemo(() => {
    const s = new Set(subscriptions.map((sub) => sub.country));
    return Array.from(s).sort();
  }, [subscriptions]);

  const effectiveFilters = useMemo(
    () => ({
      ...filters,
      dateRange: filters.dateRange !== "all" ? filters.dateRange : globalDateRange,
      customStartDate: filters.customStartDate || customStartDate,
      customEndDate: filters.customEndDate || customEndDate,
    }),
    [filters, globalDateRange, customStartDate, customEndDate]
  );

  const filteredSubscriptions = useMemo(
    () => filterAndSortSubscriptions(subscriptions, effectiveFilters, sort),
    [subscriptions, effectiveFilters, sort]
  );

  const paginatedSubscriptions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubscriptions.slice(start, start + pageSize);
  }, [filteredSubscriptions, currentPage, pageSize]);

  const activeFilterCount = useMemo(() => {
    let cnt = 0;
    if (filters.status !== "all") cnt++;
    if (filters.planId !== "all") cnt++;
    if (filters.billingInterval !== "all") cnt++;
    if (filters.paymentProvider !== "all") cnt++;
    if (filters.country !== "all") cnt++;
    if (filters.autoRenew !== "all") cnt++;
    if (filters.complimentaryFilter !== "all") cnt++;
    return cnt;
  }, [filters]);

  // Handlers
  const handleTabChange = (tab: SubscriptionTabKey) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleNavigateFilter = (tab: SubscriptionTabKey, statusFilter?: "all" | SubscriptionStatus) => {
    setActiveTab(tab);
    if (statusFilter) {
      setFilters((prev) => ({ ...prev, status: statusFilter }));
    }
    setCurrentPage(1);
  };

  const handleOpenUserManagement = (userId: string) => {
    navigate(`/users?userId=${encodeURIComponent(userId)}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPlans(loadSubscriptionPlans());
      setSubscriptions(loadSubscriptions());
      setTransactions(loadSubscriptionTransactions());
      setRefunds(loadRefundsAndDisputes());
      setEntitlements(loadEntitlementConfigs());
      setAuditHistory(loadSubscriptionAuditHistory());
      setStagedPromos(loadStagedPromotions());
      setIsRefreshing(false);
      showToast("Subscription operations data refreshed from local state.");
    }, 450);
  };

  const handleRequestResetDemo = () => {
    setPendingConfirm({
      title: "Reset Demonstration Subscription Data",
      description:
        "Restore all subscription plans, active member billing cycles, failed payments, refund cases, and audit logs to initial NobleBond demonstration values?",
      confirmLabel: "Reset Demo Records",
      variant: "danger",
      requireReason: false,
      onExecute: () => {
        resetSubscriptionManagementData();
        setPlans(loadSubscriptionPlans());
        setSubscriptions(loadSubscriptions());
        setTransactions(loadSubscriptionTransactions());
        setRefunds(loadRefundsAndDisputes());
        setEntitlements(loadEntitlementConfigs());
        setAuditHistory(loadSubscriptionAuditHistory());
        setStagedPromos(loadStagedPromotions());
        setFilters(DEFAULT_FILTERS);
        setGlobalDateRange("all");
        showToast("Subscription demonstration dataset reset cleanly.");
      },
    });
  };

  const handleSavePlan = (plan: SubscriptionPlanConfig, isNew: boolean, reason: string) => {
    const res = saveOrUpdatePlan(plan, isNew, permissions.roleLabel, permissions.roleLabel, reason);
    setPlans(res.plans);
    setAuditHistory(res.audit);
    showToast(
      isNew
        ? `Demo Plan "${plan.name}" created (future checkouts only).`
        : `Plan "${plan.name}" updated. Existing subscriber contracts untouched.`
    );
  };

  const handleRequestPlanStatusChange = (plan: SubscriptionPlanConfig, targetStatus: PlanStatus) => {
    const isDeactivating = targetStatus === "inactive" || targetStatus === "archived";
    setPendingConfirm({
      title: `${targetStatus === "active" ? "Activate" : targetStatus === "archived" ? "Archive" : "Deactivate"} Plan: ${plan.name}`,
      description: isDeactivating
        ? `Changing "${plan.name}" to ${targetStatus.toUpperCase()} hides it from new mobile signups. Existing active subscribers on this tier WILL NOT be automatically cancelled.`
        : `Publishing "${plan.name}" as ACTIVE makes it eligible for new subscriber purchases according to regional availability.`,
      confirmLabel: `Confirm ${targetStatus.toUpperCase()}`,
      variant: targetStatus === "active" ? "primary" : "warning",
      requireReason: true,
      onExecute: (reason) => {
        const res = changePlanStatus(
          plan.id,
          targetStatus,
          permissions.roleLabel,
          permissions.roleLabel,
          reason
        );
        setPlans(res.plans);
        setAuditHistory(res.audit);
        showToast(`Plan "${plan.name}" transitioned to ${targetStatus.toUpperCase()}.`);
      },
    });
  };

  const handleConfirmComplimentaryGrant = (params: {
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
  }) => {
    const res = grantComplimentaryAccess(params, permissions.roleLabel, permissions.roleLabel);
    setSubscriptions(res.subscriptions);
    setAuditHistory(res.audit);
    showToast(`Granted complimentary VIP access to ${params.userName} ($0.00 paid revenue).`);
  };

  const handleRequestRevokeComplimentary = (sub: SubscriptionRecord) => {
    setPendingConfirm({
      title: `Revoke Complimentary VIP Access: ${sub.userName}`,
      description:
        "This immediately terminates complimentary administrative access for this member. Paid store subscriptions are never affected.",
      confirmLabel: "Revoke Complimentary Access",
      variant: "danger",
      requireReason: true,
      onExecute: (reason) => {
        const res = revokeComplimentaryAccess(
          sub.id,
          reason,
          permissions.roleLabel,
          permissions.roleLabel
        );
        setSubscriptions(res.subscriptions);
        setAuditHistory(res.audit);
        setInspectingSub(res.subscriptions.find((s) => s.id === sub.id) || null);
        showToast(`Complimentary access revoked for ${sub.userName}.`);
      },
    });
  };

  const handleRequestCancellationUpdate = (
    sub: SubscriptionRecord,
    targetStatus: "cancellation_scheduled" | "cancelled"
  ) => {
    setPendingConfirm({
      title: `Update Cancellation State: ${sub.id}`,
      description:
        targetStatus === "cancellation_scheduled"
          ? `Schedules auto-renewal cancellation for ${sub.userName}. Full Premium access remains active until period end (${sub.currentPeriodEnd.slice(0, 10)}). Requires provider sync in production.`
          : `Terminates subscription ${sub.id} immediately.`,
      confirmLabel: "Confirm Schedule Cancellation",
      variant: "warning",
      requireReason: true,
      onExecute: (reason) => {
        const res = updateSubscriptionCancellationState(
          sub.id,
          targetStatus,
          reason,
          permissions.roleLabel,
          permissions.roleLabel
        );
        setSubscriptions(res.subscriptions);
        setAuditHistory(res.audit);
        setInspectingSub(res.subscriptions.find((s) => s.id === sub.id) || null);
        showToast(`Subscription ${sub.id} scheduled for period-end cancellation.`);
      },
    });
  };

  const handleRefreshPaymentStatus = (transactionId: string) => {
    const res = refreshFailedPaymentStatus(transactionId, permissions.roleLabel, permissions.roleLabel);
    setTransactions(res.transactions);
    setAuditHistory(res.audit);
    if (inspectingTransaction?.id === transactionId) {
      setInspectingTransaction(res.transactions.find((t) => t.id === transactionId) || null);
    }
    showToast(`Synced read-only status check for ${transactionId} (unpaid until customer/provider retry).`);
  };

  const handleProcessRefundDecision = (
    refundId: string,
    decision: "approved" | "rejected" | "under_review",
    notes: string
  ) => {
    const res = processRefundDecision(
      refundId,
      decision,
      notes,
      permissions.roleLabel,
      permissions.roleLabel
    );
    setRefunds(res.refunds);
    setTransactions(res.transactions);
    setAuditHistory(res.audit);
    showToast(`Demo refund case ${refundId} marked as ${decision.replace("_", " ").toUpperCase()}.`);
  };

  const handleAddRefundNote = (refundId: string, text: string) => {
    const updated = addRefundInternalNote(refundId, text, permissions.roleLabel);
    setRefunds(updated);
    setInspectingRefund(updated.find((r) => r.id === refundId) || null);
    showToast(`Internal note logged on ${refundId}.`);
  };

  const handleToggleEntitlementPlan = (
    entitlementKey: EntitlementKey,
    planIds: string[],
    reason: string
  ) => {
    const res = updateEntitlementPlanMapping(
      entitlementKey,
      planIds,
      permissions.roleLabel,
      permissions.roleLabel,
      reason
    );
    setEntitlements(res.entitlements);
    setAuditHistory(res.audit);
    showToast(`Updated entitlement matrix for "${entitlementKey}".`);
  };

  const handleSaveStagedPromo = (promo: StagedPromotionDraft) => {
    const res = saveStagedPromotionDraft(promo, permissions.roleLabel, permissions.roleLabel);
    setStagedPromos(res.promos);
    setAuditHistory(res.audit);
    showToast(`Saved inactive staging promo draft "${promo.promoCode}".`);
  };

  const handleGlobalExport = () => {
    if (activeTab === "payments" || activeTab === "failed_payments") {
      exportTransactionsCsv(transactions);
      showToast("Exported Premium payment transactions CSV.");
    } else if (activeTab === "subscribers") {
      exportSubscribersCsv(subscriberDirectory);
      showToast("Exported NobleBond Subscribers CSV.");
    } else if (activeTab === "refunds") {
      exportRefundsCsv(refunds);
      showToast("Exported Refund & Dispute cases CSV.");
    } else if (activeTab === "audit_history") {
      exportAuditHistoryCsv(auditHistory);
      showToast("Exported Subscription Audit History CSV.");
    } else {
      exportSubscriptionsCsv(filteredSubscriptions);
      showToast(`Exported ${filteredSubscriptions.length} filtered subscriptions CSV.`);
    }
  };

  const handleSortChange = (field: SubscriptionSortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  // Tabs Definition (11 Sections)
  const tabs: Array<{
    key: SubscriptionTabKey;
    label: string;
    icon: React.ComponentType<{ size: number; color?: string }>;
    badge?: number;
  }> = [
    { key: "overview", label: "Overview", icon: Crown },
    { key: "plans", label: "Plans & Pricing", icon: Layers, badge: plans.filter((p) => p.status === "active").length },
    { key: "subscriptions", label: "All Subscriptions", icon: List, badge: subscriptions.length },
    { key: "subscribers", label: "Subscribers", icon: Users, badge: subscriberDirectory.length },
    { key: "payments", label: "Payments & Transactions", icon: CreditCard },
    { key: "renewals", label: "Renewals & Cancellations", icon: RefreshCw, badge: kpis.pendingRenewalsCount },
    { key: "failed_payments", label: "Failed Payments", icon: AlertTriangle, badge: kpis.failedPaymentsCount },
    { key: "refunds", label: "Refunds & Disputes", icon: RotateCcw, badge: kpis.pendingRefundRequests },
    { key: "entitlements", label: "Entitlements", icon: ShieldCheck },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "audit_history", label: "Audit History", icon: History },
  ];

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Floating Toast */}
      {toastMessage && (
        <div
          className="animate-scale-up"
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            zIndex: 99999,
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderLeft: "4px solid var(--primary)",
            padding: "13px 18px",
            borderRadius: "12px",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "var(--text-main)",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={16} color="var(--primary)" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "2px" }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header & Role Selector */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
              Subscription Management
            </h1>
            <span
              style={{
                padding: "3px 10px",
                borderRadius: "999px",
                backgroundColor: "var(--bg-active)",
                color: "var(--primary)",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              NobleBond Premium Operations
            </span>
          </div>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", margin: "4px 0 0" }}>
            Manage Premium tiers, subscriber lifecycles, renewals, payment integrity, entitlements, and MRR/ARR analytics.
          </p>
        </div>

        {/* Global Action Strip */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {/* Permission Role Switcher */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 10px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              fontSize: "12px",
            }}
            title="Switch Admin Role to test permission-aware controls"
          >
            <Shield size={13} color="var(--primary)" />
            <select
              value={adminRole}
              onChange={(e) => {
                const r = e.target.value as AdminRoleKey;
                setAdminRole(r);
                showToast(`Switched RBAC permission preview to ${ADMIN_ROLE_PERMISSIONS[r].roleLabel}`);
              }}
              style={{
                border: "none",
                background: "transparent",
                color: "var(--text-main)",
                fontSize: "12px",
                fontWeight: 600,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="super_admin">Role: Super Admin</option>
              <option value="billing_operations_lead">Role: Billing Lead</option>
              <option value="customer_support_agent">Role: Support Specialist</option>
              <option value="finance_auditor">Role: Finance Read-Only</option>
            </select>
          </div>

          {permissions.canGrantComplimentary && (
            <button
              type="button"
              onClick={() => {
                setComplimentaryTarget(null);
                setIsComplimentaryModalOpen(true);
              }}
              style={{
                padding: "9px 14px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "#FFFFFF",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <Gift size={14} /> Grant Complimentary VIP
            </button>
          )}

          <button
            type="button"
            onClick={handleGlobalExport}
            style={{
              padding: "9px 13px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Download size={14} /> Export CSV
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              padding: "9px 13px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : undefined} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            type="button"
            onClick={handleRequestResetDemo}
            style={{
              padding: "9px 12px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-muted)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            title="Reset demonstration subscription state"
          >
            <RotateCcw size={13} color="var(--status-error)" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Product Boundary Enforcement Banner */}
      <ProductSeparationBanner />

      {/* Global Date Filter Bar */}
      <div
        style={{
          padding: "10px 16px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <Calendar size={14} color="var(--primary)" />
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-main)" }}>Date Period:</span>
          {(
            [
              { id: "all", label: "All Time" },
              { id: "today", label: "Today" },
              { id: "7d", label: "Last 7 Days" },
              { id: "30d", label: "Last 30 Days" },
              { id: "90d", label: "Last 90 Days" },
              { id: "custom", label: "Custom Range" },
            ] as const
          ).map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setGlobalDateRange(d.id);
                setCurrentPage(1);
              }}
              style={{
                padding: "5px 11px",
                borderRadius: "8px",
                border: globalDateRange === d.id ? "1px solid var(--primary)" : "1px solid var(--border)",
                backgroundColor: globalDateRange === d.id ? "var(--bg-active)" : "var(--bg-surface)",
                color: globalDateRange === d.id ? "var(--primary)" : "var(--text-secondary)",
                fontSize: "11.5px",
                fontWeight: globalDateRange === d.id ? 700 : 500,
                cursor: "pointer",
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        {globalDateRange === "custom" && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              style={{
                padding: "5px 8px",
                borderRadius: "7px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "12px",
              }}
            />
            <span style={{ color: "var(--text-muted)" }}>to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              style={{
                padding: "5px 8px",
                borderRadius: "7px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "12px",
              }}
            />
          </div>
        )}
      </div>

      {/* KPI Header */}
      <SubscriptionStatsHeader
        kpis={kpis}
        activeTab={activeTab}
        canViewFinancialAnalytics={permissions.canViewFinancialAnalytics}
        onNavigateFilter={handleNavigateFilter}
      />

      {/* 11-Section Navigation Tab Strip */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          borderBottom: "1px solid var(--border)",
          overflowX: "auto",
          paddingBottom: "2px",
        }}
      >
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => handleTabChange(t.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "10px 13px",
                border: "none",
                borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                backgroundColor: "transparent",
                color: isActive ? "var(--primary)" : "var(--text-secondary)",
                fontSize: "12.5px",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={14} color={isActive ? "var(--primary)" : "currentColor"} />
              <span>{t.label}</span>
              {typeof t.badge === "number" && t.badge > 0 && (
                <span
                  style={{
                    padding: "1px 6px",
                    borderRadius: "10px",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    backgroundColor: isActive ? "var(--primary)" : "var(--bg-surface-elevated)",
                    color: isActive ? "#FFFFFF" : "var(--text-muted)",
                  }}
                >
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search, Quick Pills & Drawer Toolbar for All Subscriptions Tab */}
      {activeTab === "subscriptions" && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface-elevated)",
                flex: "1 1 260px",
                minWidth: "220px",
              }}
            >
              <Search size={14} color="var(--text-muted)" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
                  setCurrentPage(1);
                }}
                placeholder="Search Subscription ID, Name, @Username, Email, Provider Ref..."
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  color: "var(--text-main)",
                  fontSize: "12.5px",
                  width: "100%",
                }}
              />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: "" }))}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <X size={12} color="var(--text-muted)" />
                </button>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(true)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  border: activeFilterCount > 0 ? "1px solid var(--primary)" : "1px solid var(--border)",
                  backgroundColor: activeFilterCount > 0 ? "var(--bg-active)" : "var(--bg-surface)",
                  color: activeFilterCount > 0 ? "var(--primary)" : "var(--text-main)",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Filter size={13} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      backgroundColor: "var(--primary)",
                      color: "#FFFFFF",
                      fontSize: "10px",
                      fontWeight: 800,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setFilters(DEFAULT_FILTERS);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: "8px 11px",
                    borderRadius: "9px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-surface)",
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Clear
                </button>
              )}

              <div
                style={{
                  display: "flex",
                  backgroundColor: "var(--bg-surface-elevated)",
                  padding: "3px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  style={{
                    padding: "5px 8px",
                    borderRadius: "7px",
                    border: "none",
                    backgroundColor: viewMode === "table" ? "var(--bg-card)" : "transparent",
                    color: viewMode === "table" ? "var(--text-main)" : "var(--text-muted)",
                    cursor: "pointer",
                  }}
                  title="Table View"
                >
                  <List size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  style={{
                    padding: "5px 8px",
                    borderRadius: "7px",
                    border: "none",
                    backgroundColor: viewMode === "cards" ? "var(--bg-card)" : "transparent",
                    color: viewMode === "cards" ? "var(--text-main)" : "var(--text-muted)",
                    cursor: "pointer",
                  }}
                  title="Card View"
                >
                  <LayoutGrid size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Status Filter Pills */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {(
              [
                { id: "all", label: "All States" },
                { id: "active", label: "Active" },
                { id: "past_due", label: "Past Due" },
                { id: "cancellation_scheduled", label: "Cancels at Period End" },
                { id: "cancelled", label: "Cancelled" },
                { id: "expired", label: "Expired" },
                { id: "refunded", label: "Refunded" },
              ] as const
            ).map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, status: pill.id }));
                  setCurrentPage(1);
                }}
                style={{
                  padding: "5px 10px",
                  borderRadius: "999px",
                  border: filters.status === pill.id ? "1px solid var(--primary)" : "1px solid var(--border)",
                  backgroundColor: filters.status === pill.id ? "var(--bg-active)" : "var(--bg-surface)",
                  color: filters.status === pill.id ? "var(--primary)" : "var(--text-secondary)",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Section Routing */}
      {isRefreshing ? (
        <SubscriptionSkeletonLoader
          variant={activeTab === "overview" ? "overview" : activeTab === "plans" ? "plans" : "table"}
        />
      ) : (
        <>
          {activeTab === "overview" && (
            <SubscriptionOverviewSection
              plans={plans}
              subscriptions={subscriptions}
              transactions={transactions}
              refunds={refunds}
              kpis={kpis}
              dateRange={globalDateRange}
              customStart={customStartDate}
              customEnd={customEndDate}
              canViewFinancialAnalytics={permissions.canViewFinancialAnalytics}
              onSelectSubscription={(sub) => setInspectingSub(sub)}
              onSelectTransaction={(tx) => setInspectingTransaction(tx)}
              onNavigateTab={handleTabChange}
            />
          )}

          {activeTab === "plans" && (
            <PlansPricingSection
              plans={plans}
              subscriptions={subscriptions}
              stagedPromos={stagedPromos}
              permissions={permissions}
              onCreatePlan={() => {
                setEditingPlan(null);
                setIsPlanFormOpen(true);
              }}
              onEditPlan={(plan) => {
                setEditingPlan(plan);
                setIsPlanFormOpen(true);
              }}
              onInspectPlan={(plan, initialPreview) =>
                setPreviewingPlan({ plan, mode: initialPreview ? "preview" : "specs" })
              }
              onChangePlanStatus={handleRequestPlanStatusChange}
              onSaveStagedPromo={handleSaveStagedPromo}
            />
          )}

          {activeTab === "subscriptions" && (
            <>
              {viewMode === "table" ? (
                <AllSubscriptionsTable
                  subscriptions={paginatedSubscriptions}
                  sort={sort}
                  onSortChange={handleSortChange}
                  onOpenSubscription={(sub) => setInspectingSub(sub)}
                  onOpenUserProfile={handleOpenUserManagement}
                  onClearFilters={() => {
                    setFilters(DEFAULT_FILTERS);
                    setCurrentPage(1);
                  }}
                />
              ) : (
                <SubscriptionMobileCards
                  subscriptions={paginatedSubscriptions}
                  onOpenSubscription={(sub) => setInspectingSub(sub)}
                  onOpenUserProfile={handleOpenUserManagement}
                />
              )}

              {filteredSubscriptions.length > 0 && (
                <SubscriptionPagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalItems={filteredSubscriptions.length}
                  onPageChange={(page) => setCurrentPage(page)}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                />
              )}
            </>
          )}

          {activeTab === "subscribers" && (
            <SubscribersSection
              subscribers={subscriberDirectory}
              permissions={permissions}
              onOpenSubscriber={(sub) => setInspectingSubscriber(sub)}
              onOpenUserProfile={handleOpenUserManagement}
              onGrantComplimentary={(sub) => {
                setComplimentaryTarget(sub);
                setIsComplimentaryModalOpen(true);
              }}
            />
          )}

          {activeTab === "payments" && (
            <PaymentsTransactionsSection
              transactions={transactions}
              permissions={permissions}
              onInspectTransaction={(tx) => setInspectingTransaction(tx)}
              onExportCsv={(filtered) => {
                exportTransactionsCsv(filtered);
                showToast(`Exported ${filtered.length} billing transactions CSV.`);
              }}
            />
          )}

          {activeTab === "renewals" && (
            <RenewalsCancellationsSection
              subscriptions={subscriptions}
              transactions={transactions}
              onInspectSubscription={(sub) => setInspectingSub(sub)}
              onInspectTransaction={(tx) => setInspectingTransaction(tx)}
            />
          )}

          {activeTab === "failed_payments" && (
            <FailedPaymentsSection
              transactions={transactions}
              subscriptions={subscriptions}
              onInspectFailedPayment={(tx) => setInspectingTransaction(tx)}
              onRefreshPaymentStatus={handleRefreshPaymentStatus}
              onInspectSubscription={(sub) => setInspectingSub(sub)}
              onOpenUserProfile={handleOpenUserManagement}
            />
          )}

          {activeTab === "refunds" && (
            <RefundsDisputesSection
              records={refunds}
              permissions={permissions}
              onInspectRefund={(rec) => setInspectingRefund(rec)}
              onExportCsv={(filtered) => {
                exportRefundsCsv(filtered);
                showToast(`Exported ${filtered.length} refund/dispute records CSV.`);
              }}
            />
          )}

          {activeTab === "entitlements" && (
            <SubscriptionEntitlementsSection
              entitlements={entitlements}
              plans={plans}
              subscriptions={subscriptions}
              permissions={permissions}
              onToggleEntitlementPlan={handleToggleEntitlementPlan}
            />
          )}

          {activeTab === "analytics" && (
            <SubscriptionAnalyticsSection
              plans={plans}
              subscriptions={subscriptions}
              transactions={transactions}
              kpis={kpis}
              dateRange={globalDateRange}
              customStart={customStartDate}
              customEnd={customEndDate}
              permissions={permissions}
            />
          )}

          {activeTab === "audit_history" && (
            <SubscriptionAuditHistorySection
              events={auditHistory}
              permissions={permissions}
              onExportCsv={(filtered) => {
                exportAuditHistoryCsv(filtered);
                showToast(`Exported ${filtered.length} audit log records CSV.`);
              }}
            />
          )}
        </>
      )}

      {/* Modals & Drawers */}
      <SubscriptionDetailDrawer
        isOpen={Boolean(inspectingSub)}
        onClose={() => setInspectingSub(null)}
        subscription={inspectingSub}
        transactions={transactions}
        entitlements={entitlements}
        permissions={permissions}
        onOpenUserProfile={handleOpenUserManagement}
        onInspectTransaction={(tx) => setInspectingTransaction(tx)}
        onRequestCancellationUpdate={handleRequestCancellationUpdate}
        onRevokeComplimentary={handleRequestRevokeComplimentary}
      />

      <SubscriberProfileModal
        isOpen={Boolean(inspectingSubscriber)}
        onClose={() => setInspectingSubscriber(null)}
        subscriber={inspectingSubscriber}
        transactions={transactions}
        refunds={refunds}
        entitlements={entitlements}
        auditHistory={auditHistory}
        permissions={permissions}
        onOpenUserProfile={handleOpenUserManagement}
        onGrantComplimentary={(sub) => {
          setComplimentaryTarget(sub);
          setIsComplimentaryModalOpen(true);
        }}
      />

      {isPlanFormOpen && (
        <PlanFormModal
          isOpen={isPlanFormOpen}
          onClose={() => {
            setIsPlanFormOpen(false);
            setEditingPlan(null);
          }}
          editingPlan={editingPlan}
          existingPlans={plans}
          entitlements={entitlements}
          permissions={permissions}
          onSavePlan={handleSavePlan}
        />
      )}

      {previewingPlan && (
        <PlanDetailPreviewModal
          isOpen={Boolean(previewingPlan)}
          onClose={() => setPreviewingPlan(null)}
          plan={previewingPlan.plan}
          activeSubscriberCount={
            subscriptions.filter(
              (s) =>
                s.planId === previewingPlan.plan.id &&
                (s.status === "active" || s.status === "cancellation_scheduled") &&
                !s.isComplimentary
            ).length
          }
          entitlements={entitlements}
          initialMode={previewingPlan.mode}
        />
      )}

      {isComplimentaryModalOpen && (
        <ComplimentaryAccessModal
          isOpen={isComplimentaryModalOpen}
          onClose={() => {
            setIsComplimentaryModalOpen(false);
            setComplimentaryTarget(null);
          }}
          plans={plans}
          preselectedSubscriber={complimentaryTarget}
          onConfirmGrant={handleConfirmComplimentaryGrant}
        />
      )}

      <TransactionDetailModal
        isOpen={Boolean(inspectingTransaction)}
        onClose={() => setInspectingTransaction(null)}
        transaction={inspectingTransaction}
        onRefreshPaymentStatus={handleRefreshPaymentStatus}
        onOpenUserProfile={handleOpenUserManagement}
      />

      <RefundDisputeModal
        isOpen={Boolean(inspectingRefund)}
        onClose={() => setInspectingRefund(null)}
        record={inspectingRefund}
        permissions={permissions}
        onProcessDecision={handleProcessRefundDecision}
        onAddNote={handleAddRefundNote}
      />

      <SubscriptionFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filterState={filters}
        plans={plans}
        countries={countries}
        onFilterChange={(f) => {
          setFilters(f);
          setCurrentPage(1);
        }}
        onResetFilters={() => {
          setFilters(DEFAULT_FILTERS);
          setCurrentPage(1);
        }}
        totalFiltered={filteredSubscriptions.length}
      />

      {pendingConfirm && (
        <ConfirmSubscriptionActionModal
          isOpen={Boolean(pendingConfirm)}
          onClose={() => setPendingConfirm(null)}
          title={pendingConfirm.title}
          description={pendingConfirm.description}
          confirmLabel={pendingConfirm.confirmLabel}
          variant={pendingConfirm.variant}
          requireReason={pendingConfirm.requireReason}
          onConfirm={pendingConfirm.onExecute}
        />
      )}
    </div>
  );
};
