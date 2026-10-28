"use client";

import { useRef } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Endless horizontal ticker that briefly speeds up with scroll velocity. */
export default function Marquee({ items, className = "", speed = 40 }) {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const tweenRef = useRef(null);

  useGSAP(
    () => {
      // The track holds two identical halves, so moving -50% loops seamlessly
      tweenRef.current = gsap.to(trackRef.current, {
        xPercent: -50,
        ease: "none",
        duration: speed,
        repeat: -1,
      });
    },
    { scope: ref },
  );

  useLenis(({ velocity }) => {
    const tween = tweenRef.current;
    if (!tween) return;
    const boost = 1 + Math.min(Math.abs(velocity) * 0.12, 4);
    gsap.to(tween, { timeScale: boost, duration: 0.3, overwrite: true });
    gsap.to(tween, { timeScale: 1, duration: 1.2, delay: 0.3, ease: "power2.out" });
  });

  const row = items.map((item, i) => (
    <span key={i} className="flex shrink-0 items-center gap-[clamp(1.5rem,4vw,4rem)] pr-[clamp(1.5rem,4vw,4rem)]">
      <span>{item}</span>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[0.4em] fill-current opacity-60">
        <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
      </svg>
    </span>
  ));

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} aria-label={items.join(", ")}>
      <div ref={trackRef} className="flex w-max will-change-transform" aria-hidden="true">
        {row}
        {row}
      </div>
    </div>
  );
}
