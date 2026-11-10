// NobleBond Admin — Content Review Detail Modal
// Granular content item inspection with automated heuristic disclosure and human verification controls. Zero emojis.

import React, { useState } from "react";
import {
  X,
  Sparkles,
  ShieldCheck,
  XCircle,
  AlertTriangle,
  User,
  Clock,
  ExternalLink,
  Bot,
} from "lucide-react";
import type { ContentModerationItem } from "../../../types/reportsModeration.types";

interface ContentReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ContentModerationItem | null;
  onApprove: (itemId: string, notes?: string) => void;
  onReject: (itemId: string, rejectionReason: string) => void;
  onEscalateToCase?: (item: ContentModerationItem) => void;
}

const REJECTION_REASONS = [
  "Contains explicit nudity, partial nudity, or sexually provocative posture",
  "Depicts firearms, narcotics, illicit substances, or violent imagery",
  "Infringes copyright, includes unverified celebrity image, or stock photo",
  "Commercial solicitation, off-platform handle, or QR code display",
  "Hate speech, discriminatory slurs, or harassment in text content",
  "Violates NobleBond community standards for respectful presentation",
];

export const ContentReviewDetailModal: React.FC<ContentReviewDetailModalProps> = ({
  isOpen,
  onClose,
  item,
  onApprove,
  onReject,
  onEscalateToCase,
}) => {
  const [rejectionReason, setRejectionReason] = useState<string>(REJECTION_REASONS[0]);
  const [reviewNotes, setReviewNotes] = useState<string>("");
  const [mode, setMode] = useState<"inspect" | "rejecting">("inspect");
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen || !item) return null;

  const handleConfirmApprove = () => {
    setSubmitting(true);
    setTimeout(() => {
      onApprove(item.id, reviewNotes.trim() || "Approved by human moderation review.");
      setSubmitting(false);
      onClose();
    }, 300);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      onReject(item.id, rejectionReason);
      setSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="content-review-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-900/50">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="content-review-title" className="text-base font-semibold text-stone-900 dark:text-white">
                Content Item Moderation Review
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Item #{item.id} &bull; Type: {item.contentType.replace("_", " ")}
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Creator Profile Mini Card */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {item.owner.avatar ? (
                <img
                  src={item.owner.avatar}
                  alt={item.owner.name}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200 dark:border-stone-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center font-bold text-xs text-stone-700 dark:text-stone-300">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="text-sm font-semibold text-stone-900 dark:text-white">
                  {item.owner.name}
                </div>
                <div className="font-mono text-[11px] text-stone-500">
                  ID: {item.owner.id}
                </div>
              </div>
            </div>
            <div className="text-right text-xs">
              <span className="font-medium text-stone-500">Submitted: </span>
              <span className="text-stone-800 dark:text-stone-200">{new Date(item.submittedAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Media or Text Display */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Flagged Content Payload
            </label>
            {item.contentPreviewUrl ? (
              <div className="relative rounded-2xl overflow-hidden bg-stone-950 flex items-center justify-center max-h-80 border border-stone-200 dark:border-stone-800">
                <img
                  src={item.contentPreviewUrl}
                  alt="Flagged media"
                  className="max-h-80 w-auto object-contain"
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-mono">
                  {item.contentType.toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-sm font-mono whitespace-pre-wrap">
                {item.contentPreviewText || "No text content provided."}
              </div>
            )}
          </div>

          {/* Automated Heuristic Signals */}
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                <Bot className="w-4 h-4" />
                Automated Heuristic Detection Signals
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                Confidence: {Math.round((item.automatedSignal?.confidence || 0.85) * 100)}%
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-stone-900 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
              >
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                {item.automatedSignal?.suggestedLabel || "Sensitive Media Flag"}
              </span>
            </div>

            <p className="text-[11px] text-amber-800/80 dark:text-amber-400/80 leading-relaxed italic">
              Notice: Automated heuristics provide screening assistance and are not conclusive proof of a violation. Final adjudication requires human verification.
            </p>
          </div>

          {/* Optional Review Notes */}
          {mode === "inspect" && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Staff Review Notes (Optional)
              </label>
              <input
                type="text"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add factual justification or context for this decision..."
                className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3 py-2 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Reject Mode Sub-Form */}
          {mode === "rejecting" && (
            <form onSubmit={handleConfirmReject} className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-red-900 dark:text-red-300 uppercase">
                <XCircle className="w-4 h-4" />
                Select Rejection Justification
              </div>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full text-xs rounded-xl border border-red-300 dark:border-red-800 bg-white dark:bg-stone-900 px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {REJECTION_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMode("inspect")}
                  className="px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Confirm Rejection & Removal
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        {mode === "inspect" && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
            <div>
              {onEscalateToCase && (
                <button
                  type="button"
                  onClick={() => {
                    onEscalateToCase(item);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Convert to Formal Safety Case
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMode("rejecting")}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/60 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Reject & Remove
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                disabled={submitting}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {submitting ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                Approve & Mark Safe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
