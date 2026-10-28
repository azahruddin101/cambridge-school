import Link from "next/link";
import Image from "next/image";
import SplitHeading from "@/components/motion/SplitHeading";
import Reveal from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import Button from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/Icons";
import CurrentYear from "./CurrentYear";
import { navigation, site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-forest text-ivory">
      <div className="container-x pt-28 md:pt-40">
        <div className="grid gap-12 border-b border-line-light pb-20 md:grid-cols-[1.4fr_1fr] md:items-end md:pb-28">
          <div>
            <p className="eyebrow mb-8 text-gold-soft">Admissions open</p>
            <SplitHeading className="display-lg max-w-3xl">
              Every great journey begins with a single <em className="text-gold-soft">first step.</em>
            </SplitHeading>
          </div>
          <Reveal className="flex flex-col items-start gap-4 md:items-end">
            <Magnetic>
              <Button href="/contact" variant="ivory">
                Book a campus visit
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href={site.phoneHref} variant="outline" icon={<PhoneIcon />}>
                Call {site.phone}
              </Button>
            </Magnetic>
          </Reveal>
        </div>

        <Reveal className="grid gap-12 py-20 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          <div data-reveal-item="">
            <h3 className="mb-5 font-sans text-xs uppercase tracking-[0.22em] text-ivory/50">Visit</h3>
            <p className="max-w-56 leading-relaxed text-ivory/85">
              {site.location}
              <br />
              {site.address}
            </p>
          </div>
          <div data-reveal-item="">
            <h3 className="mb-5 font-sans text-xs uppercase tracking-[0.22em] text-ivory/50">Contact</h3>
            <ul className="space-y-2 text-ivory/85">
              <li>
                <a href={site.phoneHref} className="link-underline">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="link-underline break-all">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
          <div data-reveal-item="">
            <h3 className="mb-5 font-sans text-xs uppercase tracking-[0.22em] text-ivory/50">Explore</h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-ivory/85">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal-item="">
            <h3 className="mb-5 font-sans text-xs uppercase tracking-[0.22em] text-ivory/50">Follow</h3>
            <ul className="space-y-2 text-ivory/85">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noreferrer" className="link-underline">
                    {social.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="container-x" aria-hidden="true">
        <SplitHeading as="p" start="top 95%" className="select-none whitespace-nowrap font-serif text-[14.6vw] leading-[0.8] tracking-[-0.04em] text-ivory/[0.07] xl:text-[13.4rem]">
          Eastern Cambridge
        </SplitHeading>
      </div>

      <div className="container-x">
        <div className="flex flex-col gap-4 border-t border-line-light py-8 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-paper px-2 py-1.5">
              <Image src="/images/brand/logo.webp" alt="" width={1200} height={280} sizes="120px" className="h-6 w-auto" />
            </span>
            <span>
              © <CurrentYear /> {site.name}. {site.motto}.
            </span>
          </div>
          <span>Run by the R.S.S.D. Education Welfare Society</span>
        </div>
      </div>
    </footer>
  );
}
