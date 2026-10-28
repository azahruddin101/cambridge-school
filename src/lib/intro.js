// Coordinates hero animations with the preloader: on a hard load they wait for
// the curtain to lift, on client-side navigations they start right away.

export const INTRO_DURATION = 2.1;

export function introDelay() {
  if (typeof window === "undefined" || window.__ecsIntroDone) return 0;
  // Start just as the curtain begins to lift
  return INTRO_DURATION - 0.5;
}

export function markIntroDone() {
  window.__ecsIntroDone = true;
}
