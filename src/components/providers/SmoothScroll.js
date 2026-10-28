"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

export const SCROLL_OFFSET = -96;

const LENIS_OPTIONS = {
  lerp: 0.085,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.4,
  anchors: { offset: SCROLL_OFFSET },
};

// Drives Lenis from GSAP's ticker so ScrollTrigger and Lenis share one frame loop
function LenisSync() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;

    const update = (time) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
    };
  }, [lenis]);

  // Reset scroll on route change, or jump to the anchor in the URL
  useEffect(() => {
    if (!lenis) return;
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));

    lenis.scrollTo(target || 0, { offset: target ? SCROLL_OFFSET : 0, immediate: true, force: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [lenis, pathname]);

  return null;
}

export default function SmoothScroll({ children }) {
  // Native scrolling for visitors who prefer reduced motion
  const [options] = useState(() => ({ ...LENIS_OPTIONS, smoothWheel: !prefersReducedMotion() }));

  return (
    <ReactLenis root options={options} autoRaf={false}>
      <LenisSync />
      {children}
    </ReactLenis>
  );
}
