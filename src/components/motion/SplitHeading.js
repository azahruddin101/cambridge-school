"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { introDelay } from "@/lib/intro";

/**
 * Heading whose lines rise out of a mask. Plays on scroll by default,
 * or immediately (after `delay`) when `immediate` is set — e.g. in a hero.
 */
export default function SplitHeading({
  as: Tag = "h2",
  children,
  className,
  delay = 0,
  afterIntro = false,
  stagger = 0.09,
  immediate = false,
  start = "top 85%",
  ...props
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;

      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { opacity: 1 });
          return gsap.fromTo(
            self.lines,
            { yPercent: 115, rotate: 2 },
            {
              yPercent: 0,
              rotate: 0,
              duration: 1.5,
              delay: delay + (afterIntro ? introDelay() : 0),
              stagger,
              ease: "expo.out",
              scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
            },
          );
        },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} data-reveal="" className={className} {...props}>
      {children}
    </Tag>
  );
}
