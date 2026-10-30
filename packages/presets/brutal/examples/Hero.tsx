const NAV = [
  { label: "Work", href: "#work", current: true },
  { label: "Docs", href: "#docs", current: false },
  { label: "Prices", href: "#prices", current: false },
  { label: "Log in", href: "#login", current: false },
];

const FACTS = [
  { value: "12,400", label: "Teams shipping on Fridays" },
  { value: "0", label: "Config files to write" },
  { value: "41s", label: "Median rollback" },
];

const FOCUS = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-fg";

export default function Hero() {
  return (
    <div className="bg-bg text-fg font-body">
      <header className="border-b-3 border-fg">
        <nav aria-label="Primary" className="flex flex-col md:flex-row">
          <a
            href="/"
            className={`flex items-center min-h-12 px-4 md:px-8 border-b-3 md:border-b-0 md:border-r-3 border-fg font-display uppercase text-lg ${FOCUS}`}
          >
            Forklift
          </a>
          <ul className="flex md:ml-auto divide-x-3 divide-fg md:border-l-3 border-fg">
            {NAV.map((item) => (
              <li key={item.href} className="flex-1 md:flex-none">
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={
                    item.current
                      ? `flex items-center justify-center min-h-12 px-4 md:px-6 bg-fg text-bg font-mono font-bold uppercase text-sm ${FOCUS}`
                      : `flex items-center justify-center min-h-12 px-4 md:px-6 font-mono font-bold uppercase text-sm hover:bg-muted transition ease-standard ${FOCUS}`
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
        <section
          aria-labelledby="hero-title"
          className="grid grid-cols-12 gap-x-8 gap-y-12 px-4 md:px-8 pt-12 md:pt-20 pb-12 md:pb-20"
        >
          <div className="col-span-12 md:col-span-8">
            <p className="inline-block bg-fg text-bg font-mono font-bold uppercase text-sm px-2 py-0.5">
              Deploys / v4.2
            </p>
            <h1
              id="hero-title"
              className="mt-6 font-display uppercase text-xl md:text-3xl xl:text-4xl leading-none"
            >
              <span className="block">Ship it</span>
              <span className="block">on</span>
              <span className="block">Friday.</span>
            </h1>
            <p className="mt-8 max-w-prose text-base">
              Forklift builds every branch into a live preview, runs your checks in parallel and
              rolls production back in one click when something breaks. No YAML, no pager panic.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href="#signup"
                className={`inline-flex items-center min-h-12 px-6 border-3 border-fg bg-accent text-accent-fg font-bold shadow-md transition ease-standard hover:translate-x-1 hover:translate-y-1 hover:shadow-none motion-reduce:transition-none ${FOCUS}`}
              >
                Start a free project
              </a>
              <a
                href="#changelog"
                className={`inline-flex items-center min-h-12 px-1 font-bold underline decoration-3 underline-offset-4 hover:bg-fg hover:text-bg transition ease-standard ${FOCUS}`}
              >
                Read the changelog
              </a>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 md:mt-12 self-start border-3 border-fg shadow-lg divide-y-3 divide-fg">
            <aside aria-labelledby="build-stat" className="relative bg-fg text-bg p-6 pt-8">
              <p
                id="build-stat"
                className="absolute -top-3 left-4 border-3 border-fg bg-bg text-fg font-mono font-bold uppercase text-sm px-2"
              >
                Median build
              </p>
              <p className="font-display text-2xl leading-none">38s</p>
              <p className="mt-4 text-base">
                From <span className="font-mono">git push</span> to a live preview URL, across the
                last 30 days. p95 is <span className="font-mono">1m 04s</span>.
              </p>
            </aside>
            <dl aria-label="Forklift in numbers" className="divide-y-3 divide-fg">
              {FACTS.map((fact) => (
                <div key={fact.label} className="px-6 py-4">
                  <dt className="font-mono text-base">{fact.label}</dt>
                  <dd className="mt-1 font-display text-xl leading-none">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
    </div>
  );
}
