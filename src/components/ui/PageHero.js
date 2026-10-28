import Image from "next/image";
import SplitHeading from "@/components/motion/SplitHeading";
import Reveal from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";

/** Dark, image-backed hero used at the top of every inner page. */
export default function PageHero({ eyebrow, title, intro, image }) {
  return (
    <section className="grain relative flex min-h-[78svh] items-end overflow-hidden bg-ink pb-16 pt-40 text-ivory md:pb-24">
      {image && (
        <Parallax className="absolute inset-0" amount={18} scale={1.2}>
          <Image src={image.src} alt="" fill preload sizes="100vw" className="object-cover opacity-45" />
        </Parallax>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />

      <div className="container-x relative">
        <Reveal afterIntro className="eyebrow mb-8 text-gold-soft" delay={0.1}>
          {eyebrow}
        </Reveal>
        <SplitHeading as="h1" immediate afterIntro delay={0.2} className="display-xl max-w-5xl">
          {title}
        </SplitHeading>
        {intro && (
          <Reveal afterIntro delay={0.6} className="mt-10 max-w-xl text-lg leading-relaxed text-ivory/70">
            <p>{intro}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
