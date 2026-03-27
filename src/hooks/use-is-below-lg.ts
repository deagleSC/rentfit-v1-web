import { useSyncExternalStore } from "react";

/** Tailwind `lg` breakpoint (1024px). */
const QUERY = "(max-width: 1023px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/** True on viewports smaller than the `lg` breakpoint (mobile + tablet). */
export function useIsBelowLg() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
