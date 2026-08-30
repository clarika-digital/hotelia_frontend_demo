"use client";

import { useEffect, useRef } from "react";

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "pointermove",
  "pointerdown",
  "keydown",
  "wheel",
  "touchstart",
];

export function useIdleLock(
  timeoutMs: number,
  onLock: () => void,
  enabled: boolean
): void {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onLockRef = useRef(onLock);
  onLockRef.current = onLock;

  useEffect(() => {
    if (!enabled || !Number.isFinite(timeoutMs)) return;

    const reset = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => onLockRef.current(), timeoutMs);
    };

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, reset, { passive: true })
    );
    reset();

    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, reset)
      );
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
    };
  }, [timeoutMs, enabled]);
}