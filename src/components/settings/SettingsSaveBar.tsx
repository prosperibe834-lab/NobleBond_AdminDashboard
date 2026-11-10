import React from "react";
import { CheckCircle2, AlertCircle, RotateCcw, Save, Loader2, Eye } from "lucide-react";

export type SaveWorkflowStatus = "saved" | "unsaved" | "saving" | "save_failed" | "just_saved";

interface SettingsSaveBarProps {
  status: SaveWorkflowStatus;
  sectionLabel: string;
  canSave: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onPreview?: () => void;
}

export const SettingsSaveBar: React.FC<SettingsSaveBarProps> = ({
  status,
  sectionLabel,
  canSave,
  onSave,
  onDiscard,
  onPreview,
}) => {
  const badgeConfig: Record<
    SaveWorkflowStatus,
    { label: string; color: string; bg: string; icon: React.ReactNode }
  > = {
    saved: {
      label: "All changes synchronized locally",
      color: "var(--text-secondary)",
      bg: "var(--bg-surface-elevated)",
      icon: <CheckCircle2 size={14} />,
    },
    unsaved: {
      label: `Unsaved draft changes in ${sectionLabel}`,
      color: "var(--status-warning)",
      bg: "var(--status-warning-bg)",
      icon: <AlertCircle size={14} />,
    },
    saving: {
      label: "Applying demonstration configuration...",
      color: "var(--status-info)",
      bg: "var(--status-info-bg)",
      icon: <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} />,
    },
    save_failed: {
      label: "Validation check blocked save — review highlighted inputs",
      color: "var(--status-error)",
      bg: "var(--status-error-bg)",
      icon: <AlertCircle size={14} />,
    },
    just_saved: {
      label: "Saved to demonstration config store & appended to Audit Log",
      color: "var(--status-success)",
      bg: "var(--status-success-bg)",
      icon: <CheckCircle2 size={14} />,
    },
  };

  const active = badgeConfig[status];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        padding: "11px 16px",
        borderRadius: 14,
        background: "var(--bg-card)",
        border: `1px solid ${status === "unsaved" ? "var(--status-warning)" : "var(--border)"}`,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        role="status"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12.5,
          fontWeight: 700,
          color: active.color,
          background: active.bg,
          padding: "5px 12px",
          borderRadius: 999,
        }}
      >
        {active.icon}
        <span>{active.label}</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {onPreview && (
          <button
            type="button"
            onClick={onPreview}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 12px",
              borderRadius: 9,
              border: "1px solid var(--border)",
              background: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Eye size={14} />
            <span>Preview</span>
          </button>
        )}

        <button
          type="button"
          disabled={status !== "unsaved"}
          onClick={onDiscard}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 12px",
            borderRadius: 9,
            border: "1px solid var(--border)",
            background: "var(--bg-surface-elevated)",
            color: status === "unsaved" ? "var(--text-main)" : "var(--text-muted)",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: status === "unsaved" ? "pointer" : "not-allowed",
            opacity: status === "unsaved" ? 1 : 0.65,
          }}
        >
          <RotateCcw size={13} />
          <span>Reset Draft</span>
        </button>

        <button
          type="button"
          disabled={!canSave || status === "saving" || status === "saved"}
          onClick={onSave}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 15px",
            borderRadius: 9,
            border: "none",
            background:
              canSave && status === "unsaved" ? "var(--primary)" : "var(--bg-surface-elevated)",
            color:
              canSave && status === "unsaved" ? "var(--primary-text)" : "var(--text-muted)",
            fontSize: 12.5,
            fontWeight: 700,
            cursor: canSave && status === "unsaved" ? "pointer" : "not-allowed",
          }}
        >
          <Save size={14} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

