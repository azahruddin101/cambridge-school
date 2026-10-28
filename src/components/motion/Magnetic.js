"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Gently pulls its child towards the pointer on hover (fine pointers only). */
export default function Magnetic({ children, strength = 0.35, className = "inline-block" }) {
  const ref = useRef(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!window.matchMedia("(pointer: fine)").matches) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });

      const onMove = contextSafe((e) => {
        const { left, top, width, height } = el.getBoundingClientRect();
        xTo((e.clientX - (left + width / 2)) * strength);
        yTo((e.clientY - (top + height / 2)) * strength);
      });
      const onLeave = contextSafe(() => {
        xTo(0);
        yTo(0);
      });

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
