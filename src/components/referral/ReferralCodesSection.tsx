import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  QrCode,
  Copy,
  Check,
  Link as LinkIcon,
  Search,
  ExternalLink,
  History,
  PauseCircle,
  PlayCircle,
  Info,
} from "lucide-react";
import type {
  ReferralCodeRecord,
  ReferralRolePermissions,
} from "../../types/referralManagement.types";
import { Badge } from "../common/Badge";
import { formatReferralPoints, formatShortDate } from "./referralUiUtils";

interface ReferralCodesSectionProps {
  codes: ReferralCodeRecord[];
  permissions: ReferralRolePermissions;
  onOpenQr: (rec: ReferralCodeRecord) => void;
  onViewUserReferrals: (userId: string) => void;
  onToggleCodeStatus: (rec: ReferralCodeRecord) => void;
  onCopyToast: (msg: string) => void;
}

export const ReferralCodesSection: React.FC<ReferralCodesSectionProps> = ({
  codes,
  permissions,
  onOpenQr,
  onViewUserReferrals,
  onToggleCodeStatus,
  onCopyToast,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = codes.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      c.ownerName.toLowerCase().includes(q) ||
      c.ownerUsername.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.ownerCountry.toLowerCase().includes(q)
    );
  });

  const handleCopy = async (text: string, tag: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard fallback ignored in restricted frames
    }
    setCopiedId(tag);
    onCopyToast(`Copied ${label}: ${text}`);
    setTimeout(() => {
      setCopiedId((curr) => (curr === tag ? null : curr));
    }, 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px 18px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "var(--primary-glow)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <QrCode size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Referral Codes, Invite Links &amp; QR Codes ({filtered.length})
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Aligned with NobleBond mobile Invite &amp; Earn (?ref=CODE). Demonstration link telemetry shown cleanly below.
            </div>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <Search
            size={14}
            style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search owner or referral code..."
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              borderRadius: "9px",
              padding: "8px 10px 8px 32px",
              fontSize: "0.8rem",
              width: "240px",
            }}
          />
        </div>
      </div>

      <div
        style={{
          padding: "10px 14px",
          borderRadius: "11px",
          background: "var(--status-info-bg)",
          color: "var(--text-secondary)",
          fontSize: "0.76rem",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Info size={15} style={{ color: "var(--status-info)", flexShrink: 0 }} />
        <span>
          Demonstration Attribution Notice: Per-member referral codes reflect synchronized User Management demonstration profiles. Offline ISO-18004 QR previews generate real scannable PNG images locally without sending member codes to third-party servers.
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "14px" }}>
        {filtered.map((rec) => {
          const codeCopied = copiedId === `code_${rec.userId}`;
          const linkCopied = copiedId === `link_${rec.userId}`;
          const stVariant =
            rec.status === "active"
              ? "success"
              : rec.status === "paused"
              ? "warning"
              : "error";

          return (
            <div
              key={rec.userId}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <img
                      src={rec.ownerAvatar}
                      alt={rec.ownerName}
                      style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.9rem" }}>
                        {rec.ownerName}
                      </div>
                      <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>
                        {rec.ownerUsername} • Since {formatShortDate(rec.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                    <Badge variant={stVariant} size="sm">
                      {rec.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <span style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>Demo Code</span>
                  </div>
                </div>

                {/* Code & Link Strip */}
                <div
                  style={{
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "11px",
                    padding: "10px 12px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700 }}>UNIQUE REFERRAL CODE</div>
                      <div style={{ fontSize: "1.02rem", fontWeight: 800, color: "var(--primary)", letterSpacing: "0.04em" }}>
                        {rec.code}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(rec.code, `code_${rec.userId}`, "referral code")}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "7px",
                        border: "1px solid var(--border)",
                        background: codeCopied ? "var(--status-success)" : "var(--bg-card)",
                        color: codeCopied ? "#fff" : "var(--text-main)",
                        fontSize: "0.73rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {codeCopied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{codeCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", paddingTop: "6px", borderTop: "1px solid var(--border-light)" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {rec.referralLink}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(rec.referralLink, `link_${rec.userId}`, "invite link")}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "7px",
                        border: "1px solid var(--border)",
                        background: linkCopied ? "var(--status-success)" : "var(--bg-card)",
                        color: linkCopied ? "#fff" : "var(--text-secondary)",
                        fontSize: "0.71rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                        flexShrink: 0,
                      }}
                    >
                      {linkCopied ? <Check size={11} /> : <LinkIcon size={11} />}
                      <span>{linkCopied ? "Copied" : "Copy Link"}</span>
                    </button>
                  </div>
                </div>

                {/* Counts */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", textAlign: "center" }}>
                  <div style={{ padding: "6px", borderRadius: "8px", background: "var(--bg-surface-elevated)" }}>
                    <div style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>Link Uses</div>
                    <div style={{ fontWeight: 700, fontSize: "0.84rem", color: "var(--text-main)" }}>{rec.linkUsesTracked}</div>
                  </div>
                  <div style={{ padding: "6px", borderRadius: "8px", background: "var(--bg-surface-elevated)" }}>
                    <div style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>Successful</div>
                    <div style={{ fontWeight: 700, fontSize: "0.84rem", color: "var(--status-success)" }}>{rec.successfulReferrals}</div>
                  </div>
                  <div style={{ padding: "6px", borderRadius: "8px", background: "var(--bg-surface-elevated)" }}>
                    <div style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>Pending</div>
                    <div style={{ fontWeight: 700, fontSize: "0.84rem", color: "var(--status-warning)" }}>{rec.pendingReferrals}</div>
                  </div>
                  <div style={{ padding: "6px", borderRadius: "8px", background: "var(--bg-surface-elevated)" }}>
                    <div style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>Points</div>
                    <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--accent-lavender)" }}>
                      {formatReferralPoints(rec.pointsEarnedTotal)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => onOpenQr(rec)}
                  style={{
                    flex: 1,
                    padding: "7px 10px",
                    borderRadius: "8px",
                    border: "none",
                    background: "var(--primary)",
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                  }}
                >
                  <QrCode size={13} />
                  <span>QR Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => onViewUserReferrals(rec.userId)}
                  style={{
                    padding: "7px 9px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--bg-surface-elevated)",
                    color: "var(--text-main)",
                    fontSize: "0.74rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <History size={12} />
                  <span>History</span>
                </button>
                {permissions.canChangeReferralSettings && rec.status !== "flagged_review" && (
                  <button
                    type="button"
                    onClick={() => onToggleCodeStatus(rec)}
                    title={rec.status === "paused" ? "Re-activate Code" : "Pause Code"}
                    style={{
                      padding: "7px 9px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--bg-surface-elevated)",
                      color: "var(--text-secondary)",
                      fontSize: "0.74rem",
                      cursor: "pointer",
                    }}
                  >
                    {rec.status === "paused" ? <PlayCircle size={14} /> : <PauseCircle size={14} />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate(`/users?userId=${encodeURIComponent(rec.userId)}`)}
                  title="Open User Profile"
                  style={{
                    padding: "7px 9px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--bg-surface-elevated)",
                    color: "var(--text-secondary)",
                    fontSize: "0.74rem",
                    cursor: "pointer",
                  }}
                >
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

