import PageHero from "@/components/ui/PageHero";
import SplitHeading from "@/components/motion/SplitHeading";
import Reveal from "@/components/motion/Reveal";
import Image from "next/image";
import { images } from "@/data/content";
import { getCommittee, getFaculty } from "@/lib/server/data";

export const metadata = {
  title: "Administration",
  description: "The School Managing Committee and teaching staff of Eastern Cambridge School.",
};

const ROLE_NAMES = {
  PTI: "Physical Training Instructor",
  TGT: "Trained Graduate Teacher",
  PRT: "Primary Teacher",
};

export default async function AdministrationPage() {
  const [committee, staff] = await Promise.all([getCommittee(), getFaculty()]);

  return (
    <>
      <PageHero
        eyebrow="Administration"
        title={
          <>
            The people behind <em className="text-gold-soft">every</em> lesson.
          </>
        }
        intro="A managing committee of educators, teachers and parents, and a dedicated team of qualified staff."
        image={images.reception}
      />

      <section id="committee" className="scroll-mt-24 py-28 md:py-40">
        <div className="container-x">
          <div className="mb-16 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end">
            <div>
              <Reveal className="eyebrow mb-8 text-ember">School Managing Committee</Reveal>
              <SplitHeading className="display-lg max-w-3xl">Guided by our community.</SplitHeading>
            </div>
            <Reveal className="text-sm text-ink/55">{committee.length} members</Reveal>
          </div>

          <Reveal as="ul" className="border-t border-line" stagger={0.05}>
            {committee.map((member, i) => (
              <li
                key={member.id}
                data-reveal-item=""
                className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 border-b border-line py-6 transition-colors duration-500 hover:bg-paper/70 md:grid-cols-[4rem_1.4fr_1fr_1fr] md:px-4"
              >
                <span className="text-xs tabular-nums text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex items-center gap-4 font-serif text-2xl transition-transform duration-700 ease-out-expo group-hover:translate-x-2 md:text-3xl">
                  {member.photo && <Image src={member.photo} alt="" width={48} height={48} className="size-12 shrink-0 rounded-full object-cover" />}
                  {member.name}
                </span>
                <span className="col-start-2 text-sm text-ember md:col-start-auto">{member.role}</span>
                <span className="col-start-2 text-sm text-ink/55 md:col-start-auto md:text-right">{member.place}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="staff" className="scroll-mt-24 bg-ivory-deep py-28 md:py-40">
        <div className="container-x">
          <div className="mb-16 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end">
            <div>
              <Reveal className="eyebrow mb-8 text-ember">Staff details</Reveal>
              <SplitHeading className="display-lg max-w-3xl">
                Qualified, <em className="text-forest-soft">caring</em> educators.
              </SplitHeading>
            </div>
            <Reveal className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/55">
              {Object.entries(ROLE_NAMES).map(([code, name]) => (
                <span key={code}>
                  <strong className="font-medium text-ink">{code}</strong> · {name}
                </span>
              ))}
            </Reveal>
          </div>

          <Reveal as="ul" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" stagger={0.04}>
            {staff.map((member) => (
              <li
                key={member.id}
                data-reveal-item=""
                className="group flex items-center justify-between gap-4 rounded-2xl bg-paper p-6 shadow-[0_0_0_1px_var(--line)] transition-[transform,box-shadow] duration-700 ease-out-expo hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgb(18_32_26/0.4),0_0_0_1px_var(--line)]"
              >
                <span className="flex min-w-0 items-center gap-4">
                  {member.photo && <Image src={member.photo} alt="" width={56} height={56} className="size-14 shrink-0 rounded-full object-cover" />}
                  <span className="min-w-0">
                    <span className="block font-serif text-2xl leading-tight">{member.name}</span>
                    <span className="mt-1 block text-sm text-ink/55">{member.qualification}</span>
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-forest px-3 py-1 text-[0.68rem] font-medium tracking-[0.14em] text-ivory">{member.role}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
