"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

/* ---------- Toasts: short confirmations after each save ---------- */

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((result) => {
    if (!result?.message) return;
    const id = Math.random();
    setToasts((list) => [...list, { id, ...result }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), result.ok ? 3500 : 6000);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm shadow-lg ${
              t.ok ? "bg-forest text-ivory" : "bg-[#9f2d1f] text-white"
            }`}
          >
            <span aria-hidden="true">{t.ok ? "✓" : "!"}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

/** Calls `onResult` whenever a useActionState result changes. */
export function useActionResult(state, onResult) {
  const last = useRef(state);
  useEffect(() => {
    if (state && state !== last.current) onResult(state);
    last.current = state;
  }, [state, onResult]);
}

/* ---------- Form primitives ---------- */

export const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-forest focus:ring-2 focus:ring-forest/15";

export function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-ink/80">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink/50">{hint}</span>}
    </label>
  );
}

const BUTTON = {
  primary: "bg-forest text-ivory hover:bg-forest-soft",
  secondary: "bg-white text-ink ring-1 ring-line hover:bg-ivory",
  danger: "bg-[#9f2d1f] text-white hover:bg-[#86251a]",
  ghost: "text-ink/70 hover:bg-ink/5 hover:text-ink",
};

export function Button({ variant = "secondary", className = "", ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON[variant]} ${className}`}
      {...props}
    />
  );
}

/** Submit button that shows a pending label while its form's action runs. */
export function SubmitButton({ children, pendingText = "Saving…", variant = "primary", className = "" }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} disabled={pending} className={className}>
      {pending && <Spinner />}
      {pending ? pendingText : children}
    </Button>
  );
}

export function Spinner() {
  return <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />;
}

/** Delete in two clicks — the first arms it, the second confirms — without a browser dialog. */
export function ConfirmButton({ onConfirm, label = "Delete", confirmLabel = "Confirm delete", disabled }) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(timer);
  }, [armed]);

  return armed ? (
    <Button variant="danger" disabled={disabled} onClick={() => (setArmed(false), onConfirm())} className="px-3 py-2">
      {confirmLabel}
    </Button>
  ) : (
    <Button variant="ghost" disabled={disabled} onClick={() => setArmed(true)} className="px-3 py-2 text-[#9f2d1f] hover:bg-[#9f2d1f]/10 hover:text-[#9f2d1f]">
      {label}
    </Button>
  );
}

export function IconButton({ label, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="grid size-8 place-items-center rounded-md text-ink/55 transition-colors hover:bg-ink/5 hover:text-ink disabled:pointer-events-none disabled:opacity-25"
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "" }) {
  return <div className={`rounded-2xl bg-white shadow-[0_0_0_1px_var(--line)] ${className}`}>{children}</div>;
}

export function EmptyState({ children }) {
  return <p className="px-6 py-14 text-center text-sm text-ink/55">{children}</p>;
}
