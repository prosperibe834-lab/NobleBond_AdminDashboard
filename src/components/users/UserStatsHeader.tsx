import React from "react";
import {
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  Crown,
  Radio,
  Coins,
  Sparkles,
  TrendingUp,
  Activity,
  UserPlus,
} from "lucide-react";
import type { UserStatsKpis } from "../../types/userManagement.types";

interface UserStatsHeaderProps {
  kpis: UserStatsKpis;
  activeFilter: string;
  onFilterClick: (filterKey: string, filterValue: string) => void;
}

export const UserStatsHeader: React.FC<UserStatsHeaderProps> = ({
  kpis,
  activeFilter,
  onFilterClick,
}) => {
  const cards = [
    {
      id: "total",
      title: "Total Users",
      value: kpis.totalUsers.toLocaleString(),
      subtext: `+${kpis.growthPercentage}% vs last month`,
      icon: Users,
      color: "var(--primary)",
      bg: "rgba(193, 47, 102, 0.08)",
      filterKey: "accountStatus",
      filterValue: "all",
    },
    {
      id: "active",
      title: "Active Users",
      value: kpis.activeUsersDau.toLocaleString(),
      subtext: `DAU | WAU: ${(kpis.activeUsersWau / 1000).toFixed(0)}k | MAU: ${(kpis.activeUsersMau / 1000000).toFixed(2)}M`,
      icon: Activity,
      color: "var(--accent-lavender)",
      bg: "rgba(124, 104, 232, 0.08)",
      filterKey: "activity",
      filterValue: "recent",
    },
    {
      id: "new_reg",
      title: "New Registrations",
      value: `+${kpis.newRegistrationsToday.toLocaleString()}`,
      subtext: `${kpis.newRegistrationsPeriod.toLocaleString()} registered this month`,
      icon: UserPlus,
      color: "var(--status-success)",
      bg: "rgba(20, 132, 95, 0.08)",
      filterKey: "activity",
      filterValue: "recent",
    },
    {
      id: "verified",
      title: "Verified Accounts",
      value: kpis.verifiedTotal.toLocaleString(),
      subtext: `Email: ${kpis.verifiedEmail} | Phone: ${kpis.verifiedPhone} | Photo: ${kpis.verifiedPhoto}`,
      icon: UserCheck,
      color: "var(--status-success)",
      bg: "rgba(20, 132, 95, 0.08)",
      filterKey: "verification",
      filterValue: "verified",
    },
    {
      id: "unverified",
      title: "Unverified Users",
      value: kpis.unverifiedTotal.toLocaleString(),
      subtext: "Pending phone/photo checks",
      icon: UserX,
      color: "var(--status-warning)",
      bg: "rgba(181, 139, 66, 0.08)",
      filterKey: "verification",
      filterValue: "unverified",
    },
    {
      id: "suspended",
      title: "Suspended Accounts",
      value: kpis.suspendedTotal.toLocaleString(),
      subtext: `${kpis.bannedTotal} permanently banned`,
      icon: ShieldAlert,
      color: "var(--status-danger)",
      bg: "rgba(201, 54, 79, 0.08)",
      filterKey: "accountStatus",
      filterValue: "suspended",
    },
    {
      id: "premium",
      title: "Premium Subscribers",
      value: kpis.premiumTotal.toLocaleString(),
      subtext: "Active VIP & Pass Holders",
      icon: Crown,
      color: "var(--accent-champagne)",
      bg: "rgba(181, 139, 66, 0.12)",
      filterKey: "premium",
      filterValue: "premium",
    },
    {
      id: "online",
      title: "Online Users",
      value: kpis.onlineTotal.toLocaleString(),
      subtext: "Live session presence now",
      icon: Radio,
      color: "var(--status-success)",
      bg: "rgba(20, 132, 95, 0.08)",
      filterKey: "accountStatus",
      filterValue: "online",
    },
    {
      id: "gift_coins",
      title: "Total Gift Coins",
      value: kpis.totalGiftCoins.toLocaleString(),
      subtext: "Live gifting currency in wallets",
      icon: Coins,
      color: "var(--accent-champagne)",
      bg: "rgba(181, 139, 66, 0.08)",
      filterKey: "walletCoins",
      filterValue: "has_coins",
    },
    {
      id: "connection_points",
      title: "Connection Points",
      value: kpis.totalConnectionPoints.toLocaleString(),
      subtext: "Marketing referral rewards pool",
      icon: Sparkles,
      color: "var(--accent-lavender)",
      bg: "rgba(124, 104, 232, 0.08)",
      filterKey: "walletPoints",
      filterValue: "has_points",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
        gap: "12px",
      }}
    >
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isActive = activeFilter === card.id || activeFilter === card.filterValue;

        return (
          <div
            key={card.id}
            onClick={() => onFilterClick(card.filterKey, card.filterValue)}
            role="button"
            tabIndex={0}
            style={{
              padding: "14px 16px",
              borderRadius: "14px",
              backgroundColor: "var(--bg-card)",
              border: isActive ? `2px solid ${card.color}` : "1px solid var(--border)",
              boxShadow: isActive ? `0 0 0 2px ${card.bg}` : "var(--shadow-card)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "var(--shadow-elevated)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = isActive
                ? `0 0 0 2px ${card.bg}`
                : "var(--shadow-card)";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                }}
              >
                {card.title}
              </span>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  backgroundColor: card.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.color,
                }}
              >
                <IconComponent size={16} />
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--text-main)",
                  letterSpacing: "-0.02em",
                }}
              >
                {card.value}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  marginTop: "3px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {card.id === "total" && <TrendingUp size={11} color="var(--status-success)" />}
                {card.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

