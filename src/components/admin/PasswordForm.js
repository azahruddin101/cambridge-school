"use client";

import { useActionState, useCallback, useRef } from "react";
import { changePassword } from "@/app/admin/_actions/auth";
import { Field, SubmitButton, inputClass, useActionResult, useToast } from "./ui";

export default function PasswordForm() {
  const [state, action] = useActionState(changePassword, null);
  const formRef = useRef(null);
  const toast = useToast();

  useActionResult(
    state,
    useCallback(
      (result) => {
        toast(result);
        if (result.ok) formRef.current?.reset();
      },
      [toast],
    ),
  );

  return (
    <form ref={formRef} action={action} className="max-w-md space-y-4">
      <Field label="Current password">
        <input name="current" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      <Field label="New password" hint="At least 10 characters.">
        <input name="next" type="password" autoComplete="new-password" minLength={10} required className={inputClass} />
      </Field>
      <Field label="Confirm new password">
        <input name="confirm" type="password" autoComplete="new-password" minLength={10} required className={inputClass} />
      </Field>
      <SubmitButton pendingText="Updating…">Change password</SubmitButton>
    </form>
  );
}
