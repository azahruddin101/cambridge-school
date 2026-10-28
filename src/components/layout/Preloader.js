"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { INTRO_DURATION, markIntroDone } from "@/lib/intro";
import { site } from "@/data/site";

export default function Preloader() {
  const ref = useRef(null);
  const countRef = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      const done = () => {
        markIntroDone();
        gsap.set(el, { display: "none" });
      };

      if (prefersReducedMotion()) {
        gsap.to(el, { opacity: 0, duration: 0.4, onComplete: done });
        return;
      }

      const counter = { n: 0 };
      gsap
        .timeline({ onComplete: done })
        .fromTo("[data-pre-emblem]", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, ease: "expo.out" })
        .fromTo("[data-pre-line]", { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.15)
        .to(
          counter,
          {
            n: 100,
            duration: INTRO_DURATION - 0.9,
            ease: "power2.inOut",
            onUpdate: () => {
              countRef.current.textContent = String(Math.round(counter.n)).padStart(3, "0");
            },
          },
          0,
        )
        .to("[data-pre-content]", { yPercent: -30, opacity: 0, duration: 0.8, ease: "expo.in" }, INTRO_DURATION - 1.1)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, INTRO_DURATION - 0.6);
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="grain fixed inset-0 z-[100] hidden flex-col items-center justify-center bg-forest text-ivory [.js_&]:flex"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div data-pre-content="" className="flex flex-col items-center text-center">
        <span data-pre-emblem="" className="mb-8 grid size-20 place-items-center rounded-full bg-paper">
          <Image src="/images/brand/emblem.webp" alt="" width={288} height={360} preload className="h-14 w-auto" />
        </span>
        <span className="block overflow-hidden">
          <span data-pre-line="" className="block font-serif text-4xl md:text-5xl">
            {site.name}
          </span>
        </span>
        <span className="mt-3 block overflow-hidden">
          <span data-pre-line="" className="block text-[0.65rem] uppercase tracking-[0.4em] text-gold-soft">
            {site.motto}
          </span>
        </span>
      </div>
      <span ref={countRef} className="absolute bottom-8 right-[clamp(1.25rem,4vw,3.5rem)] font-serif text-6xl tabular-nums text-ivory/20 md:text-8xl">
        000
      </span>
    </div>
  );
}
