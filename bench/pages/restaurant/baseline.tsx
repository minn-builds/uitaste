import { useState } from "react";

type MenuItem = { name: string; description: string; price: string };

const menu: Record<string, MenuItem[]> = {
  Starters: [
    { name: "Burrata e Pomodori", description: "Creamy burrata, heirloom tomatoes, basil oil, sea salt", price: "€12" },
    { name: "Carpaccio di Manzo", description: "Thinly sliced beef, rocket, parmigiano, lemon", price: "€14" },
    { name: "Arancini al Tartufo", description: "Crispy risotto balls with black truffle and fontina", price: "€10" },
    { name: "Zuppa di Fagioli", description: "Tuscan white bean soup, rosemary, olive oil", price: "€9" },
  ],
  Mains: [
    { name: "Tagliatelle al Ragù", description: "Hand-cut egg pasta, slow-cooked beef and pork ragù", price: "€19" },
    { name: "Risotto ai Funghi", description: "Carnaroli rice, porcini mushrooms, thyme, parmigiano", price: "€21" },
    { name: "Branzino al Forno", description: "Oven-roasted sea bass, capers, cherry tomatoes, potatoes", price: "€26" },
    { name: "Ossobuco alla Milanese", description: "Braised veal shank, saffron risotto, gremolata", price: "€29" },
  ],
  Desserts: [
    { name: "Tiramisù della Casa", description: "Mascarpone, espresso-soaked savoiardi, cocoa", price: "€8" },
    { name: "Panna Cotta", description: "Vanilla bean cream with wild berry compote", price: "€7" },
    { name: "Cannoli Siciliani", description: "Ricotta, pistachio, candied orange", price: "€8" },
  ],
};

const hours = [
  { day: "Monday", time: "Closed" },
  { day: "Tuesday – Thursday", time: "17:30 – 22:00" },
  { day: "Friday – Saturday", time: "17:30 – 23:00" },
  { day: "Sunday", time: "12:00 – 15:00 · 17:30 – 21:30" },
];

export default function Page() {
  const [tab, setTab] = useState<keyof typeof menu>("Starters");

  return (
    <main className="min-h-screen bg-amber-50 text-stone-800">
      {/* Nav */}
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-white">
          <a href="#" className="font-serif text-2xl tracking-wide">
            Osteria Lume
          </a>
          <nav className="hidden gap-8 text-sm md:flex">
            <a href="#about" className="hover:text-amber-200">Chef</a>
            <a href="#menu" className="hover:text-amber-200">Menu</a>
            <a href="#hours" className="hover:text-amber-200">Hours</a>
          </nav>
          <a href="#reserve" className="rounded-full border border-white/70 px-5 py-2 text-sm hover:bg-white hover:text-stone-900">
            Reserve
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center justify-center bg-stone-800 text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <div className="relative px-6">
          <p className="text-sm tracking-[0.3em] text-amber-200 uppercase">Cucina Italiana · Since 2014</p>
          <h1 className="mt-6 font-serif text-5xl sm:text-7xl">Osteria Lume</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-stone-200">
            Seasonal Italian cooking, handmade pasta and natural wines in a warm, candlelit room for just 32 guests.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a href="#reserve" className="rounded-full bg-amber-600 px-8 py-3 font-medium hover:bg-amber-500">
              Book a table
            </a>
            <a href="#menu" className="rounded-full border border-white/60 px-8 py-3 font-medium hover:bg-white/10">
              View menu
            </a>
          </div>
        </div>
      </section>

      {/* Chef */}
      <section id="about" className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <div className="aspect-[4/5] rounded-lg bg-stone-300" />
        <div>
          <p className="text-sm tracking-[0.2em] text-amber-700 uppercase">About the chef</p>
          <h2 className="mt-4 font-serif text-4xl">Chef Giulia Ferraro</h2>
          <p className="mt-6 leading-relaxed text-stone-600">
            Born in Bologna and trained in kitchens from Florence to Copenhagen, Giulia opened Osteria Lume to cook the
            food she grew up with — simple, generous and rooted in the seasons.
          </p>
          <p className="mt-4 leading-relaxed text-stone-600">
            Every pasta is rolled by hand each morning, and our produce comes from small farms within 50 kilometres.
            The menu changes with what's best that week.
          </p>
          <p className="mt-8 font-serif text-2xl text-amber-800 italic">"Good food is patience made visible."</p>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="text-sm tracking-[0.2em] text-amber-700 uppercase">La Carta</p>
            <h2 className="mt-4 font-serif text-4xl">Our Menu</h2>
          </div>
          <div className="mt-10 flex justify-center gap-2">
            {Object.keys(menu).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                  tab === key ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
          <ul className="mt-12 space-y-8">
            {menu[tab].map((item) => (
              <li key={item.name}>
                <div className="flex items-baseline gap-4">
                  <h3 className="font-serif text-xl">{item.name}</h3>
                  <span className="flex-1 border-b border-dotted border-stone-300" />
                  <span className="font-medium text-amber-800">{item.price}</span>
                </div>
                <p className="mt-1 text-sm text-stone-500">{item.description}</p>
              </li>
            ))}
          </ul>
          <p className="mt-12 text-center text-sm text-stone-500">
            Please let us know about any allergies. Vegetarian and gluten-free options available.
          </p>
        </div>
      </section>

      {/* Hours */}
      <section id="hours" className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <p className="text-sm tracking-[0.2em] text-amber-700 uppercase">Visit us</p>
          <h2 className="mt-4 font-serif text-4xl">Opening Hours</h2>
          <dl className="mt-8 divide-y divide-stone-200">
            {hours.map((h) => (
              <div key={h.day} className="flex justify-between py-4">
                <dt className="font-medium">{h.day}</dt>
                <dd className={h.time === "Closed" ? "text-stone-400" : "text-stone-600"}>{h.time}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 space-y-2 text-stone-600">
            <p className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5 text-amber-700">
                <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Via dei Lampioni 12, Bologna
            </p>
            <p className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5 text-amber-700">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
              </svg>
              +39 051 123 4567
            </p>
          </div>
        </div>
        <div className="min-h-80 rounded-lg bg-stone-200" />
      </section>

      {/* Reservation CTA */}
      <section id="reserve" className="bg-stone-900 py-24 text-center text-white">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-serif text-4xl sm:text-5xl">Reserve your table</h2>
          <p className="mt-6 text-stone-300">
            With only eight tables, we recommend booking ahead — especially on weekends. For groups of 7 or more, please
            call us directly.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a href="#" className="rounded-full bg-amber-600 px-8 py-3 font-medium hover:bg-amber-500">
              Book online
            </a>
            <a href="tel:+390511234567" className="rounded-full border border-white/40 px-8 py-3 font-medium hover:bg-white/10">
              Call +39 051 123 4567
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-stone-950 py-8 text-center text-sm text-stone-500">
        © 2026 Osteria Lume · Via dei Lampioni 12, Bologna
      </footer>
    </main>
  );
}
