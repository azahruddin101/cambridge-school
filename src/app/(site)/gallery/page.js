import { Suspense } from "react";
import PageHero from "@/components/ui/PageHero";
import GalleryGrid from "@/components/sections/gallery/GalleryGrid";
import { images } from "@/data/content";
import { getGallery } from "@/lib/server/data";

export const metadata = {
  title: "Gallery",
  description: "Campus, classrooms, labs, sports and celebrations at Eastern Cambridge School.",
};

// Awaiting searchParams renders the grid per request, so /gallery?page=3 arrives
// already on page 3; the hero above stays part of the prerendered shell.
async function Gallery({ searchParams }) {
  await searchParams;
  const gallery = await getGallery();
  return gallery.length ? <GalleryGrid items={gallery} /> : <p className="text-lg text-ink/60">Photos will be added soon.</p>;
}

function GallerySkeleton() {
  return (
    <div aria-hidden="true" className="columns-2 gap-3 sm:gap-4 lg:columns-3 [&>*]:mb-3 sm:[&>*]:mb-4">
      {["aspect-[4/3]", "aspect-[3/4]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]"].map((ratio, i) => (
        <div key={i} className={`${ratio} animate-pulse rounded-2xl bg-ink/[0.06] sm:rounded-[1.5rem]`} />
      ))}
    </div>
  );
}

export default function GalleryPage({ searchParams }) {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            Life, <em className="text-gold-soft">captured.</em>
          </>
        }
        intro="Our campus, classrooms and laboratories — and the celebrations and victories that fill them."
        image={images.sports}
      />
      <section className="py-24 md:py-32">
        <div className="container-x">
          <Suspense fallback={<GallerySkeleton />}>
            <Gallery searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
