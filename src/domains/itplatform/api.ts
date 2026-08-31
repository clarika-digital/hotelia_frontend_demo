import { client } from "@/global/api/client";
import { IT_API_ROUTES } from "./constants";
import type { DeviceAction, ItPlatformSnapshot, KioskTouchpoint, SessionDevice } from "./types";

export function fetchItOverview(): Promise<ItPlatformSnapshot> {
  return client.get<ItPlatformSnapshot>(IT_API_ROUTES.overview);
}

export function actOnDevice(
  id: string,
  target: "session" | "kiosk",
  action: DeviceAction
): Promise<SessionDevice | KioskTouchpoint> {
  return client.post<
    SessionDevice | KioskTouchpoint,
    { id: string; target: "session" | "kiosk"; action: DeviceAction }
  >(IT_API_ROUTES.device, { id, target, action });
}
