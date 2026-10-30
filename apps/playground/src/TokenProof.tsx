// Literal class names so Tailwind can see every token utility.
const accentRamp = [
  { name: "accent-50", cls: "bg-accent-50" },
  { name: "accent-100", cls: "bg-accent-100" },
  { name: "accent-200", cls: "bg-accent-200" },
  { name: "accent-300", cls: "bg-accent-300" },
  { name: "accent-400", cls: "bg-accent-400" },
  { name: "accent-500", cls: "bg-accent-500" },
  { name: "accent-600", cls: "bg-accent-600" },
  { name: "accent-700", cls: "bg-accent-700" },
  { name: "accent-800", cls: "bg-accent-800" },
  { name: "accent-900", cls: "bg-accent-900" },
  { name: "accent-950", cls: "bg-accent-950" },
];
const neutralRamp = [
  { name: "neutral-50", cls: "bg-neutral-50" },
  { name: "neutral-100", cls: "bg-neutral-100" },
  { name: "neutral-200", cls: "bg-neutral-200" },
  { name: "neutral-300", cls: "bg-neutral-300" },
  { name: "neutral-400", cls: "bg-neutral-400" },
  { name: "neutral-500", cls: "bg-neutral-500" },
  { name: "neutral-600", cls: "bg-neutral-600" },
  { name: "neutral-700", cls: "bg-neutral-700" },
  { name: "neutral-800", cls: "bg-neutral-800" },
  { name: "neutral-900", cls: "bg-neutral-900" },
  { name: "neutral-950", cls: "bg-neutral-950" },
];
const roles = [
  { name: "bg", cls: "bg-bg" },
  { name: "fg", cls: "bg-fg" },
  { name: "muted", cls: "bg-muted" },
  { name: "accent", cls: "bg-accent" },
  { name: "border", cls: "bg-border" },
  { name: "ring", cls: "bg-ring" },
  { name: "destructive", cls: "bg-destructive" },
];
const typeSteps = [
  { name: "text-xs", cls: "text-xs" },
  { name: "text-sm", cls: "text-sm" },
  { name: "text-base", cls: "text-base" },
  { name: "text-lg", cls: "text-lg" },
  { name: "text-xl", cls: "text-xl" },
  { name: "text-2xl", cls: "text-2xl" },
  { name: "text-3xl", cls: "text-3xl" },
  { name: "text-4xl", cls: "text-4xl" },
  { name: "text-5xl", cls: "text-5xl" },
];

function Swatches({ title, items }: { title: string; items: { name: string; cls: string }[] }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl">{title}</h2>
      <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {items.map((i) => (
          <li key={i.name}>
            <div className={`h-10 rounded-sm border border-border ${i.cls}`} />
            <code className="mt-1 block font-mono text-xs text-muted-fg">--color-{i.name}</code>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TokenProof() {
  return (
    <main className="mx-auto max-w-4xl p-6 md:p-12">
      <h1 className="font-display text-5xl leading-tight">uitaste playground</h1>
      <p className="mt-4 text-lg text-muted-fg">Rendered from preset tokens only.</p>

      <div className="mt-8 rounded-lg border border-border p-6">
        <h2 className="font-display text-2xl">Card</h2>
        <p className="mt-2 text-base">Body copy in the preset body font.</p>
        <code className="mt-2 block font-mono text-sm">const tone = "uitaste";</code>
        <button
          type="button"
          className="mt-4 min-h-11 rounded-sm bg-accent-700 px-6 text-bg transition-colors hover:bg-accent-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Primary action
        </button>
      </div>

      <Swatches title="Semantic roles" items={roles} />
      <Swatches title="Accent ramp" items={accentRamp} />
      <Swatches title="Neutral ramp" items={neutralRamp} />

      <section className="mt-8">
        <h2 className="font-display text-xl">Type scale</h2>
        <ul className="mt-2 space-y-2">
          {typeSteps.map((t) => (
            <li key={t.name} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
              <code className="w-24 shrink-0 font-mono text-xs text-muted-fg">{t.name}</code>
              <span className={`font-display ${t.cls}`}>Hamburgefonstiv</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
