// Preset: swiss. Signature moves: asymmetric column spans (2/6/4, 2/4/6), thick rules as
// structure, numbered sections in the label column, one red signal per view (the key number,
// then one flat red field for the download block), and tabular mono numbers.

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const NAV = [
  { label: "Features", href: "#features", current: true },
  { label: "Security", href: "#security", current: false },
  { label: "Pricing", href: "#pricing", current: false },
];

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M16.5 3.5c-1 .1-2.2.8-2.9 1.7-.6.7-1.1 1.8-.9 2.8 1.1 0 2.2-.6 2.9-1.5.6-.8 1-1.8.9-3Z" />
      <path d="M19.5 16.6c-.5 1.2-.8 1.7-1.5 2.7-1 1.4-2.3 3.1-4 3.1-1.5 0-1.9-1-3.9-1s-2.5 1-4 1c-1.7 0-2.9-1.6-3.9-3-2.7-4-3-8.6-1.3-11.1C2 6.5 3.9 5.4 5.7 5.4c1.8 0 3 1 4.5 1 1.5 0 2.4-1 4.5-1 1.6 0 3.3.9 4.5 2.4-4 2.2-3.3 7.8.3 8.8Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M4 3.5v17l9-8.5-9-8.5Z" />
      <path d="M4 3.5l12.5 7L13 12" />
      <path d="M4 20.5l12.5-7L13 12" />
      <path d="M16.5 10.5 20 12.5l-3.5 2" />
    </svg>
  );
}

function StoreButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href="https://apps.apple.com/app/tally-budget"
        className={`inline-flex items-center gap-x-1.5 min-h-6 px-2 bg-fg text-bg rounded-none hover:bg-fg/85 transition-colors ease-standard ${FOCUS}`}
      >
        <AppleIcon />
        <span className="text-left leading-tight">
          <span className="block text-sm">Download on the</span>
          <span className="block font-display font-bold text-base">App Store</span>
        </span>
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=app.tally"
        className={`inline-flex items-center gap-x-1.5 min-h-6 px-2 bg-fg text-bg rounded-none hover:bg-fg/85 transition-colors ease-standard ${FOCUS}`}
      >
        <PlayIcon />
        <span className="text-left leading-tight">
          <span className="block text-sm">Get it on</span>
          <span className="block font-display font-bold text-base">Google Play</span>
        </span>
      </a>
    </div>
  );
}

const BUDGET_ROWS = [
  { label: "Groceries", spent: "€318", of: "€450" },
  { label: "Transport", spent: "€64", of: "€90" },
  { label: "Eating out", spent: "€141", of: "€120" },
];

export default function Page() {
  return (
    <main className="bg-bg text-fg font-body overflow-x-hidden">
      <header className="border-b border-border">
        <nav aria-label="Primary" className="grid grid-cols-12 gap-x-3 px-3 md:px-6 items-baseline">
          <a href="/" className={`col-span-12 md:col-span-2 py-2 font-display font-bold text-base ${FOCUS}`}>
            Tally
          </a>
          <ul className="col-span-12 md:col-span-10 flex flex-wrap gap-x-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={
                    item.current
                      ? `inline-flex items-center min-h-6 text-sm font-medium border-b-2 border-accent ${FOCUS}`
                      : `inline-flex items-center min-h-6 text-sm font-medium text-muted-fg border-b-2 border-bg hover:text-fg transition-colors ease-standard ${FOCUS}`
                  }
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* 01 Hero: label 2 | headline 6 | phone 4 */}
      <section aria-labelledby="hero-title" className="px-3 md:px-6 pt-6 md:pt-12 pb-8 md:pb-12">
        <div className="grid grid-cols-12 gap-x-3 gap-y-4 border-t-4 border-fg pt-3">
          <p className="col-span-12 md:col-span-2 font-mono text-sm text-muted-fg">01 / Tally</p>
          <div className="col-span-12 md:col-span-6">
            <h1 id="hero-title" className="font-display font-bold text-2xl md:text-4xl leading-tight">
              <span className="block">Know what</span>
              <span className="block">is left before</span>
              <span className="block">you spend it.</span>
            </h1>
            <p className="pt-3 max-w-prose text-base">
              Tally connects to 2,400 European banks, sorts every payment into a budget and tells
              you in one number what you can still spend this month. Free for one account.
            </p>
            <div className="pt-4">
              <StoreButtons />
            </div>
            <p className="pt-2 font-mono text-sm text-muted-fg">iOS 16+ · Android 10+ · 4.8 average from 31,000 ratings</p>
          </div>

          <figure className="col-span-12 sm:col-span-8 md:col-span-4 md:pt-6">
            <div
              role="img"
              aria-label="Phone mockup placeholder showing the Tally budget screen"
              className="max-w-40 aspect-[9/16] border-4 border-fg bg-bg p-2 flex flex-col"
            >
              <div className="flex justify-between font-mono text-sm text-muted-fg">
                <span>09:41</span>
                <span>October</span>
              </div>
              <p className="pt-3 text-sm text-muted-fg">Left to spend</p>
              <p className="font-mono text-3xl text-accent tabular-nums">€212</p>
              <p className="text-sm text-muted-fg">of €1,450 · 2 days to payday</p>
              <ul className="mt-3 divide-y divide-border border-y border-border">
                {BUDGET_ROWS.map((r) => (
                  <li key={r.label} className="flex items-baseline justify-between gap-x-2 py-1">
                    <span className="text-sm">{r.label}</span>
                    <span className="font-mono text-sm tabular-nums">
                      {r.spent} <span className="text-muted-fg">/ {r.of}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto border-t-2 border-fg pt-1 flex justify-between font-mono text-sm">
                <span>Budgets</span>
                <span className="text-muted-fg">Goals</span>
                <span className="text-muted-fg">Shared</span>
              </div>
            </div>
          </figure>
        </div>
      </section>

      {/* 02 Features: numbered rows, label 2 | heading 4 | body + data 6 */}
      <section id="features" aria-labelledby="features-title" className="px-3 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-12 gap-x-3 gap-y-3 border-t-4 border-fg pt-3">
          <p className="col-span-12 md:col-span-2 font-mono text-sm text-muted-fg">02</p>
          <h2 id="features-title" className="col-span-12 md:col-span-10 font-display font-bold text-xl md:text-2xl">
            Three things Tally does every day
          </h2>
        </div>
        <ol className="mt-6">
          <li className="grid grid-cols-12 gap-x-3 gap-y-2 border-t border-border py-4">
            <p className="col-span-12 md:col-span-2 font-mono text-sm">2.1</p>
            <h3 className="col-span-12 md:col-span-4 font-display font-bold text-lg">Budgets</h3>
            <div className="col-span-12 md:col-span-6">
              <p className="text-base">
                Set a limit per category once. Tally files each card payment within seconds and
                warns you at 80%, not after you are over.
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-x-3 border-t border-border pt-2">
                <div>
                  <dt className="text-sm text-muted-fg">Categories</dt>
                  <dd className="font-mono text-base">24, editable</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-fg">Sorted automatically</dt>
                  <dd className="font-mono text-base">96%</dd>
                </div>
              </dl>
            </div>
          </li>
          <li className="grid grid-cols-12 gap-x-3 gap-y-2 border-t border-border py-4">
            <p className="col-span-12 md:col-span-2 font-mono text-sm">2.2</p>
            <h3 className="col-span-12 md:col-span-4 font-display font-bold text-lg">Goals</h3>
            <div className="col-span-12 md:col-span-6">
              <p className="text-base">
                Name it, date it, and Tally works out the monthly amount. Round-ups from every
                payment move into the goal on Sunday night.
              </p>
              <p className="mt-2 border-t border-border pt-2 font-mono text-base">
                Lisbon in May · €1,240 of €1,800 · on track
              </p>
            </div>
          </li>
          <li className="grid grid-cols-12 gap-x-3 gap-y-2 border-t border-b border-border py-4">
            <p className="col-span-12 md:col-span-2 font-mono text-sm">2.3</p>
            <h3 className="col-span-12 md:col-span-4 font-display font-bold text-lg">Shared accounts</h3>
            <div className="col-span-12 md:col-span-6">
              <p className="text-base">
                Rent, bills and the weekly shop in one shared space with a partner or flatmates.
                Each person keeps their own budgets private.
              </p>
              <p className="mt-2 border-t border-border pt-2 font-mono text-base">
                Up to 6 people · split by % or by item
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* 03 Security: inverted black block, 4/8 */}
      <section id="security" aria-labelledby="security-title" className="bg-fg text-bg px-3 md:px-6 py-8 md:py-16">
        <div className="grid grid-cols-12 gap-x-3 gap-y-4 border-t-4 border-bg pt-3">
          <p className="col-span-12 md:col-span-2 font-mono text-sm text-bg/70">03</p>
          <div className="col-span-12 md:col-span-4">
            <h2 id="security-title" className="font-display font-bold text-xl md:text-2xl">
              <span className="block">Read-only.</span>
              <span className="block">Always.</span>
            </h2>
            <p className="pt-2 text-base text-bg/80">
              Tally can see your transactions. It cannot move a single cent, and nobody at Tally
              can either.
            </p>
          </div>
          <dl className="col-span-12 md:col-span-6 divide-y divide-bg/30 border-y border-bg/30">
            <div className="grid grid-cols-6 gap-x-3 py-2">
              <dt className="col-span-6 sm:col-span-2 text-sm font-medium text-bg/70">Bank access</dt>
              <dd className="col-span-6 sm:col-span-4 text-base">PSD2 open banking, read-only, renewed every 180 days</dd>
            </div>
            <div className="grid grid-cols-6 gap-x-3 py-2">
              <dt className="col-span-6 sm:col-span-2 text-sm font-medium text-bg/70">Encryption</dt>
              <dd className="col-span-6 sm:col-span-4 text-base">AES-256 at rest, TLS 1.3 in transit</dd>
            </div>
            <div className="grid grid-cols-6 gap-x-3 py-2">
              <dt className="col-span-6 sm:col-span-2 text-sm font-medium text-bg/70">Licence</dt>
              <dd className="col-span-6 sm:col-span-4 text-base">Registered AISP with De Nederlandsche Bank, no. R178204</dd>
            </div>
            <div className="grid grid-cols-6 gap-x-3 py-2">
              <dt className="col-span-6 sm:col-span-2 text-sm font-medium text-bg/70">Your data</dt>
              <dd className="col-span-6 sm:col-span-4 text-base">Never sold. Export or delete it from Settings in one tap</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 04 Download: the page's one flat red field, 7/5 */}
      <section id="pricing" aria-labelledby="download-title" className="px-3 md:px-6 py-8 md:py-16">
        <div className="grid grid-cols-12 gap-x-3 gap-y-4">
          <div className="col-span-12 md:col-span-7 bg-accent text-accent-fg p-3 md:p-4">
            <p className="font-mono text-sm">04</p>
            <h2 id="download-title" className="pt-2 font-display font-bold text-2xl md:text-3xl leading-tight">
              <span className="block">Free for one account.</span>
              <span className="block">€3 a month for all.</span>
            </h2>
            <div className="pt-4">
              <StoreButtons />
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 border-t-4 border-fg pt-3">
            <p className="text-base">
              Tally Plus adds unlimited bank connections, shared accounts and CSV export. Cancel in
              the app; no email to customer service needed.
            </p>
            <p className="pt-2 font-mono text-sm text-muted-fg">Prices include VAT. 30-day free trial of Plus.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-3 md:px-6 py-4">
        <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-sm text-muted-fg">
          <p className="col-span-12 md:col-span-2 font-display font-bold text-base text-fg">Tally</p>
          <p className="col-span-12 md:col-span-4">Tally Finance B.V., Keizersgracht 241, Amsterdam</p>
          <ul className="col-span-12 md:col-span-6 flex flex-wrap gap-x-4">
            <li>
              <a href="/privacy" className={`inline-flex items-center min-h-6 hover:text-fg transition-colors ease-standard ${FOCUS}`}>
                Privacy
              </a>
            </li>
            <li>
              <a href="/terms" className={`inline-flex items-center min-h-6 hover:text-fg transition-colors ease-standard ${FOCUS}`}>
                Terms
              </a>
            </li>
            <li>
              <a href="/security" className={`inline-flex items-center min-h-6 hover:text-fg transition-colors ease-standard ${FOCUS}`}>
                Security
              </a>
            </li>
            <li>
              <a href="mailto:help@tally.app" className={`inline-flex items-center min-h-6 hover:text-fg transition-colors ease-standard ${FOCUS}`}>
                help@tally.app
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </main>
  );
}
