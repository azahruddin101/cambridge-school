import PageHeader from "@/components/admin/PageHeader";
import PeopleManager from "@/components/admin/PeopleManager";
import { requireAdmin } from "@/lib/server/auth";
import { getFaculty } from "@/lib/server/data";

export const metadata = { title: "Faculty" };

export default async function FacultyAdminPage() {
  await requireAdmin();
  const faculty = await getFaculty();

  return (
    <>
      <PageHeader title="Faculty" description="Staff listed on the Administration page. The teacher count on the home page updates automatically." />
      <PeopleManager
        kind="faculty"
        items={faculty}
        noun={{ singular: "staff member", plural: "staff members" }}
        roleLabel="Designation"
        roleSuggestions={["Principal", "PGT", "TGT", "PRT", "PTI", "Librarian", "Counsellor"]}
        extraField={{ key: "qualification", label: "Qualification", placeholder: "e.g. M.A., B.Ed" }}
      />
    </>
  );
}
