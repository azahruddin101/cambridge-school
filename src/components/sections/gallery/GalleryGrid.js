"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import Reveal from "@/components/motion/Reveal";

// Photos per page on phones; larger screens show the whole gallery
const MOBILE_PAGE_SIZE = 10;

/** Pages to show as buttons: all of them, or first/last plus the current neighbourhood. */
function pageList(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total));
  return [...pages].sort((a, b) => a - b).flatMap((p, i, arr) => (i && p - arr[i - 1] > 1 ? ["…", p] : [p]));
}

/**
 * Masonry grid of photographs that open in a full-screen lightbox. On phones
 * it's paginated, with the page kept in the URL (?page=2) so reloads and
 * shared links land on the same page.
 */
export default function GalleryGrid({ items }) {
  const [index, setIndex] = useState(null);
  const lenis = useLenis();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const boxRef = useRef(null);
  const gridRef = useRef(null);
  const shownPage = useRef(null);
  const open = index !== null;

  const pages = Math.max(1, Math.ceil(items.length / MOBILE_PAGE_SIZE));
  const requested = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const current = Number.isNaN(requested) ? 1 : Math.min(Math.max(requested, 1), pages);
  const first = (current - 1) * MOBILE_PAGE_SIZE;
  const onPage = (i) => i >= first && i < first + MOBILE_PAGE_SIZE;

  const hrefFor = (p) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p === 1) params.delete("page");
    else params.set("page", String(p));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  // pushState updates the URL (and useSearchParams) without a server round trip;
  // the links still work as plain navigation if JavaScript hasn't loaded
  const goTo = (event, p) => {
    event.preventDefault();
    if (p < 1 || p > pages || p === current) return;
    window.history.pushState(null, "", hrefFor(p));
    lenis?.scrollTo(gridRef.current, { offset: -110, duration: 1 });
  };

  // Fade a newly shown page in (clicks and back/forward alike), and let
  // scroll-linked animations re-measure the shorter/taller page
  useGSAP(
    () => {
      const isFirstRender = shownPage.current === null;
      shownPage.current = current;
      if (isFirstRender) return;
      gsap.fromTo(
        gridRef.current.querySelectorAll("[data-on-page]"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.05, ease: "expo.out", clearProps: "transform" },
      );
      ScrollTrigger.refresh();
    },
    { dependencies: [current], scope: gridRef },
  );

  const step = useCallback((dir) => setIndex((i) => (i + dir + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, lenis, step]);

  useGSAP(
    () => {
      if (!open) return;
      gsap.fromTo("[data-lightbox-img]", { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.9, ease: "expo.out" });
    },
    { dependencies: [index], scope: boxRef },
  );

  return (
    <>
      <div ref={gridRef}>
        <Reveal className="columns-2 gap-3 sm:gap-4 lg:columns-3 [&>*]:mb-3 sm:[&>*]:mb-4" stagger={0.08}>
          {items.map((image, i) => (
            <button
              key={image.src}
              type="button"
              data-reveal-item=""
              data-on-page={onPage(i) ? "" : undefined}
              onClick={() => setIndex(i)}
              // Off-page photos are hidden on phones only
              className={`group relative block w-full break-inside-avoid overflow-hidden rounded-2xl bg-ink/10 sm:rounded-[1.5rem] ${onPage(i) ? "" : "max-sm:hidden"}`}
              aria-label={`Open photo: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="h-auto w-full transition-transform duration-[1400ms] ease-out-expo group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-transparent to-transparent p-5 text-left text-sm text-ivory opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                {image.alt}
              </span>
            </button>
          ))}
        </Reveal>
      </div>

      {pages > 1 && (
        <nav aria-label="Gallery pages" className="mt-10 flex flex-col items-center gap-4 sm:hidden">
          <p className="text-sm text-ink/55">
            Showing {first + 1}–{Math.min(first + MOBILE_PAGE_SIZE, items.length)} of {items.length} photos
          </p>
          <div className="flex items-center gap-1.5">
            <PageLink page={current - 1} disabled={current === 1} href={hrefFor(current - 1)} onNavigate={goTo} label="Previous page">
              ←
            </PageLink>
            {pageList(current, pages).map((p, i) =>
              p === "…" ? (
                <span key={`gap-${i}`} className="px-1 text-ink/40">
                  …
                </span>
              ) : (
                <PageLink key={p} page={p} active={p === current} href={hrefFor(p)} onNavigate={goTo} label={`Page ${p}`}>
                  {p}
                </PageLink>
              ),
            )}
            <PageLink page={current + 1} disabled={current === pages} href={hrefFor(current + 1)} onNavigate={goTo} label="Next page">
              →
            </PageLink>
          </div>
        </nav>
      )}

      {open && (
        <div
          ref={boxRef}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[60] flex flex-col bg-ink/95 text-ivory backdrop-blur-sm"
          onClick={() => setIndex(null)}
        >
          <div className="container-x flex h-20 items-center justify-between text-sm">
            <span className="tabular-nums text-ivory/60">
              {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => setIndex(null)} className="rounded-full border border-line-light px-5 py-2" autoFocus>
              Close
            </button>
          </div>

          <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
            <Image
              key={items[index].src}
              data-lightbox-img=""
              src={items[index].src}
              alt={items[index].alt}
              fill
              sizes="100vw"
              className="object-contain px-4 md:px-24"
            />
            <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="absolute left-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-ivory/10 text-xl backdrop-blur transition-colors hover:bg-ivory/20 md:left-8">
              ←
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next photo" className="absolute right-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-ivory/10 text-xl backdrop-blur transition-colors hover:bg-ivory/20 md:right-8">
              →
            </button>
          </div>

          <p className="container-x py-6 text-center text-sm text-ivory/70">{items[index].alt}</p>
        </div>
      )}
    </>
  );
}

function PageLink({ page, href, onNavigate, label, active = false, disabled = false, children }) {
  const base = "grid size-11 place-items-center rounded-full text-sm tabular-nums transition-colors duration-300";
  if (disabled) {
    return (
      <span aria-disabled="true" aria-label={label} className={`${base} border border-line opacity-30`}>
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      onClick={(e) => onNavigate(e, page)}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`${base} ${active ? "bg-forest text-ivory" : "border border-line text-ink/70"}`}
    >
      {children}
    </a>
  );
}
