// Preset: brutal. Signature moves: slabs with drawn 3px edges and shared dividers, one hard
// shadow per view plus pressable buttons, oversized hand-broken uppercase display, tape labels,
// one orange flood per view, and an asymmetric stack with the minor slab dropped down.

const FOCUS = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-fg";
const TAPE = "inline-block bg-fg text-bg font-mono font-bold uppercase text-sm px-2 py-0.5";
const PRESS =
  "transition ease-standard hover:translate-x-1 hover:translate-y-1 hover:shadow-none motion-reduce:transition-none";

const NAV = [
  { label: "Speakers", href: "#speakers", current: false },
  { label: "Schedule", href: "#schedule", current: false },
  { label: "Tickets", href: "#tickets", current: true },
];

const SPEAKERS = [
  { name: "Noor Haddad", role: "Type designer, Haddad Foundry", talk: "Arabic and Latin on one baseline" },
  { name: "Jesper Lind", role: "Design director, Rijkswaterstaat", talk: "Signage for a country below sea level" },
  { name: "Ama Mensah", role: "Founder, Kente Systems", talk: "Design systems for 14 languages" },
  { name: "Lucía Ferrer", role: "Creative technologist, Estudio Ola", talk: "Posters that print themselves" },
  { name: "Wim de Bruijn", role: "Partner, Studio Dumbar", talk: "Forty years of the Dutch grid" },
  { name: "Hana Sato", role: "Interface lead, Kumo Maps", talk: "Maps people trust at 3 a.m." },
];

const DAY_ONE = [
  { time: "09:00", item: "Doors and coffee", room: "Hall" },
  { time: "10:00", item: "Opening: Mira Okonkwo", room: "Main" },
  { time: "11:15", item: "Wim de Bruijn", room: "Main" },
  { time: "13:30", item: "Noor Haddad", room: "Main" },
  { time: "15:00", item: "Workshops, round 1", room: "Docks" },
  { time: "19:00", item: "Night of the Posters", room: "Roof" },
];

const DAY_TWO = [
  { time: "09:30", item: "Jesper Lind", room: "Main" },
  { time: "11:00", item: "Ama Mensah", room: "Main" },
  { time: "13:30", item: "Workshops, round 2", room: "Docks" },
  { time: "15:30", item: "Lucía Ferrer", room: "Main" },
  { time: "17:00", item: "Closing: Hana Sato", room: "Main" },
];

const TICKETS = [
  {
    id: "student",
    name: "Student",
    price: "€95",
    note: "Valid student ID at the door.",
    features: [
      ["Both days", "Yes"],
      ["Workshops", "1 seat"],
      ["Poster night", "Yes"],
    ],
    slab: "lg:col-span-3 lg:mt-16 border-3 border-fg bg-bg text-fg",
    cta: `flex items-center justify-center min-h-12 px-6 border-3 border-fg bg-bg font-bold hover:bg-fg hover:text-bg transition ease-standard ${FOCUS}`,
    recommended: false,
  },
  {
    id: "regular",
    name: "Regular",
    price: "€340",
    note: "Two days, both workshop rounds, the roof party. 212 left.",
    features: [
      ["Both days", "Yes"],
      ["Workshops", "2 seats"],
      ["Poster night", "Yes"],
    ],
    slab: "order-first lg:order-none lg:col-span-5 border-3 border-fg bg-accent text-accent-fg shadow-lg",
    cta: `flex items-center justify-center min-h-12 px-6 border-3 border-fg bg-bg text-fg font-bold shadow-md ${PRESS} ${FOCUS}`,
    recommended: true,
  },
  {
    id: "team",
    name: "Team of 5",
    price: "€1,450",
    note: "Invoice in your company's name.",
    features: [
      ["Both days", "5 people"],
      ["Workshops", "10 seats"],
      ["Poster night", "Yes"],
    ],
    slab: "lg:col-span-4 lg:mt-8 border-3 border-fg bg-bg text-fg",
    cta: `flex items-center justify-center min-h-12 px-6 border-3 border-fg bg-bg font-bold hover:bg-fg hover:text-bg transition ease-standard ${FOCUS}`,
    recommended: false,
  },
] as const;

const SPONSORS = ["Drukkerij Veen", "Fontstand", "Het Nieuwe Instituut", "Maas Paper Co.", "Vormgeving NL"];

function ScheduleTable({ rows, label }: { rows: { time: string; item: string; room: string }[]; label: string }) {
  return (
    <table className="w-full text-left">
      <caption className="sr-only">{label}</caption>
      <thead className="bg-fg text-bg font-mono uppercase text-sm">
        <tr>
          <th scope="col" className="px-4 py-2 w-24">
            Time
          </th>
          <th scope="col" className="px-4 py-2">
            Session
          </th>
          <th scope="col" className="px-4 py-2 text-right">
            Room
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-fg">
        {rows.map((r) => (
          <tr key={r.time}>
            <td className="px-4 py-3 font-mono text-base tabular-nums align-top">{r.time}</td>
            <td className="px-4 py-3 text-base">{r.item}</td>
            <td className="px-4 py-3 font-mono text-base text-right align-top">{r.room}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Page() {
  return (
    <main className="bg-bg text-fg font-body overflow-x-hidden">
      <header className="border-b-3 border-fg">
        <nav aria-label="Primary" className="flex flex-col md:flex-row">
          <a
            href="/"
            className={`flex items-center min-h-12 px-4 md:px-8 border-b-3 md:border-b-0 md:border-r-3 border-fg font-display uppercase text-lg ${FOCUS}`}
          >
            Offset
          </a>
          <ul className="flex md:ml-auto divide-x-3 divide-fg md:border-l-3 border-fg">
            {NAV.map((item) => (
              <li key={item.href} className="flex-1 md:flex-none">
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={
                    item.current
                      ? `flex items-center justify-center min-h-12 px-4 md:px-6 bg-fg text-bg font-mono font-bold uppercase text-sm ${FOCUS}`
                      : `flex items-center justify-center min-h-12 px-4 md:px-6 font-mono font-bold uppercase text-sm hover:bg-muted transition ease-standard ${FOCUS}`
                  }
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Hero: 8/4 with dropped ink rail for dates and venue */}
      <section
        aria-labelledby="hero-title"
        className="grid grid-cols-12 gap-x-8 gap-y-12 px-4 md:px-8 pt-12 md:pt-20 pb-12 md:pb-20"
      >
        <div className="col-span-12 md:col-span-8">
          <p className={TAPE}>Design conference / 3rd edition</p>
          <h1 id="hero-title" className="mt-6 font-display uppercase text-xl md:text-3xl xl:text-4xl leading-none">
            <span className="block">Offset</span>
            <span className="block">is two</span>
            <span className="block">loud days.</span>
          </h1>
          <p className="mt-8 max-w-prose text-base">
            Twelve talks, eight workshops and one night of posters in a former harbour warehouse.
            For type designers, interface people and anyone who still cares how a grid is drawn.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#tickets"
              className={`inline-flex items-center min-h-12 px-6 border-3 border-fg bg-accent text-accent-fg font-bold shadow-md ${PRESS} ${FOCUS}`}
            >
              Get a ticket from €95
            </a>
            <a
              href="#schedule"
              className={`inline-flex items-center min-h-12 px-1 font-bold underline decoration-3 underline-offset-4 hover:bg-fg hover:text-bg transition ease-standard ${FOCUS}`}
            >
              See the schedule
            </a>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 md:mt-12 self-start border-3 border-fg shadow-lg divide-y-3 divide-fg">
          <div className="relative bg-fg text-bg p-6 pt-8">
            <p className="absolute -top-3 left-4 border-3 border-fg bg-bg text-fg font-mono font-bold uppercase text-sm px-2">
              When
            </p>
            <p className="font-display text-2xl leading-none">26–27</p>
            <p className="mt-2 font-mono text-base uppercase">March 2027</p>
          </div>
          <dl className="divide-y-3 divide-fg">
            <div className="px-6 py-4">
              <dt className="font-mono text-base">Venue</dt>
              <dd className="mt-1 font-display text-lg leading-none uppercase">Fenix Loods</dd>
              <dd className="mt-2 text-base">Veerlaan 19, Katendrecht, Rotterdam</dd>
            </div>
            <div className="px-6 py-4">
              <dt className="font-mono text-base">Getting there</dt>
              <dd className="mt-1 text-base">8 min walk from Rijnhaven metro. Water taxi stop at the door.</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Speakers: lead slab 5 + ruled list 7 */}
      <section id="speakers" aria-labelledby="speakers-title" className="border-t-3 border-fg px-4 md:px-8 py-12 md:py-20">
        <p className={TAPE}>Lineup</p>
        <h2 id="speakers-title" className="mt-6 font-display uppercase text-xl md:text-2xl leading-none">
          <span className="block">Twelve speakers,</span>
          <span className="block">no panels.</span>
        </h2>
        <div className="mt-12 grid grid-cols-12 gap-8 items-start">
          <article className="col-span-12 lg:col-span-5 border-3 border-fg bg-fg text-bg p-6 md:p-8">
            <p className="font-mono uppercase text-sm">Opening keynote</p>
            <p className="mt-4 font-display uppercase text-xl leading-none">Mira Okonkwo</p>
            <p className="mt-4 text-base">
              Head of design at the Port of Rotterdam. Mira will show how a container terminal is
              signposted for robots, cranes and humans at the same time.
            </p>
            <p className="mt-6 font-mono text-base">Day 1 / 10:00 / Main hall</p>
          </article>
          <ul className="col-span-12 lg:col-span-7 lg:mt-12 border-3 border-fg divide-y-3 divide-fg">
            {SPEAKERS.map((s) => (
              <li key={s.name} className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-1 px-4 md:px-6 py-4">
                <p className="md:col-span-5 font-display uppercase text-base leading-tight">{s.name}</p>
                <div className="md:col-span-7">
                  <p className="text-base font-bold">{s.talk}</p>
                  <p className="font-mono text-base">{s.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Schedule: two tables, uneven 7/5, day two dropped */}
      <section id="schedule" aria-labelledby="schedule-title" className="border-t-3 border-fg bg-muted px-4 md:px-8 py-12 md:py-20">
        <p className={TAPE}>Schedule</p>
        <h2 id="schedule-title" className="mt-6 font-display uppercase text-xl md:text-2xl leading-none">
          Two days
        </h2>
        <div className="mt-12 grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 lg:col-span-7 border-3 border-fg bg-bg">
            <h3 className="border-b-3 border-fg px-4 py-3 font-display uppercase text-lg leading-none">
              Fri 26 March
            </h3>
            <ScheduleTable rows={DAY_ONE} label="Day one, Friday 26 March" />
          </div>
          <div className="col-span-12 lg:col-span-5 lg:mt-16 border-3 border-fg bg-bg">
            <h3 className="border-b-3 border-fg px-4 py-3 font-display uppercase text-lg leading-none">
              Sat 27 March
            </h3>
            <ScheduleTable rows={DAY_TWO} label="Day two, Saturday 27 March" />
          </div>
        </div>
      </section>

      {/* Tickets: 3/5/4 slabs, recommended is the orange flood */}
      <section id="tickets" aria-labelledby="tickets-title" className="border-t-3 border-fg px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-12 gap-x-8 gap-y-6">
          <div className="col-span-12 md:col-span-7">
            <p className={TAPE}>Tickets</p>
            <h2 id="tickets-title" className="mt-6 font-display uppercase text-xl md:text-2xl leading-none">
              <span className="block">One price,</span>
              <span className="block">everything in.</span>
            </h2>
          </div>
          <p className="col-span-12 md:col-span-4 md:col-start-9 self-end max-w-prose text-base">
            Prices include 21% VAT, lunch on both days and the poster night. Transfer your ticket
            to a colleague up to 48 hours before doors.
          </p>
        </div>
        <ol aria-label="Ticket types" className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {TICKETS.map((t) => (
            <li key={t.id} className={t.slab}>
              <div className="flex items-center justify-between gap-4 border-b-3 border-fg px-6 py-4">
                <h3 className="font-display uppercase text-lg leading-none">{t.name}</h3>
                {t.recommended ? (
                  <span className="bg-fg text-bg font-mono font-bold uppercase text-sm px-2 py-0.5">
                    Most picked
                  </span>
                ) : null}
              </div>
              <div className="px-6 pt-6">
                <p className="font-display text-2xl leading-none">{t.price}</p>
                <p className="mt-4 text-base">{t.note}</p>
              </div>
              <dl className="mt-6 mx-6 border-y-3 border-fg divide-y divide-fg">
                {t.features.map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 py-2">
                    <dt className="text-base">{label}</dt>
                    <dd className="font-mono font-bold text-base text-right">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="p-6">
                <a href={`/checkout?ticket=${t.id}`} className={t.cta}>
                  Buy {t.name}
                </a>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Sponsors: one drawn strip */}
      <section aria-labelledby="sponsors-title" className="border-t-3 border-fg px-4 md:px-8 py-12">
        <h2 id="sponsors-title" className={TAPE}>
          Made possible by
        </h2>
        <ul className="mt-6 border-3 border-fg flex flex-col md:flex-row divide-y-3 md:divide-y-0 md:divide-x-3 divide-fg">
          {SPONSORS.map((s) => (
            <li key={s} className="flex-1 flex items-center min-h-16 px-4 font-display uppercase text-base leading-tight">
              {s}
            </li>
          ))}
        </ul>
        <a
          href="mailto:partners@offset.nl"
          className={`mt-6 inline-flex items-center min-h-12 px-1 font-bold underline decoration-3 underline-offset-4 hover:bg-fg hover:text-bg transition ease-standard ${FOCUS}`}
        >
          Sponsor the 2027 edition
        </a>
      </section>

      <footer className="border-t-3 border-fg bg-fg text-bg px-4 md:px-8 py-8 flex flex-col md:flex-row gap-4 md:justify-between">
        <p className="font-display uppercase text-lg">Offset 2027</p>
        <p className="font-mono text-base">Rotterdam / hello@offset.nl / KvK 81234567</p>
      </footer>
    </main>
  );
}
