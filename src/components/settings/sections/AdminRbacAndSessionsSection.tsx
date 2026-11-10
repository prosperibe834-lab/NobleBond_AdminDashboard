import React, { useState } from "react";
import {
  UserCog,
  Key,
  MonitorSmartphone,
  ShieldAlert,
  UserPlus,
  Copy,
  Check,
  X,
} from "lucide-react";
import {
  countActiveSuperAdmins,
  PERMISSION_GROUPS,
} from "../../../data/systemSettingsDataService";
import type {
  AdminAccountRecord,
  AdminAccountStatus,
  AdminRoleId,
  RbacRoleDefinition,
  SystemSettingsRootState,
} from "../../../types/systemSettings.types";
import type { ConfirmActionRequest } from "./sharedSectionTypes";
import { formatSettingsTimestamp } from "../settingsUiUtils";

interface AdminRbacAndSessionsSectionProps {
  state: SystemSettingsRootState;
  activeViewerRoleId: AdminRoleId;
  mode: "administrators" | "roles_permissions" | "sessions_security";
  canManageAdmins: boolean;
  canManageRoles: boolean;
  canRevokeSessions: boolean;
  onInviteDemoAdmin: (name: string, email: string, roleId: AdminRoleId, reason: string) => void;
  onUpdateAdmin: (
    adminId: string,
    patch: Partial<Pick<AdminAccountRecord, "roleId" | "roleName" | "status">>,
    reason: string
  ) => void;
  onSaveRolePermissions: (
    roleId: AdminRoleId,
    nextPermissions: Record<string, boolean>,
    reason: string
  ) => void;
  onCreateOrCloneRole: (name: string, description: string, basePermissions: Record<string, boolean>, reason: string) => void;
  onToggleRoleActive: (roleId: AdminRoleId, nextActive: boolean, reason: string) => void;
  onRevokeSession: (sessionId: string, reason: string) => void;
  onRevokeAllOtherSessions: (reason: string) => void;
  onRequestConfirm: (req: ConfirmActionRequest) => void;
}

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "var(--shadow-sm)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 11px",
  borderRadius: 9,
  border: "1px solid var(--border)",
  background: "var(--bg-surface-elevated)",
  color: "var(--text-main)",
  fontSize: 12.5,
  outline: "none",
};

export const AdminRbacAndSessionsSection: React.FC<AdminRbacAndSessionsSectionProps> = ({
  state,
  activeViewerRoleId,
  mode,
  canManageAdmins,
  canManageRoles,
  canRevokeSessions,
  onInviteDemoAdmin,
  onUpdateAdmin,
  onSaveRolePermissions,
  onCreateOrCloneRole,
  onToggleRoleActive,
  onRevokeSession,
  onRevokeAllOtherSessions,
  onRequestConfirm,
}) => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AdminRoleId>("support_agent");

  const [selectedRoleId, setSelectedRoleId] = useState<AdminRoleId>(
    state.roles[0]?.id || "super_admin"
  );
  const [cloneModalOpen, setCloneModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [guardWarning, setGuardWarning] = useState<string | null>(null);

  // 8. ADMINISTRATOR ACCOUNTS
  if (mode === "administrators") {
    const activeSuperCount = countActiveSuperAdmins(state.admins);

    const handleStatusChange = (adm: AdminAccountRecord, nextStatus: AdminAccountStatus) => {
      if (
        adm.roleId === "super_admin" &&
        adm.status === "active" &&
        nextStatus !== "active" &&
        countActiveSuperAdmins(state.admins, adm.id) === 0
      ) {
        setGuardWarning(
          `Blocked: Cannot deactivate or suspend "${adm.name}" because they are the last active Super Administrator.`
        );
        return;
      }
      setGuardWarning(null);
      onRequestConfirm({
        title: `Set ${adm.name} Status to "${nextStatus}"?`,
        description: `Updates administrator account access for ${adm.email}.`,
        impactWarning:
          nextStatus === "suspended" || nextStatus === "inactive"
            ? "Revokes active admin session eligibility for this account (zero passwords/hashes stored)."
            : undefined,
        danger: nextStatus !== "active",
        requireReauth: true,
        confirmLabel: `Apply ${nextStatus}`,
        onConfirm: ({ reason }) => onUpdateAdmin(adm.id, { status: nextStatus }, reason),
      });
    };

    const handleRoleAssign = (adm: AdminAccountRecord, nextRoleId: AdminRoleId) => {
      if (
        adm.roleId === "super_admin" &&
        nextRoleId !== "super_admin" &&
        countActiveSuperAdmins(state.admins, adm.id) === 0
      ) {
        setGuardWarning(
          `Blocked: Cannot demote "${adm.name}" away from Super Administrator while no other active Super Admin exists.`
        );
        return;
      }
      setGuardWarning(null);
      const roleObj = state.roles.find((r) => r.id === nextRoleId);
      onRequestConfirm({
        title: `Assign Role "${roleObj?.name || nextRoleId}" to ${adm.name}?`,
        description: `Current role: ${adm.roleName}. Assigning a new role updates RBAC permissions.`,
        requireReauth: true,
        confirmLabel: "Assign Role",
        onConfirm: ({ reason }) =>
          onUpdateAdmin(
            adm.id,
            { roleId: nextRoleId, roleName: roleObj?.name || nextRoleId },
            reason
          ),
      });
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <UserCog size={18} style={{ color: "var(--primary)" }} />
                <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
                  Administrator Accounts ({state.admins.length})
                </h3>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
                Reuses established NobleBond staff directory. Active Super Administrators:{" "}
                <strong>{activeSuperCount}</strong> (minimum 1 strictly enforced).
              </p>
            </div>

            <button
              type="button"
              disabled={!canManageAdmins}
              onClick={() => setInviteOpen((p) => !p)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 13px",
                borderRadius: 10,
                border: "none",
                background: canManageAdmins ? "var(--primary)" : "var(--bg-surface-elevated)",
                color: canManageAdmins ? "var(--primary-text)" : "var(--text-muted)",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: canManageAdmins ? "pointer" : "not-allowed",
              }}
            >
              <UserPlus size={14} />
              <span>Demo Admin Invitation</span>
            </button>
          </div>

          {guardWarning && (
            <div
              role="alert"
              style={{
                marginBottom: 12,
                padding: "10px 12px",
                borderRadius: 10,
                background: "var(--status-error-bg)",
                color: "var(--status-error)",
                fontSize: 12.5,
                fontWeight: 700,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{guardWarning}</span>
              <button
                type="button"
                onClick={() => setGuardWarning(null)}
                style={{ border: "none", background: "transparent", color: "inherit", cursor: "pointer" }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {inviteOpen && (
            <div
              style={{
                marginBottom: 14,
                padding: 14,
                borderRadius: 12,
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>
                Create Demonstration Administrator Invitation (No Backend Email Sent)
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 10,
                }}
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="email"
                  placeholder="Work Email (@noblebond.com)"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  style={inputStyle}
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as AdminRoleId)}
                  style={inputStyle}
                >
                  {state.roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setInviteOpen(false)}
                  style={{ ...inputStyle, width: "auto", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!inviteName.trim() || !inviteEmail.includes("@")}
                  onClick={() =>
                    onRequestConfirm({
                      title: `Send Demo Invitation to ${inviteName.trim()}?`,
                      description: `Creates Invited local administrator record assigned to ${inviteRole}.`,
                      confirmLabel: "Create Demo Invite",
                      onConfirm: ({ reason }) => {
                        onInviteDemoAdmin(inviteName.trim(), inviteEmail.trim(), inviteRole, reason);
                        setInviteName("");
                        setInviteEmail("");
                        setInviteOpen(false);
                      },
                    })
                  }
                  style={{
                    padding: "8px 14px",
                    borderRadius: 9,
                    border: "none",
                    background: "var(--primary)",
                    color: "#FFFFFF",
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Send Demo Invite
                </button>
              </div>
            </div>
          )}

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Administrator</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Assigned Role</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>MFA Status</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Last Login</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Status</th>
                  <th style={{ textAlign: "right", padding: "8px 10px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.admins.map((adm) => (
                  <tr key={adm.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "9px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <span
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            background: "var(--bg-active)",
                            color: "var(--primary)",
                            fontWeight: 800,
                            fontSize: 11,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {adm.avatarInitials}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{adm.name}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{adm.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "9px 10px" }}>
                      <select
                        disabled={!canManageAdmins}
                        value={adm.roleId}
                        onChange={(e) => handleRoleAssign(adm, e.target.value)}
                        style={{ ...inputStyle, padding: "5px 8px", width: "auto" }}
                      >
                        {state.roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: "9px 10px", fontSize: 11.5 }}>
                      <span
                        style={{
                          color: adm.mfaEnabled ? "var(--status-success)" : "var(--status-warning)",
                          fontWeight: 700,
                        }}
                      >
                        {adm.mfaMethod}
                      </span>
                    </td>
                    <td style={{ padding: "9px 10px", fontSize: 11.5, color: "var(--text-muted)" }}>
                      {formatSettingsTimestamp(adm.lastLoginAt)}
                    </td>
                    <td style={{ padding: "9px 10px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: 999,
                          color:
                            adm.status === "active"
                              ? "var(--status-success)"
                              : adm.status === "suspended"
                                ? "var(--status-error)"
                                : "var(--status-warning)",
                          background:
                            adm.status === "active"
                              ? "var(--status-success-bg)"
                              : adm.status === "suspended"
                                ? "var(--status-error-bg)"
                                : "var(--status-warning-bg)",
                        }}
                      >
                        {adm.status}
                      </span>
                    </td>
                    <td style={{ padding: "9px 10px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        {adm.status === "active" ? (
                          <button
                            type="button"
                            disabled={!canManageAdmins}
                            onClick={() => handleStatusChange(adm, "suspended")}
                            style={{
                              padding: "4px 9px",
                              borderRadius: 7,
                              border: "1px solid var(--border)",
                              background: "var(--status-error-bg)",
                              color: "var(--status-error)",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: canManageAdmins ? "pointer" : "not-allowed",
                            }}
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={!canManageAdmins}
                            onClick={() => handleStatusChange(adm, "active")}
                            style={{
                              padding: "4px 9px",
                              borderRadius: 7,
                              border: "1px solid var(--border)",
                              background: "var(--status-success-bg)",
                              color: "var(--status-success)",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: canManageAdmins ? "pointer" : "not-allowed",
                            }}
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 9. ROLES & PERMISSIONS (14-Module Permission Matrix + Anti-Escalation Safeguards)
  if (mode === "roles_permissions") {
    const activeRole: RbacRoleDefinition =
      state.roles.find((r) => r.id === selectedRoleId) || state.roles[0];
    const assignedAdmins = state.admins.filter((a) => a.roleId === activeRole.id);
    const viewerRoleObj = state.roles.find((r) => r.id === activeViewerRoleId);

    const togglePermission = (permKey: string) => {
      if (!canManageRoles || activeRole.isProtectedSuperRole) return;

      // Critical safeguard: Do not allow admin to grant a permission they themselves do not hold
      if (!activeRole.grantedPermissions[permKey] && !viewerRoleObj?.grantedPermissions[permKey]) {
        setGuardWarning(
          `Privilege Escalation Blocked: Your active role cannot grant permission "${permKey}" because your role does not hold it.`
        );
        return;
      }

      setGuardWarning(null);
      const nextVal = !activeRole.grantedPermissions[permKey];
      onRequestConfirm({
        title: `${nextVal ? "Grant" : "Revoke"} "${permKey}" on ${activeRole.name}?`,
        description: `Affects ${assignedAdmins.length} assigned administrator(s).`,
        impactWarning:
          "Client matrix preview updates immediately; real security boundaries must also be verified server-side on API endpoints.",
        requireReauth: true,
        confirmLabel: nextVal ? "Grant Permission" : "Revoke Permission",
        onConfirm: ({ reason }) =>
          onSaveRolePermissions(
            activeRole.id,
            { ...activeRole.grantedPermissions, [permKey]: nextVal },
            reason
          ),
      });
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Key size={18} style={{ color: "var(--accent-lavender)" }} />
                <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
                  RBAC Roles & 14-Module Permission Matrix
                </h3>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
                Select a role to audit or configure granular module capabilities. Super
                Administrator core locks prevent self-escalation or lockout.
              </p>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                disabled={!canManageRoles}
                onClick={() => {
                  setNewRoleName(`${activeRole.name} Clone`);
                  setNewRoleDesc(`Custom derivative of ${activeRole.name}`);
                  setCloneModalOpen(true);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 12px",
                  borderRadius: 9,
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface-elevated)",
                  color: canManageRoles ? "var(--text-main)" : "var(--text-muted)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: canManageRoles ? "pointer" : "not-allowed",
                }}
              >
                <Copy size={13} />
                <span>Clone Selected Role</span>
              </button>
            </div>
          </div>

          {guardWarning && (
            <div
              role="alert"
              style={{
                marginBottom: 12,
                padding: 11,
                borderRadius: 10,
                background: "var(--status-error-bg)",
                color: "var(--status-error)",
                fontSize: 12.5,
                fontWeight: 700,
              }}
            >
              {guardWarning}
            </div>
          )}

          {cloneModalOpen && (
            <div
              style={{
                marginBottom: 14,
                padding: 14,
                borderRadius: 12,
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <strong style={{ fontSize: 13, color: "var(--text-main)" }}>
                Clone "{activeRole.name}" into New Custom Role
              </strong>
              <input
                type="text"
                placeholder="Role Name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Role Purpose / Scope"
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setCloneModalOpen(false)}
                  style={{ ...inputStyle, width: "auto", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!newRoleName.trim()}
                  onClick={() =>
                    onRequestConfirm({
                      title: `Create Cloned Role "${newRoleName.trim()}"?`,
                      description: "Copies current permission set into a new editable custom role.",
                      confirmLabel: "Create Custom Role",
                      onConfirm: ({ reason }) => {
                        onCreateOrCloneRole(
                          newRoleName.trim(),
                          newRoleDesc.trim() || "Custom RBAC profile",
                          { ...activeRole.grantedPermissions },
                          reason
                        );
                        setCloneModalOpen(false);
                      },
                    })
                  }
                  style={{
                    padding: "7px 14px",
                    borderRadius: 9,
                    border: "none",
                    background: "var(--primary)",
                    color: "#FFFFFF",
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Create Role
                </button>
              </div>
            </div>
          )}

          {/* Role Selector Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
            {state.roles.map((r) => {
              const selected = r.id === activeRole.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRoleId(r.id)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 999,
                    border: `1px solid ${selected ? "var(--primary)" : "var(--border)"}`,
                    background: selected ? "var(--primary)" : "var(--bg-surface-elevated)",
                    color: selected ? "#FFFFFF" : "var(--text-main)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {r.name} {!r.isActive ? "(Inactive)" : ""}
                </button>
              );
            })}
          </div>

          {/* Active Role Details Summary */}
          <div
            style={{
              padding: 13,
              borderRadius: 12,
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-light)",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: "var(--text-main)" }}>
                {activeRole.name}{" "}
                {activeRole.isProtectedSuperRole && (
                  <span style={{ fontSize: 11, color: "var(--primary)", marginLeft: 6 }}>
                    (Protected Immutable Root Role)
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                {activeRole.description} • Assigned Admins:{" "}
                <strong>
                  {assignedAdmins.length > 0
                    ? assignedAdmins.map((a) => a.name).join(", ")
                    : "None assigned yet"}
                </strong>
              </div>
            </div>

            {!activeRole.isProtectedSuperRole && canManageRoles && (
              <button
                type="button"
                onClick={() =>
                  onRequestConfirm({
                    title: `${activeRole.isActive ? "Deactivate" : "Reactivate"} Role "${activeRole.name}"?`,
                    description: "Deactivating prevents administrators with this role from exercising privileges.",
                    danger: activeRole.isActive,
                    confirmLabel: activeRole.isActive ? "Deactivate Role" : "Activate Role",
                    onConfirm: ({ reason }) =>
                      onToggleRoleActive(activeRole.id, !activeRole.isActive, reason),
                  })
                }
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: activeRole.isActive ? "var(--status-error-bg)" : "var(--status-success-bg)",
                  color: activeRole.isActive ? "var(--status-error)" : "var(--status-success)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {activeRole.isActive ? "Deactivate Role" : "Activate Role"}
              </button>
            )}
          </div>

          {/* 14-Module Permission Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 12,
            }}
          >
            {PERMISSION_GROUPS.map((grp) => (
              <div
                key={grp.moduleKey}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 12,
                  padding: 13,
                }}
              >
                <div style={{ fontSize: 13.5, fontWeight: 800, color: "var(--primary)", marginBottom: 8 }}>
                  {grp.moduleLabel}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {grp.permissions.map((perm) => {
                    const granted = Boolean(activeRole.grantedPermissions[perm.key]);
                    const locked = !canManageRoles || activeRole.isProtectedSuperRole;
                    return (
                      <button
                        key={perm.key}
                        type="button"
                        disabled={locked}
                        onClick={() => togglePermission(perm.key)}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 8px",
                          borderRadius: 8,
                          border: "1px solid var(--border-light)",
                          background: "var(--bg-card)",
                          cursor: locked ? "default" : "pointer",
                          textAlign: "left",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-main)" }}>
                            {perm.label}
                          </div>
                          <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>
                            {perm.description}
                          </div>
                        </div>
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: granted ? "var(--status-success-bg)" : "var(--bg-surface-elevated)",
                            color: granted ? "var(--status-success)" : "var(--text-muted)",
                            flexShrink: 0,
                          }}
                        >
                          {granted ? <Check size={13} /> : <X size={13} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 10. SESSION & DEVICE SECURITY
  const activeSessions = state.sessions.filter((s) => s.status === "active");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MonitorSmartphone size={18} style={{ color: "var(--status-info)" }} />
              <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
                Administrator Sessions & Device Security ({activeSessions.length} active)
              </h3>
            </div>
            <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
              Network IP addresses are masked by default and GPS precision coordinates are never
              exposed. Session termination updates the local security log immediately; production
              revocation requires backend JWT invalidation.
            </p>
          </div>

          <button
            type="button"
            disabled={!canRevokeSessions || activeSessions.filter((s) => !s.isCurrentSession).length === 0}
            onClick={() =>
              onRequestConfirm({
                title: "Revoke All Other Active Administrator Sessions?",
                description: "Marks every other admin session across other devices as Revoked.",
                impactWarning:
                  "All staff excluding your current console session will need to re-authenticate on next request once connected to production auth.",
                danger: true,
                requireReauth: true,
                confirmLabel: "Revoke Other Sessions",
                onConfirm: ({ reason }) => onRevokeAllOtherSessions(reason),
              })
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 13px",
              borderRadius: 10,
              border: "none",
              background: canRevokeSessions ? "var(--status-error)" : "var(--bg-surface-elevated)",
              color: canRevokeSessions ? "#FFFFFF" : "var(--text-muted)",
              fontSize: 12,
              fontWeight: 700,
              cursor: canRevokeSessions ? "pointer" : "not-allowed",
            }}
          >
            <ShieldAlert size={14} />
            <span>Revoke All Other Sessions</span>
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Administrator</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Device & Browser</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Masked IP / Approx Net</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Last Activity</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Status</th>
                <th style={{ textAlign: "right", padding: "8px 10px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.sessions.map((ses) => (
                <tr key={ses.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "9px 10px", fontWeight: 700, color: "var(--text-main)" }}>
                    {ses.adminName}
                    {ses.isCurrentSession && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 10.5,
                          color: "var(--primary)",
                          background: "var(--bg-active)",
                          padding: "2px 7px",
                          borderRadius: 999,
                        }}
                      >
                        Current Console
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "9px 10px", color: "var(--text-secondary)" }}>
                    {ses.deviceType} • {ses.browser} ({ses.operatingSystem})
                  </td>
                  <td style={{ padding: "9px 10px", color: "var(--text-muted)" }}>
                    {ses.maskedIp} • {ses.approxLocation}
                  </td>
                  <td style={{ padding: "9px 10px", fontSize: 11.5 }}>
                    {formatSettingsTimestamp(ses.lastActivityAt)}
                  </td>
                  <td style={{ padding: "9px 10px" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: 999,
                        color:
                          ses.status === "active"
                            ? "var(--status-success)"
                            : ses.status === "revoked"
                              ? "var(--status-error)"
                              : "var(--text-muted)",
                        background:
                          ses.status === "active"
                            ? "var(--status-success-bg)"
                            : ses.status === "revoked"
                              ? "var(--status-error-bg)"
                              : "var(--bg-surface-elevated)",
                      }}
                    >
                      {ses.status}
                    </span>
                  </td>
                  <td style={{ padding: "9px 10px", textAlign: "right" }}>
                    {ses.status === "active" && !ses.isCurrentSession && (
                      <button
                        type="button"
                        disabled={!canRevokeSessions}
                        onClick={() =>
                          onRequestConfirm({
                            title: `Revoke Session ${ses.id} (${ses.adminName})?`,
                            description: `Terminates ${ses.browser} session from ${ses.approxLocation}.`,
                            danger: true,
                            confirmLabel: "Revoke Session",
                            onConfirm: ({ reason }) => onRevokeSession(ses.id, reason),
                          })
                        }
                        style={{
                          padding: "4px 9px",
                          borderRadius: 7,
                          border: "1px solid var(--border)",
                          background: "var(--status-error-bg)",
                          color: "var(--status-error)",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: canRevokeSessions ? "pointer" : "not-allowed",
                        }}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

