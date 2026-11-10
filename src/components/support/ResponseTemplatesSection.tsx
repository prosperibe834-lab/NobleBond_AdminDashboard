import React, { useState } from "react";
import { FileText, Plus, Edit3, Trash2, Send, Eye, CheckCircle2, X } from "lucide-react";
import type {
  SupportResponseTemplate,
  SupportRolePermissions,
} from "../../types/supportManagement.types";
import { Badge } from "../common/Badge";
import { formatShortDate } from "./supportUiUtils";

interface ResponseTemplatesSectionProps {
  templates: SupportResponseTemplate[];
  permissions: SupportRolePermissions;
  onSaveTemplate: (tpl: SupportResponseTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onUseTemplateInComposer: (content: string) => void;
}

const TEMPLATE_CATEGORIES = [
  "Account & Login",
  "Verification",
  "Profile",
  "Likes & Matches",
  "Messaging",
  "Live Streaming",
  "Premium Subscription",
  "Payment",
  "Gift Coins",
  "Connection Points",
  "Referral Rewards",
  "General Enquiries",
];

export const ResponseTemplatesSection: React.FC<
  ResponseTemplatesSectionProps
> = ({
  templates,
  permissions,
  onSaveTemplate,
  onDeleteTemplate,
  onUseTemplateInComposer,
}) => {
  const [catFilter, setCatFilter] = useState("all");
  const [editing, setEditing] = useState<SupportResponseTemplate | null>(null);
  const [previewing, setPreviewing] = useState<SupportResponseTemplate | null>(null);

  const filtered = templates.filter(
    (t) => catFilter === "all" || t.category === catFilter
  );

  const openNewModal = () => {
    setEditing({
      id: `TPL-${Math.floor(110 + Math.random() * 880)}`,
      name: "",
      category: "General Enquiries",
      subjectSuggestion: "",
      content: "",
      status: "active",
      createdBy: permissions.actorName,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px 18px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Concierge Response Templates ({filtered.length})
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Pre-approved macros populate the Inbox Composer cleanly — agents review before sending (never auto-dispatched)
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border)", color: "var(--text-main)", borderRadius: "9px", padding: "8px 10px", fontSize: "0.8rem" }}
          >
            <option value="all">All Template Categories</option>
            {TEMPLATE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {permissions.canManageTemplates && (
            <button
              type="button"
              onClick={openNewModal}
              style={{
                padding: "8px 13px",
                borderRadius: "9px",
                border: "none",
                background: "var(--primary)",
                color: "#fff",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Plus size={14} />
              <span>Create Template</span>
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "14px" }}>
        {filtered.map((tpl) => (
          <div
            key={tpl.id}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "15px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <Badge variant="info" size="sm">{tpl.category}</Badge>
                <Badge variant={tpl.status === "active" ? "success" : "neutral"} size="sm">
                  {tpl.status.toUpperCase()}
                </Badge>
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.94rem", color: "var(--text-main)", marginBottom: "4px" }}>
                {tpl.name}
              </div>
              <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", background: "var(--bg-surface-elevated)", padding: "10px", borderRadius: "9px", lineHeight: 1.45 }}>
                {tpl.content}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "6px" }}>
                By {tpl.createdBy} • Updated {formatShortDate(tpl.updatedAt)}
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              <button
                type="button"
                onClick={() => onUseTemplateInComposer(tpl.content)}
                style={{
                  flex: 1,
                  padding: "7px 10px",
                  borderRadius: "8px",
                  border: "none",
                  background: "var(--primary)",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <Send size={12} />
                <span>Insert in Inbox</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewing(tpl)}
                style={{ padding: "7px 9px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.74rem", cursor: "pointer" }}
                title="Preview"
              >
                <Eye size={13} />
              </button>

              {permissions.canManageTemplates && (
                <>
                  <button
                    type="button"
                    onClick={() => setEditing(tpl)}
                    style={{ padding: "7px 9px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.74rem", cursor: "pointer" }}
                    title="Edit"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onSaveTemplate({
                        ...tpl,
                        status: tpl.status === "active" ? "inactive" : "active",
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    style={{ padding: "7px 9px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--status-success)", fontSize: "0.74rem", cursor: "pointer" }}
                    title={tpl.status === "active" ? "Deactivate" : "Activate"}
                  >
                    <CheckCircle2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTemplate(tpl.id)}
                    style={{ padding: "7px 9px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--status-error)", fontSize: "0.74rem", cursor: "pointer" }}
                    title="Delete Template"
                  >
                    <Trash2 size={13} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewing && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }} onClick={() => setPreviewing(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "460px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", boxShadow: "var(--shadow-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", color: "var(--text-main)" }}>{previewing.name}</h3>
              <button type="button" onClick={() => setPreviewing(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={17} />
              </button>
            </div>
            <Badge variant="info" size="sm">{previewing.category}</Badge>
            <div style={{ marginTop: "12px", fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.55, background: "var(--bg-surface-elevated)", padding: "12px", borderRadius: "10px" }}>
              {previewing.content}
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }} onClick={() => setEditing(null)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              if (!editing.name.trim() || !editing.content.trim()) return;
              onSaveTemplate({
                ...editing,
                updatedAt: new Date().toISOString(),
              });
              setEditing(null);
            }}
            style={{ width: "100%", maxWidth: "480px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "22px", boxShadow: "var(--shadow-lg)", display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <h3 style={{ margin: 0, fontSize: "1rem", color: "var(--text-main)" }}>Save Support Response Template</h3>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
              Template Name
              <input
                required
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)" }}
              />
            </label>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
              Category
              <select
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)" }}
              >
                {TEMPLATE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
              Message Content (Editable before sending)
              <textarea
                required
                rows={4}
                value={editing.content}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", resize: "vertical" }}
              />
            </label>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", cursor: "pointer" }}>Cancel</button>
              <button type="submit" style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "var(--primary)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Save Template</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

