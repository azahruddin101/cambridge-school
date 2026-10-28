"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import SplitHeading from "@/components/motion/SplitHeading";
import Reveal from "@/components/motion/Reveal";
import { facilities } from "@/data/content";

export default function Facilities() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      ref.current.querySelectorAll("[data-facility]").forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top center",
          end: "bottom center",
          onToggle: ({ isActive }) => isActive && setActive(i),
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="grain relative bg-ink py-28 text-ivory md:py-44">
      <div className="container-x">
        <div className="mb-20 grid gap-8 md:mb-28 md:grid-cols-2 md:items-end">
          <div>
            <Reveal className="eyebrow mb-8 text-gold-soft">Facilities</Reveal>
            <SplitHeading className="display-lg">
              Spaces designed for <em className="text-gold-soft">curious</em> minds.
            </SplitHeading>
          </div>
          <Reveal className="max-w-md text-lg leading-relaxed text-ivory/65 md:justify-self-end">
            <p>From the first digital lesson to the first experiment, every space on campus is built to make learning tangible.</p>
          </Reveal>
        </div>

        <div className="grid gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
          <div className="hidden md:block">
            <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-forest">
              <div className="absolute inset-0">
                {facilities.map((facility, i) => (
                  <Image
                    key={facility.title}
                    src={facility.image.src}
                    alt={facility.image.alt}
                    fill
                    sizes="45vw"
                    className={`object-cover transition-[opacity,transform,filter] duration-[1400ms] ease-out-expo ${
                      active === i ? "scale-100 opacity-100 blur-0" : "scale-110 opacity-0 blur-sm"
                    }`}
                  />
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              <span className="absolute bottom-6 left-6 font-serif text-7xl tabular-nums text-ivory/90">0{active + 1}</span>
            </div>
          </div>

          <ol>
            {facilities.map((facility, i) => (
              <li
                key={facility.title}
                data-facility=""
                className={`flex flex-col justify-center border-t border-line-light py-10 transition-opacity duration-700 md:min-h-[70vh] md:py-0 ${
                  active === i ? "md:opacity-100" : "md:opacity-30"
                }`}
              >
                <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-2xl md:hidden">
                  <Image src={facility.image.src} alt={facility.image.alt} fill sizes="100vw" className="object-cover" />
                </div>
                <span className="mb-6 text-xs tracking-[0.25em] text-gold-soft">0{i + 1} / 0{facilities.length}</span>
                <h3 className="text-[clamp(2.5rem,5vw,4.5rem)]">{facility.title}</h3>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-ivory/65">{facility.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
