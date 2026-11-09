import React, { useState } from "react";
import { X, Calendar, AlertCircle, Check } from "lucide-react";

interface CustomDateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (start: string, end: string) => void;
  initialStart?: string;
  initialEnd?: string;
}

export const CustomDateRangeModal: React.FC<CustomDateRangeModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialStart = "2026-10-10",
  initialEnd = "2026-11-08",
}) => {
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!start || !end) {
      setError("Please specify both start and end dates.");
      return;
    }
    if (new Date(start) > new Date(end)) {
      setError("Start date cannot be after end date.");
      return;
    }
    setError(null);
    onApply(start, end);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        className="animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "420px",
          maxWidth: "100%",
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={18} color="var(--primary)" />
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
              Custom Date Window
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleApply} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {error && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                backgroundColor: "var(--status-error-bg)",
                border: "1px solid var(--status-error)",
                color: "var(--status-error)",
                fontSize: "12.5px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Start Date
            </label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              End Date
            </label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "9px 16px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "transparent",
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "9px 20px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 14px var(--primary-glow)",
              }}
            >
              <Check size={16} /> Apply Window
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

