import PageHeader from "@/components/admin/PageHeader";
import PeopleManager from "@/components/admin/PeopleManager";
import { requireAdmin } from "@/lib/server/auth";
import { getCommittee } from "@/lib/server/data";

export const metadata = { title: "Managing Committee" };

export default async function CommitteeAdminPage() {
  await requireAdmin();
  const members = await getCommittee();

  return (
    <>
      <PageHeader title="Managing Committee" description="Members listed on the Administration page, in the order shown here." />
      <PeopleManager
        kind="committee"
        items={members}
        noun={{ singular: "member", plural: "members" }}
        roleLabel="Role in committee"
        roleSuggestions={["President", "Secretary", "Teacher Member", "Parent Member", "Educationist", "Member"]}
        extraField={{ key: "place", label: "Place", placeholder: "e.g. Bhatpar Rani, Deoria" }}
      />
    </>
  );
}
