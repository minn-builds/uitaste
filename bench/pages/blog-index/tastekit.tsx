// Preset: editorial. Signature moves: asymmetric 3/9 and 8/4 spreads with a margin column,
// hairline rules as structure, light display type with one italic phrase, mono folio lines,
// a drop-capped standfirst, and oversized numerals as list markers.

const FOCUS =
  "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const FOLIO = "font-mono text-xs uppercase tracking-widest text-muted-fg";

const SECTIONS = [
  { label: "Latest", href: "#latest", current: true },
  { label: "Transit", href: "#topic-transit", current: false },
  { label: "Housing", href: "#topic-housing", current: false },
  { label: "Archive", href: "#archive", current: false },
];

const POSTS = [
  {
    no: "142",
    title: "Why Barcelona's superblocks took a decade to feel inevitable",
    dek: "Nine streets, three mayors and one very stubborn traffic engineer.",
    author: "Ines Okafor",
    date: "Oct 24, 2026",
    read: "14 min",
    topic: "Streets",
  },
  {
    no: "141",
    title: "The parking minimum is dead. Now what fills the lot?",
    dek: "Buffalo dropped its requirements in 2017. We walked every parcel that changed.",
    author: "Tomas Reyes",
    date: "Oct 17, 2026",
    read: "11 min",
    topic: "Housing",
  },
  {
    no: "140",
    title: "A bus stop is a front porch for people without one",
    dek: "Shade, a bench and a schedule you can trust do more than a new line.",
    author: "Priya Natarajan",
    date: "Oct 10, 2026",
    read: "7 min",
    topic: "Transit",
  },
  {
    no: "139",
    title: "Counting trees in Phoenix, one heat map at a time",
    dek: "The city's canopy plan, and the neighborhoods it keeps missing.",
    author: "Ines Okafor",
    date: "Oct 3, 2026",
    read: "9 min",
    topic: "Climate",
  },
  {
    no: "138",
    title: "Letter from Lyon: the tram that redrew a suburb",
    dek: "T6 opened with little fanfare. Rents along it did not stay quiet.",
    author: "Camille Durand",
    date: "Sep 26, 2026",
    read: "12 min",
    topic: "Transit",
  },
];

const TOPICS = [
  { name: "Streets", count: 38 },
  { name: "Housing", count: 51 },
  { name: "Transit", count: 44 },
  { name: "Zoning", count: 29 },
  { name: "Climate", count: 22 },
  { name: "Public space", count: 17 },
];

export default function Page() {
  return (
    <main className="bg-bg text-fg font-body">
      <div className="mx-auto max-w-320 px-6 md:px-12">
        {/* Masthead */}
        <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-border pt-8 pb-2">
          <a href="/" className={`font-display text-2xl ${FOCUS}`}>
            The Long Block
          </a>
          <nav aria-label="Sections">
            <ul className="flex flex-wrap gap-x-6 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    aria-current={s.current ? "page" : undefined}
                    className={
                      s.current
                        ? `inline-flex min-h-11 items-center text-fg underline decoration-fg decoration-1 underline-offset-4 ${FOCUS}`
                        : `inline-flex min-h-11 items-center text-muted-fg hover:text-fg transition-colors ease-standard ${FOCUS}`
                    }
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {/* Featured: 3/9 spread */}
        <article aria-labelledby="featured" className="pt-12 pb-16 md:pt-16 md:pb-24">
          <p className={FOLIO}>No. 143 &middot; Featured &middot; 22 min read</p>
          <div className="mt-4 grid grid-cols-1 gap-x-12 gap-y-8 border-t-2 border-fg pt-8 md:grid-cols-12">
            <aside className="flex flex-col gap-2 md:col-span-3 md:pt-3">
              <p className={FOLIO}>Zoning</p>
              <p className="text-sm text-muted-fg">
                Words by <span className="text-fg">Marguerite Ellis</span>
                <br />
                Published Oct 30, 2026
              </p>
            </aside>
            <div className="md:col-span-9">
              <h1
                id="featured"
                className="font-display font-light text-3xl break-words hyphens-auto sm:text-4xl md:text-5xl"
              >
                The quiet return of the <em className="italic">corner shop</em>
              </h1>
              <p className="mt-6 max-w-160 font-display italic text-xl text-muted-fg">
                For seventy years, most American cities made it illegal to sell milk on a
                residential block. A few are now changing one line of code to bring it back.
              </p>
            </div>
            <div className="md:col-span-7 md:col-start-4">
              <p className="max-w-160 text-base first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-5xl first-letter:text-accent">
                On Alberta Street in Portland, a former dentist's office now sells bread, bulbs and
                bus passes. It took the owner fourteen months and a variance hearing. Under the
                city's new rules, the next one will take a permit and a week.
              </p>
              <a
                href="/2026/10/corner-shop"
                className={`mt-8 inline-flex min-h-11 items-center bg-fg px-6 text-sm font-semibold text-bg hover:bg-fg/80 transition-colors ease-standard ${FOCUS}`}
              >
                Read the essay
              </a>
            </div>
          </div>
        </article>

        {/* Recent posts (8) + topics margin (4) */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-16 border-t-2 border-fg pt-8 pb-16 md:grid-cols-12 md:pb-24">
          <section id="latest" aria-labelledby="recent" className="md:col-span-8">
            <p className={FOLIO}>Recent dispatches</p>
            <h2 id="recent" className="mt-2 font-display font-light text-2xl md:text-3xl">
              From the last five weeks
            </h2>
            <ol className="mt-8 divide-y divide-border border-t border-border">
              {POSTS.map((post) => (
                <li key={post.no} className="grid grid-cols-12 gap-x-6 py-6">
                  <p
                    aria-hidden="true"
                    className="col-span-3 font-display font-light text-3xl text-muted-fg tabular-nums md:col-span-2 md:text-4xl"
                  >
                    {post.no}
                  </p>
                  <div className="col-span-9 md:col-span-10">
                    <h3 className="font-display text-xl">
                      <a
                        href={`/posts/${post.no}`}
                        className={`underline decoration-1 decoration-transparent underline-offset-4 hover:decoration-fg transition-colors ease-standard ${FOCUS}`}
                      >
                        {post.title}
                      </a>
                    </h3>
                    <p className="mt-2 max-w-160 italic text-base text-muted-fg">{post.dek}</p>
                    <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-fg">
                      <span className="text-fg">{post.author}</span> &middot;{" "}
                      <time>{post.date}</time> &middot; {post.read}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <a
              href="#archive"
              className={`mt-6 inline-flex min-h-11 items-center text-sm underline decoration-1 underline-offset-4 hover:decoration-accent transition-colors ease-standard ${FOCUS}`}
            >
              All 143 issues in the archive <span aria-hidden="true">&nbsp;&rarr;</span>
            </a>
          </section>

          <aside aria-labelledby="topics" className="md:col-span-4 md:pt-2">
            <p className={FOLIO}>Index</p>
            <h2 id="topics" className="mt-2 font-display text-xl">
              Topics
            </h2>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {TOPICS.map((t) => (
                <li key={t.name}>
                  <a
                    href={`#topic-${t.name.toLowerCase().replace(" ", "-")}`}
                    className={`flex min-h-11 items-baseline justify-between gap-4 py-2 text-base hover:text-muted-fg transition-colors ease-standard ${FOCUS}`}
                  >
                    <span>{t.name}</span>
                    <span className="font-mono text-sm text-muted-fg tabular-nums">{t.count}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm italic text-muted-fg">
              Counts are essays and field notes published since 2023.
            </p>
          </aside>
        </div>

        {/* Subscribe: oversized numeral margin + form, 4/7 offset */}
        <section aria-labelledby="subscribe" className="border-t border-border py-16 md:py-24">
          <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className={FOLIO}>Every Thursday</p>
              <p className="mt-4 font-display font-light text-5xl tabular-nums">11,800</p>
              <p className="mt-2 text-sm text-muted-fg">
                planners, councillors and curious neighbors read it.
              </p>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <h2 id="subscribe" className="font-display font-light text-2xl md:text-3xl">
                One long read a week, <em className="italic">no shouting</em>
              </h2>
              <form className="mt-8 max-w-120" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="email" className="block font-mono text-xs uppercase tracking-widest text-muted-fg">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@city.gov"
                  className="mt-2 w-full border-0 border-b border-fg bg-transparent rounded-none px-0 py-2 text-base placeholder-muted-fg focus:outline-none focus:border-accent transition-colors ease-standard"
                />
                <p className="mt-2 text-sm italic text-muted-fg">
                  Free. Unsubscribe from any issue in one click.
                </p>
                <button
                  type="submit"
                  className={`mt-6 inline-flex min-h-11 items-center bg-fg px-6 text-sm font-semibold text-bg hover:bg-fg/80 transition-colors ease-standard ${FOCUS}`}
                >
                  Subscribe to The Long Block
                </button>
              </form>
            </div>
          </div>
        </section>

        <footer className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-border py-6 text-sm text-muted-fg">
          <p className="font-display text-base text-fg">The Long Block</p>
          <p>Independent, reader funded, published from Detroit since 2023.</p>
        </footer>
      </div>
    </main>
  );
}
