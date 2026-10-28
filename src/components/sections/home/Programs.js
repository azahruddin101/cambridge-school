import SplitHeading from "@/components/motion/SplitHeading";
import Reveal from "@/components/motion/Reveal";
import { programs } from "@/data/content";

export default function Programs() {
  return (
    <section className="py-28 md:py-44">
      <div className="container-x">
        <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-2 md:items-end">
          <div>
            <Reveal className="eyebrow mb-8 text-ember">Academic programmes</Reveal>
            <SplitHeading className="display-lg">
              A path for <em className="text-forest-soft">every</em> stage of growing up.
            </SplitHeading>
          </div>
          <Reveal className="max-w-md text-lg leading-relaxed text-ink/65 md:justify-self-end">
            <p>Following the NCERT syllabus with the CCE pattern, each stage builds deliberately on the one before.</p>
          </Reveal>
        </div>

        <Reveal className="grid gap-4 md:grid-cols-3" stagger={0.12}>
          {programs.map((program, i) => (
            <article
              key={program.title}
              data-reveal-item=""
              className="group relative flex min-h-[26rem] flex-col overflow-hidden rounded-[1.75rem] bg-paper p-8 shadow-[0_0_0_1px_var(--line)] md:min-h-[32rem] md:p-10"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-forest transition-transform duration-[900ms] ease-out-expo group-hover:scale-y-100" />
              <div className="relative flex items-start justify-between transition-colors duration-700 group-hover:text-ivory">
                <span className="font-serif text-[6.5rem] leading-[0.8] tracking-tight text-ink/10 transition-colors duration-700 group-hover:text-ivory/15">
                  0{i + 1}
                </span>
                {program.tag && (
                  <span className="rounded-full border border-current/25 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em]">{program.tag}</span>
                )}
              </div>
              <div className="relative mt-auto transition-colors duration-700 group-hover:text-ivory">
                <p className="mb-4 text-xs uppercase tracking-[0.22em] text-ember transition-colors duration-700 group-hover:text-gold-soft">
                  {program.grades}
                </p>
                <h3 className="text-[clamp(2rem,3vw,2.75rem)]">{program.title}</h3>
                <p className="mt-5 leading-relaxed text-ink/65 transition-colors duration-700 group-hover:text-ivory/70">{program.body}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
