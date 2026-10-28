"use client";

import { useState } from "react";
import { ArrowIcon } from "@/components/ui/Icons";
import { site } from "@/data/site";

const CLASSES = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

function Field({ label, children }) {
  return (
    <label className="group block border-b border-line pb-3 transition-colors duration-500 focus-within:border-ink">
      <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-ink/50 transition-colors group-focus-within:text-ember">{label}</span>
      {children}
    </label>
  );
}

const inputClass = "w-full bg-transparent text-lg outline-none placeholder:text-ink/30";

/**
 * There is no backend yet, so the enquiry opens the visitor's mail app
 * with a pre-filled message addressed to the school.
 */
export default function EnquiryForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const subject = `Admission enquiry — Class ${data.class}`;
    const body = [
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Class applying for: ${data.class}`,
      "",
      data.message,
    ].join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Parent / guardian name">
          <input name="name" required autoComplete="name" className={inputClass} placeholder="Your full name" />
        </Field>
        <Field label="Phone">
          <input name="phone" type="tel" required autoComplete="tel" className={inputClass} placeholder="+91" />
        </Field>
      </div>
      <Field label="Class applying for">
        <select name="class" required defaultValue="" className={`${inputClass} appearance-none`}>
          <option value="" disabled>
            Select a class
          </option>
          {CLASSES.map((c) => (
            <option key={c} value={c}>
              Class {c}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Message">
        <textarea name="message" rows={4} className={`${inputClass} resize-none`} placeholder="Anything you'd like to ask us" />
      </Field>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          className="group/btn inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-7 pr-2 text-sm font-medium tracking-wide text-ivory transition-transform duration-500 ease-out-expo active:scale-[0.97]"
        >
          Send enquiry
          <span className="grid size-10 place-items-center rounded-full bg-ivory/10 transition-transform duration-700 ease-out-expo group-hover/btn:rotate-45">
            <ArrowIcon />
          </span>
        </button>
        <p className="text-sm text-ink/55" aria-live="polite">
          {sent ? "Your mail app should open with the enquiry ready to send." : "Opens your email app with the details filled in."}
        </p>
      </div>
    </form>
  );
}
