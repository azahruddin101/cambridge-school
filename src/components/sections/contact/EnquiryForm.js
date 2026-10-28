"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useLenis } from "lenis/react";
import { submitEnquiry } from "@/app/(site)/contact/actions";
import { ArrowIcon, PhoneIcon } from "@/components/ui/Icons";
import { enquiryClasses, site } from "@/data/site";

const inputClass = "w-full bg-transparent text-lg outline-none placeholder:text-ink/30";

function Field({ label, optional, error, children }) {
  const id = useId();
  return (
    <div>
      <label
        className={`group block border-b pb-3 transition-colors duration-500 focus-within:border-ink ${error ? "border-[#b4402a]" : "border-line"}`}
      >
        <span className="mb-2 flex justify-between text-xs uppercase tracking-[0.2em] text-ink/50 transition-colors group-focus-within:text-ember">
          {label}
          {optional && <span className="normal-case tracking-normal text-ink/35">Optional</span>}
        </span>
        {children({ "aria-invalid": error ? true : undefined, "aria-describedby": error ? id : undefined })}
      </label>
      {error && (
        <p id={id} className="mt-2 text-sm text-[#b4402a]">
          {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group/btn inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-7 pr-2 text-sm font-medium tracking-wide text-ivory transition-transform duration-500 ease-out-expo active:scale-[0.97] disabled:opacity-70"
    >
      {pending ? "Sending…" : "Send enquiry"}
      <span className="grid size-10 place-items-center rounded-full bg-ivory/10 transition-transform duration-700 ease-out-expo group-hover/btn:rotate-45">
        {pending ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <ArrowIcon />}
      </span>
    </button>
  );
}

function Form({ onSent }) {
  const [state, action] = useActionState(submitEnquiry, null);
  const startedAt = useRef(null);
  const values = state?.values ?? {};
  const errors = state?.errors ?? {};

  // Timestamp for the server's "filled in too fast" spam check
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);

  useEffect(() => {
    if (state?.ok) onSent(state.message);
  }, [state, onSent]);

  return (
    <form action={action} noValidate className="space-y-8">
      <input ref={startedAt} type="hidden" name="startedAt" />
      {/* Honeypot: hidden from people, often filled in by bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Parent / guardian name" error={errors.name}>
          {(aria) => <input name="name" required maxLength={100} autoComplete="name" defaultValue={values.name} placeholder="Your full name" className={inputClass} {...aria} />}
        </Field>
        <Field label="Mobile number" error={errors.phone}>
          {(aria) => <input name="phone" type="tel" required inputMode="tel" autoComplete="tel" defaultValue={values.phone} placeholder="+91 98765 43210" className={inputClass} {...aria} />}
        </Field>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Email" optional error={errors.email}>
          {(aria) => <input name="email" type="email" maxLength={120} autoComplete="email" defaultValue={values.email} placeholder="you@example.com" className={inputClass} {...aria} />}
        </Field>
        <Field label="Class applying for" error={errors.studentClass}>
          {(aria) => (
            <select name="studentClass" required defaultValue={values.studentClass ?? ""} className={`${inputClass} appearance-none`} {...aria}>
              <option value="" disabled>
                Select a class
              </option>
              {enquiryClasses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <Field label="Message" optional error={errors.message}>
        {(aria) => (
          <textarea name="message" rows={4} maxLength={1000} defaultValue={values.message} placeholder="Anything you'd like to ask us" className={`${inputClass} resize-none`} {...aria} />
        )}
      </Field>

      {state && !state.ok && (
        <p role="alert" className="rounded-xl bg-[#b4402a]/10 px-4 py-3 text-sm text-[#b4402a]">
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <SubmitButton />
        <p className="text-sm text-ink/55">We&rsquo;ll only use these details to reply to your enquiry.</p>
      </div>
    </form>
  );
}

export default function EnquiryForm() {
  const [sent, setSent] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const sentRef = useRef(null);
  const lenis = useLenis();

  // The confirmation is shorter than the form, so bring it back into view
  useEffect(() => {
    if (sent && sentRef.current) lenis?.scrollTo(sentRef.current, { offset: -window.innerHeight / 3, duration: 1 });
  }, [sent, lenis]);

  if (sent) {
    return (
      <div ref={sentRef} role="status" className="py-6 text-center">
        <span className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-forest text-2xl text-ivory">✓</span>
        <h3 className="text-4xl">Enquiry sent</h3>
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-ink/65">{sent}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={site.phoneHref} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm">
            <PhoneIcon /> {site.phone}
          </a>
          <button
            type="button"
            onClick={() => {
              setSent(null);
              setFormKey((k) => k + 1);
            }}
            className="rounded-full px-5 py-2.5 text-sm text-ink/70 underline-offset-4 hover:underline"
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return <Form key={formKey} onSent={setSent} />;
}
