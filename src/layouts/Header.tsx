import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  Radio,
  ChevronRight,
} from "lucide-react";
import { NAVIGATION_GROUPS } from "../config/navigationConfig";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { NotificationDropdown } from "../components/common/NotificationDropdown";
import { GlobalSearchModal } from "../components/common/GlobalSearchModal";
import { AdminProfileMenu } from "./AdminProfileMenu";

interface HeaderProps {
  onToggleMobileDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileDrawer }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Find active module metadata
  const currentPath = location.pathname;
  let activeItemName = "Dashboard";
  let activeGroupName = "OVERVIEW";

  for (const group of NAVIGATION_GROUPS) {
    for (const item of group.items) {
      if (item.path === "/" && currentPath === "/") {
        activeItemName = item.name;
        activeGroupName = group.label;
        break;
      } else if (item.path !== "/" && currentPath.startsWith(item.path)) {
        activeItemName = item.name;
        activeGroupName = group.label;
        break;
      }
    }
  }

  return (
    <header
      style={{
        height: "70px",
        backgroundColor: "var(--bg-header)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 90,
      }}
    >
      {/* LEFT: Mobile Menu Button + Breadcrumbs & Page Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          type="button"
          onClick={onToggleMobileDrawer}
          aria-label="Open navigation menu"
          style={{
            display: "none",
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-main)",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          className="mobile-hamburger-btn"
        >
          <Menu size={20} />
        </button>

        {/* Dynamic Breadcrumbs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}
          >
            <span>NobleBond Admin</span>
            <ChevronRight size={12} />
            <span>{activeGroupName}</span>
          </div>
          <h1
            style={{
              fontSize: "19px",
              fontWeight: 700,
              color: "var(--text-main)",
              letterSpacing: "-0.2px",
            }}
          >
            {activeItemName}
          </h1>
        </div>
      </div>

      {/* RIGHT: Global Search + Status Pill + Notification + Theme Toggle + Admin Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Interactive Search Bar Trigger */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 14px",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "13px",
            transition: "all 0.2s ease",
            boxShadow: "var(--shadow-sm)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--border-focus)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <Search size={16} color="var(--primary)" />
          <span className="search-placeholder-text">Search anything...</span>
          <kbd
            style={{
              backgroundColor: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "5px",
              padding: "1px 6px",
              fontSize: "10.5px",
              fontWeight: 600,
              color: "var(--text-muted)",
            }}
            className="search-kbd-hint"
          >
            ⌘K
          </kbd>
        </button>

        {/* Live Broadcast Monitoring Status Pill */}
        <div
          onClick={() => navigate("/live")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "6px 12px",
            borderRadius: "999px",
            backgroundColor: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#EF4444",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          className="live-indicator-pill"
          title="Click to open Live Management"
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: "#EF4444",
            }}
            className="animate-pulse-live"
          />
          <Radio size={13} />
          <span>42 Live</span>
        </div>

        {/* Animated Sun / Moon Theme Toggle */}
        <ThemeToggle variant="header" />

        {/* Notification Bell with Badge & Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            aria-label="View notifications"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: isNotificationOpen ? "var(--primary)" : "var(--text-main)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              transition: "all 0.2s ease",
              boxShadow: "var(--shadow-sm)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-focus)";
              e.currentTarget.style.backgroundColor = "var(--bg-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.backgroundColor = "var(--bg-surface)";
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "var(--primary)",
                border: "2px solid var(--bg-surface)",
              }}
            />
          </button>

          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>

        {/* Admin Avatar in Header */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            aria-label="Admin user menu"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary) 0%, var(--accent-lavender) 100%)",
              border: "2px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: "0 2px 8px var(--primary-glow)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            SA
          </button>

          <AdminProfileMenu
            isOpen={isProfileMenuOpen}
            onClose={() => setIsProfileMenuOpen(false)}
            position="top-right"
          />
        </div>
      </div>

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Responsive Styles Injection */}
      <style>{`
        @media (max-width: 900px) {
          .mobile-hamburger-btn {
            display: flex !important;
          }
          .search-placeholder-text {
            display: none !important;
          }
          .search-kbd-hint {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          .live-indicator-pill {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
