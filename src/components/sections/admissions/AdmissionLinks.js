import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { ArrowIcon } from "@/components/ui/Icons";

const PAGES = [
  { href: "/admissions", eyebrow: "Admissions", title: "How to apply", body: "Three simple steps to join the school." },
  { href: "/admissions/fee-structure", eyebrow: "Admissions", title: "Fee structure", body: "Fee heads by class and the month-wise payment schedule." },
  { href: "/admissions/student-strength", eyebrow: "Admissions", title: "Student strength", body: "Class-wise sections and the number of boys and girls." },
];

/** Cards linking the admissions pages to one another, leaving out the current one. */
export default function AdmissionLinks({ current }) {
  const pages = PAGES.filter((p) => p.href !== current);

  return (
    <Reveal className="grid gap-4 md:grid-cols-2" stagger={0.12}>
      {pages.map((page) => (
        <Link
          key={page.href}
          href={page.href}
          data-reveal-item=""
          className="group relative flex min-h-64 flex-col justify-between overflow-hidden rounded-[1.75rem] bg-paper p-8 shadow-[0_0_0_1px_var(--line)] md:p-10"
        >
          <span className="absolute inset-0 origin-bottom scale-y-0 bg-forest transition-transform duration-[900ms] ease-out-expo group-hover:scale-y-100" />
          <span className="relative flex items-start justify-between transition-colors duration-700 group-hover:text-ivory">
            <span className="text-xs uppercase tracking-[0.22em] text-ember transition-colors duration-700 group-hover:text-gold-soft">{page.eyebrow}</span>
            <span className="grid size-11 place-items-center rounded-full border border-current/20 transition-transform duration-700 ease-out-expo group-hover:rotate-45">
              <ArrowIcon />
            </span>
          </span>
          <span className="relative transition-colors duration-700 group-hover:text-ivory">
            <span className="block font-serif text-[clamp(2.25rem,4vw,3.25rem)] leading-none">{page.title}</span>
            <span className="mt-4 block text-ink/60 transition-colors duration-700 group-hover:text-ivory/70">{page.body}</span>
          </span>
        </Link>
      ))}
    </Reveal>
  );
}
