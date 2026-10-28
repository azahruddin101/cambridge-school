import PageHero from "@/components/ui/PageHero";
import SplitHeading from "@/components/motion/SplitHeading";
import Reveal from "@/components/motion/Reveal";
import StrengthChart from "@/components/sections/admissions/StrengthChart";
import StrengthTable from "@/components/sections/admissions/StrengthTable";
import AdmissionLinks from "@/components/sections/admissions/AdmissionLinks";
import { images } from "@/data/content";
import { getStrength, sumStrength } from "@/lib/server/data";

export const metadata = {
  title: "Student Strength",
  description: "Class-wise student strength at Eastern Cambridge School — sections, boys and girls in Classes I to VIII.",
};

export default async function StudentStrengthPage() {
  const rows = await getStrength();
  const totals = sumStrength(rows);

  return (
    <>
      <PageHero
        eyebrow="Admissions · Student strength"
        title={
          <>
            {totals.boys + totals.girls} students, <em className="text-gold-soft">one</em> family.
          </>
        }
        intro={rows.length ? `${rows.length} classes from ${rows[0].cls} to ${rows.at(-1).cls} — ${totals.boys} boys and ${totals.girls} girls learning together.` : undefined}
        image={images.assembly}
      />

      <section className="py-28 md:py-40">
        <div className="container-x">
          <Reveal className="eyebrow mb-8 text-ember">Class-wise strength</Reveal>
          <SplitHeading className="display-lg max-w-3xl">Students strength.</SplitHeading>

          {rows.length ? (
            <div className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
              <Reveal>
                <StrengthChart rows={rows} />
              </Reveal>
              <StrengthTable rows={rows} />
            </div>
          ) : (
            <p className="mt-10 text-lg text-ink/60">Student strength will be published soon.</p>
          )}
        </div>
      </section>

      <section className="bg-ivory-deep py-24 md:py-32">
        <div className="container-x">
          <AdmissionLinks current="/admissions/student-strength" />
        </div>
      </section>
    </>
  );
}
