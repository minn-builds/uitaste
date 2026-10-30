import { useState } from "react";

const projects = [
  { title: "Northern Light", year: 2026, category: "Landscape", tone: "bg-slate-300" },
  { title: "Salt & Stone", year: 2025, category: "Editorial", tone: "bg-stone-300" },
  { title: "Quiet Hours", year: 2025, category: "Portrait", tone: "bg-neutral-300" },
  { title: "City in Fog", year: 2024, category: "Street", tone: "bg-zinc-300" },
  { title: "The Orchard", year: 2024, category: "Documentary", tone: "bg-stone-200" },
  { title: "Tidewater", year: 2023, category: "Landscape", tone: "bg-slate-200" },
];

export default function Page() {
  const [sent, setSent] = useState(false);

  return (
    <main className="min-h-screen bg-stone-50 text-neutral-900">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="#" className="text-lg font-semibold tracking-tight">
          Maren Holt
        </a>
        <nav className="flex gap-6 text-sm text-neutral-600">
          <a href="#work" className="hover:text-neutral-900">Work</a>
          <a href="#about" className="hover:text-neutral-900">About</a>
          <a href="#contact" className="hover:text-neutral-900">Contact</a>
        </nav>
      </header>

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <p className="text-sm font-medium tracking-widest text-neutral-500 uppercase">Freelance Photographer</p>
        <h1 className="mt-4 max-w-4xl text-5xl leading-tight font-light tracking-tight sm:text-7xl">
          Capturing quiet moments in <span className="italic">light</span>, landscape and people.
        </h1>
        <p className="mt-8 max-w-xl text-lg text-neutral-600">
          I'm Maren Holt, a photographer based in Oslo working on editorial, documentary and commercial projects
          across Scandinavia and beyond.
        </p>
        <div className="mt-10 flex gap-4">
          <a href="#work" className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700">
            View work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium hover:border-neutral-900"
          >
            Get in touch
          </a>
        </div>
      </section>

      {/* Projects */}
      <section id="work" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-light tracking-tight">Selected projects</h2>
          <span className="text-sm text-neutral-500">2023 — 2026</span>
        </div>
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <a key={p.title} href="#" className="group block">
              <div className={`aspect-[4/5] overflow-hidden rounded-sm ${p.tone}`}>
                <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500 transition duration-500 group-hover:scale-105">
                  Image
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-lg font-medium group-hover:underline">{p.title}</h3>
                <span className="text-sm text-neutral-500">{p.year}</span>
              </div>
              <p className="text-sm text-neutral-500">{p.category}</p>
            </a>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-neutral-200">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2">
          <div className="aspect-square rounded-sm bg-neutral-300" />
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-light tracking-tight">About</h2>
            <p className="mt-6 text-lg leading-relaxed text-neutral-700">
              For over ten years I've been photographing the spaces between things — the pause before a smile, the
              hour after rain, the light that only lasts a minute.
            </p>
            <p className="mt-4 leading-relaxed text-neutral-600">
              My work has appeared in Kinfolk, The Guardian and Monocle, and I've collaborated with brands like Norrøna
              and Fjällräven. I work with natural light whenever possible and keep my process slow and intentional.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6">
              {[
                ["10+", "Years"],
                ["120", "Projects"],
                ["14", "Countries"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="text-3xl font-light">{n}</dt>
                  <dd className="text-sm text-neutral-500">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-neutral-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <h2 className="text-4xl font-light tracking-tight">Let's work together</h2>
            <p className="mt-6 max-w-md text-neutral-400">
              Available for commissions, editorial assignments and collaborations. I usually reply within two days.
            </p>
            <div className="mt-8 space-y-3 text-sm">
              <a href="mailto:hello@marenholt.com" className="flex items-center gap-3 hover:text-neutral-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
                hello@marenholt.com
              </a>
              <a href="#" className="flex items-center gap-3 hover:text-neutral-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
                @marenholt
              </a>
            </div>
          </div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <input
              required
              placeholder="Name"
              className="w-full border-b border-neutral-700 bg-transparent py-3 placeholder-neutral-500 focus:border-white focus:outline-none"
            />
            <input
              required
              type="email"
              placeholder="Email"
              className="w-full border-b border-neutral-700 bg-transparent py-3 placeholder-neutral-500 focus:border-white focus:outline-none"
            />
            <textarea
              required
              rows={4}
              placeholder="Tell me about your project"
              className="w-full resize-none border-b border-neutral-700 bg-transparent py-3 placeholder-neutral-500 focus:border-white focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-200"
            >
              {sent ? "Message sent — thank you!" : "Send message"}
            </button>
          </form>
        </div>
        <footer className="border-t border-neutral-800">
          <div className="mx-auto flex max-w-6xl justify-between px-6 py-6 text-sm text-neutral-500">
            <span>© 2026 Maren Holt</span>
            <span>Oslo, Norway</span>
          </div>
        </footer>
      </section>
    </main>
  );
}
