import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import ScrubText from "@/components/motion/ScrubText";
import SplitHeading from "@/components/motion/SplitHeading";
import Reveal from "@/components/motion/Reveal";
import ImageReveal from "@/components/motion/ImageReveal";
import Parallax from "@/components/motion/Parallax";
import Stats from "@/components/sections/Stats";
import Programs from "@/components/sections/home/Programs";
import { about, images } from "@/data/content";

export const metadata = {
  title: "About Us",
  description: about.lead,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={
          <>
            Rooted in values, <em className="text-gold-soft">reaching</em> for tomorrow.
          </>
        }
        intro="A co-educational English medium school in Bhatpar Rani, Deoria, run by the R.S.S.D. Education Welfare Society."
        image={images.seniorWing}
      />

      <section className="py-28 md:py-40">
        <div className="container-x">
          <Reveal className="eyebrow mb-10 text-ember">Who we are</Reveal>
          <ScrubText className="max-w-6xl font-serif text-[clamp(2rem,4.6vw,4.4rem)] leading-[1.08] tracking-[-0.02em]">
            {about.lead}
          </ScrubText>

          <div className="mt-20 grid gap-12 md:mt-28 md:grid-cols-12 md:gap-8">
            <ImageReveal className="relative aspect-[16/9] rounded-[1.75rem] md:col-span-7">
              <Image src={images.mainBuilding.src} alt={images.mainBuilding.alt} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
            </ImageReveal>
            <Reveal className="space-y-6 text-lg leading-relaxed text-ink/70 md:col-span-4 md:col-start-9 md:self-end" stagger={0.12}>
              {about.paragraphs.map((p) => (
                <p key={p} data-reveal-item="">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>

          <Stats className="mt-24 md:mt-32" />
        </div>
      </section>

      <section className="grain relative bg-forest py-28 text-ivory md:py-40">
        <div className="container-x">
          <Reveal className="eyebrow mb-8 text-gold-soft">What we stand for</Reveal>
          <SplitHeading className="display-lg max-w-4xl">
            Three pillars, <em className="text-gold-soft">one</em> purpose.
          </SplitHeading>

          <Reveal className="mt-20 grid gap-px overflow-hidden rounded-[1.75rem] bg-line-light md:grid-cols-3" stagger={0.12}>
            {about.pillars.map((pillar, i) => (
              <div key={pillar.title} data-reveal-item="" className="bg-forest p-8 md:p-12">
                <span className="text-xs tracking-[0.25em] text-gold-soft">0{i + 1}</span>
                <h3 className="mb-5 mt-16 text-5xl">{pillar.title}</h3>
                <p className="leading-relaxed text-ivory/65">{pillar.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <Parallax className="relative h-[70svh] md:h-[90svh]" amount={20} scale={1.25}>
        <Image src={images.assembly.src} alt={images.assembly.alt} fill sizes="100vw" className="object-cover" />
      </Parallax>

      <Programs />
    </>
  );
}
