import { readFile } from "node:fs/promises";
import { resolveUpload } from "@/lib/server/uploads";

// Serves uploaded images from the uploads folder. Files added to public/ after
// a build aren't served by Next.js, so runtime uploads live outside it.
export async function GET(_request, { params }) {
  const segments = (await params).path;
  const file = resolveUpload(`/uploads/${segments.join("/")}`);

  if (!file || !file.endsWith(".webp")) return new Response("Not found", { status: 404 });

  try {
    const data = await readFile(file);
    return new Response(data, {
      headers: {
        "Content-Type": "image/webp",
        // Filenames are random and never reused, so they can be cached forever
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
