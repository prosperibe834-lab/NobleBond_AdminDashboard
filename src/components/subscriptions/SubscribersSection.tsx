// NobleBond Admin — Subscriber Directory Section
// Aggregates lifetime Premium spend, successful payments, and plan standing per unique member. Zero emojis.

import React, { useState, useMemo } from "react";
import {
  Search,
  ExternalLink,
  Gift,
  Eye,
  ArrowUpDown,
} from "lucide-react";
import type {
  SubscriberSummaryRecord,
  AdminRolePermissions,
} from "../../types/subscriptionManagement.types";
import { Badge } from "../common/Badge";
import {
  formatMoney,
  formatShortDate,
  getSubscriptionStatusMeta,
} from "./subscriptionUiUtils";

interface SubscribersSectionProps {
  subscribers: SubscriberSummaryRecord[];
  permissions: AdminRolePermissions;
  onOpenSubscriber: (sub: SubscriberSummaryRecord) => void;
  onOpenUserProfile: (userId: string) => void;
  onGrantComplimentary: (sub: SubscriberSummaryRecord) => void;
}

export const SubscribersSection: React.FC<SubscribersSectionProps> = ({
  subscribers,
  permissions,
  onOpenSubscriber,
  onOpenUserProfile,
  onGrantComplimentary,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"spend" | "name" | "start">("spend");

  const countries = useMemo(() => {
    const set = new Set(subscribers.map((s) => s.country));
    return Array.from(set).sort();
  }, [subscribers]);

  const filtered = useMemo(() => {
    let list = [...subscribers];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.username.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          s.currentPlanName.toLowerCase().includes(q)
      );
    }
    if (countryFilter !== "all") {
      list = list.filter((s) => s.country === countryFilter);
    }
    list.sort((a, b) => {
      if (sortBy === "spend") return b.lifetimeSubscriptionSpend - a.lifetimeSubscriptionSpend;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
    return list;
  }, [subscribers, searchQuery, countryFilter, sortBy]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Filter Toolbar */}
      <div
        style={{
          padding: "14px 16px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 12px",
            borderRadius: "9px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface-elevated)",
            flex: "1 1 240px",
            minWidth: "220px",
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter subscribers by name, @username, email, plan..."
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              color: "var(--text-main)",
              fontSize: "12.5px",
              width: "100%",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            style={{
              padding: "7px 10px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <option value="all">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() =>
              setSortBy((prev) => (prev === "spend" ? "start" : prev === "start" ? "name" : "spend"))
            }
            style={{
              padding: "7px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ArrowUpDown size={13} color="var(--primary)" />
            <span>
              Sort: {sortBy === "spend" ? "Lifetime Spend" : sortBy === "start" ? "Most Recent" : "Name (A-Z)"}
            </span>
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          overflowX: "auto",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr
              style={{
                backgroundColor: "var(--bg-surface-elevated)",
                borderBottom: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontSize: "11.5px",
              }}
            >
              <th style={{ padding: "12px 14px" }}>SUBSCRIBER</th>
              <th style={{ padding: "12px 14px" }}>COUNTRY</th>
              <th style={{ padding: "12px 14px" }}>CURRENT PLAN</th>
              <th style={{ padding: "12px 14px" }}>SUB STATUS</th>
              <th style={{ padding: "12px 14px" }}>START / NEXT RENEWAL</th>
              <th style={{ padding: "12px 14px" }}>PAYMENTS</th>
              <th style={{ padding: "12px 14px" }}>LIFETIME SPEND</th>
              <th style={{ padding: "12px 14px" }}>ACCOUNT</th>
              <th style={{ padding: "12px 14px" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub) => {
              const statusMeta = getSubscriptionStatusMeta(sub.subscriptionStatus);
              return (
                <tr
                  key={sub.userId}
                  onClick={() => onOpenSubscriber(sub)}
                  style={{ borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "200px" }}>
                      <img
                        src={sub.avatar}
                        alt={sub.name}
                        style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "5px" }}>
                          <span>{sub.name}</span>
                          {sub.isComplimentary && <Gift size={12} color="var(--accent-champagne)" />}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                          {sub.username} &bull; {sub.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>
                    {sub.country} ({sub.countryCode})
                  </td>

                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--text-main)" }}>
                    {sub.currentPlanName}
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                  </td>

                  <td style={{ padding: "12px 14px", fontSize: "12px", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                    <div>Start: {formatShortDate(sub.startDate)}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Renew: {sub.nextRenewalDate ? formatShortDate(sub.nextRenewalDate) : "N/A"}
                    </div>
                  </td>

                  <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--text-main)" }}>
                    {sub.totalSuccessfulPayments}
                  </td>

                  <td style={{ padding: "12px 14px", fontWeight: 800, color: "var(--primary)", whiteSpace: "nowrap" }}>
                    {formatMoney(sub.lifetimeSubscriptionSpend)} {sub.currency}
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    <Badge variant={sub.accountStatus === "banned" || sub.accountStatus === "suspended" ? "error" : "success"}>
                      {sub.accountStatus}
                    </Badge>
                  </td>

                  <td style={{ padding: "12px 14px" }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={() => onOpenSubscriber(sub)}
                        style={{
                          padding: "5px 9px",
                          borderRadius: "7px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--bg-surface)",
                          color: "var(--primary)",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Eye size={12} /> Profile
                      </button>
                      {permissions.canGrantComplimentary && !sub.isComplimentary && (
                        <button
                          type="button"
                          onClick={() => onGrantComplimentary(sub)}
                          style={{
                            padding: "5px 8px",
                            borderRadius: "7px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--accent-champagne)",
                            fontSize: "11.5px",
                            cursor: "pointer",
                          }}
                          title="Grant Complimentary VIP"
                        >
                          <Gift size={12} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onOpenUserProfile(sub.userId)}
                        style={{
                          padding: "5px 8px",
                          borderRadius: "7px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--bg-surface)",
                          color: "var(--text-secondary)",
                          fontSize: "11.5px",
                          cursor: "pointer",
                        }}
                        title="View in User Management"
                      >
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

