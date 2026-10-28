"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/** Paragraph whose words brighten one by one as it scrolls through the viewport. */
export default function ScrubText({ as: Tag = "p", children, className }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      SplitText.create(ref.current, {
        type: "words",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.08,
              scrollTrigger: {
                trigger: ref.current,
                start: "top 80%",
                end: "bottom 45%",
                scrub: 0.6,
              },
            },
          );
        },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
