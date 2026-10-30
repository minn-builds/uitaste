import { useState } from "react";

const features = [
  {
    title: "Boards that stay tidy",
    description:
      "Organize work into simple boards and lists. Drag tasks between stages and see what everyone is working on at a glance.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
        <rect x="3" y="3" width="7" height="18" rx="1.5" />
        <rect x="14" y="3" width="7" height="11" rx="1.5" />
      </svg>
    ),
  },
  {
    title: "Async check-ins",
    description:
      "Replace daily standups with quick written updates. Loop collects them and sends a digest to the whole team.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Works across time zones",
    description:
      "Deadlines and reminders adapt to each teammate's local time, so nobody gets pinged at 3am.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },
  {
    title: "Private by default",
    description:
      "Your data is encrypted in transit and at rest. Granular permissions keep client work where it belongs.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
        <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />
      </svg>
    ),
  },
  {
    title: "Simple integrations",
    description:
      "Connect Slack, GitHub, Google Calendar and more in a couple of clicks. No admin degree required.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
        <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" />
        <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
      </svg>
    ),
  },
  {
    title: "Progress you can share",
    description:
      "Turn any project into a clean status page for clients or stakeholders with one link.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
        <path d="M3 3v18h18" />
        <path d="M7 15l4-4 3 3 5-6" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    quote:
      "Loop is the first tool our team actually kept using after the first month. It's calm, fast and just gets out of the way.",
    name: "Priya Nair",
    role: "Founder, Fieldnote Studio",
  },
  {
    quote:
      "We're spread across four countries. The async check-ins alone saved us about five hours of meetings a week.",
    name: "Tomás Ruiz",
    role: "Engineering Lead, Brightside",
  },
  {
    quote:
      "Setup took ten minutes. Our clients love the shareable progress pages — fewer 'just checking in' emails for everyone.",
    name: "Hannah Okafor",
    role: "Operations, Kite & Co.",
  },
];

function Check() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 flex-none text-indigo-600">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Page() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-2 text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-5 w-5">
                <path d="M17 7a5 5 0 1 0 0 10H7a5 5 0 1 1 0-10z" />
              </svg>
            </span>
            Loop
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#testimonials" className="hover:text-slate-900">Customers</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:block">
              Log in
            </a>
            <a
              href="#signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="signup" className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            New: async check-ins
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            Project management that feels like{" "}
            <span className="text-indigo-600">teamwork</span>, not paperwork
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Loop helps small remote teams plan, track and ship together — without the clutter of enterprise tools.
          </p>

          <form
            className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSubmitted(true);
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold whitespace-nowrap text-white shadow-sm hover:bg-indigo-500"
            >
              Start free trial
            </button>
          </form>
          <p className="mt-3 text-sm text-slate-500">
            {submitted ? "Thanks! Check your inbox to get started." : "Free for 14 days. No credit card required."}
          </p>

          <div className="mx-auto mt-16 max-w-5xl rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
            <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-400">
              Product screenshot
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="border-y border-slate-100 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-sm font-medium text-slate-500">Trusted by 2,000+ small teams worldwide</p>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-5">
            {["Fieldnote", "Brightside", "Kite & Co.", "Northwind", "Parcel"].map((name) => (
              <div key={name} className="text-center text-lg font-semibold text-slate-400">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold text-indigo-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Built for the way small teams work</p>
            <p className="mt-4 text-lg text-slate-600">
              All the essentials, none of the overhead. Loop keeps everyone aligned whether you're two people or twenty.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 p-6 transition hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  {f.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-slate-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Loved by remote teams</h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-slate-700">"{t.quote}"</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-200" />
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, honest pricing</h2>
            <p className="mt-4 text-lg text-slate-600">Start free. Upgrade when your team grows.</p>
          </div>
          <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-8">
              <h3 className="text-lg font-semibold">Starter</h3>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-slate-500">/month</span>
              </p>
              <p className="mt-2 text-slate-600">For tiny teams getting organized.</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {["Up to 3 members", "Unlimited tasks", "5 projects", "Basic integrations"].map((i) => (
                  <li key={i} className="flex gap-3">
                    <Check />
                    {i}
                  </li>
                ))}
              </ul>
              <a
                href="#signup"
                className="mt-8 block rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-semibold hover:bg-slate-50"
              >
                Get started
              </a>
            </div>
            <div className="relative rounded-2xl bg-indigo-600 p-8 text-white shadow-xl">
              <span className="absolute -top-3 right-8 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-950">
                Most popular
              </span>
              <h3 className="text-lg font-semibold">Team</h3>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">$8</span>
                <span className="text-indigo-200">/user/month</span>
              </p>
              <p className="mt-2 text-indigo-100">Everything a growing remote team needs.</p>
              <ul className="mt-6 space-y-3 text-sm">
                {["Unlimited members", "Unlimited projects", "Async check-ins", "Shareable status pages"].map((i) => (
                  <li key={i} className="flex gap-3">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 flex-none text-indigo-200">
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {i}
                  </li>
                ))}
              </ul>
              <a
                href="#signup"
                className="mt-8 block rounded-lg bg-white px-4 py-3 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
              >
                Start free trial
              </a>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Need more? <a href="#" className="font-medium text-indigo-600 hover:underline">See all plans →</a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-slate-900 px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to get your team in the loop?</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Join thousands of small teams who ship more and meet less.
          </p>
          <a
            href="#signup"
            className="mt-8 inline-block rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Start your free trial
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className="h-7 w-7 rounded-lg bg-indigo-600" />
              Loop
            </div>
            <p className="mt-3 max-w-xs text-sm text-slate-500">
              Project management for small remote teams. Made with care, everywhere.
            </p>
          </div>
          {[
            { title: "Product", links: ["Features", "Pricing", "Integrations", "Changelog"] },
            { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
            { title: "Resources", links: ["Help center", "Guides", "Privacy", "Terms"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-500">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-slate-900">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 py-6 text-center text-sm text-slate-500">
          © 2026 Loop Inc. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
