"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import Reveal from "@/components/motion/Reveal";
import { thoughts } from "@/data/content";

export default function Thoughts() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const quotes = gsap.utils.toArray("[data-quote]");
        const names = gsap.utils.toArray("[data-name]");

        gsap.set(quotes.slice(1), { opacity: 0, yPercent: 12, filter: "blur(10px)" });
        gsap.set(names.slice(1), { opacity: 0.35 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut", duration: 1 },
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
        });

        tl.fromTo("[data-progress]", { scaleX: 1 / quotes.length }, { scaleX: 1, ease: "none", duration: quotes.length }, 0);

        quotes.slice(1).forEach((quote, i) => {
          const at = i + 0.5;
          tl.to(quotes[i], { opacity: 0, yPercent: -12, filter: "blur(10px)" }, at)
            .to(quote, { opacity: 1, yPercent: 0, filter: "blur(0px)" }, at + 0.3)
            .to(names[i], { opacity: 0.35 }, at)
            .to(names[i + 1], { opacity: 1 }, at);
        });
        tl.to({}, { duration: 0.5 });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="grain relative bg-forest text-ivory md:h-[320vh]">
      <div className="relative flex flex-col overflow-hidden py-28 md:sticky md:top-0 md:h-svh md:py-0">
        <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-24 select-none font-serif text-[28rem] leading-none text-ivory/[0.04] md:text-[44rem]">
          &ldquo;
        </span>

        <div className="container-x relative flex flex-1 flex-col md:justify-center md:pb-36 md:pt-28">
          <Reveal className="eyebrow mb-12 text-gold-soft md:mb-16">Thoughts that guide us</Reveal>

          <div className="relative grid gap-16 md:block md:min-h-[46vh]">
            {thoughts.map((thought) => (
              <figure key={thought.name} data-quote="" className="md:absolute md:inset-x-0 md:top-0">
                <blockquote className="max-w-5xl font-serif text-[clamp(1.9rem,4.2vw,4.25rem)] leading-[1.1] tracking-[-0.015em]">
                  &ldquo;{thought.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4 md:hidden">
                  <Image src={thought.image} alt="" width={48} height={48} className="size-12 rounded-full object-cover object-top grayscale" />
                  <span className="text-sm uppercase tracking-[0.2em] text-ivory/70">{thought.name}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="container-x absolute inset-x-0 bottom-0 hidden pb-12 md:block">
          <div className="relative mb-8 h-px bg-ivory/15">
            <span data-progress="" className="absolute inset-0 origin-left bg-gold-soft" />
          </div>
          <ol className="grid grid-cols-3 gap-6">
            {thoughts.map((thought, i) => (
              <li key={thought.name} data-name="" className="flex items-center gap-4">
                <Image src={thought.image} alt="" width={56} height={56} className="size-14 rounded-full object-cover object-top grayscale" />
                <span>
                  <span className="block text-[0.65rem] tracking-[0.25em] text-gold-soft">0{i + 1}</span>
                  <span className="font-serif text-2xl">{thought.name}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
