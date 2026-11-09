// NobleBond Admin — Match Restoration Modal
// Controlled administrative restoration with safety checks, zero emojis

import React, { useState } from "react";
import { X, RotateCcw, CheckCircle2, AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import type { MatchRecord } from "../../../types/likesMatches.types";
import { validateMatchRestoration } from "../../../data/likesMatchesDataService";

interface RestoreMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchRecord | null;
  onConfirmRestore: (matchId: string, reason: string) => void;
}

export const RestoreMatchModal: React.FC<RestoreMatchModalProps> = ({
  isOpen,
  onClose,
  match,
  onConfirmRestore,
}) => {
  if (!isOpen || !match) return null;

  return (
    <RestoreMatchForm
      key={match.id}
      match={match}
      onClose={onClose}
      onConfirmRestore={onConfirmRestore}
    />
  );
};

interface RestoreMatchFormProps {
  match: MatchRecord;
  onClose: () => void;
  onConfirmRestore: (matchId: string, reason: string) => void;
}

const RestoreMatchForm: React.FC<RestoreMatchFormProps> = ({
  match,
  onClose,
  onConfirmRestore,
}) => {
  const [reason, setReason] = useState("");
  const validation = validateMatchRestoration(match);

  const handleExecute = () => {
    if (!validation.eligible) return;
    onConfirmRestore(match.id, reason || "Administrative match restoration requested");
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        className="animate-scale-up"
        style={{
          width: "100%",
          maxWidth: "560px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "20px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-xl)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--bg-main)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                color: "var(--status-success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RotateCcw size={18} />
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Restore Mutual Match #{match.id}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {match.user1.name} & {match.user2.name}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "6px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Validation Checklist Box */}
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: validation.eligible ? "rgba(16, 185, 129, 0.08)" : "var(--status-error-bg)",
              border: `1px solid ${validation.eligible ? "rgba(16, 185, 129, 0.25)" : "var(--status-error)"}`,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {validation.eligible ? (
                <ShieldCheck size={18} color="var(--status-success)" />
              ) : (
                <ShieldAlert size={18} color="var(--status-error)" />
              )}
              <strong style={{ fontSize: "13px", color: validation.eligible ? "var(--status-success)" : "var(--status-error)" }}>
                {validation.eligible ? "Eligibility Safeguards Passed" : "Restoration Blocked by Safeguard Policy"}
              </strong>
            </div>

            <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
              {validation.eligible ? (
                <>
                  Original mutual reciprocal likes verified. Neither participant has an active fraud ban or blocking restriction. Both accounts remain eligible for relationship restoration.
                </>
              ) : (
                validation.reasons.map((r, i) => <div key={i}>&bull; {r}</div>)
              )}
            </div>
          </div>

          {match.unmatchInfo && (
            <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", padding: "10px 14px", backgroundColor: "var(--bg-main)", borderRadius: "10px" }}>
              <strong>Original Unmatch Note:</strong> Initiated by {match.unmatchInfo.unmatcherName} on {new Date(match.unmatchInfo.unmatchDate).toLocaleDateString()}. &ldquo;{match.unmatchInfo.reason || "No reason given"}&rdquo;
            </div>
          )}

          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "6px" }}>
              Administrative Justification (Logged to Audit Record)
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Mutual consent confirmed via customer support ticket #CS-4091; accidental unmatch."
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                fontSize: "12.5px",
              }}
            />
          </div>

          <div style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
            <AlertTriangle size={13} color="#F59E0B" />
            <span>Restoring a match reopens the direct conversation channel for both participants.</span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg-main)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "9px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "12.5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!validation.eligible}
            onClick={handleExecute}
            style={{
              padding: "9px 18px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: validation.eligible ? "var(--status-success)" : "#888888",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "12.5px",
              cursor: validation.eligible ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <CheckCircle2 size={15} /> Confirm Match Restoration
          </button>
        </div>
      </div>
    </div>
  );
};

