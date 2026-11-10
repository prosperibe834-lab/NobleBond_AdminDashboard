// NobleBond Admin — Apply Moderation Enforcement Action Modal
// Rigorous policy enforcement dialog for warnings, restrictions, suspensions, and bans. Zero emojis.

import React, { useState } from "react";
import {
  X,
  ShieldAlert,
  AlertTriangle,
  Ban,
  Clock,
  FileText,
  Bell,
  CheckCircle2,
  Lock,
  MessageSquareOff,
  VideoOff,
  Trash2,
} from "lucide-react";
import type {
  ModerationActionType,
  UnifiedReportRecord,
} from "../../../types/reportsModeration.types";

interface ApplyModerationActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: UnifiedReportRecord | null;
  targetUser?: {
    id: string;
    name: string;
    avatarUrl?: string;
    email?: string;
  } | null;
  onApplyAction: (params: {
    targetUserId: string;
    targetUserName: string;
    actionType: ModerationActionType;
    reason: string;
    internalNotes: string;
    duration: string;
    expiresAt: string | null;
    notifyUser: boolean;
    linkedReportId?: string;
  }) => void;
}

const ACTION_TYPES: Array<{
  type: ModerationActionType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  severity: "low" | "medium" | "high" | "critical";
}> = [
  {
    type: "formal_warning",
    label: "Formal Policy Warning",
    description: "Issue a documented warning to member inbox with community guidelines reference.",
    icon: AlertTriangle,
    severity: "low",
  },
  {
    type: "content_removed",
    label: "Content Removal",
    description: "Permanently take down the infringing photo, video prompt, or message snippet.",
    icon: Trash2,
    severity: "medium",
  },
  {
    type: "messaging_restricted",
    label: "Messaging Restriction",
    description: "Suspend sending and receiving private chat messages for the specified duration.",
    icon: MessageSquareOff,
    severity: "medium",
  },
  {
    type: "live_restricted",
    label: "Live Streaming Restriction",
    description: "Revoke host broadcasting and live room commenting privileges.",
    icon: VideoOff,
    severity: "medium",
  },
  {
    type: "temporarily_suspended",
    label: "Account Suspension",
    description: "Temporarily freeze account access; user cannot log in or participate.",
    icon: Lock,
    severity: "high",
  },
  {
    type: "permanently_banned",
    label: "Permanent Ban",
    description: "Permanently terminate account, invalidate tokens, and blacklist verified credentials.",
    icon: Ban,
    severity: "critical",
  },
];

const DURATION_OPTIONS = [
  { label: "24 Hours (1 Day)", value: "24h", days: 1 },
  { label: "3 Days", value: "3d", days: 3 },
  { label: "7 Days (1 Week)", value: "7d", days: 7 },
  { label: "14 Days (2 Weeks)", value: "14d", days: 14 },
  { label: "30 Days (1 Month)", value: "30d", days: 30 },
  { label: "Permanent / Indefinite", value: "permanent", days: 0 },
];

const POLICY_REASONS = [
  "Harassment, intimidation, or bullying of members",
  "Identity fraud, catfishing, or impersonation",
  "Financial solicitation, commercial spam, or romance scam",
  "Explicit, graphic, or non-consensual sexual content",
  "Threats of real-world violence or self-harm",
  "Off-platform contact solicitation under false pretenses",
  "Severe violation of NobleBond Terms of Service and Code of Conduct",
];

export const ApplyModerationActionModal: React.FC<ApplyModerationActionModalProps> = ({
  isOpen,
  onClose,
  report,
  targetUser,
  onApplyAction,
}) => {
  const [selectedAction, setSelectedAction] = useState<ModerationActionType>("formal_warning");
  const [selectedDuration, setSelectedDuration] = useState<string>("7d");
  const [selectedReason, setSelectedReason] = useState<string>(POLICY_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>("");
  const [internalNotes, setInternalNotes] = useState<string>("");
  const [notifyUser, setNotifyUser] = useState<boolean>(true);
  const [banConfirmationText, setBanConfirmationText] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const targetId = targetUser?.id || report?.reportedUser?.id || "usr_unknown";
  const targetName = targetUser?.name || report?.reportedUser?.name || "Target User";
  const targetAvatar = targetUser?.avatarUrl || report?.reportedUser?.avatar;

  const isPermanent = selectedAction === "permanently_banned" || selectedDuration === "permanent";
  const canSubmit =
    selectedAction !== "permanently_banned" || banConfirmationText.trim().toUpperCase() === "CONFIRM BAN";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);

    const finalReason = customReason.trim() ? `${selectedReason} - ${customReason.trim()}` : selectedReason;
    const durConfig = DURATION_OPTIONS.find((d) => d.value === selectedDuration);
    let expiresAt: string | null = null;
    if (selectedAction !== "permanently_banned" && durConfig && durConfig.days > 0) {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + durConfig.days);
      expiresAt = expDate.toISOString();
    }

    setTimeout(() => {
      onApplyAction({
        targetUserId: targetId,
        targetUserName: targetName,
        actionType: selectedAction,
        reason: finalReason,
        internalNotes: internalNotes.trim() || "Action applied via NobleBond Trust & Safety Enforcement Console.",
        duration: isPermanent ? "Permanent" : durConfig?.label || selectedDuration,
        expiresAt,
        notifyUser,
        linkedReportId: report?.id,
      });
      setSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-action-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200 dark:border-red-900/50">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 id="apply-action-title" className="text-base font-semibold text-stone-900 dark:text-white">
                Apply Enforcement Action
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Execute disciplinary consequence on reported member account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close enforcement modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target Member Card */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {targetAvatar ? (
                <img
                  src={targetAvatar}
                  alt={targetName}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200 dark:border-stone-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-sm font-semibold text-stone-700 dark:text-stone-300">
                  {targetName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-sm font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                  <span>{targetName}</span>
                  <span className="font-mono text-[11px] font-normal text-stone-500 dark:text-stone-400">
                    ID: {targetId}
                  </span>
                </div>
                {report && (
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Associated Case: <span className="font-mono text-stone-700 dark:text-stone-300 font-medium">{report.id}</span> ({report.category.replace(/_/g, " ")})
                  </p>
                )}
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 font-medium">
              Subject of Enforcement
            </span>
          </div>

          {/* Action Type Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Select Enforcement Action *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ACTION_TYPES.map((action) => {
                const Icon = action.icon;
                const isSelected = selectedAction === action.type;
                return (
                  <button
                    key={action.type}
                    type="button"
                    onClick={() => {
                      setSelectedAction(action.type);
                      if (action.type === "permanently_banned") {
                        setSelectedDuration("permanent");
                      }
                    }}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? "border-red-500 dark:border-red-500 bg-red-50/60 dark:bg-red-950/20 ring-1 ring-red-500"
                        : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 hover:border-stone-300 dark:hover:border-stone-700"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        action.severity === "critical"
                          ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400"
                          : action.severity === "high"
                          ? "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
                          : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-stone-900 dark:text-white">
                        {action.label}
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-0.5 leading-snug">
                        {action.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration Selector */}
          {selectedAction !== "formal_warning" && selectedAction !== "content_removed" && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Restriction Duration *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DURATION_OPTIONS.map((dur) => (
                  <button
                    key={dur.value}
                    type="button"
                    disabled={selectedAction === "permanently_banned" && dur.value !== "permanent"}
                    onClick={() => setSelectedDuration(dur.value)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                      selectedDuration === dur.value
                        ? "border-red-500 bg-red-500 text-white"
                        : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700"
                    } ${
                      selectedAction === "permanently_banned" && dur.value !== "permanent"
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Policy Violation Reason */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Primary Policy Infraction Reason *
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3 py-2.5 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {POLICY_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Specifics */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
              Additional Public Explanation (Sent to Member)
            </label>
            <input
              type="text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="e.g., Specific comment in live room #402 containing prohibited solicitation"
              className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3 py-2 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Internal Audit Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Confidential Staff Justification Note *
            </label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={3}
              placeholder="Provide objective audit justification explaining the decision, reviewed evidence, and policy clause citation..."
              className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 p-3 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>

          {/* Notification Checkbox */}
          <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyUser}
              onChange={(e) => setNotifyUser(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-stone-300 dark:border-stone-600"
            />
            <div className="flex-1 text-xs">
              <div className="font-medium text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-stone-500" />
                Dispatch In-App Notification and Service Email
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                Member will receive official enforcement notification with appeals rights information.
              </div>
            </div>
          </label>

          {/* Permanent Ban Confirmation Gate */}
          {selectedAction === "permanently_banned" && (
            <div className="p-4 rounded-xl border-2 border-red-500/40 bg-red-50 dark:bg-red-950/30 space-y-3">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-semibold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                High-Impact Irreversible Action
              </div>
              <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">
                Permanent ban will invalidate all active access sessions, freeze wallet balances, remove public profiles, and hash member identity credentials to prevent account recreation.
              </p>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                  Type <span className="font-mono text-red-600 dark:text-red-400 font-bold">CONFIRM BAN</span> to authorize:
                </label>
                <input
                  type="text"
                  value={banConfirmationText}
                  onChange={(e) => setBanConfirmationText(e.target.value)}
                  placeholder="CONFIRM BAN"
                  className="w-full text-xs rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-stone-900 px-3 py-2 font-mono uppercase text-red-600 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Executing Action...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Authorize & Apply Enforcement</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
