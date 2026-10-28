"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { navigation, site } from "@/data/site";

export default function MobileMenu({ open, onNavigate }) {
  const ref = useRef(null);
  const tl = useRef(null);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(ref.current, { visibility: "visible" })
        .fromTo(
          ref.current,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.inOut" },
        )
        .fromTo(
          "[data-menu-item]",
          { yPercent: 120 },
          { yPercent: 0, duration: 1.1, stagger: 0.06, ease: "expo.out" },
          "-=0.45",
        )
        .fromTo("[data-menu-foot]", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.8");
    },
    { scope: ref },
  );

  useGSAP(() => {
    if (!tl.current) return;
    if (open) tl.current.timeScale(1).play();
    else tl.current.timeScale(1.6).reverse();
  }, [open]);

  return (
    <div
      ref={ref}
      id="mobile-menu"
      inert={!open}
      className="grain invisible fixed inset-0 z-40 flex flex-col bg-forest pb-10 pt-32 text-ivory xl:hidden"
      data-lenis-prevent=""
    >
      <nav aria-label="Mobile" className="container-x flex-1 overflow-y-auto">
        <ul>
          {navigation.map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <Link
                href={item.href}
                onClick={onNavigate}
                data-menu-item=""
                className="flex items-baseline gap-4 pb-[0.18em] pt-[0.04em] font-serif text-[clamp(2.5rem,11vw,4.5rem)] leading-[1.05]"
              >
                <span className="font-sans text-xs tracking-widest text-gold-soft">0{i + 1}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div data-menu-foot="" className="container-x mt-8 grid gap-2 border-t border-line-light pt-6 text-sm text-ivory/70">
        <a href={site.phoneHref}>{site.phone}</a>
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </div>
    </div>
  );
}
