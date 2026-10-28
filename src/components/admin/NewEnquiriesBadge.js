import { getAdmin } from "@/lib/server/auth";
import { Enquiry } from "@/lib/server/models";

/** Count of unhandled enquiries, shown next to "Enquiries" in the sidebar. */
export default async function NewEnquiriesBadge() {
  if (!(await getAdmin())) return null;
  const count = await Enquiry.countDocuments({ status: "new" });
  if (!count) return null;
  return (
    <span className="ml-auto min-w-6 rounded-full bg-ember px-2 py-0.5 text-center text-xs font-medium tabular-nums text-ivory" aria-label={`${count} new`}>
      {count}
    </span>
  );
}
