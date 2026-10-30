/**
 * Editorial dashboard block: no card surface. Opens with a heavy rule and a
 * mono label, leads with an oversized light numeral, then a ruled table.
 */
const stories = [
  { title: "The last cartographers of the North Sea coast", reads: "18,240", change: "+12%" },
  { title: "A field guide to municipal benches", reads: "9,415", change: "+4%" },
  { title: "Notes from a night ferry", reads: "6,032", change: "-3%" },
  { title: "Letters: on keeping bees in the city", reads: "2,187", change: "+1%" },
] as const;

export default function DashboardCard() {
  return (
    <section aria-labelledby="readership-title" className="bg-bg py-24 text-fg font-body">
      <div className="mx-auto max-w-320 px-6 md:px-12">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 border-t-2 border-fg pt-6 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">
              Readership &middot; week 43
            </p>
            <h2 id="readership-title" className="mt-3 font-display text-2xl">
              Readers this week
            </h2>
            <p className="mt-6 font-display font-light text-5xl tabular-nums">35,874</p>
            <p className="mt-2 text-sm text-muted-fg">
              <span className="font-mono text-accent">+8.4%</span> on last week, driven by the cover
              story.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 border-t border-border pt-4 text-sm">
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted-fg">
                  Avg. read time
                </dt>
                <dd className="mt-1 font-display text-xl tabular-nums">11 min</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted-fg">
                  Finished
                </dt>
                <dd className="mt-1 font-display text-xl tabular-nums">62%</dd>
              </div>
            </dl>
          </div>

          <div className="md:col-span-9">
            <table className="w-full border-collapse text-left">
              <caption className="pb-4 text-left font-display italic text-lg text-muted-fg">
                Most read stories, last seven days
              </caption>
              <thead>
                <tr className="border-b border-fg">
                  <th
                    scope="col"
                    className="py-2 pr-4 font-mono text-xs font-normal uppercase tracking-widest text-muted-fg"
                  >
                    Story
                  </th>
                  <th
                    scope="col"
                    className="py-2 pr-4 text-right font-mono text-xs font-normal uppercase tracking-widest text-muted-fg"
                  >
                    Reads
                  </th>
                  <th
                    scope="col"
                    className="py-2 text-right font-mono text-xs font-normal uppercase tracking-widest text-muted-fg"
                  >
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stories.map((story) => (
                  <tr key={story.title}>
                    <th scope="row" className="py-4 pr-4 text-base font-normal">
                      <a
                        href="/stories"
                        className="underline decoration-border decoration-1 underline-offset-4 transition-colors ease-standard hover:decoration-accent rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        {story.title}
                      </a>
                    </th>
                    <td className="py-4 pr-4 text-right font-mono text-sm tabular-nums">
                      {story.reads}
                    </td>
                    <td className="py-4 text-right font-mono text-sm tabular-nums text-muted-fg">
                      {story.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
