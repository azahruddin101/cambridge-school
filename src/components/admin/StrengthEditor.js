"use client";

import { useState, useTransition } from "react";
import { saveStrength } from "@/app/admin/_actions/content";
import { Button, Card, useToast } from "./ui";
import { RowControls, SaveBar, cellInput, num, numberInput, removeAt, replaceAt, swap } from "./TableEditorParts";

const COLUMNS = [
  { key: "sections", label: "Sections" },
  { key: "boys", label: "Boys" },
  { key: "girls", label: "Girls" },
];

export default function StrengthEditor({ initial }) {
  const [rows, setRows] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [saving, startSaving] = useTransition();
  const toast = useToast();
  const dirty = JSON.stringify(rows) !== JSON.stringify(saved);

  const total = (key) => rows.reduce((a, r) => a + num(r[key]), 0);

  const save = () =>
    startSaving(async () => {
      const result = await saveStrength(rows);
      toast(result);
      if (result.ok) setSaved(rows);
    });

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-ivory/70 text-left text-xs text-ink/55">
              <tr>
                <th className="px-3 py-2.5 font-medium">Class</th>
                {COLUMNS.map((c) => (
                  <th key={c.key} className="px-3 py-2.5 text-right font-medium">
                    {c.label}
                  </th>
                ))}
                <th className="px-3 py-2.5 text-right font-medium">Students</th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row, r) => {
                const update = (patch) => setRows(replaceAt(rows, r, { ...row, ...patch }));
                return (
                  <tr key={r} className="hover:bg-ivory/40">
                    <td className="px-1 py-1">
                      <input value={row.cls} onChange={(e) => update({ cls: e.target.value })} placeholder="e.g. IX" aria-label="Class" className={cellInput} />
                    </td>
                    {COLUMNS.map((c) => (
                      <td key={c.key} className="px-1 py-1">
                        <input
                          type="number"
                          min="0"
                          inputMode="numeric"
                          value={row[c.key]}
                          onChange={(e) => update({ [c.key]: e.target.value === "" ? "" : Number(e.target.value) })}
                          aria-label={`${c.label} in class ${row.cls}`}
                          className={numberInput}
                        />
                      </td>
                    ))}
                    <td className="px-3 text-right font-medium tabular-nums">{num(row.boys) + num(row.girls)}</td>
                    <td className="px-2">
                      <RowControls index={r} count={rows.length} onMove={(d) => setRows(swap(rows, r, r + d))} onRemove={() => setRows(removeAt(rows, r))} removeLabel="Remove class" />
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-forest/5 font-medium">
                <td className="px-3 py-2.5">
                  Total <span className="font-normal text-ink/50">(calculated)</span>
                </td>
                {COLUMNS.map((c) => (
                  <td key={c.key} className="px-3 py-2.5 text-right tabular-nums">
                    {total(c.key)}
                  </td>
                ))}
                <td className="px-3 py-2.5 text-right tabular-nums">{total("boys") + total("girls")}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
        <div className="border-t border-line p-3">
          <Button variant="ghost" onClick={() => setRows([...rows, { cls: "", sections: 1, boys: 0, girls: 0 }])} disabled={rows.length >= 20}>
            + Add class
          </Button>
        </div>
      </Card>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={() => setRows(saved)} />
    </>
  );
}
