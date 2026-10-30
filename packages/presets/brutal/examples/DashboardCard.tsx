const FOCUS = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-fg";

const DAYS = [
  { day: "Mon", value: "31", column: "h-24 bg-fg", today: false },
  { day: "Tue", value: "38", column: "h-28 bg-fg", today: false },
  { day: "Wed", value: "52", column: "h-40 bg-fg", today: false },
  { day: "Thu", value: "44", column: "h-32 bg-fg", today: false },
  { day: "Fri", value: "27", column: "h-20 bg-accent", today: true },
];

export default function DashboardCard() {
  return (
    <section
      aria-label="Deploy activity"
      className="bg-bg text-fg font-body px-4 md:px-8 py-12 md:py-20 border-t-3 border-fg"
    >
      <div className="grid grid-cols-12 gap-x-8 gap-y-10">
        <article
          aria-labelledby="deploys-title"
          className="relative col-span-12 md:col-span-7 border-3 border-fg bg-bg shadow-lg"
        >
          <p className="absolute -top-3 left-4 bg-fg text-bg font-mono font-bold uppercase text-sm px-2 py-0.5">
            Week 44
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y-3 lg:divide-y-0 lg:divide-x-3 divide-fg">
            <header className="lg:col-span-5 px-6 pt-8 pb-6">
              <h3 id="deploys-title" className="font-display uppercase text-lg leading-none">
                Deploys shipped
              </h3>
              <p className="mt-6 font-display text-3xl leading-none">214</p>
              <p className="mt-4 font-mono text-base">+18% vs week 43</p>
              <p className="mt-2 text-base">Friday is still running.</p>
            </header>

            <figure className="lg:col-span-7 px-6 pt-8 pb-4">
              <figcaption className="sr-only">
                Deploys per weekday, week 44. Friday is today and partial.
              </figcaption>
              <ol className="flex items-end h-56 border-b-3 border-fg">
                {DAYS.map((d) => (
                  <li key={d.day} className="flex flex-1 flex-col items-center justify-end">
                    <span className="font-mono font-bold text-base">
                      <span className="sr-only">{d.day}: </span>
                      {d.value}
                      {d.today ? <span className="sr-only"> so far (today)</span> : null}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`mt-2 w-8/12 border-3 border-b-0 border-fg ${d.column}`}
                    />
                  </li>
                ))}
              </ol>
              <ol aria-hidden="true" className="flex pt-2">
                {DAYS.map((d) => (
                  <li
                    key={d.day}
                    className={
                      d.today
                        ? "flex-1 text-center font-mono font-bold uppercase text-base"
                        : "flex-1 text-center font-mono uppercase text-base"
                    }
                  >
                    {d.day}
                  </li>
                ))}
              </ol>
            </figure>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-4 border-t-3 border-fg px-6 py-3">
            <a
              href="/deploys"
              className={`inline-flex items-center min-h-12 px-1 font-bold underline decoration-3 underline-offset-4 hover:bg-fg hover:text-bg transition ease-standard ${FOCUS}`}
            >
              Open deploy log
            </a>
            <p className="font-mono uppercase text-sm text-muted-fg">Updated 09:42 UTC</p>
          </footer>
        </article>

        <aside
          aria-labelledby="failures-title"
          className="col-span-12 md:col-span-5 md:mt-16 self-start border-3 border-fg bg-fg text-bg p-6"
        >
          <h3 id="failures-title" className="font-mono font-bold uppercase text-sm">
            Failed this week
          </h3>
          <p className="mt-4 font-display text-xl leading-none">2</p>
          <p className="mt-4 max-w-prose text-base">
            Both rolled back automatically, the slower one in 41s. No one was paged.
          </p>
        </aside>
      </div>
    </section>
  );
}
