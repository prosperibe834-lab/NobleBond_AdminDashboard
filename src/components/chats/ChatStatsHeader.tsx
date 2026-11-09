// NobleBond Admin — Chat Management KPI Statistics Header
// 9 interactive cards derived dynamically from demo records, zero emojis

import React from "react";
import {
  MessageSquare,
  MessagesSquare,
  Send,
  MailCheck,
  AlertOctagon,
  Flag,
  ShieldAlert,
  PhoneCall,
  Video,
} from "lucide-react";
import type { ChatStatsKpis } from "../../types/chatManagement.types";

interface ChatStatsHeaderProps {
  kpis: ChatStatsKpis;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const ChatStatsHeader: React.FC<ChatStatsHeaderProps> = ({
  kpis,
  activeTab,
  onSelectTab,
}) => {
  const cards = [
    {
      id: "conversations",
      label: "Total Conversations",
      value: kpis.totalConversations.toLocaleString(),
      subtext: "All direct message threads",
      delta: "Direct",
      icon: MessagesSquare,
      color: "var(--primary)",
      bg: "rgba(139, 29, 65, 0.08)",
    },
    {
      id: "conversations",
      label: "Active Conversations",
      value: kpis.activeConversations.toLocaleString(),
      subtext: "Currently open and active",
      delta: "Active",
      icon: MessageSquare,
      color: "var(--status-success)",
      bg: "var(--status-success-bg)",
    },
    {
      id: "analytics",
      label: "Total Messages Sent",
      value: kpis.totalMessagesSent.toLocaleString(),
      subtext: `${kpis.deliverySuccessRate}% delivery rate`,
      delta: "+18.4%",
      icon: Send,
      color: "#2563EB",
      bg: "rgba(37, 99, 235, 0.08)",
    },
    {
      id: "conversations",
      label: "Unread Messages",
      value: kpis.unreadMessages.toLocaleString(),
      subtext: "Awaiting recipient open",
      delta: "Pending",
      icon: MailCheck,
      color: "#F59E0B",
      bg: "rgba(245, 158, 11, 0.1)",
    },
    {
      id: "analytics",
      label: "Delivery Warnings",
      value: kpis.failedMessages.toLocaleString(),
      subtext: "Degraded network / rate throttled",
      delta: "0.2%",
      icon: AlertOctagon,
      color: "#DC2626",
      bg: "rgba(220, 38, 38, 0.08)",
    },
    {
      id: "reported_conversations",
      label: "Reported Conversations",
      value: kpis.reportedConversations.toLocaleString(),
      subtext: "Threads under safety triage",
      delta: "Action Required",
      icon: Flag,
      color: "#E11D48",
      bg: "rgba(225, 29, 72, 0.1)",
    },
    {
      id: "reported_messages",
      label: "Reported Messages",
      value: kpis.reportedMessages.toLocaleString(),
      subtext: "Individual flagged messages",
      delta: "Review Queue",
      icon: ShieldAlert,
      color: "#9333EA",
      bg: "rgba(147, 51, 234, 0.08)",
    },
    {
      id: "calls",
      label: "Voice Calls",
      value: `${kpis.voiceCallsCompleted}/${kpis.voiceCallsTotal}`,
      subtext: "Sessions completed vs attempted",
      delta: "Encrypted",
      icon: PhoneCall,
      color: "#0D9488",
      bg: "rgba(13, 148, 136, 0.1)",
    },
    {
      id: "calls",
      label: "Video Calls",
      value: `${kpis.videoCallsCompleted}/${kpis.videoCallsTotal}`,
      subtext: "Encrypted WebRTC sessions",
      delta: "Live P2P",
      icon: Video,
      color: "#4F46E5",
      bg: "rgba(79, 70, 229, 0.1)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
        gap: "14px",
        marginBottom: "20px",
      }}
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isCurrentTab = activeTab === card.id;

        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectTab(card.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: isCurrentTab
                ? `1.5px solid ${card.color}`
                : "1px solid var(--border)",
              borderRadius: "14px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: isCurrentTab
                ? `0 4px 14px ${card.bg}`
                : "var(--shadow-sm)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = isCurrentTab
                ? `0 4px 14px ${card.bg}`
                : "var(--shadow-sm)";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  lineHeight: 1.3,
                }}
              >
                {card.label}
              </span>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  backgroundColor: card.bg,
                  color: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={17} />
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "var(--text-main)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {card.value}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "6px",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "11.5px",
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {card.subtext}
                </span>
                <span
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "6px",
                    backgroundColor: card.bg,
                    color: card.color,
                    flexShrink: 0,
                  }}
                >
                  {card.delta}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
