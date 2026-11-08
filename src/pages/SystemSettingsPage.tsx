import React, { useState } from "react";
import { CheckCircle2, Moon, Sun } from "lucide-react";
import { useTheme } from "../theme/useTheme";
import { Badge } from "../components/common/Badge";

export const SystemSettingsPage: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();
  const [platformName, setPlatformName] = useState("NobleBond");
  const [supportEmail, setSupportEmail] = useState("support@noblebond.com");
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [twoFactorRequired, setTwoFactorRequired] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>
            System Settings & Security Configuration
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Global platform parameters, theme defaults, regional currencies, and moderator access controls.
          </p>
        </div>

        {isSaved && (
          <div
            className="animate-scale-up"
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--status-success-bg)",
              border: "1px solid var(--status-success)",
              borderRadius: "10px",
              color: "var(--status-success)",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
            Settings saved successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* 1. General Platform Branding */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", marginBottom: "14px" }}>
            General Platform Settings
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Platform Display Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "13.5px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Primary Support Inbound Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "13.5px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Default Base Currency
              </label>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "13.5px",
                }}
              >
                <option value="USD">USD ($) — United States Dollar</option>
                <option value="NGN">NGN (₦) — Nigerian Naira</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="CAD">CAD ($) — Canadian Dollar</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Theme & Visual Appearance */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", marginBottom: "14px" }}>
            Visual Theme & Styling
          </h3>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)" }}>
                Active Administration Theme: <strong>{isDark ? "Dark Plum Mode" : "Warm Light Mode"}</strong>
              </div>
              <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                NobleBond brand identity tokens: Pink primary (#C12F66 / #F15B8D), Lavender (#7C68E8 / #B8A8FF), Champagne (#B58B42 / #E5C57B).
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: isDark ? "var(--accent-champagne)" : "var(--primary)",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              Switch to {isDark ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>

        {/* 3. Security & Moderator Access Controls */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", marginBottom: "14px" }}>
            Security & Compliance Policies
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={twoFactorRequired}
                onChange={(e) => setTwoFactorRequired(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
              />
              <div>
                <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-main)" }}>
                  Enforce Two-Factor Authentication (2FA) for All Administrators
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Mandatory hardware key or authenticator app for staff handling user privacy and financial transactions.
                </div>
              </div>
            </label>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid var(--border-light)" }}>
              <div>
                <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-main)" }}>
                  Session Idle Timeout
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Automatically locks admin console after 30 minutes of inactivity.
                </div>
              </div>
              <Badge variant="success">Active (30 mins)</Badge>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            style={{
              padding: "12px 28px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 16px var(--primary-glow)",
            }}
          >
            Save All Platform Changes
          </button>
        </div>
      </form>
    </div>
  );
};
