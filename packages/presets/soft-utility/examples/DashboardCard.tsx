type JobStatus = "running" | "succeeded" | "failed" | "queued";

const STATUS: Record<JobStatus, { label: string; dot: string }> = {
  running: { label: "Running", dot: "size-2 shrink-0 rounded-full bg-accent" },
  succeeded: { label: "Succeeded", dot: "size-2 shrink-0 rounded-full bg-neutral-400" },
  failed: { label: "Failed", dot: "size-2 shrink-0 rounded-full bg-destructive" },
  queued: { label: "Queued", dot: "size-2 shrink-0 rounded-full border border-neutral-400" },
};

const RANGES = [
  { id: "24h", label: "24h", checked: true },
  { id: "7d", label: "7 days", checked: false },
  { id: "30d", label: "30 days", checked: false },
];

const STATS = [
  { term: "Runs", value: "12,480", note: "+4.1% vs yesterday" },
  { term: "Failed", value: "37", note: "0.3% of runs" },
  { term: "p95 duration", value: "1.8 s", note: "Target 3 s" },
];

const JOBS: { id: string; source: string; status: JobStatus; duration: string; started: string }[] =
  [
    {
      id: "sync_8f21",
      source: "Stripe → Warehouse",
      status: "running",
      duration: "0:42",
      started: "09:41",
    },
    {
      id: "sync_8f1e",
      source: "HubSpot → Warehouse",
      status: "succeeded",
      duration: "1:06",
      started: "09:30",
    },
    {
      id: "sync_8f1a",
      source: "Postgres → Search",
      status: "failed",
      duration: "0:12",
      started: "09:22",
    },
    {
      id: "sync_8f17",
      source: "Stripe → Warehouse",
      status: "succeeded",
      duration: "0:58",
      started: "09:00",
    },
    {
      id: "sync_8f15",
      source: "Zendesk → Warehouse",
      status: "queued",
      duration: "–",
      started: "–",
    },
  ];

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export default function DashboardCard() {
  return (
    <section className="bg-muted font-body text-fg">
      <div className="mx-auto max-w-300 px-4 py-10 md:px-6 md:py-16">
        <article
          aria-labelledby="jobs-title"
          className="overflow-hidden rounded-md border border-border bg-bg"
        >
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <h3 id="jobs-title" className="font-display font-medium text-lg">
                Sync jobs
              </h3>
              <p className="flex items-center gap-2 text-sm text-muted-fg">
                <span aria-hidden="true" className="size-2 rounded-full bg-neutral-400" />
                All connectors healthy
              </p>
            </div>
            <fieldset className="inline-flex rounded-sm border border-border bg-muted p-0.5">
              <legend className="sr-only">Time range</legend>
              {RANGES.map((range) => (
                <label
                  key={range.id}
                  className="relative flex min-h-11 cursor-pointer items-center rounded-sm px-3 text-sm text-muted-fg has-checked:bg-bg has-checked:font-semibold has-checked:text-fg has-focus-visible:outline-2 has-focus-visible:outline-ring transition-colors ease-standard md:min-h-8"
                >
                  <input
                    type="radio"
                    name="jobs-range"
                    value={range.id}
                    defaultChecked={range.checked}
                    className="sr-only"
                  />
                  {range.label}
                </label>
              ))}
            </fieldset>
          </header>

          <dl className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-y-0 sm:divide-x border-b border-border">
            {STATS.map((stat) => (
              <div key={stat.term} className="px-4 py-3">
                <dt className="text-sm text-muted-fg">{stat.term}</dt>
                <dd className="mt-1 font-display font-medium text-xl tabular-nums md:text-2xl">
                  {stat.value}
                </dd>
                <dd className="text-sm text-muted-fg">{stat.note}</dd>
              </div>
            ))}
          </dl>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Five most recent sync jobs</caption>
              <thead>
                <tr className="border-b border-border bg-muted text-sm text-muted-fg">
                  <th scope="col" className="py-2 pl-4 font-normal">
                    Job
                  </th>
                  <th scope="col" className="hidden py-2 pl-3 font-normal sm:table-cell">
                    Source
                  </th>
                  <th scope="col" className="py-2 pl-3 font-normal">
                    Status
                  </th>
                  <th scope="col" className="py-2 pl-3 pr-4 text-right font-normal md:pr-0">
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="hidden py-2 pr-4 pl-3 text-right font-normal md:table-cell"
                  >
                    Started
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {JOBS.map((job) => (
                  <tr key={job.id}>
                    <td className="py-2 pl-4 font-mono text-sm">{job.id}</td>
                    <td className="hidden py-2 pl-3 text-base sm:table-cell">{job.source}</td>
                    <td className="py-2 pl-3">
                      <span
                        className={
                          job.status === "failed"
                            ? "flex items-center gap-2 text-sm font-semibold text-destructive"
                            : "flex items-center gap-2 text-sm"
                        }
                      >
                        <span aria-hidden="true" className={STATUS[job.status].dot} />
                        {STATUS[job.status].label}
                      </span>
                    </td>
                    <td className="py-2 pl-3 pr-4 text-right text-base tabular-nums md:pr-0">
                      {job.duration}
                    </td>
                    <td className="hidden py-2 pr-4 pl-3 text-right text-base text-muted-fg tabular-nums md:table-cell">
                      {job.started}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted px-4 py-2">
            <p className="text-sm text-muted-fg">Updated 2 minutes ago</p>
            <a
              href="/jobs"
              className={`inline-flex min-h-11 items-center gap-2 rounded-sm px-2 text-sm font-semibold hover:bg-bg transition-colors ease-standard md:min-h-8 ${focus}`}
            >
              View all jobs
              <kbd className="rounded-sm border border-border bg-bg px-1.5 font-mono text-sm font-normal text-muted-fg">
                G J
              </kbd>
            </a>
          </footer>
        </article>
      </div>
    </section>
  );
}
