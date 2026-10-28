export default function PageHeader({ title, description, children }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-4xl leading-tight text-ink">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-ink/60">{description}</p>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap gap-2">{children}</div>}
    </div>
  );
}
