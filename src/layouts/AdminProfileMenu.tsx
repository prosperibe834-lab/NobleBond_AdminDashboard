import React, { useState } from "react";
import { User, Settings, Sliders, LogOut, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position?: "top-right" | "bottom-left";
}

export const AdminProfileMenu: React.FC<AdminProfileMenuProps> = ({
  isOpen,
  onClose,
  position = "top-right",
}) => {
  const navigate = useNavigate();
  const [showSignOutNotice, setShowSignOutNotice] = useState(false);

  if (!isOpen) return null;

  const handleSignOutClick = () => {
    setShowSignOutNotice(true);
    setTimeout(() => {
      setShowSignOutNotice(false);
      onClose();
    }, 2200);
  };

  const menuItems = [
    {
      label: "My Profile",
      icon: User,
      action: () => {
        onClose();
        navigate("/settings");
      },
    },
    {
      label: "Account Settings",
      icon: Settings,
      action: () => {
        onClose();
        navigate("/settings");
      },
    },
    {
      label: "Preferences",
      icon: Sliders,
      action: () => {
        onClose();
        navigate("/settings");
      },
    },
  ];

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
          ...(position === "top-right"
            ? { top: "calc(100% + 10px)", right: 0 }
            : { bottom: "calc(100% + 10px)", left: 0 }),
          width: "240px",
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          boxShadow: "var(--shadow-lg)",
          zIndex: 999,
          overflow: "hidden",
        }}
      >
        {/* User Identity Header */}
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface-elevated)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary) 0%, var(--accent-lavender) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              SA
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                Sarah Alexander
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                Super Administrator
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div style={{ padding: "6px" }}>
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={item.action}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "var(--text-main)",
                  fontSize: "13.5px",
                  fontWeight: 500,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                  e.currentTarget.style.color = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--text-main)";
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Sign Out Action */}
        <div style={{ padding: "6px", borderTop: "1px solid var(--border)" }}>
          <button
            type="button"
            onClick={handleSignOutClick}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "transparent",
              color: "var(--status-error)",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "left",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--status-error-bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        {/* Demo Sign Out Toast */}
        {showSignOutNotice && (
          <div
            className="animate-fade-in"
            style={{
              padding: "12px",
              backgroundColor: "var(--status-info-bg)",
              borderTop: "1px solid var(--status-info)",
              color: "var(--status-info)",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle2 size={16} />
            <span>Frontend demo: session simulation ended.</span>
          </div>
        )}
      </div>
    </>
  );
};

