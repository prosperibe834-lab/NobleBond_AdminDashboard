// NobleBond Admin — Bulk Profile Moderation Modal
// Batch operations with explicit impact explanation, item counts, zero emojis

import React, { useState } from "react";
import { X, Layers, CheckCircle2, Eye, EyeOff, ShieldAlert, AlertTriangle } from "lucide-react";
import type { ProfileVisibility } from "../../../types/profileManagement.types";

interface BulkActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onBatchApprove: (ids: string[]) => void;
  onBatchVisibility: (ids: string[], visibility: ProfileVisibility, reason: string) => void;
}

export const BulkActionModal: React.FC<BulkActionModalProps> = ({
  isOpen,
  onClose,
  selectedIds,
  onBatchApprove,
  onBatchVisibility,
}) => {
  if (!isOpen || selectedIds.length === 0) return null;

  return (
    <BulkActionForm
      key={selectedIds.join("_")}
      selectedIds={selectedIds}
      onClose={onClose}
      onBatchApprove={onBatchApprove}
      onBatchVisibility={onBatchVisibility}
    />
  );
};

interface BulkActionFormProps {
  selectedIds: string[];
  onClose: () => void;
  onBatchApprove: (ids: string[]) => void;
  onBatchVisibility: (ids: string[], visibility: ProfileVisibility, reason: string) => void;
}

const BulkActionForm: React.FC<BulkActionFormProps> = ({
  selectedIds,
  onClose,
  onBatchApprove,
  onBatchVisibility,
}) => {
  const [actionType, setActionType] = useState<"approve" | "visibility_discoverable" | "visibility_hidden" | "visibility_restricted">("approve");
  const [reason, setReason] = useState("");

  const handleExecute = () => {
    if (actionType === "approve") {
      onBatchApprove(selectedIds);
    } else if (actionType === "visibility_discoverable") {
      onBatchVisibility(selectedIds, "discoverable", reason || "Bulk restore to discoverable");
    } else if (actionType === "visibility_hidden") {
      onBatchVisibility(selectedIds, "hidden", reason || "Bulk hidden by administrator");
    } else if (actionType === "visibility_restricted") {
      onBatchVisibility(selectedIds, "restricted", reason || "Bulk restricted by administrator");
    }
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
          maxWidth: "520px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "20px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-xl)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
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
                backgroundColor: "rgba(139, 29, 65, 0.1)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Layers size={18} />
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Bulk Moderation Action
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Selected profiles: <strong>{selectedIds.length}</strong>
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
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Choose Action to Apply to {selectedIds.length} Profiles
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div
                onClick={() => setActionType("approve")}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: actionType === "approve" ? "2px solid var(--status-success)" : "1px solid var(--border)",
                  backgroundColor: actionType === "approve" ? "var(--status-success-bg)" : "var(--bg-main)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <CheckCircle2 size={18} color="var(--status-success)" />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                    Approve Profiles & Pending Photos
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                    Marks all selected profiles as approved and clears pending photo queue.
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActionType("visibility_discoverable")}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: actionType === "visibility_discoverable" ? "2px solid var(--primary)" : "1px solid var(--border)",
                  backgroundColor: actionType === "visibility_discoverable" ? "rgba(139, 29, 65, 0.08)" : "var(--bg-main)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Eye size={18} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                    Set Visibility: Discoverable
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                    Restores profiles to public feeds and discovery recommendations.
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActionType("visibility_hidden")}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: actionType === "visibility_hidden" ? "2px solid #6B7280" : "1px solid var(--border)",
                  backgroundColor: actionType === "visibility_hidden" ? "rgba(107, 114, 128, 0.1)" : "var(--bg-main)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <EyeOff size={18} color="#6B7280" />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                    Set Visibility: Hidden
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                    Hides selected profiles from matching feeds and search results.
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActionType("visibility_restricted")}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: actionType === "visibility_restricted" ? "2px solid var(--status-error)" : "1px solid var(--border)",
                  backgroundColor: actionType === "visibility_restricted" ? "var(--status-error-bg)" : "var(--bg-main)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <ShieldAlert size={18} color="var(--status-error)" />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                    Set Visibility: Restricted (Policy)
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                    Quarantines profiles due to investigation or repeated policy violation.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "6px" }}>
              Administrative Reason (Required for audit log)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Batch moderation verification check completed."
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                fontSize: "12.5px",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-main)",
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExecute}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <AlertTriangle size={15} />
            Execute on {selectedIds.length} Profiles
          </button>
        </div>
      </div>
    </div>
  );
};
