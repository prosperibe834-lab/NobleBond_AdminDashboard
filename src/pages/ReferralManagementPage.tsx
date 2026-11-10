import React, { useState, useMemo } from "react";
import {
  Share2,
  RefreshCw,
  RotateCcw,
  Shield,
  Calendar,
  AlertTriangle,
  LayoutDashboard,
  ListOrdered,
  CheckCircle2,
  Clock,
  XCircle,
  QrCode,
  Award,
  ShieldAlert,
  Sliders,
  BarChart3,
  History,
  Lock,
} from "lucide-react";
import type {
  AdminReferralRecord,
  FraudAlertCaseRecord,
  FraudReviewStatus,
  ReferralAuditEvent,
  ReferralCodeRecord,
  ReferralDateRange,
  ReferralFilterState,
  ReferralProgramSettings,
  ReferralRejectionReason,
  ReferralRoleKey,
  ReferralTabKey,
} from "../types/referralManagement.types";
import {
  addReferralInvestigationNote,
  calculateReferralOverviewKPIs,
  isWithinReferralDateRange,
  issueReferralRewardPoints,
  loadFraudAlertCases,
  loadReferralAuditHistory,
  loadReferralCodeRecords,
  loadReferralProgramSettings,
  loadReferrals,
  reconsiderRejectedReferral,
  REFERRAL_ROLE_PERMISSIONS,
  rejectReferralRecord,
  resetReferralManagementDemoData,
  reverseReferralRewardPoints,
  toggleReferralCodeStatus,
  updateFraudCaseWorkflow,
  updateReferralProgramConfig,
  validatePendingReferralRecord,
} from "../data/referralManagementDataService";
import { Badge } from "../components/common/Badge";
import { ReferralRulesBanner } from "../components/referral/ReferralRulesBanner";
import { ReferralStatsHeader } from "../components/referral/ReferralStatsHeader";
import { ReferralSkeletonLoader } from "../components/referral/ReferralSkeletonLoader";
import { ReferralOverviewSection } from "../components/referral/ReferralOverviewSection";
import { AllReferralsSection } from "../components/referral/AllReferralsSection";
import { SuccessfulReferralsSection } from "../components/referral/SuccessfulReferralsSection";
import { PendingReferralsSection } from "../components/referral/PendingReferralsSection";
import { RejectedReferralsSection } from "../components/referral/RejectedReferralsSection";
import { ReferralCodesSection } from "../components/referral/ReferralCodesSection";
import { ReferralRewardsSection } from "../components/referral/ReferralRewardsSection";
import { FraudDetectionSection } from "../components/referral/FraudDetectionSection";
import { ReferralSettingsSection } from "../components/referral/ReferralSettingsSection";
import { ReferralAnalyticsSection } from "../components/referral/ReferralAnalyticsSection";
import { ReferralAuditHistorySection } from "../components/referral/ReferralAuditHistorySection";
import { ReferralDetailDrawer } from "../components/referral/modals/ReferralDetailDrawer";
import { ReferralQrModal } from "../components/referral/modals/ReferralQrModal";
import { FraudCaseActionModal } from "../components/referral/modals/FraudCaseActionModal";
import { RejectOrReconsiderModal } from "../components/referral/modals/RejectOrReconsiderModal";
import { ConfirmReferralSettingModal } from "../components/referral/modals/ConfirmReferralSettingModal";

const DEFAULT_FILTERS: ReferralFilterState = {
  searchQuery: "",
  status: "all",
  qualificationStatus: "all",
  rewardStatus: "all",
  verificationMethod: "all",
  fraudReviewFilter: "all",
  referrerId: "all",
  dateRange: "all",
};

interface ReferralSnapshot {
  referrals: AdminReferralRecord[];
  codes: ReferralCodeRecord[];
  fraudCases: FraudAlertCaseRecord[];
  settings: ReferralProgramSettings;
  auditHistory: ReferralAuditEvent[];
}

function readSnapshot(): ReferralSnapshot {
  return {
    referrals: loadReferrals(),
    codes: loadReferralCodeRecords(),
    fraudCases: loadFraudAlertCases(),
    settings: loadReferralProgramSettings(),
    auditHistory: loadReferralAuditHistory(),
  };
}

type PendingConfigAction =
  | { type: "toggle_program"; nextEnabled: boolean }
  | { type: "save_settings"; draft: ReferralProgramSettings; reason: string }
  | { type: "reset_demo" }
  | null;

export const ReferralManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReferralTabKey>("overview");
  const [roleKey, setRoleKey] = useState<ReferralRoleKey>("super_admin");
  const [dateRange, setDateRange] = useState<ReferralDateRange>("all");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [filters, setFilters] = useState<ReferralFilterState>(DEFAULT_FILTERS);

  const [snapshot, setSnapshot] = useState<ReferralSnapshot>(() => readSnapshot());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasErrorState, setHasErrorState] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Drawers & Modals state
  const [inspectedReferralId, setInspectedReferralId] = useState<string | null>(null);
  const [qrCodeRecord, setQrCodeRecord] = useState<ReferralCodeRecord | null>(null);
  const [activeFraudCase, setActiveFraudCase] = useState<FraudAlertCaseRecord | null>(null);
  const [rejectModalState, setRejectModalState] = useState<{
    mode: "reject" | "reconsider";
    referral: AdminReferralRecord;
  } | null>(null);
  const [pendingConfigAction, setPendingConfigAction] = useState<PendingConfigAction>(null);

  const permissions = REFERRAL_ROLE_PERMISSIONS[roleKey];
  const actorName = "Elena Vance";

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
        setSnapshot(readSnapshot());
        setIsLoading(false);
      }, 300);
    } else {
      setSnapshot(readSnapshot());
    }
  };

  const dateScopedReferrals = useMemo(
    () =>
      snapshot.referrals.filter((r) =>
        isWithinReferralDateRange(r.createdAt, dateRange, customStart, customEnd)
      ),
    [snapshot.referrals, dateRange, customStart, customEnd]
  );

  const kpis = useMemo(
    () =>
      calculateReferralOverviewKPIs(
        snapshot.referrals,
        snapshot.fraudCases,
        dateRange,
        customStart,
        customEnd
      ),
    [snapshot.referrals, snapshot.fraudCases, dateRange, customStart, customEnd]
  );

  const inspectedReferral = useMemo(
    () =>
      inspectedReferralId
        ? snapshot.referrals.find((r) => r.id === inspectedReferralId) || null
        : null,
    [inspectedReferralId, snapshot.referrals]
  );

  const tabs: Array<{
    key: ReferralTabKey;
    label: string;
    icon: React.ReactNode;
    allowed: boolean;
  }> = [
    { key: "overview", label: "Overview", icon: <LayoutDashboard size={15} />, allowed: permissions.canViewReferrals },
    { key: "all_referrals", label: "All Referrals", icon: <ListOrdered size={15} />, allowed: permissions.canViewReferrals },
    { key: "successful_referrals", label: "Successful", icon: <CheckCircle2 size={15} />, allowed: permissions.canViewReferrals },
    { key: "pending_referrals", label: "Pending", icon: <Clock size={15} />, allowed: permissions.canViewReferrals },
    { key: "rejected_referrals", label: "Rejected", icon: <XCircle size={15} />, allowed: permissions.canViewReferrals },
    { key: "referral_codes", label: "Codes & Links", icon: <QrCode size={15} />, allowed: permissions.canViewReferralCodes },
    { key: "referral_rewards", label: "Rewards", icon: <Award size={15} />, allowed: permissions.canViewRewardRecords },
    { key: "fraud_detection", label: "Fraud Review", icon: <ShieldAlert size={15} />, allowed: permissions.canViewReferrals },
    { key: "settings", label: "Settings", icon: <Sliders size={15} />, allowed: permissions.canViewReferrals },
    { key: "analytics", label: "Analytics", icon: <BarChart3 size={15} />, allowed: permissions.canViewReferrals },
    { key: "audit_history", label: "Audit History", icon: <History size={15} />, allowed: permissions.canViewAuditHistory },
  ];

  const activeTabAllowed = tabs.find((t) => t.key === activeTab)?.allowed ?? true;

  const handleCardOrTabNavigate = (tab: ReferralTabKey, preset?: string) => {
    if (preset === "all") {
      setFilters(DEFAULT_FILTERS);
    } else if (preset === "pending" || preset === "successful" || preset === "rejected") {
      setFilters({ ...DEFAULT_FILTERS, status: preset });
    }
    setActiveTab(tab);
  };

  const handleValidatePending = (referralId: string) => {
    const res = validatePendingReferralRecord(referralId, actorName, permissions.roleLabel);
    if (res.success) {
      showToast(`Referral ${referralId} qualified cleanly via verified OTP and marked Successful.`);
      reloadData(false);
    }
    return { success: res.success, error: res.error };
  };

  const handleIssueReward = (referralId: string, notes = "Approved Connection Points issuance") => {
    const res = issueReferralRewardPoints(referralId, notes, actorName, permissions.roleLabel);
    if (res.success) {
      showToast(`Credited Connection Points to referrer wallet for ${referralId} (synchronized with Wallet & User Management).`);
      reloadData(false);
    }
    return { success: res.success, error: res.error };
  };

  const handleReverseReward = (referralId: string, reason: string) => {
    const res = reverseReferralRewardPoints(referralId, reason, actorName, permissions.roleLabel);
    if (res.success) {
      showToast(`Reversed issued Connection Points reward for ${referralId} and updated Wallet & User ledgers.`);
      reloadData(false);
    }
    return { success: res.success, error: res.error };
  };

  const handleAssignFraudToMe = (caseId: string) => {
    updateFraudCaseWorkflow(
      caseId,
      { assignedAdmin: `${actorName} (${permissions.roleLabel})`, reviewStatus: "under_investigation" },
      actorName,
      permissions.roleLabel
    );
    showToast(`Assigned investigation ${caseId} to ${actorName} and marked Under Investigation.`);
    reloadData(false);
  };

  const handleSaveFraudWorkflow = (
    caseId: string,
    updates: {
      reviewStatus?: FraudReviewStatus;
      assignedAdmin?: string;
      noteText?: string;
      rejectionReason?: ReferralRejectionReason;
    }
  ) => {
    updateFraudCaseWorkflow(caseId, updates, actorName, permissions.roleLabel);
    showToast(`Fraud case ${caseId} workflow updated cleanly.`);
    setActiveFraudCase(null);
    reloadData(false);
  };

  const handleConfirmSettingAction = (reason: string) => {
    if (!pendingConfigAction) return;
    if (pendingConfigAction.type === "toggle_program") {
      updateReferralProgramConfig(
        { ...snapshot.settings, isEnabled: pendingConfigAction.nextEnabled },
        reason,
        actorName,
        permissions.roleLabel
      );
      showToast(
        `Demonstration referral programme ${
          pendingConfigAction.nextEnabled ? "enabled" : "disabled"
        } cleanly. Historical records preserved.`
      );
      reloadData(false);
    } else if (pendingConfigAction.type === "save_settings") {
      updateReferralProgramConfig(
        pendingConfigAction.draft,
        reason,
        actorName,
        permissions.roleLabel
      );
      showToast(
        `Saved prospective reward configuration (${pendingConfigAction.draft.rewardAmountPoints} Pts effective ${pendingConfigAction.draft.effectiveFromDate}).`
      );
      reloadData(false);
    } else if (pendingConfigAction.type === "reset_demo") {
      resetReferralManagementDemoData();
      setFilters(DEFAULT_FILTERS);
      showToast("Referral Management demonstration data restored cleanly to baseline.");
      reloadData(true);
    }
    setPendingConfigAction(null);
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
      {/* Top Page Header */}
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
            <Share2 size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <h1 style={{ margin: 0, fontSize: "1.42rem", fontWeight: 800, color: "var(--text-main)" }}>
                Referral &amp; Invite Operations Centre
              </h1>
              <Badge variant="primary" size="sm">Invite &amp; Earn</Badge>
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Manage referral attribution, OTP qualification, Connection Points rewards, QR codes, fraud signals &amp; audit logs
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
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
              aria-label="Referral RBAC Role Preview"
              value={roleKey}
              onChange={(e) => setRoleKey(e.target.value as ReferralRoleKey)}
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
              <option value="growth_operations_lead">Role: Growth Operations Lead</option>
              <option value="trust_fraud_analyst">Role: Trust &amp; Fraud Analyst</option>
              <option value="compliance_auditor">Role: Compliance Auditor (Read-Only)</option>
            </select>
          </div>

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
              aria-label="Referral Date Range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as ReferralDateRange)}
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
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-main)", borderRadius: "8px", padding: "6px 8px", fontSize: "0.78rem" }}
              />
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-main)", borderRadius: "8px", padding: "6px 8px", fontSize: "0.78rem" }}
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
          >
            {hasErrorState ? "Clear Fault" : "Test Fallback"}
          </button>

          <button
            type="button"
            onClick={() => setPendingConfigAction({ type: "reset_demo" })}
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

      {/* Toast Notification */}
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
            style={{ background: "none", border: "none", color: "var(--status-success)", fontWeight: 700, cursor: "pointer" }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Business Rules Integrity Banner */}
      <ReferralRulesBanner
        settings={snapshot.settings}
        onOpenSettings={() => setActiveTab("settings")}
      />

      {/* 11 Structured Navigation Tabs */}
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
                border: isActive ? "1px solid var(--primary)" : "1px solid transparent",
                background: isActive ? "var(--primary-glow)" : "transparent",
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

      {/* Main Content */}
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
            Simulated Referral Service Telemetry Interruption
          </h3>
          <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--text-secondary)", maxWidth: "480px" }}>
            Local demonstration attribution sync was interrupted for resilience testing. Click retry to recover records cleanly.
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
            <span>Retry Sync</span>
          </button>
        </div>
      ) : isLoading ? (
        <ReferralSkeletonLoader />
      ) : !activeTabAllowed ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "42px 20px", textAlign: "center" }}>
          <Lock size={30} style={{ color: "var(--status-warning)", marginBottom: "8px" }} />
          <h3 style={{ margin: "0 0 6px 0", color: "var(--text-main)" }}>Section Restricted for Role ({permissions.roleLabel})</h3>
          <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--text-secondary)" }}>
            Switch RBAC preview role above to Super Admin to unlock this area.
          </p>
        </div>
      ) : (
        <>
          {(activeTab === "overview" || activeTab === "analytics") && (
            <ReferralStatsHeader kpis={kpis} onCardNavigate={handleCardOrTabNavigate} />
          )}

          {activeTab === "overview" && (
            <ReferralOverviewSection
              kpis={kpis}
              referrals={dateScopedReferrals}
              fraudCases={snapshot.fraudCases}
              onNavigateTab={handleCardOrTabNavigate}
              onInspectReferral={(r) => setInspectedReferralId(r.id)}
              onSelectFraudCase={(fc) => setActiveFraudCase(fc)}
            />
          )}

          {activeTab === "all_referrals" && (
            <AllReferralsSection
              referrals={dateScopedReferrals}
              fraudCases={snapshot.fraudCases}
              filters={filters}
              onUpdateFilters={setFilters}
              onResetFilters={() => setFilters(DEFAULT_FILTERS)}
              onRefresh={() => reloadData(true)}
              onInspectReferral={(r) => setInspectedReferralId(r.id)}
              onExportToast={showToast}
            />
          )}

          {activeTab === "successful_referrals" && (
            <SuccessfulReferralsSection
              referrals={dateScopedReferrals}
              permissions={permissions}
              onInspectReferral={(r) => setInspectedReferralId(r.id)}
              onIssueReward={(id) => handleIssueReward(id)}
            />
          )}

          {activeTab === "pending_referrals" && (
            <PendingReferralsSection
              referrals={dateScopedReferrals}
              permissions={permissions}
              onInspectReferral={(r) => setInspectedReferralId(r.id)}
              onRunValidationCheck={handleValidatePending}
              onRequestReject={(r) => setRejectModalState({ mode: "reject", referral: r })}
            />
          )}

          {activeTab === "rejected_referrals" && (
            <RejectedReferralsSection
              referrals={dateScopedReferrals}
              permissions={permissions}
              onInspectReferral={(r) => setInspectedReferralId(r.id)}
              onRequestReconsider={(r) => setRejectModalState({ mode: "reconsider", referral: r })}
            />
          )}

          {activeTab === "referral_codes" && (
            <ReferralCodesSection
              codes={snapshot.codes}
              permissions={permissions}
              onOpenQr={setQrCodeRecord}
              onViewUserReferrals={(uid) => {
                setFilters({ ...DEFAULT_FILTERS, referrerId: uid });
                setActiveTab("all_referrals");
              }}
              onToggleCodeStatus={(rec) => {
                const nextStatus = rec.status === "paused" ? "active" : "paused";
                toggleReferralCodeStatus(
                  rec.userId,
                  rec.ownerName,
                  rec.code,
                  nextStatus,
                  `Admin toggled referral code status from ${rec.status} to ${nextStatus}`,
                  actorName,
                  permissions.roleLabel
                );
                showToast(`Referral code ${rec.code} is now ${nextStatus.toUpperCase()}.`);
                reloadData(false);
              }}
              onCopyToast={showToast}
            />
          )}

          {activeTab === "referral_rewards" && (
            <ReferralRewardsSection
              kpis={kpis}
              referrals={dateScopedReferrals}
              permissions={permissions}
              onInspectReferral={(r) => setInspectedReferralId(r.id)}
              onIssueReward={handleIssueReward}
              onReverseReward={handleReverseReward}
              onExportToast={showToast}
            />
          )}

          {activeTab === "fraud_detection" && (
            <FraudDetectionSection
              fraudCases={snapshot.fraudCases}
              permissions={permissions}
              onAssignToMe={handleAssignFraudToMe}
              onOpenFraudModal={setActiveFraudCase}
            />
          )}

          {activeTab === "settings" && (
            <ReferralSettingsSection
              key={`${snapshot.settings.lastUpdatedAt}_${snapshot.settings.rewardAmountPoints}`}
              settings={snapshot.settings}
              permissions={permissions}
              onRequestToggleProgram={(nextEnabled) =>
                setPendingConfigAction({ type: "toggle_program", nextEnabled })
              }
              onRequestSaveSettings={(draft, reason) =>
                setPendingConfigAction({ type: "save_settings", draft, reason })
              }
            />
          )}

          {activeTab === "analytics" && (
            <ReferralAnalyticsSection
              dateRange={dateRange}
              kpis={kpis}
              referrals={dateScopedReferrals}
              fraudCases={snapshot.fraudCases}
            />
          )}

          {activeTab === "audit_history" && (
            <ReferralAuditHistorySection
              events={snapshot.auditHistory}
              onExportToast={showToast}
            />
          )}
        </>
      )}

      {/* Modals & Investigation Drawers */}
      <ReferralDetailDrawer
        referral={inspectedReferral}
        allReferrals={snapshot.referrals}
        permissions={permissions}
        onClose={() => setInspectedReferralId(null)}
        onAddNote={(rid, note) => {
          addReferralInvestigationNote(rid, note, actorName, permissions.roleLabel);
          showToast(`Internal note saved on referral ${rid}.`);
          reloadData(false);
        }}
        onValidatePending={handleValidatePending}
        onIssueReward={handleIssueReward}
        onRequestReject={(r) => setRejectModalState({ mode: "reject", referral: r })}
      />

      <ReferralQrModal
        record={qrCodeRecord}
        onClose={() => setQrCodeRecord(null)}
        onToast={showToast}
      />

      {activeFraudCase && (
        <FraudCaseActionModal
          key={activeFraudCase.id}
          fraudCase={activeFraudCase}
          permissions={permissions}
          onClose={() => setActiveFraudCase(null)}
          onSaveWorkflow={handleSaveFraudWorkflow}
        />
      )}

      {rejectModalState && (
        <RejectOrReconsiderModal
          mode={rejectModalState.mode}
          referral={rejectModalState.referral}
          onCancel={() => setRejectModalState(null)}
          onConfirmReject={(rid, reason, summary) => {
            rejectReferralRecord(rid, reason, summary, actorName, permissions.roleLabel);
            setRejectModalState(null);
            showToast(`Referral ${rid} rejected (${reason}) and logged cleanly.`);
            reloadData(false);
          }}
          onConfirmReconsider={(rid, summary) => {
            const res = reconsiderRejectedReferral(rid, summary, actorName, permissions.roleLabel);
            setRejectModalState(null);
            if (!res.success && res.error) {
              showToast(res.error);
            } else {
              showToast(`Referral ${rid} re-opened to Pending status for OTP/validation review.`);
            }
            reloadData(false);
          }}
        />
      )}

      {pendingConfigAction && (
        <ConfirmReferralSettingModal
          title={
            pendingConfigAction.type === "reset_demo"
              ? "Reset Referral Demo Data?"
              : pendingConfigAction.type === "toggle_program"
              ? `${pendingConfigAction.nextEnabled ? "Enable" : "Disable"} Referral Programme?`
              : "Save Referral Programme Settings?"
          }
          description={
            pendingConfigAction.type === "reset_demo"
              ? "Restores all Referral Management demo records, fraud queue, settings (50 Pts), and referral audit logs to initial baseline."
              : pendingConfigAction.type === "toggle_program"
              ? `${
                  pendingConfigAction.nextEnabled
                    ? "Re-enables demonstration reward issuance."
                    : "Pauses demonstration reward issuance. Existing historical records and already issued Connection Points remain untouched."
                } Note: This updates local demonstration configuration only.`
              : `Updates local demonstration reward to ${pendingConfigAction.draft.rewardAmountPoints} Connection Points (effective ${pendingConfigAction.draft.effectiveFromDate}) and attribution window to ${pendingConfigAction.draft.attributionWindowDays} days prospectively without rewriting historical rewards.`
          }
          confirmLabel={
            pendingConfigAction.type === "reset_demo"
              ? "Confirm Reset"
              : pendingConfigAction.type === "toggle_program"
              ? pendingConfigAction.nextEnabled
                ? "Enable Programme"
                : "Disable Programme"
              : "Confirm & Save"
          }
          requireReasonInput={pendingConfigAction.type === "toggle_program"}
          defaultReason={
            pendingConfigAction.type === "save_settings"
              ? pendingConfigAction.reason
              : ""
          }
          isDanger={
            pendingConfigAction.type === "reset_demo" ||
            (pendingConfigAction.type === "toggle_program" && !pendingConfigAction.nextEnabled)
          }
          onCancel={() => setPendingConfigAction(null)}
          onConfirm={(r) =>
            handleConfirmSettingAction(
              pendingConfigAction.type === "save_settings"
                ? pendingConfigAction.reason
                : r
            )
          }
        />
      )}
    </div>
  );
};

export default ReferralManagementPage;
