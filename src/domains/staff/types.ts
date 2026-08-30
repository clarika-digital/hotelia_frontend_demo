export type LeaveType = "annual" | "sick" | "casual" | "unpaid";

export type LeaveStatus = "pending" | "approved" | "used";

export interface LeaveRequest {
  id: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: LeaveStatus;
  submittedAt: string;
}

export interface LeaveRequestPayload {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
}

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  annual: "Annual leave",
  sick: "Sick leave",
  casual: "Casual leave",
  unpaid: "Unpaid leave",
};