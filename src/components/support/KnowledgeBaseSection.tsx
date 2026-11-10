import React, { useState } from "react";
import { BookOpen, Search, Plus, Eye, Edit3, Archive, Info, X } from "lucide-react";
import type {
  KnowledgeBaseArticle,
  SupportRolePermissions,
} from "../../types/supportManagement.types";
import { Badge } from "../common/Badge";
import { formatShortDate } from "./supportUiUtils";

interface KnowledgeBaseSectionProps {
  articles: KnowledgeBaseArticle[];
  permissions: SupportRolePermissions;
  onSaveArticle: (article: KnowledgeBaseArticle) => void;
  onInsertIntoInbox: (text: string) => void;
}

const KB_CATEGORIES = [
  "Getting Started",
  "Account & Security",
  "Profile Management",
  "Likes & Matches",
  "Messaging",
  "Live Streaming",
  "Premium Membership",
  "Gift Coins",
  "Connection Points",
  "Referral Programme",
  "Payments",
  "Safety & Privacy",
];

export const KnowledgeBaseSection: React.FC<KnowledgeBaseSectionProps> = ({
  articles,
  permissions,
  onSaveArticle,
  onInsertIntoInbox,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [previewArticle, setPreviewArticle] = useState<KnowledgeBaseArticle | null>(null);
  const [editing, setEditing] = useState<KnowledgeBaseArticle | null>(null);

  const filtered = articles.filter((a) => {
    const matchCat = catFilter === "all" || a.category === catFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchQ =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const openNew = () => {
    const now = new Date().toISOString();
    setEditing({
      id: `KB-${Math.floor(210 + Math.random() * 700)}`,
      title: "",
      category: "Getting Started",
      summary: "",
      content: "",
      author: permissions.actorName,
      createdAt: now,
      updatedAt: now,
      status: "draft",
      isAdminInternalOnly: true,
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
            <BookOpen size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Admin Support Knowledge Base ({filtered.length})
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Internal agent guidance library aligned with NobleBond mobile FAQs &amp; policies
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border)", color: "var(--text-main)", borderRadius: "9px", padding: "8px 10px 8px 31px", fontSize: "0.8rem" }}
            />
          </div>

          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border)", color: "var(--text-main)", borderRadius: "9px", padding: "8px 10px", fontSize: "0.8rem" }}
          >
            <option value="all">All KB Categories</option>
            {KB_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {permissions.canManageKnowledgeBase && (
            <button
              type="button"
              onClick={openNew}
              style={{ padding: "8px 13px", borderRadius: "9px", border: "none", background: "var(--primary)", color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
            >
              <Plus size={14} />
              <span>Create Article</span>
            </button>
          )}
        </div>
      </div>

      {/* Separation Warning Notice */}
      <div style={{ padding: "10px 14px", borderRadius: "11px", background: "var(--status-info-bg)", color: "var(--text-secondary)", fontSize: "0.76rem", display: "flex", alignItems: "center", gap: "8px" }}>
        <Info size={15} style={{ color: "var(--status-info)", flexShrink: 0 }} />
        <span>
          Internal Knowledge Base Resource: Articles managed here assist NobleBond Support Agents inside the admin dashboard and are NOT automatically pushed to mobile app FAQ screens.
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "14px" }}>
        {filtered.map((art) => (
          <div
            key={art.id}
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
                <Badge variant="info" size="sm">{art.category}</Badge>
                <Badge
                  variant={art.status === "published" ? "success" : art.status === "draft" ? "warning" : "neutral"}
                  size="sm"
                >
                  {art.status.toUpperCase()}
                </Badge>
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)", marginBottom: "4px" }}>
                {art.title}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.45, marginBottom: "8px" }}>
                {art.summary}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                Author: {art.author} • Updated {formatShortDate(art.updatedAt)}
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              <button
                type="button"
                onClick={() => setPreviewArticle(art)}
                style={{ flex: 1, padding: "7px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
              >
                <Eye size={13} />
                <span>Read Article</span>
              </button>
              <button
                type="button"
                onClick={() => onInsertIntoInbox(art.content)}
                style={{ padding: "7px 10px", borderRadius: "8px", border: "none", background: "var(--primary)", color: "#fff", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer" }}
              >
                Use Excerpt
              </button>
              {permissions.canManageKnowledgeBase && (
                <>
                  <button
                    type="button"
                    onClick={() => setEditing(art)}
                    style={{ padding: "7px 9px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", cursor: "pointer" }}
                    title="Edit"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onSaveArticle({
                        ...art,
                        status: art.status === "published" ? "archived" : "published",
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    style={{ padding: "7px 9px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-secondary)", cursor: "pointer" }}
                    title={art.status === "published" ? "Archive Article" : "Publish Article"}
                  >
                    <Archive size={13} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {previewArticle && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }} onClick={() => setPreviewArticle(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "520px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px", boxShadow: "var(--shadow-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.02rem", color: "var(--text-main)" }}>{previewArticle.title}</h3>
              <button type="button" onClick={() => setPreviewArticle(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={17} />
              </button>
            </div>
            <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
              <Badge variant="info" size="sm">{previewArticle.category}</Badge>
              <Badge variant="neutral" size="sm">Internal Agent Guide</Badge>
            </div>
            <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.6, background: "var(--bg-surface-elevated)", padding: "14px", borderRadius: "10px" }}>
              {previewArticle.content}
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }} onClick={() => setEditing(null)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              if (!editing.title.trim() || !editing.content.trim()) return;
              onSaveArticle({ ...editing, updatedAt: new Date().toISOString() });
              setEditing(null);
            }}
            style={{ width: "100%", maxWidth: "520px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "22px", boxShadow: "var(--shadow-lg)", display: "flex", flexDirection: "column", gap: "11px" }}
          >
            <h3 style={{ margin: 0, fontSize: "1rem", color: "var(--text-main)" }}>Save Knowledge Base Article</h3>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
              Title
              <input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)" }} />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
                Category
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)" }}>
                  {KB_CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </label>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
                Publication Status
                <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as KnowledgeBaseArticle["status"] })} style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)" }}>
                  <option value="published">Published (Internal)</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
            </div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
              Summary
              <input required value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)" }} />
            </label>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
              Article Content
              <textarea required rows={4} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", resize: "vertical" }} />
            </label>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", cursor: "pointer" }}>Cancel</button>
              <button type="submit" style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "var(--primary)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Save Article</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

