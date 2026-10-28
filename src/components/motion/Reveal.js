"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { introDelay } from "@/lib/intro";

/**
 * Fades and lifts content into view. Children marked with
 * `data-reveal-item` are staggered; otherwise the wrapper animates as one.
 */
export default function Reveal({
  as: Tag = "div",
  children,
  className,
  y = 48,
  delay = 0,
  afterIntro = false,
  stagger = 0.1,
  duration = 1.4,
  start = "top 88%",
  ...props
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      const items = el.querySelectorAll("[data-reveal-item]");
      const targets = items.length ? items : el;

      gsap.set(el, { opacity: 1 });
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay: delay + (afterIntro ? introDelay() : 0),
          stagger,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} data-reveal="" className={className} {...props}>
      {children}
    </Tag>
  );
}
