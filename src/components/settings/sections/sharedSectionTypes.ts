export interface ConfirmActionRequest {
  title: string;
  description: string;
  impactWarning?: string;
  confirmLabel?: string;
  danger?: boolean;
  requireReason?: boolean;
  requireReauth?: boolean;
  allowTwoPersonStage?: boolean;
  onConfirm: (payload: { reason: string; stageTwoPerson: boolean }) => void;
}

