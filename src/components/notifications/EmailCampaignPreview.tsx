import React, { useState } from "react";
import { Monitor, Smartphone, Sun, Moon, Mail } from "lucide-react";
import logoLight from "../../assets/adminlogo/noblebond-light.png";
import logoDark from "../../assets/adminlogo/noblebond-dark.png";
import { renderSampleVariables } from "./notificationsUiUtils";

interface EmailCampaignPreviewProps {
  subject: string;
  previewText: string;
  heading: string;
  body: string;
  bannerUrl?: string;
  ctaLabel: string;
  footerText: string;
  senderName?: string;
  senderEmail?: string;
}

export const EmailCampaignPreview: React.FC<EmailCampaignPreviewProps> = ({
  subject,
  previewText,
  heading,
  body,
  bannerUrl,
  ctaLabel,
  footerText,
  senderName = "NobleBond",
  senderEmail = "support@noblebond.com",
}) => {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [darkCanvas, setDarkCanvas] = useState(false);

  const bgOuter = darkCanvas ? "#151019" : "#FFF8F6";
  const bgCard = darkCanvas ? "#211824" : "#FFFFFF";
  const textMain = darkCanvas ? "#FFF8FC" : "#291B27";
  const textSub = darkCanvas ? "#C7B9C7" : "#766674";
  const borderCol = darkCanvas ? "#403244" : "#E8DDE3";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 8,
              border: `1px solid ${viewport === "desktop" ? "var(--primary)" : "var(--border)"}`,
              background: viewport === "desktop" ? "var(--bg-active)" : "var(--bg-surface-elevated)",
              color: viewport === "desktop" ? "var(--primary)" : "var(--text-secondary)",
              fontSize: 11.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Monitor size={12} /> Desktop
          </button>
          <button
            type="button"
            onClick={() => setViewport("mobile")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 8,
              border: `1px solid ${viewport === "mobile" ? "var(--primary)" : "var(--border)"}`,
              background: viewport === "mobile" ? "var(--bg-active)" : "var(--bg-surface-elevated)",
              color: viewport === "mobile" ? "var(--primary)" : "var(--text-secondary)",
              fontSize: 11.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Smartphone size={12} /> Mobile
          </button>
        </div>

        <button
          type="button"
          onClick={() => setDarkCanvas((p) => !p)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 10px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--bg-surface-elevated)",
            color: "var(--text-main)",
            fontSize: 11.5,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {darkCanvas ? <Moon size={12} /> : <Sun size={12} />}
          <span>{darkCanvas ? "Dark Client" : "Light Client"}</span>
        </button>
      </div>

      {/* Inbox Envelope Header */}
      <div
        style={{
          padding: "10px 12px",
          borderRadius: 12,
          background: "var(--bg-surface-elevated)",
          border: "1px solid var(--border-light)",
          fontSize: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)" }}>
          <Mail size={13} />
          <span>
            From: <strong style={{ color: "var(--text-main)" }}>{senderName}</strong> &lt;
            {senderEmail}&gt;
          </span>
        </div>
        <div style={{ fontWeight: 700, color: "var(--text-main)", marginTop: 4 }}>
          {renderSampleVariables(subject || "Email Subject")}
        </div>
        <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2 }}>
          {renderSampleVariables(previewText || "Inbox snippet preview text")}
        </div>
      </div>

      {/* Rendered Email Client Shell */}
      <div
        style={{
          background: bgOuter,
          borderRadius: 16,
          padding: viewport === "mobile" ? 12 : 20,
          border: `1px solid ${borderCol}`,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: viewport === "mobile" ? "min(310px, 100%)" : "100%",
            background: bgCard,
            border: `1px solid ${borderCol}`,
            borderRadius: 14,
            overflow: "hidden",
            color: textMain,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          {/* Logo Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${borderCol}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img
              src={darkCanvas ? logoDark : logoLight}
              alt="NobleBond Logo"
              style={{ height: 28, objectFit: "contain" }}
            />
            <span style={{ fontSize: 10.5, color: textSub }}>Beyond a match. A real connection.</span>
          </div>

          {bannerUrl && bannerUrl.trim() && (
            <img
              src={bannerUrl}
              alt="Email Campaign Banner"
              style={{ width: "100%", maxHeight: 165, objectFit: "cover", display: "block" }}
            />
          )}

          <div style={{ padding: viewport === "mobile" ? 16 : 22 }}>
            <h3 style={{ margin: "0 0 10px", fontSize: viewport === "mobile" ? 17 : 19, color: textMain }}>
              {renderSampleVariables(heading || "Email Headline")}
            </h3>
            <p style={{ margin: "0 0 18px", fontSize: 13.5, lineHeight: 1.6, color: textSub }}>
              {renderSampleVariables(body || "Email message content goes here.")}
            </p>

            <div
              style={{
                display: "inline-block",
                padding: "11px 22px",
                borderRadius: 10,
                background: "linear-gradient(90deg, #C12F66 0%, #8E51EB 100%)",
                color: "#FFFFFF",
                fontSize: 13.5,
                fontWeight: 700,
              }}
            >
              {ctaLabel || "Open NobleBond"}
            </div>
          </div>

          {/* Unsubscribe & Consent Footer */}
          <div
            style={{
              padding: "12px 20px",
              borderTop: `1px solid ${borderCol}`,
              fontSize: 11,
              color: textSub,
              lineHeight: 1.5,
            }}
          >
            <div>{footerText}</div>
            <div style={{ marginTop: 4, textDecoration: "underline" }}>
              Update Email Preferences • Unsubscribe from Promotional Campaigns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

