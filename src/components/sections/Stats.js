import Reveal from "@/components/motion/Reveal";
import Counter from "@/components/motion/Counter";
import { getStats } from "@/lib/server/data";

export default async function Stats({ className = "" }) {
  const stats = await getStats();
  if (!stats[0].value) return null;

  return (
    <Reveal as="dl" className={`grid grid-cols-2 border-t border-line lg:grid-cols-4 ${className}`} stagger={0.1}>
      {stats.map((stat) => (
        <div key={stat.label} data-reveal-item="" className="flex flex-col border-b border-line py-10 pr-6 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0">
          <dt className="order-2 mt-3 text-sm text-ink/60">{stat.label}</dt>
          <dd className="font-serif text-[clamp(3.5rem,7vw,6.5rem)] leading-none tracking-tight">
            <Counter value={stat.value} prefix={stat.prefix} pad={stat.pad} />
          </dd>
        </div>
      ))}
    </Reveal>
  );
}
