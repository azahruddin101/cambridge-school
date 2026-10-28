import { readUpload } from "@/lib/server/uploads";

// Serves uploaded images from MongoDB (GridFS). Filenames are random and never
// reused, so browsers and the CDN can cache each one indefinitely.
export async function GET(_request, { params }) {
  const segments = (await params).path;
  const upload = await readUpload(`/uploads/${segments.join("/")}`);
  if (!upload) return new Response("Not found", { status: 404 });

  return new Response(upload.data, {
    headers: {
      "Content-Type": upload.contentType,
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
