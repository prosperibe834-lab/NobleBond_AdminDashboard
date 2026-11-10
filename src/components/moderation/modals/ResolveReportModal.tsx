// NobleBond Admin — Resolve Report Modal
// Formal case closure modal with factual policy findings, action summary, and zero emojis.

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  Bell,
  Clock,
} from "lucide-react";
import type { UnifiedReportRecord } from "../../../types/reportsModeration.types";

interface ResolveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: UnifiedReportRecord | null;
  onConfirmResolve: (
    reportId: string,
    resolutionSummary: string,
    actionTaken: string
  ) => void;
}

const RESOLUTION_ACTION_PRESETS = [
  "Enforcement action successfully applied against target account",
  "Reported content permanently removed from platform",
  "Target account placed on communication restriction",
  "Target account formally warned regarding community guidelines",
  "Account permanently banned due to severe violations",
  "Investigation completed; member given educational guidance",
  "Mutual dispute settled without disciplinary restriction",
];

export const ResolveReportModal: React.FC<ResolveReportModalProps> = ({
  isOpen,
  onClose,
  report,
  onConfirmResolve,
}) => {
  const [actionTaken, setActionTaken] = useState<string>(RESOLUTION_ACTION_PRESETS[0]);
  const [customAction, setCustomAction] = useState<string>("");
  const [resolutionSummary, setResolutionSummary] = useState<string>("");
  const [notifyReporter, setNotifyReporter] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen || !report) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionSummary.trim()) return;

    setSubmitting(true);
    const finalAction = customAction.trim() ? customAction.trim() : actionTaken;

    setTimeout(() => {
      onConfirmResolve(
        report.id,
        resolutionSummary.trim(),
        finalAction
      );
      setSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resolve-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-900/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="resolve-modal-title" className="text-base font-semibold text-stone-900 dark:text-white">
                Resolve Safety Report
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Close case #{report.id} with documented policy findings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Case Dossier Summary */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                Case #{report.id}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                {report.category.replace(/_/g, " ")}
              </span>
            </div>
            <div className="text-xs text-stone-600 dark:text-stone-300">
              <span className="font-medium">Target:</span> {report.reportedUser.name} ({report.reportedUser.id})
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
              <span className="font-medium text-stone-600 dark:text-stone-300">Allegation:</span> {report.description}
            </div>
          </div>

          {/* Action Taken Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              Primary Outcome / Action Taken *
            </label>
            <select
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3 py-2.5 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {RESOLUTION_ACTION_PRESETS.map((preset) => (
                <option key={preset} value={preset}>
                  {preset}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Action Override */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
              Custom Outcome Description (Optional)
            </label>
            <input
              type="text"
              value={customAction}
              onChange={(e) => setCustomAction(e.target.value)}
              placeholder="Override outcome title if non-standard..."
              className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3 py-2 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Resolution Findings Summary */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
              Investigation Findings & Conclusion *
            </label>
            <textarea
              value={resolutionSummary}
              onChange={(e) => setResolutionSummary(e.target.value)}
              required
              rows={3}
              placeholder="Document the factual findings and justification for closing this report as resolved..."
              className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 p-3 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Notify Reporter Checkbox */}
          <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyReporter}
              onChange={(e) => setNotifyReporter(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 dark:border-stone-600"
            />
            <div className="flex-1 text-xs">
              <div className="font-medium text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-stone-500" />
                Notify Reporter ({report.reporter.name})
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                Sends a privacy-compliant confirmation that their report has been reviewed and resolved.
              </div>
            </div>
          </label>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!resolutionSummary.trim() || submitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Closing Case...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resolve & Close Case</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
