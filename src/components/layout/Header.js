"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import Button from "@/components/ui/Button";
import { navigation } from "@/data/site";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Dropdown closed by clicking one of its links; stays shut until the pointer leaves it
  const [dismissed, setDismissed] = useState(null);

  const lenis = useLenis(({ scroll, direction }) => {
    setScrolled(scroll > 60);
    setHidden(scroll > 400 && direction === 1);
  });

  useEffect(() => {
    if (!lenis) return;
    if (menuOpen) lenis.stop();
    else lenis.start();
  }, [menuOpen, lenis]);

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);
  const solid = scrolled && !menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,box-shadow] duration-700 ease-out-expo ${
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
        } ${solid ? "bg-ivory/80 text-ink shadow-[0_1px_0_var(--line)] backdrop-blur-xl" : "text-ivory"}`}
      >
        <div className={`container-x flex items-center justify-between transition-[height] duration-700 ease-out-expo ${solid ? "h-20" : "h-24"}`}>
          <Logo onClick={() => setMenuOpen(false)} plated={!solid} className="relative z-10 -ml-3" />

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {navigation.map((item) => (
                <li key={item.href} className="group relative" onMouseLeave={() => setDismissed(null)}>
                  <Link
                    href={item.href}
                    className={`relative block rounded-full px-4 py-2 text-[0.82rem] tracking-wide transition-opacity duration-300 hover:opacity-100 ${
                      isActive(item.href) ? "opacity-100" : "opacity-70"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-current transition-transform duration-700 ease-out-expo ${
                        isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>

                  {item.children && (
                    <div
                      className={`invisible absolute left-1/2 top-full -translate-x-1/2 translate-y-3 pt-3 opacity-0 ${
                        dismissed === item.href
                          ? "transition-none"
                          : "transition-all duration-500 ease-out-expo group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
                      }`}
                    >
                      <ul className="min-w-56 rounded-2xl bg-paper p-2 text-ink shadow-[0_24px_60px_-20px_rgb(18_32_26/0.35),0_0_0_1px_var(--line)]">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={(e) => {
                                setDismissed(item.href);
                                e.currentTarget.blur();
                              }}
                              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors duration-300 hover:bg-ivory-deep"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-3">
            <span className="hidden sm:block">
              <Button href="/contact" variant={solid ? "ink" : "ivory"}>
                Enquire now
              </Button>
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid size-12 place-items-center rounded-full border border-current/25 xl:hidden"
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ease-out-expo ${menuOpen ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ease-out-expo ${menuOpen ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onNavigate={() => setMenuOpen(false)} />
    </>
  );
}
