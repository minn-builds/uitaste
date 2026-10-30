import { useState } from "react";

const speakers = [
  { name: "Lotte de Vries", role: "Design Director, Studio Noord", topic: "Systems that scale" },
  { name: "Kenji Watanabe", role: "Type Designer, Kana Foundry", topic: "Letterforms in motion" },
  { name: "Amara Okafor", role: "Head of Product Design, Flux", topic: "Designing for trust" },
  { name: "Jonas Becker", role: "Creative Technologist", topic: "Generative identities" },
  { name: "Sofia Lindgren", role: "Principal Designer, Nordlys", topic: "Accessible by default" },
  { name: "Mateo Ruiz", role: "Founder, Plano Studio", topic: "The poster is not dead" },
  { name: "Hannah Cho", role: "UX Researcher, Atlas", topic: "Research that ships" },
  { name: "Pieter Janssen", role: "Art Director, Het Blad", topic: "Editorial grids today" },
];

const schedule = {
  day1: [
    { time: "09:00", title: "Registration & coffee", speaker: "" },
    { time: "10:00", title: "Opening keynote: Systems that scale", speaker: "Lotte de Vries" },
    { time: "11:00", title: "Letterforms in motion", speaker: "Kenji Watanabe" },
    { time: "12:30", title: "Lunch break", speaker: "" },
    { time: "14:00", title: "Designing for trust", speaker: "Amara Okafor" },
    { time: "15:30", title: "Workshops (choose one)", speaker: "Various" },
    { time: "18:00", title: "Opening night drinks at the harbour", speaker: "" },
  ],
  day2: [
    { time: "09:30", title: "Coffee & breakfast", speaker: "" },
    { time: "10:00", title: "Generative identities", speaker: "Jonas Becker" },
    { time: "11:00", title: "Accessible by default", speaker: "Sofia Lindgren" },
    { time: "12:30", title: "Lunch break", speaker: "" },
    { time: "14:00", title: "The poster is not dead", speaker: "Mateo Ruiz" },
    { time: "15:00", title: "Research that ships", speaker: "Hannah Cho" },
    { time: "16:30", title: "Closing keynote: Editorial grids today", speaker: "Pieter Janssen" },
  ],
};

const tickets = [
  {
    name: "Early Bird",
    price: "€299",
    description: "Limited availability until Jan 31",
    features: ["Access to both days", "Lunch & coffee", "Opening night drinks"],
    highlighted: false,
  },
  {
    name: "Regular",
    price: "€449",
    description: "The full OFFSET experience",
    features: ["Access to both days", "Lunch & coffee", "Opening night drinks", "One workshop of choice", "Talk recordings"],
    highlighted: true,
  },
  {
    name: "Student",
    price: "€149",
    description: "Valid student ID required",
    features: ["Access to both days", "Lunch & coffee", "Talk recordings"],
    highlighted: false,
  },
];

const sponsors = ["Figma", "Adobe", "Framer", "Webflow", "Spotify", "Booking"];

export default function Page() {
  const [activeDay, setActiveDay] = useState<"day1" | "day2">("day1");

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Nav */}
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <span className="text-xl font-black tracking-tight">OFFSET</span>
          <nav className="hidden gap-8 text-sm font-medium text-gray-300 md:flex">
            <a href="#speakers" className="hover:text-white">Speakers</a>
            <a href="#schedule" className="hover:text-white">Schedule</a>
            <a href="#tickets" className="hover:text-white">Tickets</a>
            <a href="#sponsors" className="hover:text-white">Sponsors</a>
          </nav>
          <a href="#tickets" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-gray-200">
            Get tickets
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 via-purple-700 to-indigo-900 opacity-80" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-pink-500 opacity-40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-40">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-200">Design Conference 2027</p>
          <h1 className="mt-4 text-7xl font-black tracking-tighter sm:text-9xl">OFFSET</h1>
          <p className="mt-6 max-w-xl text-xl text-gray-200">
            Two days of talks, workshops and conversations with the people shaping the future of design.
          </p>
          <div className="mt-10 flex flex-wrap gap-6">
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-4 backdrop-blur">
              <svg className="h-6 w-6 text-pink-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4 M8 2v4 M3 10h18" strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-xs text-gray-300">Dates</p>
                <p className="font-semibold">March 18–19, 2027</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-4 backdrop-blur">
              <svg className="h-6 w-6 text-pink-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <div>
                <p className="text-xs text-gray-300">Venue</p>
                <p className="font-semibold">Kunsthal, Rotterdam</p>
              </div>
            </div>
          </div>
          <div className="mt-10 flex gap-4">
            <a href="#tickets" className="rounded-full bg-white px-8 py-4 font-semibold text-black hover:bg-gray-200">
              Buy tickets
            </a>
            <a href="#schedule" className="rounded-full border border-white/40 px-8 py-4 font-semibold hover:bg-white/10">
              View schedule
            </a>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section id="speakers" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-4xl font-bold tracking-tight">Speakers</h2>
        <p className="mt-2 text-gray-400">Meet the designers, makers and thinkers taking the stage.</p>
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {speakers.map((s) => (
            <div key={s.name} className="group">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 transition group-hover:from-fuchsia-700 group-hover:to-indigo-900" />
              <h3 className="mt-4 font-semibold">{s.name}</h3>
              <p className="text-sm text-gray-400">{s.role}</p>
              <p className="mt-1 text-sm text-pink-300">{s.topic}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="bg-gray-950 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-4xl font-bold tracking-tight">Schedule</h2>
          <div className="mt-8 inline-flex rounded-full bg-gray-800 p-1">
            {(["day1", "day2"] as const).map((day, i) => (
              <button
                key={day}
                type="button"
                onClick={() => setActiveDay(day)}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                  activeDay === day ? "bg-white text-black" : "text-gray-300 hover:text-white"
                }`}
              >
                Day {i + 1} · Mar {18 + i}
              </button>
            ))}
          </div>
          <ul className="mt-10 divide-y divide-gray-800 rounded-2xl border border-gray-800">
            {schedule[activeDay].map((item) => (
              <li key={item.time} className="flex gap-6 px-6 py-5">
                <span className="w-16 shrink-0 font-mono text-sm text-pink-300">{item.time}</span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  {item.speaker && <p className="text-sm text-gray-400">{item.speaker}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tickets */}
      <section id="tickets" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight">Tickets</h2>
          <p className="mt-2 text-gray-400">Secure your spot. Prices include VAT.</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {tickets.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-2xl p-8 ${
                t.highlighted
                  ? "bg-gradient-to-b from-fuchsia-600 to-indigo-700 shadow-2xl shadow-fuchsia-900/40"
                  : "border border-gray-800 bg-gray-900"
              }`}
            >
              {t.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-bold text-black">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <p className="mt-1 text-sm text-gray-300">{t.description}</p>
              <p className="mt-6 text-5xl font-bold">{t.price}</p>
              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-pink-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                      <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`mt-8 rounded-full py-3 font-semibold ${
                  t.highlighted ? "bg-white text-black hover:bg-gray-200" : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                Buy {t.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="border-t border-gray-800 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-500">Supported by</p>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {sponsors.map((s) => (
              <div
                key={s}
                className="flex h-16 items-center justify-center rounded-lg bg-gray-900 text-lg font-bold text-gray-500 hover:text-white"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 sm:flex-row">
          <p>© 2027 OFFSET Conference · Rotterdam, NL</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Code of Conduct</a>
            <a href="#" className="hover:text-white">Contact</a>
            <a href="#" className="hover:text-white">Instagram</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
