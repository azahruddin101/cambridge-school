import PageHero from "@/components/ui/PageHero";
import SplitHeading from "@/components/motion/SplitHeading";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/Icons";
import AdmissionLinks from "@/components/sections/admissions/AdmissionLinks";
import { images, notice } from "@/data/content";
import { site } from "@/data/site";

export const metadata = {
  title: "Admissions",
  description: "How to apply to Eastern Cambridge School, with links to the fee structure and student strength.",
};

const STEPS = [
  { title: "Enquire", body: "Call us or send an enquiry — we're happy to answer any question about the school." },
  { title: "Visit", body: "Walk through the campus, see our classrooms and labs, and meet our teachers." },
  { title: "Enrol", body: "Complete the admission formalities at the school office and welcome to the family." },
];

export default function AdmissionsPage() {
  return (
    <>
      <PageHero
        eyebrow={notice.title}
        title={
          <>
            Begin your child&rsquo;s <em className="text-gold-soft">journey</em> with us.
          </>
        }
        intro={notice.body}
        image={images.annualPrimary}
      />

      <section className="py-28 md:py-40">
        <div className="container-x">
          <Reveal className="eyebrow mb-8 text-ember">How to apply</Reveal>
          <SplitHeading className="display-lg max-w-3xl">Three simple steps.</SplitHeading>

          <Reveal as="ol" className="mt-16 grid gap-4 md:mt-20 md:grid-cols-3" stagger={0.12}>
            {STEPS.map((step, i) => (
              <li key={step.title} data-reveal-item="" className="relative rounded-[1.75rem] border border-line p-8 md:p-10">
                <span className="font-serif text-7xl leading-none text-ember/80">0{i + 1}</span>
                <h3 className="mb-4 mt-12 text-4xl">{step.title}</h3>
                <p className="leading-relaxed text-ink/65">{step.body}</p>
              </li>
            ))}
          </Reveal>

          <Reveal className="mt-10 flex flex-wrap gap-3">
            <Button href="/contact">Send an enquiry</Button>
            <Button href={site.phoneHref} variant="outline" icon={<PhoneIcon />}>
              {site.phone}
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory-deep py-28 md:py-40">
        <div className="container-x">
          <Reveal className="eyebrow mb-8 text-ember">Admission details</Reveal>
          <SplitHeading className="display-md mb-14 max-w-2xl">Everything you need to know before you apply.</SplitHeading>
          <AdmissionLinks current="/admissions" />
        </div>
      </section>
    </>
  );
}
