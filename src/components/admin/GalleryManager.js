"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { deleteGalleryImage, moveGalleryImage, updateGalleryCaption, uploadGalleryImages } from "@/app/admin/_actions/content";
import { Button, Card, ConfirmButton, EmptyState, Field, IconButton, Spinner, inputClass, useToast } from "./ui";
import { shrinkImage } from "./shrinkImage";

const MAX_FILES = 12;

export default function GalleryManager({ items }) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const run = (action) =>
    startTransition(async () => {
      toast(await action());
    });

  return (
    <div className="space-y-8">
      <UploadForm />

      <div>
        <h2 className="mb-4 font-medium">
          {items.length} photo{items.length === 1 ? "" : "s"} <span className="font-normal text-ink/50">· shown on the website in this order</span>
        </h2>
        {items.length === 0 ? (
          <Card>
            <EmptyState>No photos yet. Upload some above.</EmptyState>
          </Card>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((image, i) => (
              <li key={image.id}>
                <Card className="overflow-hidden">
                  <div className="relative aspect-[4/3] bg-ivory-deep">
                    <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
                    <span className="absolute left-3 top-3 rounded-md bg-ink/70 px-2 py-0.5 text-xs text-ivory">{i + 1}</span>
                  </div>
                  <div className="space-y-3 p-4">
                    <CaptionEditor image={image} onSave={(alt) => run(() => updateGalleryCaption(image.id, alt))} disabled={pending} />
                    <div className="flex items-center justify-between">
                      <span className="flex">
                        <IconButton label="Move earlier" disabled={pending || i === 0} onClick={() => run(() => moveGalleryImage(image.id, "up"))}>
                          ◀
                        </IconButton>
                        <IconButton label="Move later" disabled={pending || i === items.length - 1} onClick={() => run(() => moveGalleryImage(image.id, "down"))}>
                          ▶
                        </IconButton>
                      </span>
                      <ConfirmButton disabled={pending} onConfirm={() => run(() => deleteGalleryImage(image.id))} />
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function CaptionEditor({ image, onSave, disabled }) {
  const [value, setValue] = useState(image.alt);
  const changed = value.trim() !== image.alt;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(value);
      }}
      className="flex gap-2"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={200}
        placeholder="Caption (describes the photo)"
        aria-label="Caption"
        className={`${inputClass} py-2 text-sm`}
      />
      {changed && (
        <Button type="submit" variant="primary" disabled={disabled} className="px-3 py-2">
          Save
        </Button>
      )}
    </form>
  );
}

function UploadForm() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const formRef = useRef(null);
  const toast = useToast();
  const busy = Boolean(progress);

  const onPick = (e) => {
    const picked = [...(e.target.files ?? [])];
    setError(picked.length > MAX_FILES ? `Choose up to ${MAX_FILES} photos at a time.` : "");
    setFiles(picked.slice(0, MAX_FILES).map((file) => ({ file, url: URL.createObjectURL(file) })));
  };

  // One photo per request keeps each under the host's request size limit (4.5 MB on Vercel)
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!files.length || busy) return;
    const alt = new FormData(e.currentTarget).get("alt") ?? "";
    const failures = [];

    for (const [i, { file }] of files.entries()) {
      setProgress(files.length > 1 ? `Uploading ${i + 1} of ${files.length}…` : "Uploading…");
      const body = new FormData();
      body.append("files", await shrinkImage(file));
      body.append("alt", alt);
      const result = await uploadGalleryImages(null, body).catch(() => ({ ok: false, message: `${file.name}: upload failed.` }));
      if (!result.ok) failures.push(result.message);
    }

    setProgress("");
    const added = files.length - failures.length;
    if (added) toast({ ok: true, message: added === 1 ? "Photo added." : `${added} photos added.` });
    failures.forEach((message) => toast({ ok: false, message }));
    if (!failures.length) {
      formRef.current?.reset();
      setFiles([]);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="mb-1 font-medium">Upload photos</h2>
      <p className="mb-5 text-sm text-ink/55">JPG, PNG or WebP, {MAX_FILES} at a time. Large photos are shrunk before uploading, then converted to WebP automatically.</p>

      <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-ivory/50 px-6 py-10 text-center transition-colors hover:border-forest/40 hover:bg-ivory">
          <span className="text-3xl" aria-hidden="true">
            ⬆
          </span>
          <span className="font-medium">Click to choose photos</span>
          <span className="text-sm text-ink/50">{files.length ? `${files.length} selected` : "You can select several at once"}</span>
          <input type="file" name="files" multiple required accept="image/jpeg,image/png,image/webp" onChange={onPick} disabled={busy} className="sr-only" />
        </label>

        {error && <p className="text-sm text-[#9f2d1f]">{error}</p>}

        {files.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {files.map((f) => (
              <li key={f.url} className="relative size-20 overflow-hidden rounded-lg bg-ivory-deep">
                <Image src={f.url} alt={f.file.name} fill unoptimized sizes="80px" className="object-cover" />
              </li>
            ))}
          </ul>
        )}

        <Field label="Caption" hint="Applied to every photo in this upload. You can edit each one afterwards.">
          <input name="alt" maxLength={200} placeholder="e.g. Annual sports day 2026" className={inputClass} />
        </Field>

        <Button type="submit" variant="primary" disabled={busy || !files.length}>
          {busy && <Spinner />}
          {busy ? progress : "Upload"}
        </Button>
      </form>
    </Card>
  );
}
