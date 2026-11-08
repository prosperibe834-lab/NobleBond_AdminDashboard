import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PanelLeftClose,
  PanelLeftOpen,
  MoreVertical,
} from "lucide-react";
import { NAVIGATION_GROUPS } from "../config/navigationConfig";
import { useTheme } from "../theme/useTheme";
import { Tooltip } from "../components/common/Tooltip";
import { Badge } from "../components/common/Badge";
import { AdminProfileMenu } from "./AdminProfileMenu";
import { ThemeToggle } from "../components/common/ThemeToggle";

// Logo assets from adminlogo folder
import logoLight from "../assets/adminlogo/noblebond-light.png";
import logoDark from "../assets/adminlogo/noblebond-dark.png";
import logoMark from "../assets/adminlogo/noblebond-mark.png";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const activePath = location.pathname;

  // On mobile drawer, sidebar is always visually expanded
  const effectiveCollapsed = isMobileDrawer ? false : isCollapsed;
  const sidebarWidth = effectiveCollapsed ? "76px" : "264px";

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  return (
    <aside
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        maxWidth: sidebarWidth,
        height: "100vh",
        backgroundColor: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "width 0.28s cubic-bezier(0.2, 0, 0, 1), min-width 0.28s cubic-bezier(0.2, 0, 0, 1)",
        position: isMobileDrawer ? "relative" : "sticky",
        top: 0,
        zIndex: isMobileDrawer ? 1000 : 100,
        boxShadow: effectiveCollapsed ? "var(--shadow-sm)" : "var(--shadow-md)",
        overflow: "hidden",
      }}
    >
      {/* 1. TOP HEADER / BRAND LOGO AREA */}
      <div
        style={{
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: effectiveCollapsed ? "center" : "space-between",
          padding: effectiveCollapsed ? "0 12px" : "0 18px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        {!effectiveCollapsed ? (
          <div
            onClick={() => handleNavigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            <img
              src={isDark ? logoDark : logoLight}
              alt="NobleBond Admin"
              style={{
                height: "32px",
                maxWidth: "155px",
                objectFit: "contain",
                display: "block",
              }}
            />
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: 800,
                letterSpacing: "0.8px",
                color: "var(--primary)",
                backgroundColor: "var(--bg-active)",
                padding: "2px 6px",
                borderRadius: "6px",
                textTransform: "uppercase",
              }}
            >
              Admin
            </span>
          </div>
        ) : (
          <div
            onClick={() => handleNavigate("/")}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="NobleBond Admin"
          >
            <img
              src={logoMark}
              alt="NobleBond"
              style={{
                width: "36px",
                height: "36px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        {/* Collapse / Expand Toggle Button (Hidden on Mobile Drawer) */}
        {!isMobileDrawer && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface-elevated)",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--primary)";
              e.currentTarget.style.borderColor = "var(--border-focus)";
              e.currentTarget.style.backgroundColor = "var(--bg-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.backgroundColor = "var(--bg-surface-elevated)";
            }}
          >
            {effectiveCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        )}
      </div>

      {/* 2. NAVIGATION GROUPS & MODULES LIST (SCROLLABLE) */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: effectiveCollapsed ? "16px 8px" : "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {NAVIGATION_GROUPS.map((group) => (
          <div key={group.id} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {/* Group Label (Hidden in Collapsed Mode) */}
            {!effectiveCollapsed ? (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.8px",
                  color: "var(--text-muted)",
                  padding: "4px 10px",
                  textTransform: "uppercase",
                }}
              >
                {group.label}
              </span>
            ) : (
              <div
                style={{
                  height: "1px",
                  backgroundColor: "var(--border-light)",
                  margin: "6px 8px",
                }}
              />
            )}

            {/* Group Items */}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/"
                  ? activePath === "/"
                  : activePath.startsWith(item.path);

              const itemContent = (
                <button
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: effectiveCollapsed ? "center" : "space-between",
                    gap: "12px",
                    padding: effectiveCollapsed ? "10px 0" : "10px 12px",
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: isActive ? "var(--bg-active)" : "transparent",
                    color: isActive ? "var(--primary)" : "var(--text-main)",
                    cursor: "pointer",
                    position: "relative",
                    transition: "all 0.18s ease",
                    boxShadow: isActive ? "0 0 16px var(--primary-glow)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                      e.currentTarget.style.color = "var(--primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--text-main)";
                    }
                  }}
                >
                  {/* Left Pill Highlight for Active State */}
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "15%",
                        bottom: "15%",
                        width: "3.5px",
                        borderRadius: "0 4px 4px 0",
                        backgroundColor: "var(--primary)",
                      }}
                    />
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isActive ? "var(--primary)" : "var(--text-secondary)",
                        flexShrink: 0,
                        transition: "transform 0.15s ease",
                      }}
                    >
                      <Icon size={19} strokeWidth={isActive ? 2.4 : 1.9} />
                    </div>

                    {!effectiveCollapsed && (
                      <span
                        style={{
                          fontSize: "13.5px",
                          fontWeight: isActive ? 700 : 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name}
                      </span>
                    )}
                  </div>

                  {/* Notification Badge in Expanded Mode */}
                  {!effectiveCollapsed && item.badge && (
                    <Badge variant={item.badge.variant} size="sm" dot={item.badge.variant === "live"}>
                      {item.badge.text}
                    </Badge>
                  )}
                </button>
              );

              // Wrap in Tooltip when sidebar is collapsed
              if (effectiveCollapsed) {
                return (
                  <Tooltip
                    key={item.id}
                    position="right"
                    content={
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>{item.name}</span>
                        {item.badge && (
                          <Badge variant={item.badge.variant} size="sm">
                            {item.badge.text}
                          </Badge>
                        )}
                      </div>
                    }
                  >
                    {itemContent}
                  </Tooltip>
                );
              }

              return <React.Fragment key={item.id}>{itemContent}</React.Fragment>;
            })}
          </div>
        ))}
      </div>

      {/* 3. BOTTOM FOOTER / ADMIN PROFILE & CONTROLS */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: effectiveCollapsed ? "12px 8px" : "12px 14px",
          backgroundColor: "var(--bg-surface-elevated)",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <AdminProfileMenu
          isOpen={isProfileMenuOpen}
          onClose={() => setIsProfileMenuOpen(false)}
          position="bottom-left"
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: effectiveCollapsed ? "center" : "space-between",
            gap: "10px",
          }}
        >
          {/* Admin Avatar & Identity */}
          <div
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "10px",
              transition: "background-color 0.15s",
              flex: 1,
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {effectiveCollapsed ? (
              <Tooltip position="right" content="Sarah Alexander (Super Admin)">
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--primary) 0%, var(--accent-lavender) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "13px",
                    boxShadow: "0 2px 8px var(--primary-glow)",
                  }}
                >
                  SA
                </div>
              </Tooltip>
            ) : (
              <>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--primary) 0%, var(--accent-lavender) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "13px",
                    boxShadow: "0 2px 8px var(--primary-glow)",
                    flexShrink: 0,
                  }}
                >
                  SA
                </div>

                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "var(--text-main)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Sarah Alexander
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Super Admin
                  </div>
                </div>

                <MoreVertical size={16} color="var(--text-secondary)" />
              </>
            )}
          </div>

          {/* Theme Toggle in Footer (When Expanded) */}
          {!effectiveCollapsed && (
            <ThemeToggle variant="sidebar" />
          )}
        </div>
      </div>
    </aside>
  );
};
