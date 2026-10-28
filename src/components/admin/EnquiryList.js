"use client";

import { useTransition } from "react";
import { deleteEnquiry, setEnquiryStatus } from "@/app/admin/_actions/content";
import { Button, Card, ConfirmButton, EmptyState, useToast } from "./ui";

const STATUS_STYLE = {
  new: "bg-ember/15 text-ember",
  contacted: "bg-forest/10 text-forest",
  closed: "bg-ink/5 text-ink/50",
};

const STATUS_LABEL = { new: "New", contacted: "Contacted", closed: "Closed" };

// The next step offered for each status
const NEXT_ACTIONS = {
  new: [{ status: "contacted", label: "Mark contacted", variant: "primary" }],
  contacted: [{ status: "closed", label: "Close", variant: "secondary" }],
  closed: [{ status: "new", label: "Reopen", variant: "ghost" }],
};

function whatsappHref(phone, name) {
  const digits = phone.replace(/\D/g, "");
  const text = `Hello ${name}, thank you for your enquiry at Eastern Cambridge School.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export default function EnquiryList({ enquiries, filtered }) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const run = (action) =>
    startTransition(async () => {
      toast(await action());
    });

  if (!enquiries.length) {
    return (
      <Card>
        <EmptyState>{filtered ? "No enquiries match." : "No enquiries yet. They'll appear here when someone uses the contact form."}</EmptyState>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {enquiries.map((e) => (
        <li key={e.id}>
          <Card className={`p-5 sm:p-6 ${e.status === "new" ? "ring-1 ring-ember/30" : ""}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-medium">{e.name}</h2>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[e.status]}`}>{STATUS_LABEL[e.status]}</span>
                  {e.studentClass && <span className="rounded-full bg-ivory-deep px-2.5 py-0.5 text-xs text-ink/70">{e.studentClass}</span>}
                </div>
                <p className="mt-1 text-sm text-ink/50">{e.date}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-line hover:bg-ivory">
                  📞 {e.phone}
                </a>
                <a href={whatsappHref(e.phone, e.name)} target="_blank" rel="noreferrer" className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-line hover:bg-ivory">
                  WhatsApp
                </a>
                {e.email && (
                  <a href={`mailto:${e.email}?subject=${encodeURIComponent("Your enquiry at Eastern Cambridge School")}`} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-line hover:bg-ivory">
                    Email
                  </a>
                )}
              </div>
            </div>

            {e.message ? (
              <p className="mt-4 whitespace-pre-wrap rounded-xl bg-ivory/70 px-4 py-3 leading-relaxed text-ink/80">{e.message}</p>
            ) : (
              <p className="mt-4 text-sm italic text-ink/40">No message.</p>
            )}
            {e.email && <p className="mt-3 text-sm text-ink/55">{e.email}</p>}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
              <div className="flex flex-wrap gap-2">
                {NEXT_ACTIONS[e.status].map((a) => (
                  <Button key={a.status} variant={a.variant} disabled={pending} onClick={() => run(() => setEnquiryStatus(e.id, a.status))} className="px-3 py-2">
                    {a.label}
                  </Button>
                ))}
                {e.status === "new" && (
                  <Button variant="ghost" disabled={pending} onClick={() => run(() => setEnquiryStatus(e.id, "closed"))} className="px-3 py-2">
                    Close
                  </Button>
                )}
              </div>
              <ConfirmButton disabled={pending} onConfirm={() => run(() => deleteEnquiry(e.id))} />
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
