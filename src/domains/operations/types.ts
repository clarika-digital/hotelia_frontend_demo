export type AttentionPriority = "high" | "medium" | "low";

export interface AttentionItem {
  id: string;
  label: string;
  detail: string;
  priority: AttentionPriority;
}

export interface WorkOrderItem {
  id: string;
  ref: string;
  room: string;
  issue: string;
  priority: "high" | "medium" | "low";
  status: "open" | "in_progress" | "resolved";
}

export interface TeamCounter {
  label: string;
  value: number;
}

export interface OperationalRecommendation {
  id: string;
  level: "info" | "warning" | "success";
  message: string;
}

export interface OperationalSnapshot {
  generatedAt: string;
  kpis: {
    occupancy: number;
    arrivalsToday: number;
    departuresToday: number;
    openTasks: number;
    pendingEscalations: number;
    signOffRequired: number;
    highPriorityMaintenance: number;
    housekeepingInProgress: number;
    openWorkOrders: number;
    guestApprovalsPending: number;
    blockedRooms: number;
  };
  occupancyTrend: { label: string; value: number }[];
  workOrders: WorkOrderItem[];
  teamSnapshot: TeamCounter[];
  attention: AttentionItem[];
  pipeline: {
    status: { label: string; field: string; color: string; count: number }[];
    account: number;
    walkIn: number;
  };
  recommendations: OperationalRecommendation[];
}
