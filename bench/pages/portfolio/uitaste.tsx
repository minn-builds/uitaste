// Preset: editorial. Signature moves: asymmetric 3/9 and 8/4 spreads (1), hairline rules as
// structure (2), light large display type with one italic phrase (3), mono folio lines (4),
// drop cap and italic deck (5), oversized numerals as markers (6).

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const PROJECTS: {
  n: string;
  title: string;
  place: string;
  year: string;
  note: string;
  span: string;
  aspect: string;
  tone: string;
}[] = [
  {
    n: "01",
    title: "Salt Year",
    place: "Læsø, Denmark",
    year: "2025",
    note: "Twelve months with the last salt boilers on a Kattegat island.",
    span: "md:col-span-8",
    aspect: "aspect-[3/2]",
    tone: "bg-neutral-300",
  },
  {
    n: "02",
    title: "Night Ferry",
    place: "Bergen to Hirtshals",
    year: "2024",
    note: "Crew portraits on the 22:00 crossing.",
    span: "md:col-span-4 md:mt-24",
    aspect: "aspect-[4/5]",
    tone: "bg-neutral-700",
  },
  {
    n: "03",
    title: "The Orchard Ledger",
    place: "Hardanger, Norway",
    year: "2024",
    note: "Cider farmers and their handwritten harvest books.",
    span: "md:col-span-5",
    aspect: "aspect-[4/5]",
    tone: "bg-neutral-200",
  },
  {
    n: "04",
    title: "Concrete Psalms",
    place: "Brutalist churches of the Ruhr",
    year: "2023",
    note: "Commissioned by Baukultur Quarterly.",
    span: "md:col-span-7 md:mt-16",
    aspect: "aspect-[16/10]",
    tone: "bg-neutral-500",
  },
  {
    n: "05",
    title: "Low Water",
    place: "Wadden Sea",
    year: "2022",
    note: "Mudflat walkers at the lowest tides of the year.",
    span: "md:col-span-6",
    aspect: "aspect-[3/2]",
    tone: "bg-neutral-400",
  },
  {
    n: "06",
    title: "Fitters",
    place: "Gdańsk shipyard",
    year: "2021",
    note: "Hands, tools and the last wooden hull in the yard.",
    span: "md:col-span-4 md:col-start-9 md:mt-32",
    aspect: "aspect-square",
    tone: "bg-neutral-800",
  },
];

const CLIENTS = [
  { term: "Editorial", value: "Monocle, Die Zeit Magazin, The Gentlewoman" },
  { term: "Commercial", value: "Hay, Norrøna, Vipp" },
  { term: "Exhibited", value: "Fotografiska Oslo, 2024; Kunsthal Charlottenborg, 2022" },
  { term: "Based in", value: "Copenhagen, working across Northern Europe" },
];

export default function Page() {
  return (
    <main className="min-h-dvh bg-bg font-body text-base text-fg">
      <div className="mx-auto max-w-320 px-6 md:px-12">
        <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-border pt-8 pb-4">
          <a href="/" className={`rounded-sm font-display text-2xl ${focus}`}>
            Maren Holt
          </a>
          <nav aria-label="Sections">
            <ul className="flex flex-wrap gap-x-6 text-sm">
              <li>
                <a
                  href="#work"
                  aria-current="page"
                  className={`inline-flex min-h-11 items-center rounded-sm underline decoration-fg decoration-1 underline-offset-4 ${focus}`}
                >
                  Work
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className={`inline-flex min-h-11 items-center rounded-sm text-muted-fg transition-colors ease-standard hover:text-fg ${focus}`}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className={`inline-flex min-h-11 items-center rounded-sm text-muted-fg transition-colors ease-standard hover:text-fg ${focus}`}
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </header>

        <section aria-labelledby="intro-title" className="pt-16 pb-24">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">
            Photographer &middot; Copenhagen &middot; Available from January 2027
          </p>
          <div className="mt-4 grid grid-cols-1 gap-x-12 gap-y-8 border-t-2 border-fg pt-8 md:grid-cols-12">
            <aside className="flex flex-col gap-2 md:col-span-3 md:pt-4">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">
                Documentary &amp; portrait
              </p>
              <p className="text-sm text-muted-fg">
                Commissions for magazines, makers and the people who build things by hand.
              </p>
            </aside>
            <div className="md:col-span-9">
              <h1
                id="intro-title"
                className="break-words font-display font-light text-3xl hyphens-auto sm:text-4xl md:text-5xl"
              >
                Pictures of people who work with their hands, <em className="italic">and the weather</em>{" "}
                they work in.
              </h1>
              <p className="mt-6 max-w-160 font-display text-xl italic text-muted-fg">
                Fifteen years photographing salt boilers, ferry crews and orchard keepers along the
                northern coasts.
              </p>
            </div>
          </div>
        </section>

        <section id="work" aria-labelledby="work-title" className="border-t border-border pt-6 pb-24">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="work-title" className="font-display font-light text-3xl">
              Selected projects
            </h2>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">
              Six of forty-one &middot; 2021&ndash;2025
            </p>
          </div>
          <ol className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-12">
            {PROJECTS.map((p) => (
              <li key={p.n} className={p.span}>
                <a
                  href={`/work/${p.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`group block rounded-sm ${focus}`}
                >
                  <div
                    role="img"
                    aria-label={`Photograph from ${p.title}, ${p.place}`}
                    className={`${p.aspect} w-full ${p.tone} transition-opacity ease-standard group-hover:opacity-90 motion-reduce:transition-none`}
                  />
                  <div className="mt-4 grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 border-t border-border pt-3">
                    <span className="font-mono text-xs text-muted-fg">{p.n}</span>
                    <span>
                      <span className="block font-display text-xl underline decoration-transparent decoration-1 underline-offset-4 transition-colors ease-standard group-hover:decoration-accent">
                        {p.title}
                      </span>
                      <span className="mt-1 block text-sm italic text-muted-fg">
                        {p.place}. {p.note}
                      </span>
                    </span>
                    <span className="font-mono text-xs tabular-nums text-muted-fg">{p.year}</span>
                  </div>
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-16">
            <a
              href="/archive"
              className={`inline-flex min-h-11 items-center rounded-sm text-sm underline decoration-1 underline-offset-4 transition-colors ease-standard hover:decoration-accent ${focus}`}
            >
              The full archive, 2011 to now <span aria-hidden="true">&nbsp;&rarr;</span>
            </a>
          </p>
        </section>

        <section id="about" aria-labelledby="about-title" className="border-t-2 border-fg pt-8 pb-24">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">About</p>
          <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <h2 id="about-title" className="font-display font-light text-3xl md:text-4xl">
                Slow pictures, <em className="italic">made on location</em>
              </h2>
              <p className="mt-6 max-w-160 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-5xl first-letter:text-accent">
                I grew up on Bornholm, where my father repaired fishing boats, and I still think the
                best portraits happen while someone is busy with their work. I shoot on medium
                format film and a quiet digital body, usually over several visits, and I print
                everything myself in a small darkroom in Nørrebro.
              </p>
              <p className="mt-4 max-w-160">
                Most of my commissions come from magazines and from companies that make physical
                things. I take on around eight projects a year so each one gets the time it needs.
              </p>
            </div>
            <dl className="divide-y divide-border border-t border-fg md:col-span-4 md:col-start-9">
              {CLIENTS.map((c) => (
                <div key={c.term} className="py-4">
                  <dt className="font-mono text-xs uppercase tracking-widest text-muted-fg">
                    {c.term}
                  </dt>
                  <dd className="mt-1 text-base">{c.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-title" className="border-t border-border pt-8 pb-16">
          <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">Contact</p>
              <p className="mt-4 font-display text-5xl font-light tabular-nums">8</p>
              <p className="text-sm italic text-muted-fg">projects a year. Two places left for 2027.</p>
            </div>
            <div className="md:col-span-9">
              <h2 id="contact-title" className="font-display font-light text-3xl md:text-4xl">
                Tell me about the people <em className="italic">and the place</em>
              </h2>
              <p className="mt-4 max-w-160 text-muted-fg">
                A few lines on the story, the dates and where it runs is enough to start. I reply
                within two working days.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <a
                  href="mailto:studio@marenholt.dk"
                  className={`inline-flex min-h-11 items-center rounded-sm bg-fg px-6 text-sm font-semibold text-bg transition-colors ease-standard hover:bg-neutral-700 ${focus}`}
                >
                  Write to studio@marenholt.dk
                </a>
                <a
                  href="tel:+4531428870"
                  className={`inline-flex min-h-11 items-center rounded-sm text-sm underline decoration-1 underline-offset-4 transition-colors ease-standard hover:decoration-accent ${focus}`}
                >
                  +45 31 42 88 70
                </a>
              </div>
            </div>
          </div>
          <footer className="mt-24 flex flex-wrap items-baseline justify-between gap-4 border-t border-border pt-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">
              &copy; 2026 Maren Holt &middot; CVR 41 82 66 19
            </p>
            <ul className="flex gap-x-6 text-sm">
              <li>
                <a
                  href="https://instagram.com/marenholt"
                  className={`inline-flex min-h-11 items-center rounded-sm text-muted-fg transition-colors ease-standard hover:text-fg ${focus}`}
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="/prints"
                  className={`inline-flex min-h-11 items-center rounded-sm text-muted-fg transition-colors ease-standard hover:text-fg ${focus}`}
                >
                  Print sales
                </a>
              </li>
            </ul>
          </footer>
        </section>
      </div>
    </main>
  );
}
