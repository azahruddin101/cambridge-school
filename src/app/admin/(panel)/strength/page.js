import PageHeader from "@/components/admin/PageHeader";
import StrengthEditor from "@/components/admin/StrengthEditor";
import { requireAdmin } from "@/lib/server/auth";
import { getStrength } from "@/lib/server/data";

export const metadata = { title: "Student Strength" };

export default async function StrengthAdminPage() {
  await requireAdmin();
  const rows = await getStrength();

  return (
    <>
      <PageHeader title="Student Strength" description="Class-wise sections and students. The student count on the home page updates automatically.">
        <a href="/admissions/student-strength" target="_blank" rel="noreferrer" className="rounded-lg px-4 py-2.5 text-sm ring-1 ring-line hover:bg-white">
          View on website ↗
        </a>
      </PageHeader>
      <StrengthEditor initial={rows} />
    </>
  );
}
