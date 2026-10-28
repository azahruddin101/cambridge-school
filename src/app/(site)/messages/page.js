import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import SplitHeading from "@/components/motion/SplitHeading";
import Reveal from "@/components/motion/Reveal";
import ImageReveal from "@/components/motion/ImageReveal";
import { images, messages } from "@/data/content";

export const metadata = {
  title: "Messages",
  description: "Messages from the Chairman, Director and Principal of Eastern Cambridge School.",
};

export default function MessagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Messages"
        title={
          <>
            Words from the people who <em className="text-gold-soft">lead</em> us.
          </>
        }
        image={images.annualMiddle}
      />

      {messages.map((message, i) => (
        <section key={message.id} id={message.id} className={`scroll-mt-24 py-28 md:py-40 ${i % 2 ? "bg-ivory-deep" : ""}`}>
          <div className="container-x grid gap-14 md:grid-cols-12 md:gap-8">
            <div className={`md:col-span-4 ${i % 2 ? "md:order-2 md:col-start-9" : ""}`}>
              <div className="md:sticky md:top-28">
                {message.image ? (
                  <ImageReveal className="relative aspect-[4/5] rounded-[1.75rem] bg-ink/10">
                    <Image src={message.image.src} alt={message.image.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover object-top" />
                  </ImageReveal>
                ) : (
                  <Reveal className="grain relative grid aspect-[4/5] place-items-center overflow-hidden rounded-[1.75rem] bg-forest text-ivory">
                    <span className="font-serif text-[9rem] leading-none text-gold-soft/90">{message.monogram}</span>
                  </Reveal>
                )}
                <Reveal className="mt-6 border-b border-line pb-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-ember">{message.role}</p>
                  <p className="mt-2 font-serif text-3xl">{message.name}</p>
                </Reveal>
              </div>
            </div>

            <div className={`md:col-span-7 ${i % 2 ? "md:col-start-1" : "md:col-start-6"}`}>
              <Reveal className="eyebrow mb-10 text-ember">{message.role}&rsquo;s message</Reveal>
              <SplitHeading as="blockquote" className="display-md">
                &ldquo;{message.highlight}&rdquo;
              </SplitHeading>
              <Reveal className="mt-12 max-w-2xl space-y-6 text-lg leading-relaxed text-ink/70" stagger={0.12}>
                {message.body.map((p) => (
                  <p key={p} data-reveal-item="">
                    {p}
                  </p>
                ))}
              </Reveal>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
