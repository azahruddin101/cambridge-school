import PageHero from "@/components/ui/PageHero";
import SplitHeading from "@/components/motion/SplitHeading";
import Reveal from "@/components/motion/Reveal";
import EnquiryForm from "@/components/sections/contact/EnquiryForm";
import { MailIcon, PhoneIcon } from "@/components/ui/Icons";
import { images } from "@/data/content";
import { site } from "@/data/site";

export const metadata = {
  title: "Contact & Enquiry",
  description: `Visit, call or write to ${site.name} in Bhatpar Rani, Deoria.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Enquiry"
        title={
          <>
            We&rsquo;d love to <em className="text-gold-soft">meet</em> you.
          </>
        }
        intro="Questions about admissions, fees or transport? Call, write or simply visit the campus."
        image={images.mainBuilding}
      />

      <section className="py-28 md:py-40">
        <div className="container-x grid gap-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Reveal className="eyebrow mb-8 text-ember">Get in touch</Reveal>
            <SplitHeading className="display-md">Call us for consultations.</SplitHeading>

            <Reveal as="ul" className="mt-14 space-y-3" stagger={0.1}>
              <li data-reveal-item="">
                <a href={site.phoneHref} className="group flex items-center gap-5 rounded-2xl bg-paper p-5 shadow-[0_0_0_1px_var(--line)] transition-transform duration-700 ease-out-expo hover:-translate-y-1">
                  <span className="grid size-12 place-items-center rounded-full bg-forest text-ivory">
                    <PhoneIcon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.2em] text-ink/50">Phone</span>
                    <span className="font-serif text-2xl">{site.phone}</span>
                  </span>
                </a>
              </li>
              <li data-reveal-item="">
                <a href={`mailto:${site.email}`} className="group flex items-center gap-5 rounded-2xl bg-paper p-5 shadow-[0_0_0_1px_var(--line)] transition-transform duration-700 ease-out-expo hover:-translate-y-1">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-forest text-ivory">
                    <MailIcon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-[0.2em] text-ink/50">Email</span>
                    <span className="block truncate font-serif text-2xl">{site.email}</span>
                  </span>
                </a>
              </li>
              <li data-reveal-item="" className="rounded-2xl bg-paper p-5 shadow-[0_0_0_1px_var(--line)]">
                <span className="block text-xs uppercase tracking-[0.2em] text-ink/50">Address</span>
                <span className="mt-1 block font-serif text-2xl leading-snug">
                  {site.location}
                  <br />
                  {site.address}
                </span>
              </li>
            </Reveal>
          </div>

          <Reveal className="rounded-[1.75rem] bg-paper p-8 shadow-[0_0_0_1px_var(--line)] md:p-12 lg:col-span-6 lg:col-start-7">
            <h2 className="mb-10 text-4xl">Admission enquiry</h2>
            <EnquiryForm />
          </Reveal>
        </div>
      </section>

      <Reveal className="container-x pb-28 md:pb-40">
        <div className="overflow-hidden rounded-[1.75rem] shadow-[0_0_0_1px_var(--line)]">
          <iframe
            title={`Map showing ${site.name}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
            className="h-[60svh] w-full grayscale-[0.6] transition-[filter] duration-700 hover:grayscale-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Reveal>
    </>
  );
}
