"use client";

import { useActionState, useCallback, useState, useTransition } from "react";
import Image from "next/image";
import { deletePersonAction, movePersonAction, savePersonAction } from "@/app/admin/_actions/content";
import { shrinkImage } from "./shrinkImage";
import { Button, Card, ConfirmButton, EmptyState, Field, IconButton, SubmitButton, inputClass, useActionResult, useToast } from "./ui";

/**
 * List + inline add/edit forms for a collection of people (managing committee
 * or faculty). `extraField` is the one text field that differs between them.
 */
export default function PeopleManager({ kind, items, noun, roleLabel, roleSuggestions = [], extraField }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const run = (action) =>
    startTransition(async () => {
      toast(await action());
    });

  const q = query.trim().toLowerCase();
  const visible = q ? items.filter((p) => [p.name, p.role, p[extraField.key]].join(" ").toLowerCase().includes(q)) : items;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${items.length} ${noun.plural}…`}
          className={`${inputClass} sm:max-w-xs`}
        />
        {!adding && (
          <Button variant="primary" onClick={() => (setAdding(true), setEditingId(null))}>
            + Add {noun.singular}
          </Button>
        )}
      </div>

      {adding && (
        <Card className="p-6">
          <h2 className="mb-5 font-medium">New {noun.singular}</h2>
          <PersonForm kind={kind} roleLabel={roleLabel} roleSuggestions={roleSuggestions} extraField={extraField} onDone={() => setAdding(false)} />
        </Card>
      )}

      <Card>
        {visible.length === 0 ? (
          <EmptyState>{q ? "No matches." : `No ${noun.plural} yet. Add the first one above.`}</EmptyState>
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((person) => {
              const index = items.indexOf(person);
              return (
                <li key={person.id}>
                  <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
                    {!q && (
                      <span className="flex flex-col">
                        <IconButton label="Move up" disabled={pending || index === 0} onClick={() => run(() => movePersonAction(kind, person.id, "up"))}>
                          ▲
                        </IconButton>
                        <IconButton label="Move down" disabled={pending || index === items.length - 1} onClick={() => run(() => movePersonAction(kind, person.id, "down"))}>
                          ▼
                        </IconButton>
                      </span>
                    )}
                    <Avatar person={person} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{person.name}</p>
                      <p className="truncate text-sm text-ink/55">
                        {person.role}
                        {person[extraField.key] && <> · {person[extraField.key]}</>}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button variant="ghost" className="px-3 py-2" onClick={() => (setEditingId(editingId === person.id ? null : person.id), setAdding(false))}>
                        {editingId === person.id ? "Close" : "Edit"}
                      </Button>
                      <ConfirmButton disabled={pending} onConfirm={() => run(() => deletePersonAction(kind, person.id))} />
                    </div>
                  </div>
                  {editingId === person.id && (
                    <div className="border-t border-line bg-ivory/60 px-4 py-6 sm:px-5">
                      <PersonForm
                        key={person.id}
                        kind={kind}
                        person={person}
                        roleLabel={roleLabel}
                        roleSuggestions={roleSuggestions}
                        extraField={extraField}
                        onDone={() => setEditingId(null)}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Avatar({ person }) {
  if (person.photo) {
    return <Image src={person.photo} alt="" width={44} height={44} className="size-11 shrink-0 rounded-full object-cover" />;
  }
  const initials = person.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ivory-deep text-sm font-medium text-ink/70">{initials}</span>;
}

function PersonForm({ kind, person, roleLabel, roleSuggestions, extraField, onDone }) {
  const [state, action] = useActionState(savePersonAction.bind(null, kind), null);
  const [preview, setPreview] = useState(null);
  const toast = useToast();
  const listId = `${kind}-roles`;

  useActionResult(
    state,
    useCallback(
      (result) => {
        toast(result);
        if (result.ok) onDone();
      },
      [toast, onDone],
    ),
  );

  return (
    <form action={action} className="grid gap-5 md:grid-cols-[auto_1fr]">
      {person && <input type="hidden" name="id" value={person.id} />}

      <div className="flex flex-col items-center gap-3 md:w-36">
        <span className="relative grid size-28 place-items-center overflow-hidden rounded-full bg-ivory-deep text-xs text-ink/45">
          {preview || person?.photo ? (
            <Image src={preview || person.photo} alt="" fill sizes="112px" unoptimized={Boolean(preview)} className="object-cover" />
          ) : (
            "No photo"
          )}
        </span>
        <label className="cursor-pointer text-sm font-medium text-forest hover:underline">
          {person?.photo ? "Change photo" : "Add photo"}
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={async (e) => {
              const input = e.target;
              const picked = input.files?.[0];
              if (!picked) return setPreview(null);
              // Swap in a downscaled copy so the form stays under host request limits
              const small = await shrinkImage(picked, { maxSize: 1200 });
              const transfer = new DataTransfer();
              transfer.items.add(small);
              input.files = transfer.files;
              setPreview(URL.createObjectURL(small));
            }}
          />
        </label>
        {person?.photo && !preview && (
          <label className="flex items-center gap-2 text-xs text-ink/60">
            <input type="checkbox" name="removePhoto" /> Remove photo
          </label>
        )}
        <span className="text-center text-xs text-ink/45">Optional · JPG/PNG/WebP</span>
      </div>

      <div className="grid content-start gap-4 sm:grid-cols-2">
        <Field label="Full name" className="sm:col-span-2">
          <input name="name" required maxLength={120} defaultValue={person?.name} className={inputClass} />
        </Field>
        <Field label={roleLabel}>
          <input name="role" required maxLength={80} defaultValue={person?.role} list={listId} className={inputClass} />
          <datalist id={listId}>
            {roleSuggestions.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </Field>
        <Field label={extraField.label}>
          <input name={extraField.key} maxLength={120} defaultValue={person?.[extraField.key]} placeholder={extraField.placeholder} className={inputClass} />
        </Field>
        <div className="flex gap-2 sm:col-span-2">
          <SubmitButton>{person ? "Save changes" : `Add`}</SubmitButton>
          <Button onClick={onDone}>Cancel</Button>
        </div>
      </div>
    </form>
  );
}
