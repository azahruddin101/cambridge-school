"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/_actions/auth";
import { Field, SubmitButton, inputClass } from "./ui";

export default function LoginForm({ next }) {
  const [state, action] = useActionState(login, null);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Username">
        <input name="username" autoComplete="username" required autoFocus className={inputClass} />
      </Field>
      <Field label="Password">
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      {state && !state.ok && (
        <p role="alert" className="rounded-lg bg-[#9f2d1f]/10 px-3 py-2.5 text-sm text-[#9f2d1f]">
          {state.message}
        </p>
      )}
      <SubmitButton pendingText="Signing in…" className="w-full py-3">
        Sign in
      </SubmitButton>
    </form>
  );
}
