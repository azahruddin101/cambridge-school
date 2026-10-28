import PageHeader from "@/components/admin/PageHeader";
import GalleryManager from "@/components/admin/GalleryManager";
import { requireAdmin } from "@/lib/server/auth";
import { getGallery } from "@/lib/server/data";

export const metadata = { title: "Gallery" };

export default async function GalleryAdminPage() {
  await requireAdmin();
  const images = await getGallery();

  return (
    <>
      <PageHeader title="Gallery" description="Photos for the Gallery page. The first five also appear on the home page.">
        <a href="/gallery" target="_blank" rel="noreferrer" className="rounded-lg px-4 py-2.5 text-sm ring-1 ring-line hover:bg-white">
          View on website ↗
        </a>
      </PageHeader>
      <GalleryManager items={images} />
    </>
  );
}
