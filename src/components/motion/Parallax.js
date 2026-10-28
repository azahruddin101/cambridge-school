"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Clips its children and drifts them vertically while scrolling.
 * `amount` is the travel in percent of the inner element's height.
 */
export default function Parallax({ children, className = "relative", amount = 12, scale = 1.18 }) {
  const ref = useRef(null);
  const innerRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        innerRef.current,
        { yPercent: -amount / 2, scale },
        {
          yPercent: amount / 2,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="absolute inset-0 will-change-transform">
        {children}
      </div>
    </div>
  );
}
