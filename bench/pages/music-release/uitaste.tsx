// Preset: brutal. Signature moves: the album cover as the one orange flood with the hard
// shadow, oversized hand-broken uppercase display, tape labels on slab edges, drawn 3px
// edges with shared dividers, and an asymmetric 7/5 then 8/4 stack with dropped minor slabs.

const FOCUS = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-fg";
const TAPE = "inline-block bg-fg text-bg font-mono font-bold uppercase text-sm px-2 py-0.5";
const PRESS =
  "transition ease-standard hover:translate-x-1 hover:translate-y-1 hover:shadow-none motion-reduce:transition-none";

const TRACKS = [
  { n: "01", title: "Ferry at 6:10", length: "3:42" },
  { n: "02", title: "Low Tide Radio", length: "4:18" },
  { n: "03", title: "Concrete Gulls", length: "2:57" },
  { n: "04", title: "Everyone I Know Is Moving", length: "5:03" },
  { n: "05", title: "Salt in the Amp", length: "3:21" },
  { n: "06", title: "Night Bus (Northbound)", length: "4:46" },
  { n: "07", title: "Breakwater", length: "3:09" },
  { n: "08", title: "Kitchen Light", length: "6:12" },
];

const SHOWS = [
  { date: "Nov 14", city: "Glasgow", venue: "Mono", status: "on-sale" },
  { date: "Nov 15", city: "Manchester", venue: "YES (Pink Room)", status: "on-sale" },
  { date: "Nov 17", city: "London", venue: "The Lexington", status: "sold-out" },
  { date: "Nov 19", city: "Brighton", venue: "The Hope & Ruin", status: "on-sale" },
  { date: "Nov 22", city: "Amsterdam", venue: "Paradiso Noord", status: "few-left" },
  { date: "Nov 23", city: "Hamburg", venue: "Molotow", status: "on-sale" },
] as const;

const STATUS_LABEL = {
  "on-sale": "Tickets",
  "few-left": "Last 30",
  "sold-out": "Sold out",
} as const;

export default function Page() {
  return (
    <main className="bg-bg text-fg font-body overflow-x-hidden">
      <header className="border-b-3 border-fg">
        <nav aria-label="Primary" className="flex flex-col md:flex-row">
          <a
            href="/"
            className={`flex items-center min-h-12 px-4 md:px-8 border-b-3 md:border-b-0 md:border-r-3 border-fg font-display uppercase text-lg ${FOCUS}`}
          >
            Harbour Static
          </a>
          <ul className="flex md:ml-auto divide-x-3 divide-fg md:border-l-3 border-fg">
            <li className="flex-1 md:flex-none">
              <a
                href="#record"
                aria-current="page"
                className={`flex items-center justify-center min-h-12 px-4 md:px-6 bg-fg text-bg font-mono font-bold uppercase text-sm ${FOCUS}`}
              >
                Record
              </a>
            </li>
            <li className="flex-1 md:flex-none">
              <a
                href="#tour"
                className={`flex items-center justify-center min-h-12 px-4 md:px-6 font-mono font-bold uppercase text-sm hover:bg-muted transition ease-standard ${FOCUS}`}
              >
                Tour
              </a>
            </li>
            <li className="flex-1 md:flex-none">
              <a
                href="#list"
                className={`flex items-center justify-center min-h-12 px-4 md:px-6 font-mono font-bold uppercase text-sm hover:bg-muted transition ease-standard ${FOCUS}`}
              >
                List
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero: title 7 | cover 5, cover is the orange flood and the focal shadow */}
      <section
        id="record"
        aria-labelledby="album-title"
        className="grid grid-cols-12 gap-x-8 gap-y-12 px-4 md:px-8 pt-12 md:pt-20 pb-12 md:pb-20"
      >
        <div className="col-span-12 md:col-span-7">
          <p className={TAPE}>New album / Out Nov 7</p>
          <h1 id="album-title" className="mt-6 font-display uppercase text-xl md:text-3xl xl:text-4xl leading-none">
            <span className="block">Low</span>
            <span className="block">Tide</span>
            <span className="block">Radio</span>
          </h1>
          <p className="mt-8 max-w-prose text-base">
            The second record from Harbour Static. Eight songs written in a rented flat above a
            ferry terminal in Leith and tracked live in four days, amps in the hallway.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#preorder"
              className={`inline-flex items-center min-h-12 px-6 border-3 border-fg bg-fg text-bg font-bold shadow-md ${PRESS} ${FOCUS}`}
            >
              Pre-order the LP, £24
            </a>
            <a
              href="#listen"
              className={`inline-flex items-center min-h-12 px-1 font-bold underline decoration-3 underline-offset-4 hover:bg-fg hover:text-bg transition ease-standard ${FOCUS}`}
            >
              Stream the single
            </a>
          </div>
        </div>

        <figure className="col-span-12 md:col-span-5 md:mt-12 self-start">
          <div
            role="img"
            aria-label="Album cover placeholder for Low Tide Radio"
            className="aspect-square border-3 border-fg bg-accent text-accent-fg shadow-lg grid grid-rows-[1fr_auto]"
          >
            <svg
              viewBox="0 0 120 120"
              className="w-full h-full p-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              aria-hidden="true"
            >
              <path d="M0 70 Q15 60 30 70 T60 70 T90 70 T120 70" />
              <path d="M0 84 Q15 74 30 84 T60 84 T90 84 T120 84" />
              <path d="M0 98 Q15 88 30 98 T60 98 T90 98 T120 98" />
              <circle cx="84" cy="36" r="16" />
            </svg>
            <div className="border-t-3 border-fg px-4 py-3 flex items-baseline justify-between gap-4">
              <span className="font-display uppercase text-base leading-none">Harbour Static</span>
              <span className="font-mono text-base">HS-002</span>
            </div>
          </div>
          <figcaption className="mt-4 font-mono text-base">Cover art by Isla Moir. 12" black vinyl, 180g.</figcaption>
        </figure>
      </section>

      {/* Tracklist 8 | credits 4 dropped */}
      <section aria-labelledby="tracks-title" className="border-t-3 border-fg px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 lg:col-span-8 relative border-3 border-fg">
            <h2
              id="tracks-title"
              className="absolute -top-4 left-4 bg-fg text-bg font-mono font-bold uppercase text-sm px-2 py-0.5"
            >
              Tracklist / 33:28
            </h2>
            <ol className="divide-y divide-fg pt-4">
              {TRACKS.map((t) => (
                <li key={t.n} className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 px-4 md:px-6 py-3">
                  <span className="font-mono text-base tabular-nums">{t.n}</span>
                  <span className="text-base font-bold">{t.title}</span>
                  <span className="font-mono text-base tabular-nums text-right">{t.length}</span>
                </li>
              ))}
            </ol>
          </div>
          <aside className="col-span-12 lg:col-span-4 lg:mt-12 border-3 border-fg bg-fg text-bg divide-y-3 divide-bg">
            <div className="p-6">
              <p className="font-mono uppercase text-sm">Formats</p>
              <p className="mt-2 text-base">LP, cassette and digital. Signed LPs while 300 last.</p>
            </div>
            <div className="p-6">
              <p className="font-mono uppercase text-sm">Recorded</p>
              <p className="mt-2 text-base">Gorgie Sound, Edinburgh, March 2026. Produced by Ruth Kallas.</p>
            </div>
          </aside>
        </div>
      </section>

      {/* Tour: full-width table */}
      <section id="tour" aria-labelledby="tour-title" className="border-t-3 border-fg bg-muted px-4 md:px-8 py-12 md:py-20">
        <p className={TAPE}>On the road</p>
        <h2 id="tour-title" className="mt-6 font-display uppercase text-xl md:text-2xl leading-none">
          <span className="block">Six nights,</span>
          <span className="block">four countries.</span>
        </h2>
        <div className="mt-12 border-3 border-fg bg-bg">
          <ul className="divide-y-3 divide-fg">
            {SHOWS.map((s) => (
              <li key={s.date} className="grid grid-cols-12 items-center gap-x-4 gap-y-2 px-4 md:px-6 py-4">
                <p className="col-span-4 md:col-span-2 font-mono text-base font-bold uppercase">{s.date}</p>
                <p className="col-span-8 md:col-span-3 font-display uppercase text-base leading-tight">{s.city}</p>
                <p className="col-span-12 md:col-span-4 text-base">{s.venue}</p>
                <div className="col-span-12 md:col-span-3 md:justify-self-end">
                  {s.status === "sold-out" ? (
                    <span className="inline-flex items-center min-h-12 px-4 font-mono font-bold uppercase text-sm line-through">
                      {STATUS_LABEL[s.status]}
                    </span>
                  ) : (
                    <a
                      href={`/tickets/${s.city.toLowerCase()}`}
                      className={`inline-flex items-center justify-center min-h-12 px-6 border-3 border-fg font-bold hover:bg-fg hover:text-bg transition ease-standard ${FOCUS}`}
                    >
                      {STATUS_LABEL[s.status]}
                      <span className="sr-only">
                        {" "}
                        for {s.city}, {s.date}
                      </span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mailing list: 5 | 7 form slab */}
      <section id="list" aria-labelledby="list-title" className="border-t-3 border-fg px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 md:col-span-5">
            <p className={TAPE}>Mailing list</p>
            <h2 id="list-title" className="mt-6 font-display uppercase text-xl md:text-2xl leading-none">
              <span className="block">Hear it</span>
              <span className="block">first.</span>
            </h2>
            <p className="mt-6 max-w-prose text-base">
              One email per month at most: new dates before they go public, demos, and the odd
              photo from the van. 4,100 people are on it.
            </p>
          </div>
          <form
            className="col-span-12 md:col-span-6 md:col-start-7 md:mt-12 border-3 border-fg p-6 md:p-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="email" className="block font-mono uppercase text-sm font-bold">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-2 w-full min-h-12 border-3 border-fg bg-bg px-3 text-base rounded-none placeholder-muted-fg focus:outline-none focus:shadow-md transition ease-standard"
            />
            <label htmlFor="city" className="mt-6 block font-mono uppercase text-sm font-bold">
              Nearest city
            </label>
            <input
              id="city"
              type="text"
              autoComplete="address-level2"
              placeholder="So we only email about shows near you"
              className="mt-2 w-full min-h-12 border-3 border-fg bg-bg px-3 text-base rounded-none placeholder-muted-fg focus:outline-none focus:shadow-md transition ease-standard"
            />
            <button
              type="submit"
              className={`mt-8 inline-flex items-center min-h-12 px-6 border-3 border-fg bg-accent text-accent-fg font-bold shadow-md ${PRESS} ${FOCUS}`}
            >
              Join the list
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t-3 border-fg bg-fg text-bg px-4 md:px-8 py-8 flex flex-col md:flex-row gap-4 md:justify-between">
        <p className="font-display uppercase text-lg">Harbour Static</p>
        <p className="font-mono text-base">Released on Gull Records / GULL-031</p>
      </footer>
    </main>
  );
}
