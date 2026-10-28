"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Softly lifts each new page into place on client-side navigation. */
export default function PageTransition({ children }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      // The preloader covers the very first load
      if (!window.__ecsIntroDone) return;
      gsap.fromTo(ref.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", clearProps: "transform" });
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
