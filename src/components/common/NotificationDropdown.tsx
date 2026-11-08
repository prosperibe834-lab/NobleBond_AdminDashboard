import React from "react";
import { ShieldAlert, Coins, Radio, UserCheck, CheckCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  unread: boolean;
  type: "moderation" | "wallet" | "live" | "verification";
  link: string;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const notifications: NotificationItem[] = [
    {
      id: "n_1",
      title: "New high-priority harassment report on Chat #441",
      time: "2m ago",
      unread: true,
      type: "moderation",
      link: "/moderation",
    },
    {
      id: "n_2",
      title: "Emily Carter's broadcast exceeded 2,400 concurrent viewers",
      time: "14m ago",
      unread: true,
      type: "live",
      link: "/live",
    },
    {
      id: "n_3",
      title: "Ultimate 9,000 Coins Package purchased ($99.99)",
      time: "32m ago",
      unread: false,
      type: "wallet",
      link: "/wallet",
    },
    {
      id: "n_4",
      title: "14 new photo verification requests waiting in queue",
      time: "1h ago",
      unread: false,
      type: "verification",
      link: "/profiles",
    },
  ];

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "moderation":
        return <ShieldAlert size={16} color="var(--status-error)" />;
      case "live":
        return <Radio size={16} color="#EF4444" />;
      case "wallet":
        return <Coins size={16} color="var(--accent-champagne)" />;
      case "verification":
        return <UserCheck size={16} color="var(--status-success)" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
        }}
      />

      <div
        className="animate-scale-up"
        style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          right: 0,
          width: "360px",
          maxWidth: "calc(100vw - 32px)",
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          boxShadow: "var(--shadow-lg)",
          zIndex: 999,
          overflow: "hidden",
        }}
      >
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
            <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)" }}>
              Notifications
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                backgroundColor: "var(--primary)",
                color: "#FFFFFF",
                padding: "2px 7px",
                borderRadius: "999px",
              }}
            >
              2 New
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={() => {}}
              style={{
                background: "none",
                border: "none",
                fontSize: "12px",
                color: "var(--primary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontWeight: 600,
              }}
            >
              <CheckCheck size={14} />
              Read all
            </button>
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
              <X size={16} />
            </button>
          </div>
        </div>

        <div style={{ maxHeight: "360px", overflowY: "auto" }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onClose();
                navigate(n.link);
              }}
              style={{
                padding: "14px 20px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                borderBottom: "1px solid var(--border-light)",
                backgroundColor: n.unread ? "var(--bg-active)" : "transparent",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = n.unread ? "var(--bg-active)" : "transparent";
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {getIcon(n.type)}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: n.unread ? 600 : 500,
                    color: "var(--text-main)",
                    lineHeight: 1.4,
                  }}
                >
                  {n.title}
                </p>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    marginTop: "4px",
                    display: "inline-block",
                  }}
                >
                  {n.time}
                </span>
              </div>
              {n.unread && (
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary)",
                    marginTop: "6px",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid var(--border)",
            textAlign: "center",
            backgroundColor: "var(--bg-surface-elevated)",
          }}
        >
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate("/notifications");
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            View all notifications →
          </button>
        </div>
      </div>
    </>
  );
};

