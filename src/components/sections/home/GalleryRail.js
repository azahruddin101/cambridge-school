"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import SplitHeading from "@/components/motion/SplitHeading";
import Button from "@/components/ui/Button";

// Frame shapes cycled across the photos, alternating landscape and portrait
const FRAMES = [
  { frame: "w-[78vw] aspect-[4/3] md:w-auto md:h-[46svh]" },
  { frame: "w-[64vw] aspect-[3/4] md:w-auto md:h-[52svh]", offset: "md:mt-[6svh]" },
  { frame: "w-[78vw] aspect-[4/3] md:w-auto md:h-[42svh]" },
  { frame: "w-[64vw] aspect-[3/4] md:w-auto md:h-[50svh]", offset: "md:-mt-[3svh]" },
  { frame: "w-[78vw] aspect-[16/10] md:w-auto md:h-[44svh]", offset: "md:mt-[5svh]" },
];

/** Vertical scroll drives a horizontal filmstrip of school life (desktop); swipeable on touch. */
export default function GalleryRail({ items }) {
  const ref = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const section = ref.current;
        const track = trackRef.current;
        const distance = () => track.scrollWidth - window.innerWidth;
        const setHeight = () => {
          section.style.height = `${distance() + window.innerHeight}px`;
        };

        setHeight();
        ScrollTrigger.addEventListener("refreshInit", setHeight);

        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true },
        });

        gsap.utils.toArray("[data-slide-media]", section).forEach((media) => {
          gsap.fromTo(
            media,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: media.parentElement, containerAnimation: scroll, start: "left right", end: "right left", scrub: true },
            },
          );
        });

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", setHeight);
          section.style.height = "";
        };
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative bg-ivory">
      <div className="flex flex-col justify-center overflow-hidden py-24 md:sticky md:top-0 md:h-svh md:py-0">
        <div className="container-x mb-12 flex flex-col gap-8 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-6 text-ember">Life at Eastern Cambridge</p>
            <SplitHeading className="display-md max-w-xl">Moments that shape who they become.</SplitHeading>
          </div>
          <Button href="/gallery" variant="outline" className="self-start md:self-auto">
            View the gallery
          </Button>
        </div>

        <div className="overflow-x-auto [scrollbar-width:none] md:overflow-visible">
          <div ref={trackRef} className="flex w-max items-start gap-4 px-[clamp(1.25rem,4vw,3.5rem)] will-change-transform md:gap-8">
            {items.map((image, i) => {
              const { frame, offset = "" } = FRAMES[i % FRAMES.length];
              return (
                <figure key={image.id} className={`shrink-0 ${offset}`}>
                  <div className={`relative overflow-hidden rounded-[1.5rem] bg-ink/10 ${frame}`}>
                    <div data-slide-media="" className="absolute -inset-x-[10%] inset-y-0">
                      <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 46vw, 80vw" className="object-cover" />
                    </div>
                  </div>
                  <figcaption className="mt-4 flex items-center gap-3 text-sm text-ink/60">
                    <span className="text-xs tracking-[0.2em] text-ember">0{i + 1}</span>
                    {image.alt}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
