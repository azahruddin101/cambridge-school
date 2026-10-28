import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import EnquiryList from "@/components/admin/EnquiryList";
import { inputClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { ENQUIRY_STATUSES, Enquiry } from "@/lib/server/models";

export const metadata = { title: "Enquiries" };

const LIMIT = 200;
const TABS = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "closed", label: "Closed" },
];

const formatDate = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default async function EnquiriesPage({ searchParams }) {
  await requireAdmin();
  await connectDB();
  const params = await searchParams;
  const status = ENQUIRY_STATUSES.includes(params.status) ? params.status : "all";
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";

  const filter = {};
  if (status !== "all") filter.status = status;
  if (q) {
    const pattern = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ name: pattern }, { phone: pattern }, { email: pattern }, { message: pattern }, { studentClass: pattern }];
  }

  const [docs, grouped] = await Promise.all([
    Enquiry.find(filter).sort({ createdAt: -1 }).limit(LIMIT).lean(),
    Enquiry.aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
  ]);
  const counts = Object.fromEntries(grouped.map((g) => [g._id, g.n]));
  counts.all = grouped.reduce((a, g) => a + g.n, 0);

  const enquiries = docs.map((d) => ({
    id: String(d._id),
    name: d.name,
    phone: d.phone,
    email: d.email,
    studentClass: d.studentClass,
    message: d.message,
    status: d.status,
    date: formatDate.format(d.createdAt),
  }));

  const hrefFor = (tab) => {
    const sp = new URLSearchParams();
    if (tab !== "all") sp.set("status", tab);
    if (q) sp.set("q", q);
    return `/admin/enquiries${sp.size ? `?${sp}` : ""}`;
  };

  return (
    <>
      <PageHeader title="Enquiries" description="Admission enquiries sent through the contact form on the website, newest first." />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={hrefFor(tab.key)}
              aria-current={status === tab.key ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                status === tab.key ? "bg-forest text-ivory" : "bg-white text-ink/70 ring-1 ring-line hover:text-ink"
              }`}
            >
              {tab.label}
              <span className={`ml-2 tabular-nums ${status === tab.key ? "text-ivory/70" : "text-ink/40"}`}>{counts[tab.key] ?? 0}</span>
            </Link>
          ))}
        </nav>

        <form action="/admin/enquiries" className="flex gap-2 lg:w-80">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <input type="search" name="q" defaultValue={q} placeholder="Search name, phone, message…" aria-label="Search enquiries" className={inputClass} />
        </form>
      </div>

      <EnquiryList enquiries={enquiries} filtered={Boolean(q) || status !== "all"} />

      {docs.length === LIMIT && <p className="mt-4 text-center text-sm text-ink/50">Showing the latest {LIMIT}. Use search or the filters to find older enquiries.</p>}
    </>
  );
}
