"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const FROM_CLIP = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 0% 0% 100%)",
  right: "inset(0% 100% 0% 0%)",
};

/** Unveils an image with a clip-path wipe while it settles from a slight zoom. */
export default function ImageReveal({ children, className = "relative", direction = "up", delay = 0, parallax = true }) {
  const ref = useRef(null);
  const innerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        delay,
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });

      tl.fromTo(
        ref.current,
        { clipPath: FROM_CLIP[direction], opacity: 1 },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" },
      ).fromTo(innerRef.current, { scale: 1.35 }, { scale: 1.1, duration: 2.2, ease: "expo.out" }, 0);

      if (parallax) {
        gsap.fromTo(
          innerRef.current,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-reveal="" className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="absolute inset-0 will-change-transform">
        {children}
      </div>
    </div>
  );
}
