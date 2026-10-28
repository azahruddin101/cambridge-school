import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/server/auth";
import { getCommittee, getFaculty, getFees, getStrength, sumStrength } from "@/lib/server/data";
import { Enquiry } from "@/lib/server/models";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const [committee, faculty, fees, strength, newEnquiries, allEnquiries] = await Promise.all([
    getCommittee(),
    getFaculty(),
    getFees(),
    getStrength(),
    Enquiry.countDocuments({ status: "new" }),
    Enquiry.estimatedDocumentCount(),
  ]);
  const totals = sumStrength(strength);

  const cards = [
    { href: "/admin/enquiries?status=new", label: "New enquiries", value: newEnquiries, detail: `${allEnquiries} received in total`, site: "/contact" },
    { href: "/admin/committee", label: "Managing Committee", value: committee.length, detail: "members", site: "/administration#committee" },
    { href: "/admin/faculty", label: "Faculty", value: faculty.length, detail: "staff members", site: "/administration#staff" },
    { href: "/admin/fees", label: "Fee Structure", value: fees.rows.length, detail: fees.session ? `fee heads · ${fees.session}` : "fee heads", site: "/admissions/fee-structure" },
    { href: "/admin/strength", label: "Student Strength", value: totals.boys + totals.girls, detail: `students in ${strength.length} classes`, site: "/admissions/student-strength" },
  ];

  return (
    <>
      <PageHeader title={`Welcome, ${admin.username}`} description="Choose a section to update. Changes appear on the website as soon as you save. (The gallery is managed in code for now.)" />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <li key={card.href} className="group relative rounded-2xl bg-white p-6 shadow-[0_0_0_1px_var(--line)] transition-shadow hover:shadow-[0_0_0_1px_var(--line),0_16px_40px_-24px_rgb(18_32_26/0.5)]">
            <Link href={card.href} className="block after:absolute after:inset-0 after:rounded-2xl">
              <span className="text-sm text-ink/60">{card.label}</span>
              <span className="mt-3 block font-serif text-5xl leading-none">{card.value}</span>
              <span className="mt-2 block text-sm text-ink/55">{card.detail}</span>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-forest">Manage →</span>
            </Link>
            <a href={card.site} target="_blank" rel="noreferrer" className="relative z-10 mt-1 inline-block text-xs text-ink/45 hover:text-ink">
              View on website ↗
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
