"use client";

import { useState, useTransition } from "react";
import { saveFees } from "@/app/admin/_actions/content";
import { Button, Card, Field, inputClass, useToast } from "./ui";
import { RowControls, SaveBar, cellInput, formatINR, numberInput, removeAt, replaceAt, sum, swap } from "./TableEditorParts";

export default function FeesEditor({ initial }) {
  const [fees, setFees] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [saving, startSaving] = useTransition();
  const toast = useToast();
  const dirty = JSON.stringify(fees) !== JSON.stringify(saved);

  const set = (patch) => setFees((f) => ({ ...f, ...patch }));
  const setRows = (rows) => set({ rows });
  const setSchedule = (patch) => set({ schedule: { ...fees.schedule, ...patch } });

  const totals = fees.columns.map((_, c) => sum(fees.rows.filter((r) => r.inTotal).map((r) => r.values[c])));

  const save = () =>
    startSaving(async () => {
      const result = await saveFees(fees);
      toast(result);
      if (result.ok) setSaved(fees);
    });

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <Field label="Academic session" hint="Shown in the page headings, e.g. 2026 – 2027." className="max-w-xs">
          <input value={fees.session} onChange={(e) => set({ session: e.target.value })} maxLength={40} className={inputClass} />
        </Field>
      </Card>

      {/* Fee heads */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-medium">Fee heads</h2>
            <p className="text-sm text-ink/55">Tick &ldquo;In total&rdquo; for fees included in the &ldquo;Total fees&rdquo; row.</p>
          </div>
          <Button
            onClick={() => set({ columns: [...fees.columns, `Class group ${fees.columns.length + 1}`], rows: fees.rows.map((r) => ({ ...r, values: [...r.values, 0] })) })}
            disabled={fees.columns.length >= 8}
          >
            + Class group column
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-ivory/70 text-left text-xs text-ink/55">
              <tr>
                <th className="w-[30%] px-3 py-2 font-medium">Fee head</th>
                <th className="w-[14%] px-3 py-2 font-medium">Duration</th>
                {fees.columns.map((col, c) => (
                  <th key={c} className="px-1 py-1.5 font-medium">
                    <span className="flex items-center gap-1">
                      <input
                        value={col}
                        onChange={(e) => set({ columns: replaceAt(fees.columns, c, e.target.value) })}
                        aria-label={`Class group ${c + 1} name`}
                        className={`${cellInput} text-right font-medium`}
                      />
                      {fees.columns.length > 1 && (
                        <button
                          type="button"
                          title="Remove column"
                          aria-label={`Remove ${col}`}
                          onClick={() => set({ columns: removeAt(fees.columns, c), rows: fees.rows.map((r) => ({ ...r, values: removeAt(r.values, c) })) })}
                          className="text-ink/35 hover:text-[#9f2d1f]"
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  </th>
                ))}
                <th className="px-3 py-2 text-center font-medium">In total</th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {fees.rows.map((row, r) => {
                const update = (patch) => setRows(replaceAt(fees.rows, r, { ...row, ...patch }));
                return (
                  <tr key={r} className="hover:bg-ivory/40">
                    <td className="px-1 py-1">
                      <input value={row.head} onChange={(e) => update({ head: e.target.value })} placeholder="e.g. Admission Fee" aria-label="Fee head" className={cellInput} />
                    </td>
                    <td className="px-1 py-1">
                      <input value={row.duration} onChange={(e) => update({ duration: e.target.value })} placeholder="Yearly" aria-label="Duration" className={cellInput} />
                    </td>
                    {fees.columns.map((col, c) => (
                      <td key={c} className="px-1 py-1">
                        <input
                          type="number"
                          min="0"
                          inputMode="numeric"
                          value={row.values[c] ?? ""}
                          onChange={(e) => update({ values: replaceAt(row.values, c, e.target.value === "" ? "" : Number(e.target.value)) })}
                          aria-label={`${row.head || "Fee"} for ${col}`}
                          className={numberInput}
                        />
                      </td>
                    ))}
                    <td className="text-center">
                      <input type="checkbox" checked={row.inTotal} onChange={(e) => update({ inTotal: e.target.checked })} aria-label="Include in total" className="size-4 accent-[var(--forest)]" />
                    </td>
                    <td className="px-2">
                      <RowControls index={r} count={fees.rows.length} onMove={(d) => setRows(swap(fees.rows, r, r + d))} onRemove={() => setRows(removeAt(fees.rows, r))} removeLabel="Remove fee head" />
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-forest/5 font-medium">
                <td className="px-3 py-2.5" colSpan={2}>
                  Total fees <span className="font-normal text-ink/50">(calculated)</span>
                </td>
                {totals.map((t, c) => (
                  <td key={c} className="px-3 py-2.5 text-right tabular-nums">
                    {formatINR(t)}
                  </td>
                ))}
                <td colSpan={2} />
              </tr>
            </tbody>
          </table>
        </div>
        <div className="border-t border-line p-3">
          <Button variant="ghost" onClick={() => setRows([...fees.rows, { head: "", duration: "Yearly", values: fees.columns.map(() => 0), inTotal: true }])}>
            + Add fee head
          </Button>
        </div>
      </Card>

      {/* Payment schedule */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-medium">Month-wise payment schedule</h2>
            <p className="text-sm text-ink/55">The total column is calculated automatically.</p>
          </div>
          <Button
            onClick={() =>
              setSchedule({ columns: [...fees.schedule.columns, "New period"], rows: fees.schedule.rows.map((r) => ({ ...r, values: [...r.values, 0] })) })
            }
            disabled={fees.schedule.columns.length >= 12}
          >
            + Period column
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-ivory/70 text-left text-xs text-ink/55">
              <tr>
                <th className="w-[16%] px-3 py-2 font-medium">Class</th>
                {fees.schedule.columns.map((col, c) => (
                  <th key={c} className="px-1 py-1.5 font-medium">
                    <span className="flex items-center gap-1">
                      <input
                        value={col}
                        onChange={(e) => setSchedule({ columns: replaceAt(fees.schedule.columns, c, e.target.value) })}
                        aria-label={`Period ${c + 1} name`}
                        className={`${cellInput} text-right font-medium`}
                      />
                      {fees.schedule.columns.length > 1 && (
                        <button
                          type="button"
                          title="Remove column"
                          aria-label={`Remove ${col}`}
                          onClick={() =>
                            setSchedule({ columns: removeAt(fees.schedule.columns, c), rows: fees.schedule.rows.map((r) => ({ ...r, values: removeAt(r.values, c) })) })
                          }
                          className="text-ink/35 hover:text-[#9f2d1f]"
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  </th>
                ))}
                <th className="px-3 py-2 text-right font-medium">Total</th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {fees.schedule.rows.map((row, r) => {
                const update = (patch) => setSchedule({ rows: replaceAt(fees.schedule.rows, r, { ...row, ...patch }) });
                return (
                  <tr key={r} className="hover:bg-ivory/40">
                    <td className="px-1 py-1">
                      <input value={row.label} onChange={(e) => update({ label: e.target.value })} placeholder="Class 1 – 3" aria-label="Class" className={cellInput} />
                    </td>
                    {fees.schedule.columns.map((col, c) => (
                      <td key={c} className="px-1 py-1">
                        <input
                          type="number"
                          min="0"
                          inputMode="numeric"
                          value={row.values[c] ?? ""}
                          onChange={(e) => update({ values: replaceAt(row.values, c, e.target.value === "" ? "" : Number(e.target.value)) })}
                          aria-label={`${row.label || "Class"} — ${col}`}
                          className={numberInput}
                        />
                      </td>
                    ))}
                    <td className="px-3 text-right font-medium tabular-nums">{formatINR(sum(row.values))}</td>
                    <td className="px-2">
                      <RowControls
                        index={r}
                        count={fees.schedule.rows.length}
                        onMove={(d) => setSchedule({ rows: swap(fees.schedule.rows, r, r + d) })}
                        onRemove={() => setSchedule({ rows: removeAt(fees.schedule.rows, r) })}
                        removeLabel="Remove class row"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-line p-3">
          <Button variant="ghost" onClick={() => setSchedule({ rows: [...fees.schedule.rows, { label: "", values: fees.schedule.columns.map(() => 0) }] })}>
            + Add class row
          </Button>
        </div>
      </Card>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={() => setFees(saved)} />
    </div>
  );
}

