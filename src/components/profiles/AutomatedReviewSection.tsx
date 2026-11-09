// NobleBond Admin — Automated Profile Review & Policy Screening Queue
// Interactive screening rules overview, automated outcome badges, zero emojis

import React, { useState } from "react";
import {
  ShieldAlert,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight,
} from "lucide-react";
import type { AdminProfile } from "../../types/profileManagement.types";

interface AutomatedReviewSectionProps {
  profiles: AdminProfile[];
  onOpenQueue: () => void;
}

export const AutomatedReviewSection: React.FC<AutomatedReviewSectionProps> = ({
  profiles,
  onOpenQueue,
}) => {
  const [showConfig, setShowConfig] = useState(false);

  const needsReviewCount = profiles.filter(
    (p) => p.automatedReviewSummary === "needs_human_review" || p.moderationStatus === "under_review"
  ).length;

  const flaggedCount = profiles.filter(
    (p) => p.automatedReviewSummary === "flagged" || p.moderationStatus === "flagged"
  ).length;

  const passedCount = profiles.filter(
    (p) => p.automatedReviewSummary === "passed" && p.moderationStatus === "approved"
  ).length;

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "18px 20px",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              backgroundColor: "rgba(139, 29, 65, 0.1)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Cpu size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)" }}>
                Automated Policy Screening & Human Queue
              </span>
              <span
                style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  color: "var(--status-success)",
                  fontWeight: 700,
                }}
              >
                AI Shield v4.2 Active
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Pre-moderates photos, biographies, prompts and documents before human administrator review
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            style={{
              padding: "7px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-main)",
              color: "var(--text-secondary)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Sliders size={14} />
            Policy Rules
            {showConfig ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button
            type="button"
            onClick={onOpenQueue}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(139, 29, 65, 0.25)",
            }}
          >
            Review Human Queue ({needsReviewCount})
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Queue Status Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          backgroundColor: "var(--bg-main)",
          padding: "12px",
          borderRadius: "12px",
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <CheckCircle2 size={18} color="var(--status-success)" />
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Passed Screening</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
              {passedCount} profiles
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Layers size={18} color="#F59E0B" />
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Awaiting Review</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#F59E0B" }}>
              {needsReviewCount} profiles
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <AlertTriangle size={18} color="#EC4899" />
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Suspicious / Flagged</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#EC4899" }}>
              {flaggedCount} profiles
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ShieldAlert size={18} color="var(--status-error)" />
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Policy Reject Rate</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--status-error)" }}>
              2.4% auto-rejected
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Policy Rules Configuration demonstration */}
      {showConfig && (
        <div
          className="animate-fade-in"
          style={{
            padding: "16px",
            backgroundColor: "var(--bg-main)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
              Completeness Threshold
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Minimum 70% profile completeness required before profile is eligible for discovery carousel.
            </div>
            <div style={{ fontSize: "11px", color: "var(--status-success)", fontWeight: 600, marginTop: "2px" }}>
              Status: Enforced
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
              AI Visual NSFW & Violence Filter
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Confidence &gt; 80% triggers auto-quarantine; 50-80% routes directly to Human Review Queue.
            </div>
            <div style={{ fontSize: "11px", color: "var(--status-success)", fontWeight: 600, marginTop: "2px" }}>
              Status: Enforced
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
              Duplicate Image & Hash Match
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Similarity &gt; 90% against public celebrity/influencer repository triggers impersonation hold.
            </div>
            <div style={{ fontSize: "11px", color: "var(--status-success)", fontWeight: 600, marginTop: "2px" }}>
              Status: Enforced
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
              Biometric Liveness Match
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Photo selfie biometric score must exceed 85.0% for verified badge activation.
            </div>
            <div style={{ fontSize: "11px", color: "var(--status-success)", fontWeight: 600, marginTop: "2px" }}>
              Status: Enforced
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
