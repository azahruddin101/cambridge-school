"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Validated categorical pair (dataviz validator, light surface #fbf8f2)
const SERIES = [
  { key: "boys", label: "Boys", color: "#2f6fa3" },
  { key: "girls", label: "Girls", color: "#c65a2e" },
];

/** Stacked horizontal bars of boys and girls per class, with a hover tooltip. */
export default function StrengthChart({ rows }) {
  const ref = useRef(null);
  const [hover, setHover] = useState(null);
  const max = Math.max(...rows.map((r) => r.boys + r.girls));

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-bar]",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.6, stagger: 0.06, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 80%", once: true } },
      );
    },
    { scope: ref },
  );

  return (
    <figure ref={ref} className="rounded-[1.75rem] bg-paper p-6 shadow-[0_0_0_1px_var(--line)] md:p-10">
      <figcaption className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <span className="font-serif text-2xl">Students per class</span>
        <span className="flex gap-5 text-sm text-ink/70">
          {SERIES.map((s) => (
            <span key={s.key} className="flex items-center gap-2">
              <span className="size-2.5 rounded-[3px]" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </span>
      </figcaption>

      <ul className="space-y-3" onMouseLeave={() => setHover(null)}>
        {rows.map((row) => {
          const total = row.boys + row.girls;
          return (
            <li key={row.cls} className="grid grid-cols-[2.75rem_1fr_2.5rem] items-center gap-3 text-sm">
              <span className="text-ink/60">{row.cls}</span>
              <span className="relative h-7">
                <span data-bar="" className="absolute inset-y-0 left-0 flex origin-left gap-[2px]" style={{ width: `${(total / max) * 100}%` }}>
                  {SERIES.map((s, i) => (
                    <span
                      key={s.key}
                      onMouseEnter={() => setHover({ cls: row.cls, series: s, value: row[s.key], total })}
                      className={`h-full transition-opacity duration-300 ${i === 0 ? "rounded-l-[4px]" : "rounded-r-[4px]"} ${
                        hover && (hover.cls !== row.cls || hover.series.key !== s.key) ? "opacity-40" : ""
                      }`}
                      style={{ width: `${(row[s.key] / total) * 100}%`, background: s.color }}
                    />
                  ))}
                </span>
                {hover?.cls === row.cls && (
                  <span className="pointer-events-none absolute -top-11 left-0 z-10 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs text-ivory shadow-lg">
                    Class {row.cls} · {hover.series.label}: <strong className="font-medium">{hover.value}</strong> of {total}
                  </span>
                )}
              </span>
              <span className="text-right tabular-nums text-ink/80">{total}</span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
