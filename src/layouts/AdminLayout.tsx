import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const SIDEBAR_PREF_KEY = "noblebond_admin_sidebar_collapsed";

export const AdminLayout: React.FC = () => {
  // Desktop collapsed preference persistence
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem(SIDEBAR_PREF_KEY);
    return saved === "true";
  });

  // Mobile drawer open state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Synchronize collapsed state with localStorage
  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_PREF_KEY, String(next));
      return next;
    });
  };

  // Close mobile drawer when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900 && isMobileDrawerOpen) {
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileDrawerOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileDrawerOpen]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--bg-app)",
        color: "var(--text-main)",
        position: "relative",
      }}
    >
      {/* 1. DESKTOP SIDEBAR */}
      <div className="desktop-sidebar-container">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>

      {/* 2. MOBILE DRAWER SIDEBAR WITH BACKDROP */}
      {isMobileDrawerOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
          }}
        >
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(3px)",
              animation: "fadeIn 0.2s ease",
            }}
          />

          {/* Slide-in Drawer Container */}
          <div
            style={{
              position: "relative",
              zIndex: 1001,
              animation: "slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <Sidebar
              isCollapsed={false}
              onToggleCollapse={() => {}}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0, // Prevents flex child overflow
          overflowX: "hidden",
        }}
      >
        <Header onToggleMobileDrawer={() => setIsMobileDrawerOpen(true)} />

        <main
          style={{
            flex: 1,
            padding: "24px 28px",
            maxWidth: "1600px",
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
          className="admin-main-content"
        >
          <Outlet />
        </main>
      </div>

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-sidebar-container {
            display: none !important;
          }
          .admin-main-content {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

