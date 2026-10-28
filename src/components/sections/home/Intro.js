import Image from "next/image";
import ScrubText from "@/components/motion/ScrubText";
import ImageReveal from "@/components/motion/ImageReveal";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import Stats from "@/components/sections/Stats";
import { about, images } from "@/data/content";

export default function Intro() {
  return (
    <section className="relative py-28 md:py-44">
      <div className="container-x">
        <Reveal className="eyebrow mb-10 text-ember">About the school</Reveal>

        <ScrubText className="max-w-6xl font-serif text-[clamp(2rem,4.6vw,4.4rem)] leading-[1.08] tracking-[-0.02em]">
          {about.lead}
        </ScrubText>

        <div className="mt-20 grid gap-8 md:mt-32 md:grid-cols-12 md:gap-6">
          <ImageReveal className="relative aspect-[4/5] rounded-[1.75rem] md:col-span-5 md:aspect-[4/5]">
            <Image src={images.assembly.src} alt={images.assembly.alt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </ImageReveal>

          <div className="flex flex-col justify-between gap-12 md:col-span-6 md:col-start-7 md:pt-24">
            <ImageReveal direction="left" delay={0.15} className="relative aspect-[16/10] rounded-[1.75rem]">
              <Image src={images.seniorWing.src} alt={images.seniorWing.alt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
            </ImageReveal>

            <Reveal className="max-w-md space-y-5 text-lg leading-relaxed text-ink/70" stagger={0.12}>
              {about.paragraphs.map((p) => (
                <p key={p} data-reveal-item="">
                  {p}
                </p>
              ))}
              <div data-reveal-item="" className="pt-4">
                <Button href="/about">Our story</Button>
              </div>
            </Reveal>
          </div>
        </div>

        <Stats className="mt-24 md:mt-36" />
      </div>
    </section>
  );
}
