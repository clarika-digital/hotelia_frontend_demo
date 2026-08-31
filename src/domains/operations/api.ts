import { client } from "@/global/api/client";
import { OPERATIONS_API_ROUTES } from "./constants";
import type { OperationalSnapshot } from "./types";

export function fetchManagerOverview(): Promise<OperationalSnapshot> {
  return client.get<OperationalSnapshot>(OPERATIONS_API_ROUTES.overview);
}
