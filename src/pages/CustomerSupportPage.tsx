import React, { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { MOCK_TICKETS } from "../data/adminMockData";
import type { SupportTicket } from "../data/adminMockData";
import { Badge } from "../components/common/Badge";

export const CustomerSupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0]);
  const [replyText, setReplyText] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const handleResolveTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "resolved" } : t))
    );
    if (selectedTicket?.id === id) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: "resolved" } : null));
    }
    setToast(`Ticket ${id} marked as resolved!`);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) return;
    setToast(`Reply sent to ${selectedTicket?.email}!`);
    setReplyText("");
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>
            Customer Support & Inquiries
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Resolve member billing questions, KYC verification appeals, and live streaming assistance.
          </p>
        </div>

        {toast && (
          <div
            className="animate-scale-up"
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--status-success-bg)",
              border: "1px solid var(--status-success)",
              borderRadius: "10px",
              color: "var(--status-success)",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
            {toast}
          </div>
        )}
      </div>

      {/* Two Column Ticket Queue & Conversation View */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px" }}>
        {/* Ticket List */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)" }}>
            Open Support Tickets ({tickets.filter((t) => t.status !== "resolved").length})
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {tickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: isSelected ? "var(--primary)" : "var(--border)",
                    backgroundColor: isSelected ? "var(--bg-active)" : "var(--bg-surface-elevated)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Badge variant={t.priority === "urgent" || t.priority === "high" ? "error" : "neutral"}>
                        {t.priority}
                      </Badge>
                      <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{t.id}</span>
                    </div>
                    <Badge variant={t.status === "resolved" ? "success" : t.status === "in_progress" ? "warning" : "error"}>
                      {t.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                    {t.subject}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    User: {t.user} • {t.updatedAt}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Ticket Detail View */}
        {selectedTicket && (
          <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border)", paddingBottom: "14px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                    {selectedTicket.subject}
                  </span>
                  <Badge variant={selectedTicket.status === "resolved" ? "success" : "warning"}>
                    {selectedTicket.status}
                  </Badge>
                </div>
                <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  Requester: <strong>{selectedTicket.user}</strong> ({selectedTicket.email}) • Category: {selectedTicket.category}
                </div>
              </div>

              {selectedTicket.status !== "resolved" && (
                <button
                  type="button"
                  onClick={() => handleResolveTicket(selectedTicket.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "var(--status-success)",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Mark Resolved
                </button>
              )}
            </div>

            {/* Conversation message simulation */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ padding: "12px 16px", borderRadius: "12px", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  {selectedTicket.user} wrote ({selectedTicket.updatedAt}):
                </div>
                <div style={{ fontSize: "13.5px", color: "var(--text-main)" }}>
                  {selectedTicket.subject}. Please assist or verify if my payment went through properly.
                </div>
              </div>
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="Type response to user..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "13.5px",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 18px",
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
                }}
              >
                <Send size={14} /> Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
