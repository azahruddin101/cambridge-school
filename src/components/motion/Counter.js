"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Counts up to `value` once it scrolls into view. */
export default function Counter({ value, prefix = "", pad = false, className }) {
  const ref = useRef(null);
  const format = (n) => `${prefix}${pad ? String(n).padStart(2, "0") : n}`;

  useGSAP(
    () => {
      const state = { n: 0 };
      ref.current.textContent = format(0);
      gsap.to(state, {
        n: value,
        duration: 2.4,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        onUpdate: () => {
          ref.current.textContent = format(Math.round(state.n));
        },
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
