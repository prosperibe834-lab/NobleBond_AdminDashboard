import React from "react";
import {
  X,
  Filter,
  RotateCcw,
  Check,
  Shield,
  Wallet,
  Activity as ActivityIcon,
  Crown,
  UserCheck,
} from "lucide-react";
import type { UserFilterState } from "../../types/userManagement.types";

interface UserFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: UserFilterState;
  onFilterChange: (newFilters: UserFilterState) => void;
  onReset: () => void;
  activeFilterCount: number;
  totalFilteredCount: number;
}

export const UserFilterDrawer: React.FC<UserFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  activeFilterCount,
  totalFilteredCount,
}) => {
  if (!isOpen) return null;

  const update = (patch: Partial<UserFilterState>) => {
    onFilterChange({ ...filters, ...patch });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "flex-end",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          height: "100%",
          backgroundColor: "var(--bg-card)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "var(--shadow-elevated)",
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "rgba(193, 47, 102, 0.08)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Filter size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                Advanced Filters
              </h3>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {totalFilteredCount} users matching criteria
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onReset}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "5px 10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--primary)",
                  backgroundColor: "rgba(193, 47, 102, 0.08)",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={12} />
                <span>Reset ({activeFilterCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Drawer Body - Scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* 1. Account Status */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12.5px",
                fontWeight: 700,
                color: "var(--text-main)",
                marginBottom: "8px",
              }}
            >
              Account Status
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {[
                { id: "all", label: "All Statuses" },
                { id: "active", label: "Active" },
                { id: "online", label: "Online Now" },
                { id: "suspended", label: "Suspended" },
                { id: "banned", label: "Banned" },
                { id: "pending_verification", label: "Pending Verification" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update({ accountStatus: opt.id })}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: "1px solid",
                    borderColor:
                      filters.accountStatus === opt.id ? "var(--primary)" : "var(--border)",
                    backgroundColor:
                      filters.accountStatus === opt.id ? "rgba(193, 47, 102, 0.1)" : "var(--bg-surface)",
                    color:
                      filters.accountStatus === opt.id ? "var(--primary)" : "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Gender */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12.5px",
                fontWeight: 700,
                color: "var(--text-main)",
                marginBottom: "8px",
              }}
            >
              Gender
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {[
                { id: "all", label: "All Genders" },
                { id: "female", label: "Female" },
                { id: "male", label: "Male" },
                { id: "other", label: "Other" },
                { id: "prefer_not_to_say", label: "Prefer not to say" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update({ gender: opt.id })}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: "1px solid",
                    borderColor: filters.gender === opt.id ? "var(--primary)" : "var(--border)",
                    backgroundColor:
                      filters.gender === opt.id ? "rgba(193, 47, 102, 0.1)" : "var(--bg-surface)",
                    color: filters.gender === opt.id ? "var(--primary)" : "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Age Range Slider/Inputs */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
                Age Range (DOB Calculated)
              </label>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary)" }}>
                {filters.ageMin} - {filters.ageMax} yrs
              </span>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <input
                type="range"
                min={18}
                max={70}
                value={filters.ageMin}
                onChange={(e) => update({ ageMin: Math.min(Number(e.target.value), filters.ageMax) })}
                style={{ flex: 1, accentColor: "var(--primary)" }}
              />
              <input
                type="range"
                min={18}
                max={70}
                value={filters.ageMax}
                onChange={(e) => update({ ageMax: Math.max(Number(e.target.value), filters.ageMin) })}
                style={{ flex: 1, accentColor: "var(--primary)" }}
              />
            </div>
          </div>

          {/* 4. Location / Country */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12.5px",
                fontWeight: 700,
                color: "var(--text-main)",
                marginBottom: "8px",
              }}
            >
              Location / Country
            </label>
            <select
              value={filters.country}
              onChange={(e) => update({ country: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="all">All Countries</option>
              <option value="Nigeria">Nigeria</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="Ghana">Ghana</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
            </select>
          </div>

          {/* 5. Verification Status */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <UserCheck size={14} color="var(--status-success)" />
              <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
                Verification Tier
              </label>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {[
                { id: "all", label: "All" },
                { id: "verified", label: "Fully Verified" },
                { id: "photo", label: "Photo Verified" },
                { id: "pending", label: "Pending Review" },
                { id: "unverified", label: "Unverified" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update({ verification: opt.id })}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: "1px solid",
                    borderColor: filters.verification === opt.id ? "var(--primary)" : "var(--border)",
                    backgroundColor:
                      filters.verification === opt.id ? "rgba(193, 47, 102, 0.1)" : "var(--bg-surface)",
                    color: filters.verification === opt.id ? "var(--primary)" : "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Premium Subscriptions */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <Crown size={14} color="var(--accent-champagne)" />
              <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
                Premium Membership
              </label>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {[
                { id: "all", label: "All" },
                { id: "premium", label: "All Premium VIP" },
                { id: "free", label: "Free Members" },
                { id: "active", label: "Active Subs" },
                { id: "expired", label: "Expired" },
                { id: "cancelled", label: "Cancelled" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update({ premium: opt.id })}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: "1px solid",
                    borderColor: filters.premium === opt.id ? "var(--accent-champagne)" : "var(--border)",
                    backgroundColor:
                      filters.premium === opt.id ? "rgba(181, 139, 66, 0.1)" : "var(--bg-surface)",
                    color: filters.premium === opt.id ? "var(--accent-champagne)" : "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Wallet & Virtual Currencies */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <Wallet size={14} color="var(--accent-lavender)" />
              <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
                Virtual Wallets (Coins & Points)
              </label>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", width: "80px", color: "var(--text-secondary)" }}>
                  Gift Coins:
                </span>
                {["all", "has_coins", "no_coins"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => update({ walletCoins: val })}
                    style={{
                      flex: 1,
                      padding: "5px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      border: "1px solid",
                      borderColor: filters.walletCoins === val ? "var(--accent-champagne)" : "var(--border)",
                      backgroundColor:
                        filters.walletCoins === val ? "rgba(181, 139, 66, 0.1)" : "var(--bg-surface)",
                      color: filters.walletCoins === val ? "var(--accent-champagne)" : "var(--text-secondary)",
                      cursor: "pointer",
                    }}
                  >
                    {val === "all" ? "All" : val === "has_coins" ? "Has Coins" : "Zero Coins"}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", width: "80px", color: "var(--text-secondary)" }}>
                  Points:
                </span>
                {["all", "has_points", "no_points"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => update({ walletPoints: val })}
                    style={{
                      flex: 1,
                      padding: "5px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      border: "1px solid",
                      borderColor: filters.walletPoints === val ? "var(--accent-lavender)" : "var(--border)",
                      backgroundColor:
                        filters.walletPoints === val ? "rgba(124, 104, 232, 0.1)" : "var(--bg-surface)",
                      color: filters.walletPoints === val ? "var(--accent-lavender)" : "var(--text-secondary)",
                      cursor: "pointer",
                    }}
                  >
                    {val === "all" ? "All" : val === "has_points" ? "Has Points" : "Zero Points"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 8. Activity Filters */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <ActivityIcon size={14} color="var(--primary)" />
              <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
                Engagement & Activity
              </label>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {[
                { id: "all", label: "All" },
                { id: "recent", label: "Recently Active" },
                { id: "inactive", label: "Inactive" },
                { id: "live_host", label: "Live Stream Hosts" },
                { id: "gift_sender", label: "Gift Senders" },
                { id: "gift_receiver", label: "Gift Receivers" },
                { id: "has_matches", label: "With Matches" },
                { id: "no_matches", label: "Zero Matches" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update({ activity: opt.id })}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    border: "1px solid",
                    borderColor: filters.activity === opt.id ? "var(--primary)" : "var(--border)",
                    backgroundColor:
                      filters.activity === opt.id ? "rgba(193, 47, 102, 0.1)" : "var(--bg-surface)",
                    color: filters.activity === opt.id ? "var(--primary)" : "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 9. Referral Filters */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12.5px",
                fontWeight: 700,
                color: "var(--text-main)",
                marginBottom: "8px",
              }}
            >
              Referral Performance (Invite & Earn)
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {[
                { id: "all", label: "All Users" },
                { id: "has_referrals", label: "Has Referred Friends" },
                { id: "successful_referrals", label: "Qualified (+50 Pts)" },
                { id: "pending_referrals", label: "Pending Verification" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update({ referral: opt.id })}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    border: "1px solid",
                    borderColor: filters.referral === opt.id ? "var(--accent-lavender)" : "var(--border)",
                    backgroundColor:
                      filters.referral === opt.id ? "rgba(124, 104, 232, 0.1)" : "var(--bg-surface)",
                    color: filters.referral === opt.id ? "var(--accent-lavender)" : "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 10. Device Platform & Security / VPN */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <Shield size={14} color="var(--status-info)" />
              <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
                Device Platform & VPN Risk
              </label>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", width: "80px", color: "var(--text-secondary)" }}>
                  Platform:
                </span>
                {[
                  { id: "all", label: "All" },
                  { id: "ios", label: "iOS" },
                  { id: "android", label: "Android" },
                  { id: "web", label: "Web" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => update({ platform: opt.id })}
                    style={{
                      flex: 1,
                      padding: "5px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      border: "1px solid",
                      borderColor: filters.platform === opt.id ? "var(--primary)" : "var(--border)",
                      backgroundColor:
                        filters.platform === opt.id ? "rgba(193, 47, 102, 0.1)" : "var(--bg-surface)",
                      color: filters.platform === opt.id ? "var(--primary)" : "var(--text-secondary)",
                      cursor: "pointer",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", width: "80px", color: "var(--text-secondary)" }}>
                  VPN Risk:
                </span>
                {[
                  { id: "all", label: "All" },
                  { id: "detected", label: "VPN Flagged" },
                  { id: "not_detected", label: "Clean IP" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => update({ vpn: opt.id })}
                    style={{
                      flex: 1,
                      padding: "5px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      border: "1px solid",
                      borderColor: filters.vpn === opt.id ? "var(--status-danger)" : "var(--border)",
                      backgroundColor:
                        filters.vpn === opt.id ? "rgba(201, 54, 79, 0.1)" : "var(--bg-surface)",
                      color: filters.vpn === opt.id ? "var(--status-danger)" : "var(--text-secondary)",
                      cursor: "pointer",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              border: "none",
              fontSize: "13.5px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <Check size={16} />
            <span>Apply Filters ({totalFilteredCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
