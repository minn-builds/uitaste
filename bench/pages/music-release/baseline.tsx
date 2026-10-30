import { type FormEvent, useState } from "react";

const tracks = [
  { title: "Static Bloom", duration: "3:42" },
  { title: "Paper Lanterns", duration: "4:15" },
  { title: "Undertow", duration: "3:58" },
  { title: "Small Hours", duration: "5:03" },
  { title: "Glasshouse", duration: "3:27" },
  { title: "Northern Line", duration: "4:41" },
  { title: "Half Light", duration: "3:19" },
  { title: "Every Room We Left", duration: "6:12" },
  { title: "Slow Return", duration: "4:05" },
];

const tourDates = [
  { date: "Nov 14", city: "London, UK", venue: "Electric Ballroom", status: "available" },
  { date: "Nov 16", city: "Manchester, UK", venue: "Gorilla", status: "available" },
  { date: "Nov 19", city: "Amsterdam, NL", venue: "Paradiso Noord", status: "low" },
  { date: "Nov 21", city: "Berlin, DE", venue: "Lido", status: "soldout" },
  { date: "Nov 23", city: "Copenhagen, DK", venue: "Pumpehuset", status: "available" },
  { date: "Nov 26", city: "Paris, FR", venue: "La Maroquinerie", status: "available" },
];

export default function Page() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) setJoined(true);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-lg font-bold tracking-widest">PALE HARBOUR</span>
        <nav className="hidden gap-8 text-sm text-neutral-400 md:flex">
          <a href="#music" className="hover:text-white">Music</a>
          <a href="#tour" className="hover:text-white">Tour</a>
          <a href="#signup" className="hover:text-white">Mailing List</a>
        </nav>
      </header>

      {/* Hero / album */}
      <section id="music" className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-12 md:grid-cols-2">
        <div className="relative">
          <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-orange-400 via-rose-500 to-purple-800 shadow-2xl shadow-rose-900/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm uppercase tracking-[0.4em] text-white/70">Album Cover</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-rose-400">New Album · Out Now</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight md:text-6xl">Every Room We Left</h1>
          <p className="mt-4 text-lg text-neutral-400">
            The second full-length record from Pale Harbour. Nine songs written over two winters, recorded live to tape in
            a converted chapel.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#" className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Listen now
            </a>
            <a href="#" className="rounded-full border border-neutral-700 px-6 py-3 font-semibold hover:bg-neutral-900">
              Buy vinyl
            </a>
          </div>

          {/* Tracklist */}
          <div className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">Tracklist</h2>
            <ol className="mt-4 divide-y divide-neutral-800">
              {tracks.map((track, i) => (
                <li key={track.title} className="group flex items-center justify-between py-3">
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-right font-mono text-sm text-neutral-500 group-hover:text-rose-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium group-hover:text-white">{track.title}</span>
                  </div>
                  <span className="font-mono text-sm text-neutral-500">{track.duration}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-neutral-500">9 tracks · 38 min</p>
          </div>
        </div>
      </section>

      {/* Tour */}
      <section id="tour" className="border-t border-neutral-800 bg-neutral-900/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-4xl font-bold tracking-tight">Tour Dates</h2>
          <p className="mt-2 text-neutral-400">Europe, Autumn 2026</p>
          <ul className="mt-10 divide-y divide-neutral-800 border-y border-neutral-800">
            {tourDates.map((show) => (
              <li key={show.date} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-8">
                  <span className="w-20 font-mono text-lg font-semibold text-rose-400">{show.date}</span>
                  <div>
                    <p className="font-semibold">{show.city}</p>
                    <p className="text-sm text-neutral-400">{show.venue}</p>
                  </div>
                </div>
                {show.status === "soldout" ? (
                  <span className="rounded-full border border-neutral-700 px-5 py-2 text-center text-sm font-semibold text-neutral-500">
                    Sold out
                  </span>
                ) : (
                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-neutral-200"
                  >
                    {show.status === "low" ? "Few left" : "Tickets"}
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path d="M7 17 17 7 M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mailing list */}
      <section id="signup" className="py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Join the mailing list</h2>
          <p className="mt-3 text-neutral-400">
            Be the first to hear about new music, presales and the occasional handwritten postcard.
          </p>
          {joined ? (
            <p className="mt-8 rounded-lg bg-neutral-900 px-6 py-4 text-rose-300">You're on the list. See you at a show.</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 rounded-full border border-neutral-700 bg-neutral-900 px-6 py-3 text-white placeholder:text-neutral-500 focus:border-rose-500 focus:outline-none"
              />
              <button type="submit" className="rounded-full bg-rose-500 px-8 py-3 font-semibold text-white hover:bg-rose-600">
                Sign up
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-neutral-500 sm:flex-row">
          <p>© 2026 Pale Harbour. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">Bandcamp</a>
            <a href="#" className="hover:text-white">Spotify</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
