import Reveal from "@/components/motion/Reveal";
import { sumStrength } from "@/lib/server/data";

/** Class-wise table of sections, boys and girls — the data view behind the chart. */
export default function StrengthTable({ rows }) {
  const totals = sumStrength(rows);

  return (
    <Reveal className="overflow-x-auto rounded-[1.75rem] bg-paper shadow-[0_0_0_1px_var(--line)]">
      <table className="data-table">
        <thead>
          <tr>
            <th>Class</th>
            <th className="text-right!">Section</th>
            <th className="text-right!">Boys</th>
            <th className="text-right!">Girls</th>
            <th className="text-right!">Students</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.cls}>
              <td className="font-medium">{row.cls}</td>
              <td className="text-right">{row.sections}</td>
              <td className="text-right">{row.boys}</td>
              <td className="text-right">{row.girls}</td>
              <td className="text-right font-medium">{row.boys + row.girls}</td>
            </tr>
          ))}
          <tr className="bg-forest text-ivory hover:bg-forest!">
            <td className="font-serif text-xl">Total</td>
            <td className="text-right">{totals.sections}</td>
            <td className="text-right">{totals.boys}</td>
            <td className="text-right">{totals.girls}</td>
            <td className="text-right font-serif text-xl">{totals.boys + totals.girls}</td>
          </tr>
        </tbody>
      </table>
    </Reveal>
  );
}
