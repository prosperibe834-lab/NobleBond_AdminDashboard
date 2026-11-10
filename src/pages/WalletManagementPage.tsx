import React, { useState, useMemo } from "react";
import {
  Wallet,
  RefreshCw,
  RotateCcw,
  Shield,
  Calendar,
  AlertTriangle,
  LayoutDashboard,
  Coins,
  Award,
  CreditCard,
  ListOrdered,
  Users,
  Scale,
  Gift,
  CheckSquare,
  BarChart3,
  History,
  CheckCircle2,
  Lock,
} from "lucide-react";
import type {
  ConnectionPointsRedemptionRecord,
  ConnectionPointsRewardRecord,
  FinancialRoleKey,
  GiftCoinPurchaseRecord,
  ReconciliationCaseRecord,
  ReconciliationStatus,
  UnifiedFinancialTransaction,
  UserWalletSummary,
  WalletAuditEvent,
  WalletDateRange,
  WalletFilterState,
  WalletTabKey,
} from "../types/walletManagement.types";
import type { LiveGiftTransactionRecord } from "../types/liveManagement.types";
import type { SubscriptionTransactionRecord } from "../types/subscriptionManagement.types";
import {
  buildAllFinancialTransactions,
  buildFinancialAlerts,
  calculateWalletOverviewKPIs,
  executeLedgerAdjustment,
  FINANCIAL_ROLE_PERMISSIONS,
  isWithinWalletDateRange,
  loadConnectionPointsRedemptions,
  loadConnectionPointsRewards,
  loadGiftCoinPurchases,
  loadReconciliationCases,
  loadReferralRewardAmount,
  loadUserWalletSummaries,
  loadWalletAdjustmentTransactions,
  loadWalletAuditHistory,
  processReferralRewardAction,
  resetWalletManagementData,
  updateConfigurableReferralPoints,
  updateReconciliationCaseStatus,
} from "../data/walletManagementDataService";
import { loadLiveGifts } from "../data/liveManagementDataService";
import { loadSubscriptionTransactions } from "../data/subscriptionManagementDataService";
import { Badge } from "../components/common/Badge";
import { WalletSeparationBanner } from "../components/wallet/WalletSeparationBanner";
import { WalletStatsHeader } from "../components/wallet/WalletStatsHeader";
import { WalletSkeletonLoader } from "../components/wallet/WalletSkeletonLoader";
import { WalletOverviewSection } from "../components/wallet/WalletOverviewSection";
import { GiftCoinsManagementSection } from "../components/wallet/GiftCoinsManagementSection";
import { ConnectionPointsManagementSection } from "../components/wallet/ConnectionPointsManagementSection";
import { PremiumTransactionsSection } from "../components/wallet/PremiumTransactionsSection";
import { AllTransactionsSection } from "../components/wallet/AllTransactionsSection";
import { UserWalletsSection } from "../components/wallet/UserWalletsSection";
import {
  FinancialAdjustmentsSection,
  type PendingAdjustmentDraft,
} from "../components/wallet/FinancialAdjustmentsSection";
import { RewardsIssuanceSection } from "../components/wallet/RewardsIssuanceSection";
import { ReconciliationSection } from "../components/wallet/ReconciliationSection";
import { WalletAnalyticsSection } from "../components/wallet/WalletAnalyticsSection";
import { WalletAuditHistorySection } from "../components/wallet/WalletAuditHistorySection";
import { TransactionInspectionDrawer } from "../components/wallet/modals/TransactionInspectionDrawer";
import { UserWalletDetailDrawer } from "../components/wallet/modals/UserWalletDetailDrawer";
import { AdjustmentConfirmModal } from "../components/wallet/modals/AdjustmentConfirmModal";
import { ReconciliationDetailModal } from "../components/wallet/modals/ReconciliationDetailModal";
import { ConfirmWalletResetModal } from "../components/wallet/modals/ConfirmWalletResetModal";

const DEFAULT_FILTERS: WalletFilterState = {
  searchQuery: "",
  category: "all",
  transactionType: "all",
  status: "all",
  currency: "all",
  dateRange: "all",
};

interface WalletSnapshotData {
  purchases: GiftCoinPurchaseRecord[];
  rewards: ConnectionPointsRewardRecord[];
  redemptions: ConnectionPointsRedemptionRecord[];
  liveGifts: LiveGiftTransactionRecord[];
  subscriptionTxs: SubscriptionTransactionRecord[];
  adjustments: UnifiedFinancialTransaction[];
  allTransactions: UnifiedFinancialTransaction[];
  wallets: UserWalletSummary[];
  reconciliationCases: ReconciliationCaseRecord[];
  auditHistory: WalletAuditEvent[];
  referralPointsAmount: number;
}

function readWalletSnapshot(): WalletSnapshotData {
  return {
    purchases: loadGiftCoinPurchases(),
    rewards: loadConnectionPointsRewards(),
    redemptions: loadConnectionPointsRedemptions(),
    liveGifts: loadLiveGifts(),
    subscriptionTxs: loadSubscriptionTransactions(),
    adjustments: loadWalletAdjustmentTransactions(),
    allTransactions: buildAllFinancialTransactions(),
    wallets: loadUserWalletSummaries(),
    reconciliationCases: loadReconciliationCases(),
    auditHistory: loadWalletAuditHistory(),
    referralPointsAmount: loadReferralRewardAmount(),
  };
}

export const WalletManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WalletTabKey>("overview");
  const [roleKey, setRoleKey] = useState<FinancialRoleKey>("super_admin");
  const [dateRange, setDateRange] = useState<WalletDateRange>("all");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [filters, setFilters] = useState<WalletFilterState>(DEFAULT_FILTERS);

  const [snapshot, setSnapshot] = useState<WalletSnapshotData>(() =>
    readWalletSnapshot()
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasErrorState, setHasErrorState] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals & Drawers state
  const [inspectedTx, setInspectedTx] =
    useState<UnifiedFinancialTransaction | null>(null);
  const [inspectedWallet, setInspectedWallet] =
    useState<UserWalletSummary | null>(null);
  const [pendingAdjustment, setPendingAdjustment] =
    useState<PendingAdjustmentDraft | null>(null);
  const [preselectedAdjustmentUserId, setPreselectedAdjustmentUserId] =
    useState<string | undefined>(undefined);
  const [activeRecCase, setActiveRecCase] =
    useState<ReconciliationCaseRecord | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState<boolean>(false);

  const permissions = FINANCIAL_ROLE_PERMISSIONS[roleKey];
  const adminActorLabel = `Elena Vance (${permissions.roleLabel})`;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 4200);
  };

  const reloadData = (withSkeleton = true) => {
    setHasErrorState(false);
    if (withSkeleton) {
      setIsLoading(true);
      setTimeout(() => {
        setSnapshot(readWalletSnapshot());
        setIsLoading(false);
      }, 300);
    } else {
      setSnapshot(readWalletSnapshot());
    }
  };

  const kpis = calculateWalletOverviewKPIs(dateRange, customStart, customEnd);

  const alerts = buildFinancialAlerts();

  const dateFilteredTransactions = useMemo(() => {
    return snapshot.allTransactions.filter((t) =>
      isWithinWalletDateRange(t.timestamp, dateRange, customStart, customEnd)
    );
  }, [snapshot.allTransactions, dateRange, customStart, customEnd]);

  const dateFilteredPurchases = useMemo(
    () =>
      snapshot.purchases.filter((p) =>
        isWithinWalletDateRange(p.timestamp, dateRange, customStart, customEnd)
      ),
    [snapshot.purchases, dateRange, customStart, customEnd]
  );

  const dateFilteredLiveGifts = useMemo(
    () =>
      snapshot.liveGifts.filter((g) =>
        isWithinWalletDateRange(g.timestamp, dateRange, customStart, customEnd)
      ),
    [snapshot.liveGifts, dateRange, customStart, customEnd]
  );

  const dateFilteredRedemptions = useMemo(
    () =>
      snapshot.redemptions.filter((r) =>
        isWithinWalletDateRange(r.timestamp, dateRange, customStart, customEnd)
      ),
    [snapshot.redemptions, dateRange, customStart, customEnd]
  );

  const dateFilteredSubscriptions = useMemo(
    () =>
      snapshot.subscriptionTxs.filter((s) =>
        isWithinWalletDateRange(s.timestamp, dateRange, customStart, customEnd)
      ),
    [snapshot.subscriptionTxs, dateRange, customStart, customEnd]
  );

  const tabs: Array<{
    key: WalletTabKey;
    label: string;
    icon: React.ReactNode;
    allowed: boolean;
  }> = [
    {
      key: "overview",
      label: "Overview",
      icon: <LayoutDashboard size={15} />,
      allowed: permissions.canViewOverview,
    },
    {
      key: "gift_coins",
      label: "Gift Coins",
      icon: <Coins size={15} />,
      allowed: permissions.canViewGiftCoins,
    },
    {
      key: "connection_points",
      label: "Connection Points",
      icon: <Award size={15} />,
      allowed: permissions.canViewConnectionPoints,
    },
    {
      key: "premium_transactions",
      label: "Premium Billing",
      icon: <CreditCard size={15} />,
      allowed: permissions.canViewSubscriptions,
    },
    {
      key: "all_transactions",
      label: "All Transactions",
      icon: <ListOrdered size={15} />,
      allowed: permissions.canViewOverview,
    },
    {
      key: "user_wallets",
      label: "User Wallets",
      icon: <Users size={15} />,
      allowed: permissions.canViewUserWallets,
    },
    {
      key: "adjustments",
      label: "Adjustments",
      icon: <Scale size={15} />,
      allowed:
        permissions.canApproveAdjustments || permissions.canReverseTransactions,
    },
    {
      key: "rewards_issuance",
      label: "Rewards Queue",
      icon: <Gift size={15} />,
      allowed: permissions.canViewConnectionPoints,
    },
    {
      key: "reconciliation",
      label: "Reconciliation",
      icon: <CheckSquare size={15} />,
      allowed: permissions.canReviewReconciliation,
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: <BarChart3 size={15} />,
      allowed: permissions.canViewAnalytics,
    },
    {
      key: "audit_history",
      label: "Audit History",
      icon: <History size={15} />,
      allowed: permissions.canViewAuditHistory,
    },
  ];

  const activeTabAllowed =
    tabs.find((t) => t.key === activeTab)?.allowed ?? true;

  const handleConfirmAdjustment = () => {
    if (!pendingAdjustment) return;
    const res = executeLedgerAdjustment(
      {
        userId: pendingAdjustment.user.userId,
        walletType: pendingAdjustment.walletType,
        adjustmentType: pendingAdjustment.adjustmentType,
        quantity: pendingAdjustment.quantity,
        reason: pendingAdjustment.reason,
        relatedReference: pendingAdjustment.relatedReference,
      },
      adminActorLabel,
      permissions.roleLabel
    );
    if (res.success) {
      showToast(
        `Ledger adjustment confirmed for ${pendingAdjustment.user.name} (${
          pendingAdjustment.walletType === "gift_coins"
            ? `${pendingAdjustment.quantity} Coins`
            : `${pendingAdjustment.quantity} Pts`
        }).`
      );
      setPendingAdjustment(null);
      reloadData(false);
    } else {
      showToast(res.error || "Adjustment rejected by ledger validation.");
      setPendingAdjustment(null);
    }
  };

  const handleProcessReward = (
    rewardId: string,
    action: "issue" | "reject" | "reverse",
    notes: string
  ) => {
    const res = processReferralRewardAction(
      rewardId,
      action,
      notes,
      adminActorLabel,
      permissions.roleLabel
    );
    if (res.success) {
      showToast(
        `Reward ${rewardId} ${
          action === "issue"
            ? "issued & credited to referrer wallet"
            : action === "reject"
            ? "rejected and logged"
            : "reversed from referrer wallet"
        }.`
      );
      reloadData(false);
    }
    return { success: res.success, error: res.error };
  };

  const handleSaveReconciliation = (
    caseId: string,
    newStatus: ReconciliationStatus,
    notes: string
  ) => {
    updateReconciliationCaseStatus(
      caseId,
      newStatus,
      notes,
      adminActorLabel,
      permissions.roleLabel
    );
    showToast(`Reconciliation case ${caseId} updated to ${newStatus.replace("_", " ")}.`);
    setActiveRecCase(null);
    reloadData(false);
  };

  const handleUpdateReferralPoints = (points: number, reason: string) => {
    updateConfigurableReferralPoints(
      points,
      reason,
      adminActorLabel,
      permissions.roleLabel
    );
    showToast(`Referral incentive rate updated to ${points} Connection Points.`);
    reloadData(false);
  };

  const handleOpenUserWalletById = (userId: string) => {
    const found = snapshot.wallets.find((w) => w.userId === userId);
    if (found) {
      setInspectedWallet(found);
    } else {
      showToast(`User wallet record for ${userId} was not found in active directory.`);
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        padding: "22px",
        maxWidth: "1520px",
        margin: "0 auto",
        color: "var(--text-main)",
      }}
    >
      {/* Page Top Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "14px",
          marginBottom: "18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "var(--primary-glow)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(225, 29, 72, 0.25)",
            }}
          >
            <Wallet size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <h1 style={{ margin: 0, fontSize: "1.42rem", fontWeight: 800, color: "var(--text-main)" }}>
                Wallet & Financial Operations Centre
              </h1>
              <Badge variant="primary" size="sm">Enterprise Fintech</Badge>
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Separated ledger operations for Gift Coins, Connection Points, and Premium Subscription billing
            </div>
          </div>
        </div>

        {/* Controls Bar: Role Preview, Date Window, Refresh, Simulate Error, Reset */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          {/* RBAC Preview Switcher */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "6px 10px",
            }}
          >
            <Shield size={14} style={{ color: "var(--primary)" }} />
            <select
              aria-label="RBAC Role Preview"
              value={roleKey}
              onChange={(e) => setRoleKey(e.target.value as FinancialRoleKey)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-main)",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="super_admin">Role: Super Admin</option>
              <option value="financial_controller">Role: Financial Controller</option>
              <option value="rewards_manager">Role: Rewards Manager</option>
              <option value="compliance_auditor">Role: Compliance Auditor</option>
            </select>
          </div>

          {/* Date Range Selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "6px 10px",
            }}
          >
            <Calendar size={14} style={{ color: "var(--text-muted)" }} />
            <select
              aria-label="Date Range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as WalletDateRange)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-main)",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRange === "custom" && (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  color: "var(--text-main)",
                  borderRadius: "8px",
                  padding: "6px 8px",
                  fontSize: "0.78rem",
                }}
              />
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  color: "var(--text-main)",
                  borderRadius: "8px",
                  padding: "6px 8px",
                  fontSize: "0.78rem",
                }}
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => reloadData(true)}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              borderRadius: "10px",
              padding: "8px 11px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setHasErrorState((prev) => !prev)}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: hasErrorState ? "var(--status-error)" : "var(--text-secondary)",
              borderRadius: "10px",
              padding: "8px 11px",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
            title="Toggle simulated ledger sync fallback banner"
          >
            {hasErrorState ? "Clear Fault" : "Test Fallback"}
          </button>

          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              borderRadius: "10px",
              padding: "8px 11px",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback Banner */}
      {toastMsg && (
        <div
          style={{
            marginBottom: "16px",
            padding: "11px 15px",
            borderRadius: "12px",
            background: "var(--status-success-bg)",
            border: "1px solid var(--status-success)",
            color: "var(--status-success)",
            fontSize: "0.83rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle2 size={16} />
            <span>{toastMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            style={{ background: "transparent", border: "none", color: "var(--status-success)", fontWeight: 700, cursor: "pointer" }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Three-Ledger Separation Integrity Notice */}
      <WalletSeparationBanner />

      {/* Horizontal Navigation Tabs (11 Structured Financial Sections) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "7px",
          padding: "8px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          marginBottom: "18px",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                border: isActive
                  ? "1px solid var(--primary)"
                  : "1px solid transparent",
                background: isActive
                  ? "var(--primary-glow)"
                  : "transparent",
                color: !tab.allowed
                  ? "var(--text-muted)"
                  : isActive
                  ? "var(--primary)"
                  : "var(--text-secondary)",
                fontSize: "0.8rem",
                fontWeight: isActive ? 700 : 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                opacity: tab.allowed ? 1 : 0.65,
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {!tab.allowed && <Lock size={11} />}
            </button>
          );
        })}
      </div>

      {/* Main Content Body (Error Fallback | Skeleton Loader | Section Content) */}
      {hasErrorState ? (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--status-error)",
            borderRadius: "16px",
            padding: "42px 20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <AlertTriangle size={34} style={{ color: "var(--status-error)" }} />
          <h3 style={{ margin: 0, fontSize: "1.08rem", color: "var(--text-main)" }}>
            Simulated Financial Ledger Sync Interruption
          </h3>
          <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--text-secondary)", maxWidth: "480px" }}>
            Connection to the local financial snapshot was paused for resilience verification. Click retry to restore live state and recalculate separated KPIs.
          </p>
          <button
            type="button"
            onClick={() => reloadData(true)}
            style={{
              marginTop: "6px",
              padding: "9px 18px",
              borderRadius: "10px",
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              fontSize: "0.84rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <RefreshCw size={14} />
            <span>Retry Ledger Sync</span>
          </button>
        </div>
      ) : isLoading ? (
        <WalletSkeletonLoader />
      ) : !activeTabAllowed ? (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "42px 20px",
            textAlign: "center",
          }}
        >
          <Lock size={30} style={{ color: "var(--status-warning)", marginBottom: "8px" }} />
          <h3 style={{ margin: "0 0 6px 0", fontSize: "1.05rem", color: "var(--text-main)" }}>
            Access Restricted by Role ({permissions.roleLabel})
          </h3>
          <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--text-secondary)" }}>
            Switch RBAC preview role above to Super Admin or an authorized financial role to inspect or modify this section.
          </p>
        </div>
      ) : (
        <>
          {(activeTab === "overview" || activeTab === "analytics") && (
            <WalletStatsHeader kpis={kpis} onNavigateTab={setActiveTab} />
          )}

          {activeTab === "overview" && (
            <WalletOverviewSection
              kpis={kpis}
              recentTransactions={dateFilteredTransactions}
              giftPurchases={dateFilteredPurchases}
              pointsRedemptions={dateFilteredRedemptions}
              alerts={alerts}
              onNavigateTab={setActiveTab}
              onInspectTransaction={setInspectedTx}
            />
          )}

          {activeTab === "gift_coins" && (
            <GiftCoinsManagementSection
              kpis={kpis}
              purchases={dateFilteredPurchases}
              liveGifts={dateFilteredLiveGifts}
              onInspectTransaction={setInspectedTx}
              onInspectUserWallet={handleOpenUserWalletById}
            />
          )}

          {activeTab === "connection_points" && (
            <ConnectionPointsManagementSection
              kpis={kpis}
              rewards={snapshot.rewards}
              redemptions={dateFilteredRedemptions}
              referralPointsAmount={snapshot.referralPointsAmount}
              canUpdateConfig={permissions.canIssueConnectionPoints}
              onUpdateReferralPoints={handleUpdateReferralPoints}
              onNavigateTab={setActiveTab}
              onInspectTransaction={setInspectedTx}
            />
          )}

          {activeTab === "premium_transactions" && (
            <PremiumTransactionsSection
              kpis={kpis}
              subscriptionTxs={dateFilteredSubscriptions}
              onInspectTransaction={setInspectedTx}
            />
          )}

          {activeTab === "all_transactions" && (
            <AllTransactionsSection
              transactions={dateFilteredTransactions}
              filters={filters}
              onUpdateFilters={setFilters}
              onResetFilters={() => setFilters(DEFAULT_FILTERS)}
              onInspectTransaction={setInspectedTx}
              onExportToast={showToast}
            />
          )}

          {activeTab === "user_wallets" && (
            <UserWalletsSection
              wallets={snapshot.wallets}
              onInspectWallet={setInspectedWallet}
              onExportToast={showToast}
            />
          )}

          {activeTab === "adjustments" && (
            <FinancialAdjustmentsSection
              key={preselectedAdjustmentUserId || "adj-default"}
              wallets={snapshot.wallets}
              adjustmentHistory={snapshot.adjustments}
              permissions={permissions}
              preselectedUserId={preselectedAdjustmentUserId}
              onRequestConfirmAdjustment={setPendingAdjustment}
              onInspectTransaction={setInspectedTx}
            />
          )}

          {activeTab === "rewards_issuance" && (
            <RewardsIssuanceSection
              rewards={snapshot.rewards}
              permissions={permissions}
              onProcessReward={handleProcessReward}
            />
          )}

          {activeTab === "reconciliation" && (
            <ReconciliationSection
              cases={snapshot.reconciliationCases}
              permissions={permissions}
              onSelectCase={setActiveRecCase}
            />
          )}

          {activeTab === "analytics" && (
            <WalletAnalyticsSection
              dateRange={dateRange}
              kpis={kpis}
              purchases={dateFilteredPurchases}
              liveGifts={dateFilteredLiveGifts}
              redemptions={dateFilteredRedemptions}
              subscriptionTxs={dateFilteredSubscriptions}
            />
          )}

          {activeTab === "audit_history" && (
            <WalletAuditHistorySection
              events={snapshot.auditHistory}
              onExportToast={showToast}
            />
          )}
        </>
      )}

      {/* Drawers & Confirmation Modals */}
      <TransactionInspectionDrawer
        transaction={inspectedTx}
        onClose={() => setInspectedTx(null)}
        onOpenUserWallet={handleOpenUserWalletById}
      />

      <UserWalletDetailDrawer
        wallet={inspectedWallet}
        allTransactions={snapshot.allTransactions}
        canAdjust={permissions.canApproveAdjustments}
        onClose={() => setInspectedWallet(null)}
        onJumpToAdjustment={(uid) => {
          setPreselectedAdjustmentUserId(uid);
          setActiveTab("adjustments");
        }}
        onInspectTransaction={setInspectedTx}
      />

      <AdjustmentConfirmModal
        draft={pendingAdjustment}
        onCancel={() => setPendingAdjustment(null)}
        onConfirm={handleConfirmAdjustment}
      />

      {activeRecCase && (
        <ReconciliationDetailModal
          key={activeRecCase.id}
          record={activeRecCase}
          canUpdate={permissions.canReviewReconciliation}
          onClose={() => setActiveRecCase(null)}
          onSaveStatus={handleSaveReconciliation}
        />
      )}

      <ConfirmWalletResetModal
        isOpen={resetModalOpen}
        onCancel={() => setResetModalOpen(false)}
        onConfirmReset={() => {
          resetWalletManagementData();
          setResetModalOpen(false);
          setPreselectedAdjustmentUserId(undefined);
          showToast("Wallet & Financial Management demo ledger restored to clean initial state.");
          reloadData(true);
        }}
      />
    </div>
  );
};

export default WalletManagementPage;
