// Pure UI utilities & timestamp-based SLA helpers for Customer Support Management
// Separated from TSX components to satisfy ESLint react-refresh/only-export-components. Zero emojis.

import type {
  SupportProgramSettings,
  SupportTicketRecord,
  TicketPriority,
  TicketStatus,
} from "../../types/supportManagement.types";

export const DEMO_REFERENCE_NOW_MS = new Date("2026-11-10T11:30:00Z").getTime();

export function formatShortDate(iso: string | undefined): string {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(iso: string | undefined): string {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDurationMinutes(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined || Number.isNaN(minutes)) return "--";
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function getTicketStatusMeta(status: TicketStatus): {
  label: string;
  variant: "success" | "warning" | "error" | "info" | "neutral" | "champagne" | "primary";
} {
  switch (status) {
    case "new":
      return { label: "New", variant: "primary" };
    case "open":
      return { label: "Open", variant: "info" };
    case "in_progress":
      return { label: "In Progress", variant: "warning" };
    case "waiting_for_user":
      return { label: "Waiting for User", variant: "neutral" };
    case "waiting_for_support":
      return { label: "Waiting for Support", variant: "warning" };
    case "escalated":
      return { label: "Escalated", variant: "champagne" };
    case "resolved":
      return { label: "Resolved", variant: "success" };
    case "closed":
      return { label: "Closed", variant: "neutral" };
    default:
      return { label: status, variant: "neutral" };
  }
}

export function getPriorityMeta(priority: TicketPriority): {
  label: string;
  variant: "success" | "warning" | "error" | "info" | "neutral";
  rank: number;
} {
  switch (priority) {
    case "urgent":
      return { label: "Urgent", variant: "error", rank: 4 };
    case "high":
      return { label: "High", variant: "warning", rank: 3 };
    case "medium":
      return { label: "Medium", variant: "info", rank: 2 };
    default:
      return { label: "Low", variant: "neutral", rank: 1 };
  }
}

// Strict timestamp-based SLA check (uses configured priority targets, never arbitrary guesses)
export function evaluateTicketSlaStatus(
  ticket: SupportTicketRecord,
  settings: SupportProgramSettings
): {
  isOverdue: boolean;
  isApproaching: boolean;
  elapsedMinutes: number;
  targetMinutes: number;
  summary: string;
} {
  const targetMinutes = ticket.firstResponseAt
    ? settings.slaResolutionMinutes[ticket.priority]
    : settings.slaFirstResponseMinutes[ticket.priority];

  if (ticket.status === "resolved" || ticket.status === "closed") {
    return {
      isOverdue: false,
      isApproaching: false,
      elapsedMinutes: 0,
      targetMinutes,
      summary: "SLA Completed",
    };
  }

  // When waiting solely on user reply, resolution clock pauses per standard SLA policy
  if (ticket.status === "waiting_for_user") {
    return {
      isOverdue: false,
      isApproaching: false,
      elapsedMinutes: 0,
      targetMinutes,
      summary: "Paused (Awaiting Customer)",
    };
  }

  const anchorMs = new Date(ticket.createdAt).getTime();
  const elapsedMinutes = Math.max(1, Math.round((DEMO_REFERENCE_NOW_MS - anchorMs) / 60000));
  const isOverdue = elapsedMinutes > targetMinutes;
  const isApproaching = !isOverdue && elapsedMinutes >= Math.round(targetMinutes * 0.75);

  return {
    isOverdue,
    isApproaching,
    elapsedMinutes,
    targetMinutes,
    summary: isOverdue
      ? `Overdue (${formatDurationMinutes(elapsedMinutes)} > ${formatDurationMinutes(targetMinutes)})`
      : isApproaching
      ? `Approaching Target (${formatDurationMinutes(elapsedMinutes)} / ${formatDurationMinutes(targetMinutes)})`
      : `Within SLA (${formatDurationMinutes(elapsedMinutes)} / ${formatDurationMinutes(targetMinutes)})`,
  };
}

