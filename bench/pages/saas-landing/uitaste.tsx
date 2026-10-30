// Preset: soft-utility. Signature moves: panels on a canvas (1), show the product next to a
// 5/7 split pitch (3), status dot + label (4), property lists and divide-x stat strips (5),
// keyboard hints and segmented controls (6).

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const NAV = [
  { label: "Product", href: "#product", current: true },
  { label: "How it works", href: "#how" },
  { label: "Customers", href: "#customers" },
  { label: "Pricing", href: "#pricing" },
];

type Status = "doing" | "review" | "done" | "next";

const STATUS: Record<Status, { label: string; dot: string }> = {
  doing: { label: "In progress", dot: "size-2 shrink-0 rounded-full bg-accent" },
  review: { label: "In review", dot: "size-2 shrink-0 rounded-full bg-neutral-600" },
  done: { label: "Done", dot: "size-2 shrink-0 rounded-full bg-neutral-400" },
  next: { label: "Up next", dot: "size-2 shrink-0 rounded-full border border-neutral-400" },
};

const TASKS: { id: string; title: string; owner: string; zone: string; status: Status }[] = [
  {
    id: "LP-318",
    title: "Draft onboarding email for October cohort",
    owner: "Priya",
    zone: "Lisbon",
    status: "doing",
  },
  {
    id: "LP-316",
    title: "Fix invoice PDF margins",
    owner: "Tomás",
    zone: "Mexico City",
    status: "review",
  },
  { id: "LP-311", title: "Record Q4 roadmap walkthrough", owner: "Ana", zone: "Berlin", status: "done" },
  {
    id: "LP-309",
    title: "Ship dark mode for the mobile app",
    owner: "Kenji",
    zone: "Osaka",
    status: "next",
  },
  {
    id: "LP-305",
    title: "Interview three churned customers",
    owner: "Priya",
    zone: "Lisbon",
    status: "done",
  },
];

const VIEWS = [
  { id: "week", label: "This week", checked: true },
  { id: "mine", label: "Mine", checked: false },
  { id: "all", label: "All", checked: false },
];

const FACTS = [
  { term: "Teams on Loop", value: "3,100" },
  { term: "Median team size", value: "7 people" },
  { term: "Setup time", value: "About 10 minutes" },
];

const STEPS = [
  {
    n: "1",
    title: "Write it down once",
    body: "Every task gets an owner, a due date and the context it needs. Loop asks for the missing piece before you hit save.",
  },
  {
    n: "2",
    title: "Work in your own hours",
    body: "Hand-offs show the local time of whoever picks the task up next, so nobody waits for a meeting to start.",
  },
  {
    n: "3",
    title: "Read the week in one page",
    body: "On Friday Loop writes a plain summary of what moved, what is stuck and who needs help. No status meeting.",
  },
];

const DETAILS = [
  { term: "Time-zone aware due dates", value: "Due at 17:00 in the owner's city" },
  { term: "Async check-ins", value: "Two questions, answered when it suits you" },
  { term: "Integrations", value: "Slack, GitHub, Google Calendar, Linear import" },
  { term: "Guests", value: "Free, with access to one project" },
];

const PLANS = [
  { name: "Free", blurb: "Up to 5 people and 3 projects.", price: "$0" },
  { name: "Team", blurb: "Unlimited projects, check-ins and summaries.", price: "$8" },
  { name: "Business", blurb: "SSO, audit log and priority support.", price: "$14" },
];

export default function Page() {
  return (
    <main className="min-h-dvh bg-muted font-body text-base text-fg">
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
            Loop
          </a>
          <ul className="order-last flex w-full gap-1 overflow-x-auto md:order-none md:w-auto">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={
                    item.current
                      ? `flex min-h-11 items-center whitespace-nowrap rounded-sm bg-muted px-3 font-semibold md:min-h-9 ${focus}`
                      : `flex min-h-11 items-center whitespace-nowrap rounded-sm px-3 text-muted-fg transition-colors ease-standard hover:bg-muted hover:text-fg md:min-h-9 ${focus}`
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
              className={`flex min-h-11 items-center rounded-sm px-3 text-muted-fg transition-colors ease-standard hover:text-fg md:min-h-9 ${focus}`}
            >
              Sign in
            </a>
            <a
              href="/signup"
              className={`flex min-h-11 items-center rounded-sm border border-border bg-bg px-3 font-semibold transition-colors ease-standard hover:bg-muted md:min-h-9 ${focus}`}
            >
              Create a team
            </a>
          </div>
        </nav>
      </header>

      <section
        id="product"
        aria-labelledby="hero-title"
        className="mx-auto grid max-w-300 grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:gap-6 md:px-6 md:py-16"
      >
        <div className="md:col-span-5 md:pt-4">
          <p className="flex items-center gap-2 text-sm text-muted-fg">
            <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
            Weekly summaries are live for every team
          </p>
          <h1
            id="hero-title"
            className="mt-3 font-display font-semibold text-3xl leading-tight tracking-tight md:text-4xl"
          >
            Keep a remote team in step without another meeting.
          </h1>
          <p className="mt-4 max-w-120 text-muted-fg">
            Loop is a shared task list for teams of 3 to 30 spread across time zones. Everyone sees
            who owns what, when it is due in their own city, and what changed while they slept.
          </p>
          <form
            className="mt-6 flex flex-col gap-2 sm:flex-row"
            aria-label="Sign up"
            action="/signup"
          >
            <label htmlFor="hero-email" className="sr-only">
              Work email
            </label>
            <input
              id="hero-email"
              type="email"
              name="email"
              required
              placeholder="you@company.com"
              className="min-h-11 min-w-0 flex-1 rounded-sm border border-border bg-bg px-3 placeholder-muted-fg focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
            <button
              type="submit"
              className={`inline-flex min-h-11 items-center justify-center rounded-sm bg-accent px-4 font-semibold text-accent-fg transition-colors ease-standard hover:bg-accent-700 ${focus}`}
            >
              Start free for your team
            </button>
          </form>
          <p className="mt-2 text-sm text-muted-fg">
            Free for up to 5 people. No card needed.{" "}
            <a
              href="/tour"
              className={`rounded-sm text-fg underline decoration-border underline-offset-4 transition-colors ease-standard hover:decoration-fg ${focus}`}
            >
              Watch the 2-minute tour
            </a>
          </p>
          <dl className="mt-8 divide-y divide-border border-y border-border">
            {FACTS.map((fact) => (
              <div key={fact.term} className="flex items-baseline justify-between gap-4 py-2">
                <dt className="text-sm text-muted-fg">{fact.term}</dt>
                <dd className="font-semibold tabular-nums">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure
          aria-labelledby="board-title"
          className="flex flex-col overflow-hidden rounded-lg border border-border bg-bg shadow-sm md:col-span-7 md:self-stretch"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted px-4 py-2">
            <p id="board-title" className="font-display font-semibold">
              Growth team
              <span className="ml-2 font-body text-sm font-normal text-muted-fg tabular-nums">
                14 open tasks
              </span>
            </p>
            <fieldset className="inline-flex rounded-sm border border-border bg-muted p-0.5">
              <legend className="sr-only">Show tasks</legend>
              {VIEWS.map((view) => (
                <label
                  key={view.id}
                  className="flex min-h-11 cursor-pointer items-center rounded-sm px-3 text-sm text-muted-fg transition-colors ease-standard has-checked:bg-bg has-checked:font-semibold has-checked:text-fg has-focus-visible:outline-2 has-focus-visible:outline-ring md:min-h-8"
                >
                  <input
                    type="radio"
                    name="board-view"
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
              <caption className="sr-only">Tasks for this week</caption>
              <thead>
                <tr className="border-b border-border text-sm text-muted-fg">
                  <th scope="col" className="hidden py-2 pl-4 font-normal sm:table-cell">
                    ID
                  </th>
                  <th scope="col" className="py-2 pl-4 font-normal sm:pl-3">
                    Task
                  </th>
                  <th scope="col" className="hidden py-2 pl-3 font-normal md:table-cell">
                    Owner
                  </th>
                  <th scope="col" className="py-2 pr-4 pl-3 font-normal">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {TASKS.map((t) => (
                  <tr key={t.id} className="transition-colors ease-standard hover:bg-muted">
                    <td className="hidden py-2 pl-4 font-mono text-sm text-muted-fg sm:table-cell">
                      {t.id}
                    </td>
                    <td className="py-2 pl-4 sm:pl-3">{t.title}</td>
                    <td className="hidden py-2 pl-3 text-muted-fg md:table-cell">
                      {t.owner}
                      <span className="block text-sm">{t.zone}</span>
                    </td>
                    <td className="py-2 pr-4 pl-3">
                      <span className="flex items-center gap-2 whitespace-nowrap text-sm">
                        <span aria-hidden="true" className={STATUS[t.status].dot} />
                        {STATUS[t.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border bg-muted px-4 py-2 text-sm text-muted-fg">
            <p>Next hand-off: Kenji, 09:00 Osaka</p>
            <p className="flex items-center gap-2">
              New task
              <kbd className="rounded-sm border border-border bg-bg px-1.5 font-mono text-sm text-fg">
                N
              </kbd>
            </p>
          </div>
        </figure>
      </section>

      <section id="how" aria-labelledby="how-title" className="border-y border-border bg-bg">
        <div className="mx-auto grid max-w-300 grid-cols-1 gap-6 px-4 py-10 md:grid-cols-12 md:px-6 md:py-16">
          <div className="md:col-span-4">
            <h2
              id="how-title"
              className="font-display font-semibold text-2xl leading-tight tracking-tight"
            >
              How Loop runs a week
            </h2>
            <p className="mt-2 max-w-120 text-muted-fg">
              Three habits, built into the tool so nobody has to enforce them.
            </p>
          </div>
          <ol className="divide-y divide-border border-y border-border md:col-span-8">
            {STEPS.map((step) => (
              <li key={step.n} className="grid grid-cols-[auto_1fr] gap-x-4 py-4">
                <span className="flex size-8 items-center justify-center rounded-sm border border-border bg-muted font-mono text-sm text-muted-fg">
                  {step.n}
                </span>
                <div>
                  <h3 className="font-display font-medium text-lg">{step.title}</h3>
                  <p className="mt-1 max-w-160 text-muted-fg">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="detail-title"
        className="mx-auto grid max-w-300 grid-cols-1 gap-6 px-4 py-10 md:grid-cols-12 md:px-6 md:py-16"
      >
        <article className="overflow-hidden rounded-md border border-border bg-bg md:col-span-7">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
            <h2 id="detail-title" className="font-display font-medium text-lg">
              Friday summary
            </h2>
            <p className="flex items-center gap-2 text-sm text-muted-fg">
              <span aria-hidden="true" className="size-2 rounded-full bg-neutral-400" />
              Sent to 7 people, 16:00 their time
            </p>
          </header>
          <dl className="grid grid-cols-1 divide-y divide-border border-b border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="px-4 py-3">
              <dt className="text-sm text-muted-fg">Closed</dt>
              <dd className="mt-1 font-display font-bold text-2xl tabular-nums">23</dd>
            </div>
            <div className="px-4 py-3">
              <dt className="text-sm text-muted-fg">Stuck over 2 days</dt>
              <dd className="mt-1 font-display font-medium text-2xl tabular-nums">2</dd>
            </div>
            <div className="px-4 py-3">
              <dt className="text-sm text-muted-fg">Meetings skipped</dt>
              <dd className="mt-1 font-display font-medium text-2xl tabular-nums">4</dd>
            </div>
          </dl>
          <div className="px-4 py-4">
            <p className="max-w-160">
              The pricing page went out on Wednesday. Tomás is waiting on legal for the invoice
              change, and Kenji needs a design review before dark mode can ship.
            </p>
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted px-4 py-2">
            <p className="text-sm text-muted-fg">Written by Loop from 41 task updates</p>
            <a
              href="/summaries"
              className={`inline-flex min-h-11 items-center gap-2 rounded-sm px-2 text-sm font-semibold transition-colors ease-standard hover:bg-bg md:min-h-8 ${focus}`}
            >
              See a sample summary
              <kbd className="rounded-sm border border-border bg-bg px-1.5 font-mono text-sm font-normal text-muted-fg">
                G S
              </kbd>
            </a>
          </footer>
        </article>
        <div className="md:col-span-5 md:pt-2">
          <h2 className="font-display font-semibold text-2xl leading-tight tracking-tight">
            Built for teams that never share an office
          </h2>
          <p className="mt-2 text-muted-fg">
            The small details that keep a 7-person team across 4 time zones from tripping over each
            other.
          </p>
          <dl className="mt-6 divide-y divide-border border-y border-border">
            {DETAILS.map((d) => (
              <div key={d.term} className="py-3">
                <dt className="font-semibold">{d.term}</dt>
                <dd className="mt-1 text-sm text-muted-fg">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="customers" aria-labelledby="customers-title" className="border-y border-border bg-bg">
        <div className="mx-auto grid max-w-300 grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:gap-6 md:px-6 md:py-16">
          <h2 id="customers-title" className="sr-only">
            What customers say
          </h2>
          <figure className="md:col-span-7">
            <blockquote className="font-display font-medium text-2xl leading-tight tracking-tight md:text-3xl">
              “We dropped our daily stand-up in the second week. The Friday summary tells me more
              than six calls ever did.”
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3 text-sm text-muted-fg">
              <span
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-sm bg-muted font-display font-semibold text-fg"
              >
                RA
              </span>
              <span>
                <span className="block font-semibold text-fg">Rosa Alves</span>
                Head of Operations, Fieldnote (9 people, 5 countries)
              </span>
            </figcaption>
          </figure>
          <ul className="divide-y divide-border border-y border-border md:col-span-5">
            <li className="py-4">
              <p>“Due dates in my own time zone. That one change ended most of our Slack pings.”</p>
              <p className="mt-2 text-sm text-muted-fg">
                <span className="font-semibold text-fg">Dev Malhotra</span>, CTO, Patchwork Labs
              </p>
            </li>
            <li className="py-4">
              <p>“Our contractors use it as guests for free, so the whole project lives in one place.”</p>
              <p className="mt-2 text-sm text-muted-fg">
                <span className="font-semibold text-fg">Lena Fischer</span>, Founder, Studio Nord
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section
        id="pricing"
        aria-labelledby="pricing-title"
        className="mx-auto max-w-300 px-4 py-10 md:px-6 md:py-16"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2
              id="pricing-title"
              className="font-display font-semibold text-2xl leading-tight tracking-tight"
            >
              Pricing that grows with the team
            </h2>
            <p className="mt-2 text-muted-fg">
              Pay per member, per month. Guests and read-only viewers are always free.
            </p>
            <a
              href="/pricing"
              className={`mt-4 inline-flex min-h-11 items-center rounded-sm px-2 font-semibold underline decoration-border underline-offset-4 transition-colors ease-standard hover:decoration-fg ${focus}`}
            >
              Compare every plan
            </a>
          </div>
          <div className="overflow-hidden rounded-md border border-border bg-bg md:col-span-7">
            <ul className="divide-y divide-border">
              {PLANS.map((plan) => (
                <li
                  key={plan.name}
                  className="flex items-start justify-between gap-4 px-4 py-3 transition-colors ease-standard hover:bg-muted"
                >
                  <span>
                    <span className="block font-display font-medium text-lg">{plan.name}</span>
                    <span className="block text-sm text-muted-fg">{plan.blurb}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-lg font-semibold tabular-nums">{plan.price}</span>
                    <span className="block text-sm text-muted-fg">per member</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted px-4 py-2 text-sm text-muted-fg">
              <p>Billed monthly in USD. Annual billing saves 2 months.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-bg">
        <div className="mx-auto flex max-w-300 flex-col gap-6 px-4 py-8 md:flex-row md:items-start md:justify-between md:px-6">
          <div>
            <p className="flex items-center gap-2 font-display font-bold text-lg">
              <span aria-hidden="true" className="size-3 rounded-sm bg-accent" />
              Loop
            </p>
            <p className="mt-1 text-sm text-muted-fg">Made by a 6-person team in 4 time zones.</p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-8 text-sm sm:grid-cols-4">
              {["Changelog", "Security", "Help center", "Status", "Privacy", "Terms", "Careers", "Contact"].map(
                (label) => (
                  <li key={label}>
                    <a
                      href={`/${label.toLowerCase().replace(" ", "-")}`}
                      className={`flex min-h-11 items-center rounded-sm text-muted-fg transition-colors ease-standard hover:text-fg md:min-h-8 ${focus}`}
                    >
                      {label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <p className="flex items-center gap-2 text-sm text-muted-fg">
            <span aria-hidden="true" className="size-2 rounded-full bg-neutral-400" />
            All systems normal
          </p>
        </div>
      </footer>
    </main>
  );
}
