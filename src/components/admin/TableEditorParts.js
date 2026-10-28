"use client";

import { Button, Spinner } from "./ui";

export const cellInput =
  "w-full min-w-0 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm outline-none transition-colors hover:border-line focus:border-forest focus:bg-white focus:ring-2 focus:ring-forest/15";

export const numberInput = `${cellInput} text-right tabular-nums`;

export const num = (v) => (v === "" || v == null ? 0 : Number(v) || 0);
export const sum = (values) => values.reduce((a, v) => a + num(v), 0);
export const formatINR = (n) => `₹${n.toLocaleString("en-IN")}`;

/** Immutable helpers for editing arrays of rows. */
export const replaceAt = (list, i, value) => list.map((item, j) => (j === i ? value : item));
export const removeAt = (list, i) => list.filter((_, j) => j !== i);
export const swap = (list, i, j) => {
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

/** Sticky bar that appears while a table has unsaved changes. */
export function SaveBar({ dirty, saving, onSave, onReset }) {
  return (
    <div
      className={`sticky bottom-4 z-20 mt-8 flex items-center justify-between gap-4 rounded-2xl px-5 py-4 shadow-lg transition-all duration-300 ${
        dirty ? "translate-y-0 bg-ink text-ivory opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
      aria-hidden={!dirty}
    >
      <span className="text-sm">You have unsaved changes.</span>
      <span className="flex gap-2">
        <Button variant="ghost" onClick={onReset} disabled={saving} className="text-ivory/80 hover:bg-white/10 hover:text-ivory">
          Discard
        </Button>
        <Button onClick={onSave} disabled={saving} className="bg-ivory text-ink hover:bg-white">
          {saving && <Spinner />}
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </span>
    </div>
  );
}

export function RowControls({ index, count, onMove, onRemove, removeLabel }) {
  return (
    <span className="flex items-center justify-end gap-0.5 whitespace-nowrap">
      <button type="button" aria-label="Move up" title="Move up" disabled={index === 0} onClick={() => onMove(-1)} className="grid size-7 place-items-center rounded text-ink/45 hover:bg-ink/5 hover:text-ink disabled:opacity-20">
        ▲
      </button>
      <button type="button" aria-label="Move down" title="Move down" disabled={index === count - 1} onClick={() => onMove(1)} className="grid size-7 place-items-center rounded text-ink/45 hover:bg-ink/5 hover:text-ink disabled:opacity-20">
        ▼
      </button>
      <button type="button" aria-label={removeLabel} title={removeLabel} onClick={onRemove} className="grid size-7 place-items-center rounded text-[#9f2d1f]/70 hover:bg-[#9f2d1f]/10 hover:text-[#9f2d1f]">
        ✕
      </button>
    </span>
  );
}
