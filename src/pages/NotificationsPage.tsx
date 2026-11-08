import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Badge } from "../components/common/Badge";

export const NotificationsPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetAudience, setTargetAudience] = useState("all");
  const [toast, setToast] = useState<string | null>(null);

  const [campaigns, setCampaigns] = useState([
    {
      id: "cmp_1",
      title: "Weekend Live Gifting Party ✨ 2x Points",
      target: "All Active Users",
      sentAt: "2026-11-07 18:00",
      delivered: "1,140,200",
      openRate: "34.8%",
    },
    {
      id: "cmp_2",
      title: "Meet NobleBond Live: Connect with creators now!",
      target: "New Registrations (Last 7 Days)",
      sentAt: "2026-11-05 12:00",
      delivered: "48,500",
      openRate: "42.1%",
    },
  ]);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    const newCampaign = {
      id: `cmp_${Date.now()}`,
      title,
      target: targetAudience === "all" ? "All Users" : targetAudience === "premium" ? "Premium Subscribers" : "Streamers",
      sentAt: "Just now",
      delivered: "1,280,000",
      openRate: "0.0%",
    };

    setCampaigns([newCampaign, ...campaigns]);
    setTitle("");
    setMessage("");
    setToast("Broadcast announcement dispatched to delivery queue!");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>
            Notifications & Broadcast Campaigns
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Schedule push notifications, in-app popups, and broadcast announcements to members.
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

      {/* Campaign Dispatch Form */}
      <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", marginBottom: "14px" }}>
          Create New Broadcast Announcement
        </h3>

        <form onSubmit={handleSendBroadcast} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Notification Title
              </label>
              <input
                type="text"
                placeholder="e.g. Special Weekend Event: Meet your match!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "13.5px",
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "13.5px",
                }}
              >
                <option value="all">All Members (1.28M)</option>
                <option value="premium">Premium Subscribers Only (52.8k)</option>
                <option value="streamers">Live Broadcasters & Hosts</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Message Body
            </label>
            <textarea
              placeholder="Type announcement message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13.5px",
                fontFamily: "inherit",
              }}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "#FFFFFF",
                fontSize: "13.5px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 14px var(--primary-glow)",
              }}
            >
              <Send size={15} /> Send Notification Now
            </button>
          </div>
        </form>
      </div>

      {/* Broadcast History Table */}
      <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", marginBottom: "14px" }}>
          Recent Broadcast History
        </h3>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "12px" }}>
                <th style={{ padding: "10px 12px" }}>TITLE</th>
                <th style={{ padding: "10px 12px" }}>AUDIENCE</th>
                <th style={{ padding: "10px 12px" }}>DELIVERED</th>
                <th style={{ padding: "10px 12px" }}>OPEN RATE</th>
                <th style={{ padding: "10px 12px" }}>SENT AT</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid var(--border-light)", fontSize: "13px" }}>
                  <td style={{ padding: "12px", fontWeight: 600, color: "var(--text-main)" }}>{c.title}</td>
                  <td style={{ padding: "12px" }}><Badge variant="primary">{c.target}</Badge></td>
                  <td style={{ padding: "12px", color: "var(--text-main)", fontWeight: 600 }}>{c.delivered}</td>
                  <td style={{ padding: "12px", color: "var(--status-success)", fontWeight: 700 }}>{c.openRate}</td>
                  <td style={{ padding: "12px", color: "var(--text-secondary)" }}>{c.sentAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
