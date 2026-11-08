import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NAVIGATION_GROUPS } from "../../config/navigationConfig";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) handleClose();
      } else if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  // Flatten navigation items for quick search
  const allNavItems = NAVIGATION_GROUPS.flatMap((g) => g.items);
  const filteredNav = allNavItems.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );

  const quickUsers = [
    { name: "Sarah James", email: "sarah.james@example.com", path: "/users" },
    { name: "Emily Carter", email: "emily.carter@noblebond.org", path: "/users" },
    { name: "David King", email: "david.king@domain.com", path: "/users" },
  ].filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "80px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
      onClick={handleClose}
    >
      <div
        className="animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "600px",
          maxWidth: "100%",
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            gap: "12px",
          }}
        >
          <Search size={20} color="var(--primary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search modules, users, live streams, reports... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              color: "var(--text-main)",
              fontSize: "15px",
              fontFamily: "inherit",
            }}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          ) : (
            <kbd
              style={{
                backgroundColor: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "2px 6px",
                fontSize: "11px",
                color: "var(--text-secondary)",
              }}
            >
              ESC
            </kbd>
          )}
        </div>

        {/* Results Body */}
        <div style={{ maxHeight: "380px", overflowY: "auto", padding: "12px" }}>
          {/* Navigation Modules Section */}
          <div style={{ marginBottom: "16px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--text-secondary)",
                letterSpacing: "0.5px",
                padding: "4px 8px",
                display: "block",
              }}
            >
              NAVIGATION MODULES ({filteredNav.length})
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
              {filteredNav.slice(0, 5).map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onClose();
                      navigate(item.path);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "background-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "8px",
                          backgroundColor: "var(--bg-active)",
                          color: "var(--primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)" }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={14} color="var(--text-secondary)" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Users Match */}
          {quickUsers.length > 0 && (
            <div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  letterSpacing: "0.5px",
                  padding: "4px 8px",
                  display: "block",
                }}
              >
                MATCHED USERS ({quickUsers.length})
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
                {quickUsers.map((u, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      onClose();
                      navigate(u.path);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-main)" }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                        {u.email}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        backgroundColor: "var(--bg-surface-elevated)",
                        border: "1px solid var(--border)",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      View in Users
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Tips */}
        <div
          style={{
            padding: "10px 20px",
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface-elevated)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "var(--text-secondary)",
          }}
        >
          <span>Use ↑ and ↓ to navigate</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
