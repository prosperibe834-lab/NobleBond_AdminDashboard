import React from "react";
import { ShieldCheck, Lock, Wifi, WifiOff, MessageSquareOff } from "lucide-react";
import { Badge } from "../common/Badge";

interface SupportSeparationBannerProps {
  isOnline: boolean;
}

export const SupportSeparationBanner: React.FC<SupportSeparationBannerProps> = ({
  isOnline,
}) => {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "14px 18px",
        marginBottom: "18px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1 1 340px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "var(--primary-glow)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ShieldCheck size={19} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)" }}>
              Dedicated Concierge Support Boundary (Separated from Private Dating Chats)
            </span>
            <Badge variant={isOnline ? "success" : "error"} size="sm">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                {isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
                {isOnline ? "Browser Online (Demo Mode)" : "Browser Offline"}
              </span>
            </Badge>
          </div>
          <div style={{ fontSize: "0.77rem", color: "var(--text-secondary)", marginTop: "2px" }}>
            Only support tickets from In-App, Email (support@noblebond.com), and Web forms appear here. Private user-to-user dating chats stay isolated in Chat Management, and Internal Notes are strictly agent-only.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 10px",
            borderRadius: "999px",
            fontSize: "0.73rem",
            fontWeight: 600,
            background: "var(--bg-surface-elevated)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <MessageSquareOff size={12} />
          No Dating Chats Mixed
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 10px",
            borderRadius: "999px",
            fontSize: "0.73rem",
            fontWeight: 600,
            background: "var(--status-warning-bg)",
            color: "var(--status-warning)",
            border: "1px solid rgba(245, 158, 11, 0.28)",
          }}
        >
          <Lock size={12} />
          Private Notes Protected
        </span>
      </div>
    </div>
  );
};

