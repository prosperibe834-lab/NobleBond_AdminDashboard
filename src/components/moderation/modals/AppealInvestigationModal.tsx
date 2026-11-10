// NobleBond Admin — Member Appeal Adjudication Modal
// Due-process review modal for contested moderation actions. Zero emojis.

import React, { useState } from "react";
import {
  X,
  Scale,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Clock,
  ShieldAlert,
} from "lucide-react";
import type { AppealRecord } from "../../../types/reportsModeration.types";

interface AppealInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appeal: AppealRecord | null;
  onResolveAppeal: (
    appealId: string,
    outcome: "approved" | "rejected",
    notes: string,
    actionTaken: string
  ) => void;
  onAssignReviewer?: (appealId: string, reviewerName: string) => void;
}

const OVERTURN_OUTCOMES = [
  "Overturn action completely and restore full account standing",
  "Downgrade penalty to formal policy warning with education notice",
  "Reduce remaining restriction duration to 24 hours",
  "Expunge violation mark from member trust scoring history",
];

const REJECTION_REASONS = [
  "Original violation findings confirmed upon multi-reviewer re-examination",
  "Member explanation does not mitigate severity of community guideline breach",
  "Evidence demonstrates intentional or repeated policy violations",
  "Submitted appeal contains misrepresentations or contradicts system logs",
];

export const AppealInvestigationModal: React.FC<AppealInvestigationModalProps> = ({
  isOpen,
  onClose,
  appeal,
  onResolveAppeal,
}) => {
  const [decision, setDecision] = useState<"approved" | "rejected">("approved");
  const [selectedOutcome, setSelectedOutcome] = useState<string>(OVERTURN_OUTCOMES[0]);
  const [selectedRejection, setSelectedRejection] = useState<string>(REJECTION_REASONS[0]);
  const [adjudicationNotes, setAdjudicationNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen || !appeal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjudicationNotes.trim()) return;

    setSubmitting(true);
    const finalOutcomeAction =
      decision === "approved" ? selectedOutcome : selectedRejection;

    setTimeout(() => {
      onResolveAppeal(
        appeal.id,
        decision,
        adjudicationNotes.trim(),
        finalOutcomeAction
      );
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
        aria-labelledby="appeal-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-900/50">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="appeal-modal-title" className="text-base font-semibold text-stone-900 dark:text-white">
                Member Appeal Case Adjudication
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Appeal #{appeal.id} &bull; Contesting Action #{appeal.originalActionId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close appeal review"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Member & Contested Penalty Dossier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Appealing Member
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-xs font-bold text-stone-700 dark:text-stone-300">
                  {appeal.user.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-900 dark:text-white">
                    {appeal.user.name}
                  </div>
                  <div className="font-mono text-[11px] text-stone-500">
                    ID: {appeal.user.id}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Contested Penalty
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400">
                    {appeal.originalActionType.replace("_", " ")}
                  </span>
                  <span className="text-stone-500 font-mono text-[11px]">
                    Case: #{appeal.originalActionId}
                  </span>
                </div>
                <div className="text-stone-700 dark:text-stone-300">
                  Status: {appeal.status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Member's Submitted Defense */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              Member Contestation Statement
            </label>
            <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 text-xs text-stone-800 dark:text-stone-200 italic leading-relaxed">
              "{appeal.appealReason}"
            </div>
          </div>

          {/* Adjudication Decision Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Adjudication Determination *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision("approved")}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  decision === "approved"
                    ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20 ring-1 ring-emerald-500 text-emerald-950 dark:text-emerald-300"
                    : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 text-stone-600 dark:text-stone-400"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">Grant Appeal (Approve)</div>
                  <div className="text-[11px] opacity-80">Overturn or mitigate penalty</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDecision("rejected")}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  decision === "rejected"
                    ? "border-red-500 bg-red-50/60 dark:bg-red-950/20 ring-1 ring-red-500 text-red-950 dark:text-red-300"
                    : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 text-stone-600 dark:text-stone-400"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">Deny Appeal (Reject)</div>
                  <div className="text-[11px] opacity-80">Uphold original enforcement</div>
                </div>
              </button>
            </div>
          </div>

          {/* Outcome / Reason Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              {decision === "approved" ? "Overturn Consequence Action *" : "Rejection Justification *"}
            </label>
            {decision === "approved" ? (
              <select
                value={selectedOutcome}
                onChange={(e) => setSelectedOutcome(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3 py-2.5 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {OVERTURN_OUTCOMES.map((out) => (
                  <option key={out} value={out}>
                    {out}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedRejection}
                onChange={(e) => setSelectedRejection(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3 py-2.5 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {REJECTION_REASONS.map((rej) => (
                  <option key={rej} value={rej}>
                    {rej}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Staff Adjudication Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Adjudication Finding & Written Justification *
            </label>
            <textarea
              value={adjudicationNotes}
              onChange={(e) => setAdjudicationNotes(e.target.value)}
              required
              rows={3}
              placeholder="State the rationale for upholding or overturning the penalty, citing review of evidence or mitigating context..."
              className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 p-3 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </form>

        {/* Footer */}
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
            disabled={!adjudicationNotes.trim() || submitting}
            className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              decision === "approved"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {submitting ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Finalizing Decision...</span>
              </>
            ) : decision === "approved" ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Authorize Overturn</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                <span>Uphold Penalty (Reject)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
