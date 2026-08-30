"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { PAGE_ROUTES, ROLE_LANDING } from "@/domains/auth/constants";
import { useSessionStore } from "@/stores/session-store";

interface GuestGuardProps {
  children: ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const claims = useSessionStore((s) => s.claims);
  const router = useRouter();

  useEffect(() => {
    if (!claims) {
      router.replace(PAGE_ROUTES.guestLogin);
      return;
    }
    if (claims.userType !== "guest") {
      router.replace(
        claims.role ? (ROLE_LANDING[claims.role] ?? PAGE_ROUTES.guestLanding) : PAGE_ROUTES.staffLogin
      );
    }
  }, [claims, router]);

  if (!claims || claims.userType !== "guest") return null;

  return <>{children}</>;
}