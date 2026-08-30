import { client } from "@/global/api/client";
import type { LeaveRequest, LeaveRequestPayload } from "./types";

export const STAFF_LEAVE_ROUTE = "/v1/staff/leave/requests";

export function fetchLeaveRequests(): Promise<LeaveRequest[]> {
  return client.get<LeaveRequest[]>(STAFF_LEAVE_ROUTE);
}

export function submitLeaveRequest(payload: LeaveRequestPayload): Promise<LeaveRequest> {
  return client.post<LeaveRequest, LeaveRequestPayload>(STAFF_LEAVE_ROUTE, payload);
}