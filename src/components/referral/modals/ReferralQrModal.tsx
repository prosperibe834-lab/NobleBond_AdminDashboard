import React, { useState, useMemo } from "react";
import { X, Copy, Check, Download, QrCode, Link as LinkIcon } from "lucide-react";
import type { ReferralCodeRecord } from "../../../types/referralManagement.types";
import {
  downloadQrPng,
  generateQrMatrix,
} from "../../../utils/qrCodeGenerator";

interface ReferralQrModalProps {
  record: ReferralCodeRecord | null;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const ReferralQrModal: React.FC<ReferralQrModalProps> = ({
  record,
  onClose,
  onToast,
}) => {
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const matrix = useMemo(
    () => (record ? generateQrMatrix(record.referralLink) : []),
    [record]
  );

  if (!record) return null;

  const handleCopy = async (text: string, type: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore sandboxed clipboard failure
    }
    if (type === "code") {
      setCodeCopied(true);
      onToast(`Copied referral code ${text}`);
      setTimeout(() => setCodeCopied(false), 2000);
    } else {
      setLinkCopied(true);
      onToast(`Copied invite link ${text}`);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0, 0, 0, 0.64)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "22px",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <QrCode size={19} style={{ color: "var(--primary)" }} />
            <div>
              <h3 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 700, color: "var(--text-main)" }}>
                Scan &amp; Join NobleBond
              </h3>
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                Member: {record.ownerName} ({record.ownerUsername})
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* High-Contrast Scannable QR Box (Always white background quiet zone) */}
        <div
          style={{
            padding: "16px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(225, 29, 72, 0.14), rgba(139, 92, 246, 0.14))",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              padding: "14px",
              borderRadius: "14px",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
            }}
          >
            <svg
              viewBox={`0 0 ${matrix.length} ${matrix.length}`}
              style={{ width: "200px", height: "200px", display: "block", shapeRendering: "crispEdges" }}
              role="img"
              aria-label={`QR Code for ${record.referralLink}`}
            >
              <rect width={matrix.length} height={matrix.length} fill="#FFFFFF" />
              {matrix.map((row, r) =>
                row.map((dark, c) =>
                  dark ? (
                    <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#151019" />
                  ) : null
                )
              )}
            </svg>
          </div>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-main)", textAlign: "center" }}>
            Offline ISO-18004 QR for {record.referralLink}
          </div>
        </div>

        {/* Metrics Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", textAlign: "center" }}>
          <div style={{ padding: "7px", borderRadius: "9px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>Uses</div>
            <div style={{ fontWeight: 700, fontSize: "0.86rem", color: "var(--text-main)" }}>{record.linkUsesTracked}</div>
          </div>
          <div style={{ padding: "7px", borderRadius: "9px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>Signups</div>
            <div style={{ fontWeight: 700, fontSize: "0.86rem", color: "var(--text-main)" }}>{record.attributedRegistrations}</div>
          </div>
          <div style={{ padding: "7px", borderRadius: "9px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>Qualified</div>
            <div style={{ fontWeight: 700, fontSize: "0.86rem", color: "var(--status-success)" }}>{record.successfulReferrals}</div>
          </div>
          <div style={{ padding: "7px", borderRadius: "9px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>Pending</div>
            <div style={{ fontWeight: 700, fontSize: "0.86rem", color: "var(--status-warning)" }}>{record.pendingReferrals}</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <button
            type="button"
            onClick={() => handleCopy(record.code, "code")}
            style={{
              flex: 1,
              padding: "9px 10px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: codeCopied ? "var(--status-success)" : "var(--bg-surface-elevated)",
              color: codeCopied ? "#fff" : "var(--text-main)",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            {codeCopied ? <Check size={14} /> : <Copy size={14} />}
            <span>{codeCopied ? "Code Copied" : "Copy Code"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleCopy(record.referralLink, "link")}
            style={{
              flex: 1,
              padding: "9px 10px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: linkCopied ? "var(--status-success)" : "var(--bg-surface-elevated)",
              color: linkCopied ? "#fff" : "var(--text-main)",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            {linkCopied ? <Check size={14} /> : <LinkIcon size={14} />}
            <span>{linkCopied ? "Link Copied" : "Copy Link"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              downloadQrPng(
                record.referralLink,
                `noblebond_qr_${record.code.toLowerCase()}`,
                record.code
              );
              onToast(`Downloaded PNG QR code for ${record.code}`);
            }}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <Download size={15} />
            <span>Download Scannable QR PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};

