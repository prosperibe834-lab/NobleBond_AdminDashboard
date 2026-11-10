import React, { useState } from "react";
import { Search, Clock, Star, X, ArrowRight } from "lucide-react";
import {
  searchSystemSettings,
  type SettingsSearchMatch,
} from "../../data/systemSettingsDataService";
import type {
  SettingsSectionKey,
  SystemSettingsRootState,
} from "../../types/systemSettings.types";
import { SETTINGS_SECTIONS_META } from "./settingsUiUtils";

interface SettingsSearchBarProps {
  state: SystemSettingsRootState;
  quickFilter: "all" | "recent" | "frequent";
  onChangeQuickFilter: (f: "all" | "recent" | "frequent") => void;
  onJumpToSection: (section: SettingsSectionKey) => void;
}

export const SettingsSearchBar: React.FC<SettingsSearchBarProps> = ({
  state,
  quickFilter,
  onChangeQuickFilter,
  onJumpToSection,
}) => {
  const [query, setQuery] = useState("");
  const results: SettingsSearchMatch[] = query.trim() ? searchSystemSettings(state, query) : [];

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Functional Real-Time Settings Search Input */}
        <div
          style={{
            flex: "1 1 280px",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search
            size={15}
            style={{
              position: "absolute",
              left: 12,
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            aria-label="Global System Settings Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any setting, country, currency, role, admin, feature flag..."
            style={{
              width: "100%",
              padding: "9px 34px 9px 36px",
              borderRadius: 11,
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: 13,
              outline: "none",
            }}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search query"
              onClick={() => setQuery("")}
              style={{
                position: "absolute",
                right: 9,
                border: "none",
                background: "transparent",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: 2,
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Section Quick Filters: All / Recently Changed / Frequently Used */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[
            { key: "all" as const, label: "All 19 Sections", icon: null },
            { key: "recent" as const, label: "Recently Changed", icon: <Clock size={12} /> },
            { key: "frequent" as const, label: "Frequently Used", icon: <Star size={12} /> },
          ].map((btn) => {
            const active = quickFilter === btn.key;
            return (
              <button
                key={btn.key}
                type="button"
                onClick={() => onChangeQuickFilter(btn.key)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 11px",
                  borderRadius: 10,
                  border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
                  background: active ? "var(--bg-active)" : "var(--bg-card)",
                  color: active ? "var(--primary)" : "var(--text-secondary)",
                  fontSize: 12,
                  fontWeight: active ? 700 : 600,
                  cursor: "pointer",
                }}
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Dropdown of Direct Section Results */}
      {query.trim().length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 44,
            left: 0,
            right: 0,
            zIndex: 75,
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            boxShadow: "var(--shadow-lg)",
            padding: 10,
            maxHeight: 330,
            overflowY: "auto",
          }}
        >
          {results.length === 0 ? (
            <div style={{ padding: 12, fontSize: 12.5, color: "var(--text-muted)" }}>
              No configuration entries matched "{query}". Try terms like "Stripe", "Nigeria",
              "MFA", "Theme", "Plan a Date", or "Super Administrator".
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {results.map((res) => (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => {
                    onJumpToSection(res.sectionKey);
                    setQuery("");
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 11px",
                    borderRadius: 10,
                    border: "1px solid var(--border-light)",
                    background: "var(--bg-surface-elevated)",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>
                      {res.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>
                      {res.snippet}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--primary)",
                        background: "var(--bg-active)",
                        padding: "2px 8px",
                        borderRadius: 999,
                      }}
                    >
                      {res.sectionLabel}
                    </span>
                    <ArrowRight size={13} style={{ color: "var(--text-muted)" }} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick shortcut pills when Recent or Frequent filter is chosen */}
      {quickFilter !== "all" && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            padding: "8px 12px",
            borderRadius: 12,
            background: "var(--bg-surface-elevated)",
            border: "1px solid var(--border-light)",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-secondary)" }}>
            {quickFilter === "recent" ? "Recently Updated:" : "Frequently Accessed:"}
          </span>
          {(quickFilter === "recent" ? state.recentlyUsedSections : state.frequentlyUsedSections).map(
            (key) => {
              const meta = SETTINGS_SECTIONS_META.find((m) => m.key === key);
              if (!meta) return null;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onJumpToSection(key)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: "1px solid var(--border)",
                    background: "var(--bg-card)",
                    color: "var(--primary)",
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {meta.label}
                </button>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

