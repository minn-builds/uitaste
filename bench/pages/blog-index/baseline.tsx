import { type FormEvent, useState } from "react";

const posts = [
  {
    title: "Why Parking Minimums Are Quietly Reshaping Our Downtowns",
    excerpt: "Decades of mandated parking have hollowed out city centers. A growing number of cities are finally rethinking the rules.",
    date: "Oct 24, 2026",
    author: "Priya Raman",
    readingTime: "8 min read",
    topic: "Zoning",
  },
  {
    title: "The Fifteen-Minute City, Revisited",
    excerpt: "Five years after the idea went mainstream, what has actually changed on the ground in Paris, Melbourne and Portland?",
    date: "Oct 17, 2026",
    author: "Daniel Osei",
    readingTime: "11 min read",
    topic: "Mobility",
  },
  {
    title: "What Barcelona's Superblocks Teach Us About Street Space",
    excerpt: "Reclaiming intersections for people turned out to be cheaper and faster than anyone expected.",
    date: "Oct 10, 2026",
    author: "Elena Marquez",
    readingTime: "6 min read",
    topic: "Public Space",
  },
  {
    title: "Missing Middle Housing and the Duplex Comeback",
    excerpt: "Townhouses, triplexes and courtyard apartments used to be everywhere. Here's how they disappeared, and how they return.",
    date: "Oct 3, 2026",
    author: "Priya Raman",
    readingTime: "9 min read",
    topic: "Housing",
  },
  {
    title: "Trees as Infrastructure: The Economics of Urban Canopy",
    excerpt: "Shade isn't a luxury. Cities are starting to budget for trees the way they budget for pipes.",
    date: "Sep 26, 2026",
    author: "Marcus Lindqvist",
    readingTime: "7 min read",
    topic: "Climate",
  },
];

const topics = [
  { name: "Zoning", count: 42 },
  { name: "Housing", count: 38 },
  { name: "Mobility", count: 31 },
  { name: "Public Space", count: 27 },
  { name: "Climate", count: 24 },
  { name: "Transit", count: 22 },
  { name: "History", count: 15 },
  { name: "Policy", count: 19 },
];

export default function Page() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="#" className="font-serif text-2xl font-bold tracking-tight">
            The Long Block
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-stone-600 md:flex">
            <a href="#" className="hover:text-stone-900">Articles</a>
            <a href="#topics" className="hover:text-stone-900">Topics</a>
            <a href="#" className="hover:text-stone-900">About</a>
            <a
              href="#subscribe"
              className="rounded-full bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800"
            >
              Subscribe
            </a>
          </nav>
        </div>
      </header>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-emerald-700">Featured</p>
        <article className="grid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 md:grid-cols-2">
          <div className="aspect-[4/3] bg-gradient-to-br from-emerald-200 via-stone-200 to-amber-100 md:aspect-auto" />
          <div className="flex flex-col justify-center p-8 md:p-12">
            <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Transit
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold leading-tight md:text-4xl">
              The Bus Is the Answer Nobody Wants to Hear
            </h1>
            <p className="mt-4 text-lg text-stone-600">
              Light rail gets the ribbon cuttings, but frequent, reliable bus networks move more people for less money.
              We look at the cities that redesigned their networks and what happened next.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-stone-500">
              <div className="h-10 w-10 rounded-full bg-stone-300" />
              <div>
                <p className="font-medium text-stone-900">Marcus Lindqvist</p>
                <p>Oct 28, 2026 · 14 min read</p>
              </div>
            </div>
            <a
              href="#"
              className="mt-8 inline-flex w-fit items-center gap-2 font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Read the article
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M5 12h14 M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </article>
      </section>

      {/* Recent posts + sidebar */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-serif text-2xl font-bold">Recent Posts</h2>
          <div className="mt-6 divide-y divide-stone-200">
            {posts.map((post) => (
              <article key={post.title} className="group flex gap-6 py-6">
                <div className="hidden h-28 w-40 shrink-0 rounded-lg bg-stone-200 sm:block" />
                <div className="flex-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{post.topic}</span>
                  <h3 className="mt-1 font-serif text-xl font-semibold leading-snug group-hover:text-emerald-700">
                    <a href="#">{post.title}</a>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-stone-600">{post.excerpt}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-2 text-sm text-stone-500">
                    <span className="font-medium text-stone-700">{post.author}</span>
                    <span>·</span>
                    <time>{post.date}</time>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 3" strokeLinecap="round" />
                      </svg>
                      {post.readingTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <button
            type="button"
            className="mt-6 w-full rounded-lg border border-stone-300 py-3 text-sm font-medium text-stone-700 hover:bg-white"
          >
            Load more posts
          </button>
        </div>

        <aside className="space-y-8">
          <div id="topics" className="rounded-2xl bg-white p-6 ring-1 ring-stone-200">
            <h2 className="font-serif text-xl font-bold">Topics</h2>
            <ul className="mt-4 space-y-1">
              {topics.map((topic) => (
                <li key={topic.name}>
                  <a
                    href="#"
                    className="flex items-center justify-between rounded-md px-3 py-2 text-stone-700 hover:bg-stone-100"
                  >
                    <span>{topic.name}</span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">{topic.count}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div id="subscribe" className="rounded-2xl bg-emerald-800 p-6 text-white">
            <svg className="h-8 w-8 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="mt-4 font-serif text-xl font-bold">Get The Long Block in your inbox</h2>
            <p className="mt-2 text-sm text-emerald-100">
              One thoughtful essay about how cities work, every Thursday. Join 24,000 readers.
            </p>
            {subscribed ? (
              <p className="mt-6 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-medium">
                Thanks for subscribing! Check your inbox to confirm.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border-0 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-300"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-amber-400 px-4 py-3 font-semibold text-stone-900 hover:bg-amber-300"
                >
                  Subscribe for free
                </button>
              </form>
            )}
            <p className="mt-3 text-xs text-emerald-200">No spam. Unsubscribe anytime.</p>
          </div>
        </aside>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-stone-500 sm:flex-row">
          <p>© 2026 The Long Block. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-stone-900">RSS</a>
            <a href="#" className="hover:text-stone-900">Archive</a>
            <a href="#" className="hover:text-stone-900">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
