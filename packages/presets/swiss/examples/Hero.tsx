const NAV = [
  { label: "Index", href: "#index", current: true },
  { label: "Projects", href: "#projects", current: false },
  { label: "Method", href: "#method", current: false },
  { label: "Contact", href: "#contact", current: false },
];

const FACTS = [
  {
    value: "12",
    label: "Columns, 24px gutters",
    className: "col-span-12 md:col-span-5 border-t border-border py-2",
  },
  {
    value: "1",
    label: "Accent color",
    className: "col-span-12 md:col-span-3 border-t border-border py-2",
  },
  {
    value: "0",
    label: "Corner radius",
    className: "col-span-12 md:col-span-4 border-t border-border py-2",
  },
];

export default function Hero() {
  return (
    <div className="bg-bg text-fg font-body">
      <header className="border-b border-border">
        <nav aria-label="Primary" className="grid grid-cols-12 gap-x-3 px-3 md:px-6 items-center">
          <a
            href="/"
            className="col-span-12 md:col-span-2 inline-flex items-center min-h-6 font-display font-bold text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Raster Studio
          </a>
          <ul className="col-span-12 md:col-start-3 md:col-span-10 flex flex-wrap gap-x-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={
                    item.current
                      ? "inline-flex items-center min-h-6 text-sm font-medium border-b-2 border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      : "inline-flex items-center min-h-6 text-sm font-medium text-muted-fg border-b-2 border-bg hover:text-fg transition-colors ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  }
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section aria-labelledby="hero-title" className="px-3 md:px-6 pt-8 md:pt-12">
          <div className="grid grid-cols-12 gap-x-3 gap-y-3 border-t-4 border-fg pt-3">
            <p className="col-span-12 md:col-span-2 font-mono text-sm text-muted-fg">01 / Studio</p>
            <div className="col-span-12 md:col-span-10">
              <h1 id="hero-title" className="font-display font-bold text-2xl md:text-4xl text-left">
                <span className="block">Order is</span>
                <span className="block">a design</span>
                <span className="block">decision.</span>
              </h1>
            </div>

            <p className="col-span-12 md:col-start-3 md:col-span-5 pt-3 text-base">
              We build identities, signage and software interfaces on a single grid. Every element
              earns its column, and the type does the rest.
            </p>

            <div className="col-span-12 md:col-start-3 md:col-span-10 flex flex-wrap items-center gap-x-4 gap-y-2 pt-3">
              <a
                href="#contact"
                className="inline-flex items-center min-h-6 px-3 bg-accent text-accent-fg font-medium text-base rounded-none hover:bg-accent-700 transition-colors ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Start a project
              </a>
              <a
                href="#projects"
                className="inline-flex items-center min-h-6 font-medium text-base underline underline-offset-4 decoration-2 hover:text-accent transition-colors ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                See 48 projects
              </a>
            </div>
          </div>

          <dl className="grid grid-cols-12 gap-x-3 mt-8 md:mt-12">
            {FACTS.map((fact) => (
              <div key={fact.label} className={fact.className}>
                <dt className="text-sm text-muted-fg">{fact.label}</dt>
                <dd className="font-mono text-2xl md:text-3xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </div>
  );
}
