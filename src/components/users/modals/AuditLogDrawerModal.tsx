import React, { useState } from "react";
import { X, Shield, Search, Clock, FileText } from "lucide-react";
import type { AdminAuditEntry } from "../../../types/userManagement.types";

interface AuditLogDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: AdminAuditEntry[];
}

export const AuditLogDrawerModal: React.FC<AuditLogDrawerModalProps> = ({
  isOpen,
  onClose,
  entries,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filtered = entries.filter(
    (e) =>
      e.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.targetUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.adminName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1100,
        display: "flex",
        justifyContent: "flex-end",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "540px",
          height: "100%",
          backgroundColor: "var(--bg-card)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "var(--shadow-elevated)",
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "rgba(124, 104, 232, 0.1)",
                color: "var(--accent-lavender)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                Administrative Audit Log
              </h3>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {entries.length} administrative events recorded
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "6px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search audit trail by user, action or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                color: "var(--text-main)",
                fontSize: "12.5px",
                width: "100%",
              }}
            />
          </div>
        </div>

        {/* List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "var(--text-muted)",
                fontSize: "13px",
              }}
            >
              <FileText size={32} style={{ margin: "0 auto 8px auto", opacity: 0.5 }} />
              No audit logs matching query.
            </div>
          ) : (
            filtered.map((entry) => (
              <div
                key={entry.id}
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                    {entry.action}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11px",
                      color: "var(--text-muted)",
                    }}
                  >
                    <Clock size={11} />
                    <span>{entry.timestamp}</span>
                  </div>
                </div>

                <div style={{ fontSize: "12px", color: "var(--primary)", fontWeight: 600 }}>
                  Target: {entry.targetUserName} ({entry.targetUserId})
                </div>

                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  <strong>Reason:</strong> {entry.reason}
                </div>

                {entry.details && (
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontStyle: "italic" }}>
                    {entry.details}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "4px",
                    paddingTop: "6px",
                    borderTop: "1px solid var(--border)",
                    fontSize: "11px",
                    color: "var(--text-muted)",
                  }}
                >
                  <span>Operator: {entry.adminName}</span>
                  {entry.previousValue && entry.newValue && (
                    <span style={{ fontFamily: "monospace" }}>
                      {entry.previousValue} &rarr; {entry.newValue}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
