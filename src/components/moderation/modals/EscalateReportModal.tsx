// NobleBond Admin — Escalate Report Modal
// Escalation workflow to Senior Trust & Safety, Legal & Compliance, or Executive Leadership. Zero emojis.

import React, { useState } from "react";
import {
  X,
  ArrowUpRight,
  ShieldAlert,
  Flame,
  Clock,
  Building2,
  FileText,
} from "lucide-react";
import type { UnifiedReportRecord } from "../../../types/reportsModeration.types";

interface EscalateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: UnifiedReportRecord | null;
  onConfirmEscalate: (
    reportId: string,
    department: string,
    reason: string,
    notes: string,
    bumpToCritical: boolean
  ) => void;
}

const DEPARTMENTS = [
  "Senior Trust & Safety Oversight",
  "Legal & Regulatory Compliance",
  "Executive Case Review Board",
  "Law Enforcement & External Liaison Team",
  "Fraud & Cybercrime Prevention Unit",
];

const ESCALATION_REASONS = [
  "Credible threats of physical violence, stalking, or extortion",
  "High-exposure case involving verified or public personalities",
  "Suspected organized fraud ring or multi-account syndicate",
  "Ambiguous policy edge-case requiring regulatory counsel",
  "Severe, repeated harassment breaching cross-border statutes",
];

export const EscalateReportModal: React.FC<EscalateReportModalProps> = ({
  isOpen,
  onClose,
  report,
  onConfirmEscalate,
}) => {
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [reason, setReason] = useState<string>(ESCALATION_REASONS[0]);
  const [notes, setNotes] = useState<string>("");
  const [bumpToCritical, setBumpToCritical] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen || !report) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      onConfirmEscalate(
        report.id,
        department,
        reason,
        notes.trim(),
        bumpToCritical
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
        aria-labelledby="escalate-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-900/50">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h2 id="escalate-modal-title" className="text-base font-semibold text-stone-900 dark:text-white">
                Escalate Safety Case
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Transfer case #{report.id} to specialized oversight
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
          <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-purple-950 dark:text-purple-300">
                Case #{report.id} ({report.category.replace(/_/g, " ")})
              </span>
              <span className="font-mono text-[10px] text-purple-700 dark:text-purple-400 uppercase font-bold">
                Current Priority: {report.priority}
              </span>
            </div>
            <p className="text-purple-800 dark:text-purple-300/80">
              Allegation against <span className="font-semibold">{report.reportedUser.name}</span>: {report.description}
            </p>
          </div>

          {/* Target Department */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Target Escalation Department *
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3 py-2.5 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Primary Escalation Reason */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Escalation Justification Category *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3 py-2.5 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {ESCALATION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Escalation Notes */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Detailed Referral Memorandum *
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              rows={3}
              placeholder="Outline specific risks, preliminary findings, cross-case patterns, or urgency criteria necessitating escalation..."
              className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 p-3 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Bump to Critical Priority Checkbox */}
          <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 cursor-pointer">
            <input
              type="checkbox"
              checked={bumpToCritical}
              onChange={(e) => setBumpToCritical(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-stone-300 dark:border-stone-600"
            />
            <div className="flex-1 text-xs">
              <div className="font-medium text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                Elevate Priority to Critical / Urgent
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                Pushes this case to the top of the queue and dispatches an alert to on-duty supervisors.
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
              disabled={!notes.trim() || submitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Escalating...</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Authorize Escalation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
