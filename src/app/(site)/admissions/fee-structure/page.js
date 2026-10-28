import PageHero from "@/components/ui/PageHero";
import SplitHeading from "@/components/motion/SplitHeading";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/Icons";
import FeeTables from "@/components/sections/admissions/FeeTables";
import AdmissionLinks from "@/components/sections/admissions/AdmissionLinks";
import { images } from "@/data/content";
import { getFees } from "@/lib/server/data";
import { site } from "@/data/site";

export const metadata = {
  title: "Fee Structure",
  description: "Fee structure and month-wise payment schedule at Eastern Cambridge School.",
};

export default async function FeeStructurePage() {
  const fees = await getFees();

  return (
    <>
      <PageHero
        eyebrow="Admissions · Fee structure"
        title={
          <>
            Clear, <em className="text-gold-soft">transparent</em> fees.
          </>
        }
        intro={`Fee heads for every class group, and the month-wise payment schedule${fees.session ? ` for session ${fees.session}` : ""}.`}
        image={images.scienceLab}
      />

      <section className="py-28 md:py-40">
        <div className="container-x">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Reveal className="eyebrow mb-8 text-ember">{fees.session ? `Session ${fees.session}` : "Admissions"}</Reveal>
              <SplitHeading className="display-lg">Fee structure.</SplitHeading>
            </div>
            <Reveal className="max-w-sm text-sm leading-relaxed text-ink/60">
              <p>These are the most recently published fees. Please contact the school office to confirm the current session&rsquo;s fees.</p>
            </Reveal>
          </div>

          {fees.rows.length ? <FeeTables fees={fees} /> : <p className="text-lg text-ink/60">The fee structure will be published soon.</p>}

          <Reveal className="mt-16 flex flex-wrap gap-3">
            <Button href="/contact">Ask about fees</Button>
            <Button href={site.phoneHref} variant="outline" icon={<PhoneIcon />}>
              {site.phone}
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory-deep py-24 md:py-32">
        <div className="container-x">
          <AdmissionLinks current="/admissions/fee-structure" />
        </div>
      </section>
    </>
  );
}
