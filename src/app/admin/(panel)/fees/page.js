import PageHeader from "@/components/admin/PageHeader";
import FeesEditor from "@/components/admin/FeesEditor";
import { requireAdmin } from "@/lib/server/auth";
import { getFees } from "@/lib/server/data";

export const metadata = { title: "Fee Structure" };

export default async function FeesAdminPage() {
  await requireAdmin();
  const fees = await getFees();

  return (
    <>
      <PageHeader title="Fee Structure" description="Edit amounts directly in the tables, then save. Totals are calculated for you.">
        <a href="/admissions/fee-structure" target="_blank" rel="noreferrer" className="rounded-lg px-4 py-2.5 text-sm ring-1 ring-line hover:bg-white">
          View on website ↗
        </a>
      </PageHeader>
      <FeesEditor initial={fees} />
    </>
  );
}
