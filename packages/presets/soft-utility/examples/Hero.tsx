const NAV = [
  { label: "Product", href: "#product", current: true },
  { label: "Integrations", href: "#integrations", current: false },
  { label: "Pricing", href: "#pricing", current: false },
  { label: "Changelog", href: "#changelog", current: false },
];

type Status = "open" | "waiting" | "closed";

const STATUS: Record<Status, { label: string; dot: string }> = {
  open: { label: "Open", dot: "size-2 shrink-0 rounded-full bg-accent" },
  waiting: { label: "Waiting", dot: "size-2 shrink-0 rounded-full bg-neutral-400" },
  closed: { label: "Closed", dot: "size-2 shrink-0 rounded-full border border-neutral-400" },
};

const REQUESTS: { id: string; title: string; owner: string; status: Status; age: string }[] = [
  {
    id: "REQ-2141",
    title: "Export fails for invoices over 500 rows",
    owner: "Mira",
    status: "open",
    age: "4m",
  },
  {
    id: "REQ-2139",
    title: "Add SSO for the Lisbon team",
    owner: "Jonas",
    status: "waiting",
    age: "38m",
  },
  { id: "REQ-2136", title: "Webhook retries after a 429", owner: "Ana", status: "open", age: "1h" },
  {
    id: "REQ-2130",
    title: "Rename workspace from settings",
    owner: "Mira",
    status: "closed",
    age: "3h",
  },
  {
    id: "REQ-2127",
    title: "CSV import drops the last column",
    owner: "Teo",
    status: "closed",
    age: "5h",
  },
];

const VIEWS = [
  { id: "open", label: "Open", checked: true },
  { id: "waiting", label: "Waiting", checked: false },
  { id: "all", label: "All", checked: false },
];

const FACTS = [
  { term: "Median first reply", value: "6 min" },
  { term: "Teams on Ledgerly", value: "2,400" },
  { term: "Data region", value: "EU or US" },
];

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export default function Hero() {
  return (
    <div className="bg-muted text-fg font-body">
      <header className="border-b border-border bg-bg">
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-300 flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 md:px-6"
        >
          <a
            href="/"
            className={`flex min-h-11 items-center gap-2 font-display font-bold text-lg ${focus}`}
          >
            <span aria-hidden="true" className="size-3 rounded-sm bg-accent" />
            Ledgerly
          </a>
          <ul className="order-last flex w-full gap-1 overflow-x-auto md:order-none md:w-auto">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={
                    item.current
                      ? `flex min-h-11 items-center rounded-sm bg-muted px-3 text-base font-semibold md:min-h-9 ${focus}`
                      : `flex min-h-11 items-center rounded-sm px-3 text-base text-muted-fg hover:bg-muted hover:text-fg transition-colors ease-standard md:min-h-9 ${focus}`
                  }
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/login"
              className={`flex min-h-11 items-center rounded-sm px-3 text-base text-muted-fg hover:text-fg transition-colors ease-standard md:min-h-9 ${focus}`}
            >
              Sign in
            </a>
            <a
              href="/signup"
              className={`flex min-h-11 items-center rounded-sm border border-border bg-bg px-3 text-base font-semibold hover:bg-muted transition-colors ease-standard md:min-h-9 ${focus}`}
            >
              Open a workspace
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section
          aria-labelledby="hero-title"
          className="mx-auto grid max-w-300 grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:gap-6 md:px-6 md:py-16"
        >
          <div className="md:col-span-5 md:pt-4">
            <p className="flex items-center gap-2 text-sm text-muted-fg">
              <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
              Version 4.2 shipped on 28 October
            </p>
            <h1
              id="hero-title"
              className="mt-3 font-display font-semibold text-3xl tracking-tight leading-tight md:text-4xl"
            >
              One quiet queue for every customer request.
            </h1>
            <p className="mt-4 max-w-120 text-base text-muted-fg">
              Ledgerly pulls email, chat and form requests into a single list, routes each one to an
              owner and tells you what is waiting. No dashboards to babysit.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/signup"
                className={`inline-flex min-h-11 items-center rounded-sm bg-accent px-4 text-base font-semibold text-accent-fg hover:bg-accent-700 transition-colors ease-standard ${focus}`}
              >
                Start a 14-day trial
              </a>
              <a
                href="/docs/import"
                className={`inline-flex min-h-11 items-center gap-2 rounded-sm px-2 text-base text-fg underline decoration-border underline-offset-4 hover:decoration-fg transition-colors ease-standard ${focus}`}
              >
                Import from Zendesk
              </a>
            </div>
            <dl className="mt-8 divide-y divide-border border-y border-border">
              {FACTS.map((fact) => (
                <div key={fact.term} className="flex items-baseline justify-between gap-4 py-2">
                  <dt className="text-sm text-muted-fg">{fact.term}</dt>
                  <dd className="text-base font-semibold tabular-nums">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure
            aria-labelledby="queue-title"
            className="overflow-hidden rounded-lg border border-border bg-bg shadow-sm md:col-span-7 md:self-stretch flex flex-col"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted px-4 py-2">
              <p id="queue-title" className="font-display font-semibold text-base">
                Requests
                <span className="ml-2 text-sm font-normal font-body text-muted-fg tabular-nums">
                  12 open
                </span>
              </p>
              <fieldset className="inline-flex rounded-sm border border-border bg-muted p-0.5">
                <legend className="sr-only">Show requests</legend>
                {VIEWS.map((view) => (
                  <label
                    key={view.id}
                    className="flex min-h-11 cursor-pointer items-center rounded-sm px-3 text-sm text-muted-fg has-checked:bg-bg has-checked:font-semibold has-checked:text-fg has-focus-visible:outline-2 has-focus-visible:outline-ring transition-colors ease-standard md:min-h-8"
                  >
                    <input
                      type="radio"
                      name="queue-view"
                      value={view.id}
                      defaultChecked={view.checked}
                      className="sr-only"
                    />
                    {view.label}
                  </label>
                ))}
              </fieldset>
            </div>
            <div className="flex-1">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Five most recent requests</caption>
                <thead>
                  <tr className="border-b border-border text-sm text-muted-fg">
                    <th scope="col" className="hidden py-2 pl-4 font-normal sm:table-cell">
                      ID
                    </th>
                    <th scope="col" className="py-2 pl-4 font-normal sm:pl-3">
                      Request
                    </th>
                    <th scope="col" className="hidden py-2 pl-3 font-normal md:table-cell">
                      Owner
                    </th>
                    <th scope="col" className="py-2 pl-3 font-normal">
                      Status
                    </th>
                    <th scope="col" className="py-2 pr-4 pl-3 text-right font-normal">
                      Age
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {REQUESTS.map((r) => (
                    <tr key={r.id} className="hover:bg-muted transition-colors ease-standard">
                      <td className="hidden py-2 pl-4 font-mono text-sm text-muted-fg sm:table-cell">
                        {r.id}
                      </td>
                      <td className="py-2 pl-4 text-base sm:pl-3">{r.title}</td>
                      <td className="hidden py-2 pl-3 text-base text-muted-fg md:table-cell">
                        {r.owner}
                      </td>
                      <td className="py-2 pl-3">
                        <span className="flex items-center gap-2 text-sm">
                          <span aria-hidden="true" className={STATUS[r.status].dot} />
                          {STATUS[r.status].label}
                        </span>
                      </td>
                      <td className="py-2 pr-4 pl-3 text-right text-sm text-muted-fg tabular-nums">
                        {r.age}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border bg-muted px-4 py-2 text-sm text-muted-fg">
              <p>Sample workspace</p>
              <p className="flex items-center gap-2">
                Search
                <kbd className="rounded-sm border border-border bg-bg px-1.5 font-mono text-sm text-fg">
                  /
                </kbd>
              </p>
            </div>
          </figure>
        </section>
      </main>
    </div>
  );
}
