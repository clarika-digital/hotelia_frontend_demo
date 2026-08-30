"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useSessionStore } from "@/stores/session-store";
import { PAGE_ROUTES, ROLE_LANDING } from "@/domains/auth/constants";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const claims = useSessionStore((s) => s.claims);
  const router = useRouter();

  useEffect(() => {
    if (!claims) {
      router.replace(PAGE_ROUTES.staffLogin);
      return;
    }
    if (claims.userType !== "staff") {
      router.replace(PAGE_ROUTES.guestLogin);
      return;
    }
    if (allowedRoles && claims.role && !allowedRoles.includes(claims.role)) {
      router.replace(
        ROLE_LANDING[claims.role] ?? PAGE_ROUTES.guestLanding
      );
    }
  }, [claims, allowedRoles, router]);

  if (!claims || claims.userType !== "staff") return null;
  if (allowedRoles && claims.role && !allowedRoles.includes(claims.role)) {
    return null;
  }

  return <>{children}</>;
}
