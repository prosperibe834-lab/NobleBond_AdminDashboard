import React, { useState } from "react";
import { Check } from "lucide-react";
import { Badge } from "../components/common/Badge";

export const SubscriptionManagementPage: React.FC = () => {
  const [plans] = useState([
    {
      id: "plan_1",
      name: "1 Week Premium",
      price: "$4.99",
      billingPeriod: "weekly",
      subscribers: "8,420",
      revenueShare: "12%",
      features: ["See Who Liked You", "Unlimited Likes", "5 Super Likes/week"],
      status: "active",
    },
    {
      id: "plan_2",
      name: "1 Month Premium",
      price: "$9.99",
      billingPeriod: "monthly",
      subscribers: "29,610",
      revenueShare: "58%",
      popular: true,
      features: ["All Weekly Features", "1 Free Profile Boost/month", "Incognito Mode", "Read Receipts"],
      status: "active",
    },
    {
      id: "plan_3",
      name: "12 Months Premium",
      price: "$59.88",
      billingPeriod: "annual",
      subscribers: "14,810",
      revenueShare: "30%",
      features: ["All Monthly Features", "5 Free Boosts", "VIP Crown Badge", "Priority Match Discovery"],
      status: "active",
    },
  ]);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>
          Subscription & Membership Management
        </h2>
        <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
          Manage NobleBond Premium tiers, active subscribers, pricing models, and monthly recurring revenue (MRR).
        </p>
      </div>

      {/* KPI Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div style={{ padding: "18px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontWeight: 600 }}>Active Subscribers</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--primary)", marginTop: "4px" }}>52,840</div>
          <div style={{ fontSize: "12px", color: "var(--status-success)", marginTop: "4px" }}>+8.4% this month</div>
        </div>
        <div style={{ padding: "18px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontWeight: 600 }}>Monthly Recurring Revenue</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--accent-champagne)", marginTop: "4px" }}>$312,450</div>
          <div style={{ fontSize: "12px", color: "var(--status-success)", marginTop: "4px" }}>94.2% renewal rate</div>
        </div>
        <div style={{ padding: "18px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontWeight: 600 }}>Average Churn Rate</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--status-success)", marginTop: "4px" }}>2.4%</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Industry low</div>
        </div>
      </div>

      {/* Subscription Plans Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              padding: "24px",
              backgroundColor: "var(--bg-card)",
              border: plan.popular ? "2px solid var(--primary)" : "1px solid var(--border)",
              borderRadius: "18px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              position: "relative",
            }}
          >
            {plan.popular && (
              <div style={{ position: "absolute", top: "-10px", right: "20px" }}>
                <Badge variant="primary">MOST POPULAR</Badge>
              </div>
            )}

            <div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "6px" }}>
                <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--primary)" }}>{plan.price}</span>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>/ {plan.billingPeriod}</span>
              </div>
            </div>

            <div style={{ padding: "10px", backgroundColor: "var(--bg-surface-elevated)", borderRadius: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
              Subscribers: <strong style={{ color: "var(--text-main)" }}>{plan.subscribers}</strong> ({plan.revenueShare} MRR)
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              {plan.features.map((feat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-main)" }}>
                  <Check size={14} color="var(--status-success)" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Configure Tier Pricing
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
