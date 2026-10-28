import Reveal from "@/components/motion/Reveal";

const inr = (n) => (n === 0 ? "—" : `₹${n.toLocaleString("en-IN")}`);
const sum = (values) => values.reduce((a, b) => a + b, 0);

function FeeRows({ rows, offset = 0 }) {
  return rows.map((row, r) => (
    <tr key={`${row.head}-${r}`}>
      <td className="text-ink/45 tabular-nums">{r + 1 + offset}</td>
      <td className="font-medium">{row.head}</td>
      <td className="text-ink/55">{row.duration}</td>
      {row.values.map((v, i) => (
        <td key={i} className="text-right">
          {inr(v)}
        </td>
      ))}
    </tr>
  ));
}

/** Fee heads per class group, followed by the month-wise payment schedule. */
export default function FeeTables({ fees }) {
  // Heads counted in "Total fees" come first, the rest are listed after it
  const included = fees.rows.filter((r) => r.inTotal);
  const excluded = fees.rows.filter((r) => !r.inTotal);
  const totals = fees.columns.map((_, c) => sum(included.map((r) => r.values[c] ?? 0)));

  return (
    <>
      <Reveal className="overflow-x-auto rounded-[1.75rem] bg-paper shadow-[0_0_0_1px_var(--line)]">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-16">Sl. no.</th>
              <th>Fee head</th>
              <th>Duration</th>
              {fees.columns.map((c) => (
                <th key={c} className="text-right!">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <FeeRows rows={included} />
            {included.length > 0 && (
              <tr className="bg-forest text-ivory hover:bg-forest!">
                <td />
                <td className="font-serif text-xl">Total fees</td>
                <td />
                {totals.map((v, i) => (
                  <td key={i} className="text-right font-serif text-xl">
                    {inr(v)}
                  </td>
                ))}
              </tr>
            )}
            <FeeRows rows={excluded} offset={included.length} />
          </tbody>
        </table>
      </Reveal>

      {fees.schedule.rows.length > 0 && (
        <Reveal className="mt-20 md:mt-28">
          <h2 className="mb-3 text-[clamp(2.25rem,4vw,3.5rem)]">Payment schedule</h2>
          <p className="mb-8 text-ink/60">Month-wise instalments{fees.session && ` for session ${fees.session}`}.</p>
          <div className="overflow-x-auto rounded-[1.75rem] bg-paper shadow-[0_0_0_1px_var(--line)]">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Class</th>
                  {fees.schedule.columns.map((c) => (
                    <th key={c} className="text-right!">
                      {c}
                    </th>
                  ))}
                  <th className="text-right!">Total</th>
                </tr>
              </thead>
              <tbody>
                {fees.schedule.rows.map((row) => (
                  <tr key={row.label}>
                    <td className="font-medium">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="text-right">
                        {inr(v)}
                      </td>
                    ))}
                    <td className="text-right font-serif text-xl text-forest">{inr(sum(row.values))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      )}
    </>
  );
}
