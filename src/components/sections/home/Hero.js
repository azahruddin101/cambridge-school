"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { introDelay } from "@/lib/intro";
import SplitHeading from "@/components/motion/SplitHeading";
import Reveal from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import Button from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/Icons";
import { images, notice } from "@/data/content";
import { site } from "@/data/site";

export default function Hero() {
  const ref = useRef(null);
  const frameRef = useRef(null);
  const mediaRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(
    () => {
      // Intro: the photograph settles from a slow zoom
      gsap.fromTo(mediaRef.current, { scale: 1.3 }, { scale: 1.08, duration: 2.8, delay: introDelay() - 0.3, ease: "expo.out" });

      // Leaving: the full-bleed image draws inward into a framed card
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
      tl.fromTo(frameRef.current, { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: "inset(6% 4% 0% 4% round 28px)", ease: "none" }, 0)
        .to(mediaRef.current, { yPercent: 18, ease: "none" }, 0)
        .to(contentRef.current, { yPercent: -25, opacity: 0, ease: "none" }, 0);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] bg-ivory">
      <div ref={frameRef} className="grain absolute inset-0 overflow-hidden bg-ink text-ivory">
        <div ref={mediaRef} className="absolute inset-0 will-change-transform">
          <Image src={images.mainBuilding.src} alt={images.mainBuilding.alt} fill preload quality={85} sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/35 to-ink/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent" />

        <div ref={contentRef} className="container-x relative flex h-full flex-col justify-end pb-10 pt-32 md:pb-14">
          <Reveal afterIntro className="eyebrow mb-8 text-gold-soft">
            Co-educational · English medium · Bhatpar Rani
          </Reveal>

          <SplitHeading as="h1" immediate afterIntro delay={0.1} className="display-xl max-w-[12ch]">
            Where wisdom finds its <em className="text-gold-soft">roots.</em>
          </SplitHeading>

          <div className="mt-10 flex flex-col gap-10 md:mt-14 md:flex-row md:items-end md:justify-between">
            <Reveal afterIntro delay={0.5} className="max-w-md space-y-8">
              <p className="text-base leading-relaxed text-ivory/75 md:text-lg">{site.description}</p>
              <div className="flex flex-wrap gap-3">
                <Magnetic>
                  <Button href="/about" variant="ivory">
                    Discover the school
                  </Button>
                </Magnetic>
                <Magnetic>
                  <Button href="/admissions" variant="outline">
                    Admissions
                  </Button>
                </Magnetic>
              </div>
            </Reveal>

            <Reveal afterIntro delay={0.7}>
              <Link
                href="/contact"
                className="group flex max-w-sm items-center gap-5 rounded-2xl border border-line-light bg-ivory/[0.06] p-4 pr-5 backdrop-blur-md transition-colors duration-500 hover:bg-ivory/[0.12]"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-ember text-center leading-none">
                  <span>
                    <span className="block font-serif text-2xl">{notice.date.day}</span>
                    <span className="text-[0.6rem] uppercase tracking-widest">{notice.date.month}</span>
                  </span>
                </span>
                <span className="text-sm">
                  <span className="mb-1 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-gold-soft">
                    <span className="size-1.5 animate-pulse rounded-full bg-gold-soft" /> Notice board
                  </span>
                  <span className="block font-serif text-xl">{notice.title}</span>
                </span>
                <ArrowIcon className="ml-auto size-5 shrink-0 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
              </Link>
            </Reveal>
          </div>

          <div className="pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-ivory/60 xl:flex">
            Scroll
            <span className="relative block h-12 w-px overflow-hidden bg-ivory/20">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.2s_cubic-bezier(0.76,0,0.24,1)_infinite] bg-ivory" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
