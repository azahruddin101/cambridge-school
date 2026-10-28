"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/_actions/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10" },
  { href: "/admin/committee", label: "Managing Committee", icon: "M17 20h5v-2a4 4 0 00-5-3.87M9 20H2v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 3a3 3 0 11-6 0 3 3 0 016 0z" },
  { href: "/admin/faculty", label: "Faculty", icon: "M12 14l9-5-9-5-9 5 9 5zm0 0v7m-6-4.5V12" },
  { href: "/admin/fees", label: "Fee Structure", icon: "M9 7h6m-6 4h6m-6 4h4M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z" },
  { href: "/admin/strength", label: "Student Strength", icon: "M4 20V10m6 10V4m6 16v-7m4 7H2" },
  { href: "/admin/gallery", label: "Gallery", icon: "M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15 9h.01" },
  { href: "/admin/account", label: "Account", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0" },
];

function NavIcon({ d }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[18px] shrink-0" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 font-medium">
          <Image src="/images/brand/emblem.webp" alt="" width={288} height={360} className="h-8 w-auto" />
          Admin
        </Link>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="admin-nav" className="rounded-lg px-3 py-2 text-sm ring-1 ring-line">
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <aside
        id="admin-nav"
        className={`${open ? "block" : "hidden"} border-b border-line bg-white lg:sticky lg:top-0 lg:block lg:h-svh lg:border-b-0 lg:border-r`}
      >
        <div className="flex h-full flex-col p-4">
          <Link href="/admin" className="mb-6 hidden items-center gap-3 rounded-xl px-2 py-1 lg:flex">
            <Image src="/images/brand/emblem.webp" alt="" width={288} height={360} className="h-10 w-auto" />
            <span className="leading-tight">
              <span className="block font-serif text-lg">Eastern Cambridge</span>
              <span className="block text-xs uppercase tracking-[0.18em] text-ink/50">Admin panel</span>
            </span>
          </Link>

          <nav aria-label="Admin" className="flex-1">
            <ul className="space-y-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive(item.href) ? "bg-forest text-ivory" : "text-ink/75 hover:bg-ivory hover:text-ink"
                    }`}
                  >
                    <NavIcon d={item.icon} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6 space-y-1 border-t border-line pt-4">
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink/75 hover:bg-ivory hover:text-ink">
              <NavIcon d="M14 4h6v6m0-6L10 14M18 14v6H4V6h6" />
              View website
            </a>
            <form action={logout}>
              <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-ink/75 hover:bg-ivory hover:text-ink">
                <NavIcon d="M15 17l5-5-5-5m5 5H9m4 9H5V3h8" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
