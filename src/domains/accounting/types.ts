export type PaymentMethod = "cash" | "card" | "momo";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface ApprovalItem {
  id: string;
  ref: string;
  guest: string;
  method: PaymentMethod;
  amount: number;
  createdAt: string;
  status: ApprovalStatus;
}

export interface RefundItem {
  id: string;
  ref: string;
  guest: string;
  amount: number;
  status: "pending" | "manager_sign_off" | "paid";
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  ref: string;
  guest: string;
  amount: number;
  status: "open" | "overdue" | "paid";
  dueDate: string;
}

export interface CollectionBucket {
  date: string;
  amount: number;
}

export interface MethodSplit {
  method: PaymentMethod;
  amount: number;
}

export interface AccountantSnapshot {
  generatedAt: string;
  kpis: {
    pendingApprovals: number;
    pendingApprovalsValue: number;
    oldestApprovalAgeMin: number;
    collectedToday: number;
    refundsInFlight: number;
    refundsRequiringSignOff: number;
    outstandingInvoices: number;
    outstandingValue: number;
    overdueInvoices: number;
    reconciliationVariance: number;
    fxConversions: number;
  };
  collections: {
    todayByMethod: MethodSplit[];
    trend7d: CollectionBucket[];
  };
  approvals: ApprovalItem[];
  refunds: RefundItem[];
  invoices: InvoiceItem[];
  reconciliation: {
    expected: number;
    settled: number;
    variance: number;
    settledByMethod: MethodSplit[];
  };
}

export type ApprovalAction = "approve" | "reject";

export interface ApprovalDecisionRequest {
  id: string;
  action: ApprovalAction;
}
