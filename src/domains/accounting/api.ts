import { client } from "@/global/api/client";
import { ACCOUNTING_API_ROUTES } from "./constants";
import type {
  AccountantSnapshot,
  ApprovalAction,
  ApprovalItem,
} from "./types";

export function fetchAccountantOverview(): Promise<AccountantSnapshot> {
  return client.get<AccountantSnapshot>(ACCOUNTING_API_ROUTES.overview);
}

export function decideApproval(
  id: string,
  action: ApprovalAction
): Promise<ApprovalItem> {
  return client.post<ApprovalItem, { id: string; action: ApprovalAction }>(
    ACCOUNTING_API_ROUTES.approval,
    { id, action }
  );
}
