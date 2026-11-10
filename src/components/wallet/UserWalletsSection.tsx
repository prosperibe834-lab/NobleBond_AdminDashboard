import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Download, Wallet, ExternalLink, ArrowUpDown } from "lucide-react";
import type { UserWalletSummary } from "../../types/walletManagement.types";
import { Badge } from "../common/Badge";
import { formatCoins, formatDateTime, formatPoints } from "./walletUiUtils";
import { exportUserWalletsCsv } from "../../data/walletManagementDataService";

interface UserWalletsSectionProps {
  wallets: UserWalletSummary[];
  onInspectWallet: (wallet: UserWalletSummary) => void;
  onExportToast: (msg: string) => void;
}

export const UserWalletsSection: React.FC<UserWalletsSectionProps> = ({
  wallets,
  onInspectWallet,
  onExportToast,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"coins" | "points" | "gifts" | "name">("coins");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = wallets
    .filter((w) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.username.toLowerCase().includes(q) ||
        w.email.toLowerCase().includes(q) ||
        w.userId.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || w.accountStatus === statusFilter;
      return matchQuery && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "coins") return b.giftCoinsBalance - a.giftCoinsBalance;
      if (sortBy === "points") return b.connectionPointsBalance - a.connectionPointsBalance;
      if (sortBy === "gifts") return b.giftsReceivedCoinValue - a.giftsReceivedCoinValue;
      return a.name.localeCompare(b.name);
    });

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "18px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "var(--primary-glow)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Wallet size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Member Wallets Directory ({filtered.length})
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Separate Gift Coins and Connection Points balances synced live with User Management
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search
              size={14}
              style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member, email, ID..."
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "9px",
                padding: "8px 10px 8px 32px",
                fontSize: "0.8rem",
                width: "215px",
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              borderRadius: "9px",
              padding: "8px 10px",
              fontSize: "0.8rem",
            }}
          >
            <option value="all">All Account Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>

          <button
            type="button"
            onClick={() =>
              setSortBy((prev) =>
                prev === "coins" ? "points" : prev === "points" ? "gifts" : prev === "gifts" ? "name" : "coins"
              )
            }
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              borderRadius: "9px",
              padding: "8px 11px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <ArrowUpDown size={14} />
            <span>Sort: {sortBy === "coins" ? "Gift Coins" : sortBy === "points" ? "Points" : sortBy === "gifts" ? "Host Gifts" : "Name"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              exportUserWalletsCsv(filtered);
              onExportToast(`Exported ${filtered.length} member wallet summaries to CSV.`);
            }}
            style={{
              background: "var(--primary)",
              border: "none",
              color: "#fff",
              borderRadius: "9px",
              padding: "8px 12px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Download size={14} />
            <span>Export Wallets</span>
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
              <th style={{ padding: "10px 8px" }}>Member</th>
              <th style={{ padding: "10px 8px" }}>Gift Coins Wallet</th>
              <th style={{ padding: "10px 8px" }}>Connection Points Wallet</th>
              <th style={{ padding: "10px 8px" }}>Non-Cash Host Receipts</th>
              <th style={{ padding: "10px 8px" }}>Wallet State</th>
              <th style={{ padding: "10px 8px" }}>Last Activity</th>
              <th style={{ padding: "10px 8px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr
                key={w.userId}
                onClick={() => onInspectWallet(w)}
                style={{ borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
              >
                <td style={{ padding: "11px 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <img
                      src={w.avatar}
                      alt={w.name}
                      style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{w.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                        @{w.username} ({w.userId})
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "11px 8px" }}>
                  <div style={{ fontWeight: 800, color: "var(--accent-champagne)", fontSize: "0.88rem" }}>
                    {formatCoins(w.giftCoinsBalance)}
                  </div>
                  <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>
                    Purchased: {w.giftCoinsPurchasedTotal} | Spent: {w.giftCoinsSpentTotal}
                  </div>
                </td>
                <td style={{ padding: "11px 8px" }}>
                  <div style={{ fontWeight: 800, color: "var(--accent-lavender)", fontSize: "0.88rem" }}>
                    {formatPoints(w.connectionPointsBalance)}
                  </div>
                  <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>
                    Earned: {w.connectionPointsEarnedReferrals} | Redeemed: {w.connectionPointsRedeemedTotal}
                  </div>
                </td>
                <td style={{ padding: "11px 8px" }}>
                  <div style={{ fontWeight: 700, color: "var(--status-info)" }}>
                    {formatCoins(w.giftsReceivedCoinValue)}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Non-cash gifts metric</div>
                </td>
                <td style={{ padding: "11px 8px" }}>
                  <Badge
                    variant={
                      w.walletStatus === "active"
                        ? "success"
                        : w.walletStatus === "restricted"
                        ? "warning"
                        : "error"
                    }
                    size="sm"
                  >
                    {w.walletStatus.replace("_", " ").toUpperCase()}
                  </Badge>
                </td>
                <td style={{ padding: "11px 8px", color: "var(--text-secondary)" }}>
                  {formatDateTime(w.lastTransactionAt)}
                </td>
                <td style={{ padding: "11px 8px", textAlign: "right" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/users?userId=${encodeURIComponent(w.userId)}`);
                    }}
                    style={{
                      background: "var(--bg-surface-elevated)",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                      borderRadius: "8px",
                      padding: "5px 9px",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    title="Open User in User Management"
                  >
                    <span>Profile</span>
                    <ExternalLink size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

