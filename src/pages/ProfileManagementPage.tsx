import React, { useState } from "react";
import { Check, X } from "lucide-react";

export const ProfileManagementPage: React.FC = () => {
  const [photoQueue, setPhotoQueue] = useState([
    {
      id: "ph_1",
      userName: "Daniel Evans",
      userAge: 27,
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=350&auto=format&fit=crop&q=80",
      reason: "Selfie verification match (98% confidence)",
      status: "pending",
    },
    {
      id: "ph_2",
      userName: "Chloe Bennet",
      userAge: 24,
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=350&auto=format&fit=crop&q=80",
      reason: "New profile photo review",
      status: "pending",
    },
    {
      id: "ph_3",
      userName: "Marcus Ray",
      userAge: 31,
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=350&auto=format&fit=crop&q=80",
      reason: "Reported: low resolution or stock photo flag",
      status: "pending",
    },
  ]);

  const [toast, setToast] = useState<string | null>(null);

  const handleAction = (id: string, action: "approve" | "reject") => {
    setPhotoQueue((prev) => prev.filter((p) => p.id !== id));
    setToast(action === "approve" ? "Profile photo approved & verified." : "Photo rejected. User notified to re-upload.");
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>
            Profile Management
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Inspect uploaded profile photos, handle government ID verification queues, and enforce media safety.
          </p>
        </div>

        {toast && (
          <div
            className="animate-scale-up"
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--status-info-bg)",
              border: "1px solid var(--status-info)",
              borderRadius: "10px",
              color: "var(--status-info)",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {toast}
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div style={{ padding: "16px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontWeight: 600 }}>Awaiting Verification</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-main)", marginTop: "4px" }}>24 Photos</div>
        </div>
        <div style={{ padding: "16px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontWeight: 600 }}>Approved Today</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--status-success)", marginTop: "4px" }}>342 Verified</div>
        </div>
        <div style={{ padding: "16px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontWeight: 600 }}>Rejection Rate</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--status-warning)", marginTop: "4px" }}>3.2%</div>
        </div>
      </div>

      {/* Photo Moderation Cards Grid */}
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", marginBottom: "12px" }}>
          Photo Review Queue ({photoQueue.length})
        </h3>

        {photoQueue.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", color: "var(--text-secondary)" }}>
            🎉 All pending photos have been reviewed!
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "18px" }}>
            {photoQueue.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ height: "260px", overflow: "hidden", position: "relative" }}>
                  <img
                    src={item.photoUrl}
                    alt={item.userName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "12px",
                      background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                      color: "#FFFFFF",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "15px" }}>
                      {item.userName}, {item.userAge}
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.9 }}>
                      {item.reason}
                    </div>
                  </div>
                </div>

                <div style={{ padding: "14px", display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => handleAction(item.id, "approve")}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      border: "none",
                      backgroundColor: "var(--status-success)",
                      color: "#FFFFFF",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(item.id, "reject")}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid var(--status-error)",
                      backgroundColor: "var(--status-error-bg)",
                      color: "var(--status-error)",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <X size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
