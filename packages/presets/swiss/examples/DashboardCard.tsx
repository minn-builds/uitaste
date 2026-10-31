const ROWS = [
  { day: "Mon", value: "1,204", bar: "h-1 w-7/12 bg-fg", peak: false },
  { day: "Tue", value: "1,388", bar: "h-1 w-8/12 bg-fg", peak: false },
  { day: "Wed", value: "2,061", bar: "h-1 w-full bg-accent", peak: true },
  { day: "Thu", value: "1,512", bar: "h-1 w-9/12 bg-fg", peak: false },
  { day: "Fri", value: "986", bar: "h-1 w-5/12 bg-fg", peak: false },
];

export default function DashboardCard() {
  return (
    <section className="bg-bg px-3 md:px-6 pt-8 md:pt-12 pb-8 md:pb-12">
      <article
        aria-labelledby="throughput-title"
        className="bg-bg text-fg font-body border-t-4 border-fg pt-2 pb-3"
      >
        <header className="grid grid-cols-12 gap-x-3 items-baseline">
          <p className="col-span-12 md:col-span-2 font-mono text-sm text-muted-fg">03 / Usage</p>
          <h3
            id="throughput-title"
            className="col-span-8 md:col-span-7 font-display font-bold text-base"
          >
            Rendered frames
          </h3>
          <p className="col-span-4 md:col-span-3 text-right text-sm text-muted-fg">This week</p>
        </header>

        <div className="grid grid-cols-12 gap-x-3 pt-3">
          <p className="col-span-12 md:col-start-3 md:col-span-10 font-mono text-2xl md:text-3xl">
            7,151
          </p>
          <p className="col-span-12 md:col-start-3 md:col-span-10 text-sm text-muted-fg">
            <span className="font-mono text-fg">+12.4%</span> against last week. Peak on Wednesday.
          </p>
        </div>

        <table className="mt-4 w-full border-collapse text-left">
          <caption className="sr-only">Rendered frames per day, this week</caption>
          <thead>
            <tr className="border-b border-fg">
              <th scope="col" className="w-2/12 py-1 text-sm font-medium text-muted-fg">
                Day
              </th>
              <th scope="col" className="py-1 text-sm font-medium text-muted-fg">
                <span className="sr-only">Share of peak</span>
              </th>
              <th scope="col" className="w-3/12 py-1 text-right text-sm font-medium text-muted-fg">
                Frames
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ROWS.map((row) => (
              <tr key={row.day}>
                <th scope="row" className="py-1.5 text-sm font-medium">
                  {row.day}
                </th>
                <td className="py-1.5 pr-3" aria-hidden="true">
                  <div className={row.bar} />
                </td>
                <td className="py-1.5 text-right font-mono text-sm">
                  {row.value}
                  {row.peak ? <span className="sr-only"> (peak)</span> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="pt-2">
          <a
            href="/reports/frames"
            className="inline-flex items-center min-h-6 text-sm font-medium underline underline-offset-4 decoration-2 hover:text-accent transition-colors ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Open full report
          </a>
        </p>
      </article>
    </section>
  );
}
