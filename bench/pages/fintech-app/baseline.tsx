const features = [
  {
    title: "Smart Budgets",
    description: "Set monthly budgets by category and get gentle nudges before you overspend. Tally learns your habits automatically.",
    icon: (
      <>
        <path d="M21 12A9 9 0 1 1 12 3v9h9Z" />
        <path d="M15 3.5A9 9 0 0 1 20.5 9H15V3.5Z" />
      </>
    ),
  },
  {
    title: "Savings Goals",
    description: "Save for a trip, a new laptop or a rainy day. Track progress visually and automate transfers on payday.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
  },
  {
    title: "Shared Accounts",
    description: "Split bills with partners or roommates. See shared spending in one place and settle up in a tap.",
    icon: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M16 14.2a5 5 0 0 1 5.5 4.8" />
      </>
    ),
  },
];

const security = [
  { title: "Bank-level encryption", description: "256-bit AES encryption protects your data at rest and in transit." },
  { title: "Read-only access", description: "Tally can never move money without your explicit approval." },
  { title: "Biometric login", description: "Unlock with Face ID or fingerprint for an extra layer of safety." },
  { title: "Never sold", description: "Your financial data is yours. We never sell it to third parties." },
];

function AppStoreButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <a href="#" className="flex items-center gap-3 rounded-xl bg-black px-5 py-3 text-white hover:bg-gray-800">
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1ZM13.9 5c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.2.1 2.3-.6 3-1.5Z" />
        </svg>
        <div className="text-left leading-tight">
          <p className="text-[10px] uppercase">Download on the</p>
          <p className="text-lg font-semibold">App Store</p>
        </div>
      </a>
      <a href="#" className="flex items-center gap-3 rounded-xl bg-black px-5 py-3 text-white hover:bg-gray-800">
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M3.6 2.3c-.2.2-.3.6-.3 1v17.4c0 .4.1.8.3 1l9.7-9.7-9.7-9.7Zm10.7 10.7 2.9 2.9-11.2 6.4 8.3-9.3Zm3.9-3.9 3 1.7c.9.5.9 1.8 0 2.3l-3 1.7-3.2-2.9 3.2-2.8Zm-1-1L6 1.7l8.3 9.3 2.9-2.9Z" />
        </svg>
        <div className="text-left leading-tight">
          <p className="text-[10px] uppercase">Get it on</p>
          <p className="text-lg font-semibold">Google Play</p>
        </div>
      </a>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 font-bold text-white">
              T
            </div>
            <span className="text-xl font-bold">Tally</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#security" className="hover:text-slate-900">Security</a>
            <a href="#" className="hover:text-slate-900">Pricing</a>
            <a href="#download" className="rounded-full bg-slate-900 px-5 py-2 text-white hover:bg-slate-700">
              Get the app
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Now with shared accounts
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Take control of your money,{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">effortlessly.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-slate-600">
              Tally brings your accounts, budgets and goals together in one beautifully simple app. Know where every dollar
              goes and where it should go next.
            </p>
            <div className="mt-8">
              <AppStoreButtons />
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-300" />
                ))}
              </div>
              <p>
                <span className="font-semibold text-slate-900">4.9 ★</span> from 120,000+ users
              </p>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative mx-auto">
            <div className="absolute -inset-10 rounded-full bg-emerald-300/30 blur-3xl" />
            <div className="relative h-[560px] w-[280px] rounded-[3rem] border-[10px] border-slate-900 bg-slate-900 shadow-2xl">
              <div className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-slate-900" />
              <div className="flex h-full w-full flex-col gap-4 overflow-hidden rounded-[2.25rem] bg-slate-50 p-5 pt-12">
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white">
                  <p className="text-xs opacity-80">Total balance</p>
                  <p className="text-2xl font-bold">$12,480.20</p>
                </div>
                <div className="h-24 rounded-2xl bg-white shadow-sm" />
                <div className="h-16 rounded-2xl bg-white shadow-sm" />
                <div className="h-16 rounded-2xl bg-white shadow-sm" />
                <div className="h-16 rounded-2xl bg-white shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight">Everything you need to thrive financially</h2>
          <p className="mt-4 text-lg text-slate-600">Powerful tools, designed to feel simple.</p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 p-8 transition hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {f.icon}
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold">{f.title}</h3>
              <p className="mt-3 text-slate-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section id="security" className="bg-slate-900 py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinejoin="round" />
                <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mt-6 text-4xl font-bold tracking-tight">Your security is our priority</h2>
            <p className="mt-4 text-lg text-slate-300">
              We use the same protections as the world's largest banks, so you can focus on your goals instead of worrying
              about your data.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-slate-400">
              <span className="rounded-full border border-slate-700 px-3 py-1">SOC 2 Type II</span>
              <span className="rounded-full border border-slate-700 px-3 py-1">FDIC partner banks</span>
              <span className="rounded-full border border-slate-700 px-3 py-1">GDPR compliant</span>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {security.map((s) => (
              <div key={s.title} className="rounded-2xl bg-slate-800 p-6">
                <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="download" className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-16 text-center text-white md:px-16">
          <h2 className="text-4xl font-bold tracking-tight">Start your financial journey today</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-50">
            Free to download. Free forever for individuals. Set up in under two minutes.
          </p>
          <div className="mt-8 flex justify-center">
            <AppStoreButtons />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 text-sm font-bold text-white">
                T
              </div>
              <span className="font-bold">Tally</span>
            </div>
            <p className="mt-4 text-sm text-slate-500">Personal finance, made simple.</p>
          </div>
          {[
            { heading: "Product", links: ["Features", "Security", "Pricing", "Changelog"] },
            { heading: "Company", links: ["About", "Careers", "Press", "Blog"] },
            { heading: "Legal", links: ["Privacy", "Terms", "Licenses", "Disclosures"] },
          ].map((col) => (
            <div key={col.heading}>
              <h4 className="text-sm font-semibold">{col.heading}</h4>
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
        <div className="border-t border-slate-100">
          <p className="mx-auto max-w-7xl px-6 py-6 text-xs text-slate-400">
            © 2026 Tally Inc. Tally is a financial technology company, not a bank. Banking services provided by partner
            banks, Member FDIC.
          </p>
        </div>
      </footer>
    </main>
  );
}
