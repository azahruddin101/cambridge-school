import Image from "next/image";
import ImageReveal from "@/components/motion/ImageReveal";
import SplitHeading from "@/components/motion/SplitHeading";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { MailIcon, PhoneIcon } from "@/components/ui/Icons";
import { messages } from "@/data/content";
import { site } from "@/data/site";

export default function ChairmanMessage() {
  const chairman = messages[0];

  return (
    <section className="bg-ivory-deep py-28 md:py-44">
      <div className="container-x grid gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5 lg:col-span-4">
          <ImageReveal className="relative aspect-[4/5] rounded-[1.75rem] bg-ink/10">
            <Image src={chairman.image.src} alt={chairman.image.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover object-top" />
          </ImageReveal>
          <Reveal className="mt-6 flex items-baseline justify-between border-b border-line pb-6">
            <span className="font-serif text-2xl">{chairman.name}</span>
            <span className="text-xs uppercase tracking-[0.2em] text-ink/55">{chairman.role}</span>
          </Reveal>
        </div>

        <div className="flex flex-col justify-between gap-16 md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
          <div>
            <Reveal className="eyebrow mb-10 text-ember">Chairman&rsquo;s message</Reveal>
            <SplitHeading as="blockquote" className="display-md">
              &ldquo;{chairman.highlight}&rdquo;
            </SplitHeading>
            <Reveal className="mt-10 max-w-xl space-y-5 text-lg leading-relaxed text-ink/70" stagger={0.12}>
              {chairman.body.map((p) => (
                <p key={p} data-reveal-item="">
                  {p}
                </p>
              ))}
              <div data-reveal-item="" className="pt-4">
                <Button href="/messages">Read all messages</Button>
              </div>
            </Reveal>
          </div>

          <Reveal className="grid gap-6 rounded-[1.75rem] bg-paper p-8 shadow-[0_0_0_1px_var(--line)] sm:grid-cols-[1fr_auto] sm:items-center md:p-10">
            <div>
              <p className="font-serif text-3xl">Call us for consultations</p>
              <a href={`mailto:${site.email}`} className="link-underline mt-3 inline-flex items-center gap-2 text-ink/65">
                <MailIcon /> {site.email}
              </a>
            </div>
            <Button href={site.phoneHref} variant="ember" icon={<PhoneIcon />}>
              {site.phone}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
