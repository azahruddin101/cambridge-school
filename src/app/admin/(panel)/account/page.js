import PageHeader from "@/components/admin/PageHeader";
import PasswordForm from "@/components/admin/PasswordForm";
import { Card } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/server/auth";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const admin = await requireAdmin();

  return (
    <>
      <PageHeader title="Account" description={`Signed in as ${admin.username}.`} />
      <Card className="p-6 sm:p-8">
        <h2 className="mb-1 font-medium">Change password</h2>
        <p className="mb-6 text-sm text-ink/55">Changing your password signs you out on every other device.</p>
        <PasswordForm />
      </Card>
    </>
  );
}
