// NobleBond Admin — Dismiss Report Modal
// Dismissal of unverified, non-violating, or false reports with factual justification notes. Zero emojis.

import React, { useState } from "react";
import {
  X,
  XCircle,
  FileQuestion,
  AlertCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import type { UnifiedReportRecord } from "../../../types/reportsModeration.types";

interface DismissReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: UnifiedReportRecord | null;
  onConfirmDismiss: (
    reportId: string,
    dismissalReason: string,
    notes: string,
    flagReporter: boolean
  ) => void;
}

const DISMISSAL_PRESETS = [
  "Insufficient evidence to corroborate violation of community guidelines",
  "Alleged conduct does not constitute a platform policy infraction",
  "Content within acceptable personal expression and dating banter boundaries",
  "Duplicate filing of an already adjudicated safety case",
  "Suspected malicious, abusive, or retaliatory false report",
  "Reported interaction occurred prior to policy revision or outside platform jurisdiction",
];

export const DismissReportModal: React.FC<DismissReportModalProps> = ({
  isOpen,
  onClose,
  report,
  onConfirmDismiss,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(DISMISSAL_PRESETS[0]);
  const [detailedNotes, setDetailedNotes] = useState<string>("");
  const [flagReporter, setFlagReporter] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen || !report) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailedNotes.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      onConfirmDismiss(
        report.id,
        selectedReason,
        detailedNotes.trim(),
        flagReporter
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
        aria-labelledby="dismiss-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center border border-stone-300 dark:border-stone-700">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="dismiss-modal-title" className="text-base font-semibold text-stone-900 dark:text-white">
                Dismiss Safety Report
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Close case #{report.id} without disciplinary action
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
          {/* Target & Case Notice */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                Report #{report.id}
              </span>
              <span className="text-[11px] font-medium text-stone-500">
                Domain: {report.domain.toUpperCase()}
              </span>
            </div>
            <p className="text-stone-600 dark:text-stone-300">
              Reported against <span className="font-semibold">{report.reportedUser.name}</span> by <span className="font-semibold">{report.reporter.name}</span>
            </p>
          </div>

          {/* Dismissal Reason */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
              <FileQuestion className="w-3.5 h-3.5" />
              Primary Reason for Dismissal *
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3 py-2.5 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-400"
            >
              {DISMISSAL_PRESETS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Factual Justification Notes */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
              Administrative Justification Notes *
            </label>
            <textarea
              value={detailedNotes}
              onChange={(e) => setDetailedNotes(e.target.value)}
              required
              rows={3}
              placeholder="State the objective findings showing no policy infraction occurred or why evidence was insufficient..."
              className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 p-3 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
            />
          </div>

          {/* Flag Reporter for Frivolous Report */}
          <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 cursor-pointer">
            <input
              type="checkbox"
              checked={flagReporter}
              onChange={(e) => setFlagReporter(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300 dark:border-stone-600"
            />
            <div className="flex-1 text-xs">
              <div className="font-medium text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                Note Potential Frivolous Filing on Reporter History
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                Increases false-positive monitoring score for {report.reporter.name} to mitigate abuse of the reporting queue.
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
              disabled={!detailedNotes.trim() || submitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl text-stone-900 dark:text-white bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Dismissing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Dismissal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
