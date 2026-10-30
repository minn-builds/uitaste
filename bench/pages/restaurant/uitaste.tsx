// Preset: editorial. Signature moves: asymmetric 3/9 and 4/8 spreads (1), hairline rules (2),
// light display type with one italic phrase (3), mono folio lines (4), drop cap and italic
// deck (5), oversized light numerals for prices and course markers (6).

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const MENU: { n: string; course: string; deck: string; dishes: { name: string; desc: string; price: string }[] }[] =
  [
    {
      n: "I",
      course: "Antipasti",
      deck: "To share, or not.",
      dishes: [
        {
          name: "Burrata di Andria",
          desc: "Roasted datterini, basil oil, grilled sourdough",
          price: "14",
        },
        {
          name: "Carne cruda",
          desc: "Hand-cut beef, anchovy cream, capers, egg yolk",
          price: "16",
        },
        {
          name: "Fiori di zucca",
          desc: "Courgette flowers, ricotta and lemon, fried to order",
          price: "12",
        },
        { name: "Puntarelle", desc: "Chicory, anchovy, garlic, Roman style", price: "11" },
      ],
    },
    {
      n: "II",
      course: "Primi e secondi",
      deck: "Pasta rolled each morning in the front window.",
      dishes: [
        {
          name: "Tagliolini al limone",
          desc: "Amalfi lemon, butter, Parmigiano aged 30 months",
          price: "19",
        },
        {
          name: "Pici cacio e pepe",
          desc: "Hand-rolled Tuscan pasta, pecorino, Tellicherry pepper",
          price: "18",
        },
        {
          name: "Risotto al radicchio",
          desc: "Treviso radicchio, Taleggio, aged balsamic",
          price: "21",
        },
        {
          name: "Branzino al forno",
          desc: "Whole sea bass, fennel, olives, salsa verde",
          price: "29",
        },
        {
          name: "Guancia brasata",
          desc: "Beef cheek braised in Barolo, soft polenta",
          price: "27",
        },
      ],
    },
    {
      n: "III",
      course: "Dolci",
      deck: "Made by Lucia, who will tell you to order two.",
      dishes: [
        { name: "Tiramisù della casa", desc: "Savoiardi, mascarpone, espresso, cocoa", price: "9" },
        { name: "Panna cotta", desc: "Vanilla, poached quince, almond crumb", price: "8" },
        {
          name: "Torta caprese",
          desc: "Flourless chocolate and almond cake, crème fraîche",
          price: "9",
        },
      ],
    },
  ];

const HOURS = [
  { day: "Monday", time: "Closed" },
  { day: "Tuesday to Thursday", time: "17:30 – 22:00" },
  { day: "Friday", time: "17:30 – 23:00" },
  { day: "Saturday", time: "12:00 – 15:00, 17:30 – 23:00" },
  { day: "Sunday", time: "12:00 – 16:00" },
];

export default function Page() {
  return (
    <main className="min-h-dvh bg-bg font-body text-base text-fg">
      <div className="mx-auto max-w-320 px-6 md:px-12">
        <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-border pt-8 pb-4">
          <a href="/" className={`rounded-sm font-display text-2xl ${focus}`}>
            Osteria Lume
          </a>
          <nav aria-label="Sections">
            <ul className="flex flex-wrap gap-x-6 text-sm">
              {[
                { href: "#chef", label: "The kitchen" },
                { href: "#menu", label: "Menu" },
                { href: "#hours", label: "Hours" },
                { href: "#reserve", label: "Reserve" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`inline-flex min-h-11 items-center rounded-sm text-muted-fg transition-colors ease-standard hover:text-fg ${focus}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <section aria-labelledby="hero-title" className="pt-16 pb-24">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">
            Via Lume 14 &middot; 28 covers &middot; Autumn menu from 21 October
          </p>
          <div className="mt-4 grid grid-cols-1 gap-x-12 gap-y-8 border-t-2 border-fg pt-8 md:grid-cols-12">
            <aside className="flex flex-col gap-2 md:col-span-3 md:pt-4">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">
                Cucina di casa
              </p>
              <p className="text-sm text-muted-fg">
                Chef <span className="text-fg">Lucia Ferrante</span>
                <br />
                Open Tuesday to Sunday
              </p>
            </aside>
            <div className="md:col-span-9">
              <h1
                id="hero-title"
                className="break-words font-display font-light text-3xl hyphens-auto sm:text-4xl md:text-5xl"
              >
                A small room, a short menu, <em className="italic">pasta rolled by hand</em> every
                morning.
              </h1>
              <p className="mt-6 max-w-160 font-display text-xl italic text-muted-fg">
                Twenty-eight seats, one wood oven and the food of Emilia and Lazio, cooked the way
                Lucia&rsquo;s grandmother cooked it.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <a
                  href="#reserve"
                  className={`inline-flex min-h-11 items-center rounded-sm bg-fg px-6 text-sm font-semibold text-bg transition-colors ease-standard hover:bg-neutral-700 ${focus}`}
                >
                  Book a table
                </a>
                <a
                  href="#menu"
                  className={`inline-flex min-h-11 items-center rounded-sm text-sm underline decoration-1 underline-offset-4 transition-colors ease-standard hover:decoration-accent ${focus}`}
                >
                  Read the autumn menu <span aria-hidden="true">&nbsp;&darr;</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="chef" aria-labelledby="chef-title" className="border-t border-border pt-8 pb-24">
          <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-12">
            <figure className="md:col-span-4">
              <div
                role="img"
                aria-label="Lucia Ferrante rolling pici at the front window"
                className="aspect-[3/4] w-full bg-neutral-300"
              />
              <figcaption className="mt-3 border-t border-border pt-2 text-sm italic text-muted-fg">
                Lucia at the pasta table, 7:30 on a Tuesday.
              </figcaption>
            </figure>
            <div className="md:col-span-7 md:col-start-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">
                The kitchen
              </p>
              <h2 id="chef-title" className="mt-4 font-display font-light text-3xl md:text-4xl">
                Lucia Ferrante, <em className="italic">from Modena</em>
              </h2>
              <p className="mt-6 max-w-160 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-5xl first-letter:text-accent">
                Lucia learned to cook standing on a chair in her grandmother&rsquo;s kitchen outside
                Modena. She spent nine years in restaurants in Bologna and Rome before opening Lume
                in 2019 with her brother Marco, who runs the room and the wine list.
              </p>
              <p className="mt-4 max-w-160">
                The menu changes with the market four times a year. Flour comes from a mill in
                Romagna, cheese from two producers she visits every spring, and anything we cannot
                get good enough simply comes off the menu.
              </p>
            </div>
          </div>
        </section>

        <section id="menu" aria-labelledby="menu-title" className="border-t-2 border-fg pt-8 pb-24">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="menu-title" className="font-display font-light text-4xl">
              Autumn menu
            </h2>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">
              Prices in euro &middot; Bread and service included
            </p>
          </div>
          <div className="mt-12 flex flex-col gap-16">
            {MENU.map((course) => (
              <div key={course.n} className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-12">
                <div className="md:col-span-3">
                  <p className="font-display text-5xl font-light">{course.n}</p>
                  <h3 className="mt-2 font-display text-2xl">{course.course}</h3>
                  <p className="mt-1 text-sm italic text-muted-fg">{course.deck}</p>
                </div>
                <ul className="divide-y divide-border border-t border-fg md:col-span-8 md:col-start-5">
                  {course.dishes.map((d) => (
                    <li key={d.name} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-4">
                      <span>
                        <span className="block font-display text-xl">{d.name}</span>
                        <span className="mt-1 block text-sm italic text-muted-fg">{d.desc}</span>
                      </span>
                      <span className="font-mono text-base tabular-nums">{d.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-12 max-w-160 text-sm italic text-muted-fg md:ml-auto md:w-2/3">
            Tell us about allergies when you book. Most pasta can be made without egg, and the
            kitchen keeps a gluten-free dough every evening.
          </p>
        </section>

        <section id="hours" aria-labelledby="hours-title" className="border-t border-border pt-8 pb-24">
          <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">
                Hours &amp; address
              </p>
              <h2 id="hours-title" className="mt-4 font-display font-light text-3xl">
                When we&rsquo;re open
              </h2>
              <address className="mt-6 text-base not-italic">
                Via Lume 14
                <br />
                40125 Bologna
                <br />
                <a
                  href="tel:+390515873310"
                  className={`mt-2 inline-flex min-h-11 items-center rounded-sm underline decoration-1 underline-offset-4 transition-colors ease-standard hover:decoration-accent ${focus}`}
                >
                  +39 051 587 3310
                </a>
              </address>
            </div>
            <table className="w-full border-collapse text-left md:col-span-7 md:col-start-6">
              <caption className="pb-4 text-left font-display text-xl italic text-muted-fg">
                Kitchen closes 30 minutes before the room.
              </caption>
              <thead>
                <tr className="border-b border-fg font-mono text-xs uppercase tracking-widest text-muted-fg">
                  <th scope="col" className="py-2 font-normal">
                    Day
                  </th>
                  <th scope="col" className="py-2 text-right font-normal">
                    Hours
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {HOURS.map((h) => (
                  <tr key={h.day}>
                    <th scope="row" className="py-3 pr-4 font-normal">
                      {h.day}
                    </th>
                    <td
                      className={
                        h.time === "Closed"
                          ? "py-3 text-right italic text-muted-fg"
                          : "py-3 text-right font-mono tabular-nums"
                      }
                    >
                      {h.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          id="reserve"
          aria-labelledby="reserve-title"
          className="border-t-2 border-fg pt-8 pb-16"
        >
          <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">
                Reservations
              </p>
              <h2 id="reserve-title" className="mt-4 font-display font-light text-4xl md:text-5xl">
                Book a table <em className="italic">for this week</em>
              </h2>
              <p className="mt-6 max-w-160 text-muted-fg">
                We take bookings up to 30 days ahead for parties of up to six. Four seats at the
                counter are kept for walk-ins every night.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <a
                  href="/reserve"
                  className={`inline-flex min-h-11 items-center rounded-sm bg-fg px-6 text-sm font-semibold text-bg transition-colors ease-standard hover:bg-neutral-700 ${focus}`}
                >
                  Reserve online
                </a>
                <a
                  href="mailto:tavoli@osterialume.it"
                  className={`inline-flex min-h-11 items-center rounded-sm text-sm underline decoration-1 underline-offset-4 transition-colors ease-standard hover:decoration-accent ${focus}`}
                >
                  Groups of 7 or more: tavoli@osterialume.it
                </a>
              </div>
            </div>
            <dl className="divide-y divide-border border-t border-fg md:col-span-3 md:col-start-10">
              <div className="py-4">
                <dt className="font-mono text-xs uppercase tracking-widest text-muted-fg">
                  Tasting menu
                </dt>
                <dd className="mt-1 font-display text-5xl font-light tabular-nums">58</dd>
                <dd className="text-sm italic text-muted-fg">Five courses, Friday and Saturday</dd>
              </div>
              <div className="py-4">
                <dt className="font-mono text-xs uppercase tracking-widest text-muted-fg">
                  Cancellation
                </dt>
                <dd className="mt-1 text-sm">Free until 24 hours before</dd>
              </div>
            </dl>
          </div>
          <footer className="mt-24 flex flex-wrap items-baseline justify-between gap-4 border-t border-border pt-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">
              Osteria Lume &middot; Bologna &middot; Since 2019
            </p>
            <a
              href="https://instagram.com/osterialume"
              className={`inline-flex min-h-11 items-center rounded-sm text-sm text-muted-fg transition-colors ease-standard hover:text-fg ${focus}`}
            >
              Instagram
            </a>
          </footer>
        </section>
      </div>
    </main>
  );
}
