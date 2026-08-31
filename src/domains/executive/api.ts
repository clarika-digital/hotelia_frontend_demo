import { client } from "@/global/api/client";
import { EXECUTIVE_API_ROUTES } from "./constants";
import type { ExecutiveSnapshot } from "./types";

export function fetchExecutiveAnalytics(): Promise<ExecutiveSnapshot> {
  return client.get<ExecutiveSnapshot>(EXECUTIVE_API_ROUTES.analytics);
}
