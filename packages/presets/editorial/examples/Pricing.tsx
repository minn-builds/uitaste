/**
 * Editorial pricing: a ruled subscription list, not a card grid. Each tier is a
 * row on the 12-col grid; the recommended tier opens with an accent rule.
 */
export default function Pricing() {
  return (
    <section aria-labelledby="pricing-title" className="bg-bg text-fg font-body">
      <div className="mx-auto max-w-320 px-6 py-24 md:px-12">
        <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-12">
          <p
            aria-hidden="true"
            className="font-display font-light italic text-5xl text-muted-fg md:col-span-3"
          >
            &sect;&nbsp;III
          </p>
          <div className="md:col-span-7">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">
              Subscriptions
            </p>
            <h2 id="pricing-title" className="mt-3 font-display font-light text-3xl md:text-4xl">
              Read it slowly, <em className="italic">on paper</em> or on screen
            </h2>
            <p className="mt-4 max-w-160 text-base text-muted-fg">
              Four issues a year, no advertising. Cancel whenever you like; the issues you paid for
              stay yours.
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col">
          <article
            aria-labelledby="tier-digital"
            className="grid grid-cols-1 gap-x-12 gap-y-4 border-t border-border py-10 md:grid-cols-12 md:items-baseline"
          >
            <h3 id="tier-digital" className="font-display text-2xl md:col-span-3">
              Digital
            </h3>
            <p className="font-display italic text-lg text-muted-fg md:col-span-4">
              Every issue and the full archive, on any device.
            </p>
            <p className="md:col-span-3">
              <span className="font-display font-light text-4xl tabular-nums">$6</span>
              <span className="ml-2 text-sm text-muted-fg">a month</span>
            </p>
            <div className="md:col-span-2 md:text-right">
              <a
                href="/subscribe/digital"
                aria-label="Subscribe to Digital"
                className="inline-flex min-h-11 items-center text-sm underline decoration-1 underline-offset-4 transition-colors ease-standard hover:decoration-accent rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Subscribe
              </a>
            </div>
          </article>

          <article
            aria-labelledby="tier-print"
            className="grid grid-cols-1 gap-x-12 gap-y-4 border-t-2 border-accent py-12 md:grid-cols-12 md:items-baseline"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-accent md:col-span-12">
              Editor&rsquo;s choice
            </p>
            <h3 id="tier-print" className="font-display text-3xl md:col-span-3">
              Print &amp; digital
            </h3>
            <div className="md:col-span-4">
              <p className="font-display italic text-lg text-muted-fg">
                The quarterly, posted to your door, plus everything in Digital.
              </p>
              <ul className="mt-4 flex flex-col gap-1 text-sm text-fg">
                <li>Uncoated 200-page edition, sewn binding</li>
                <li>Free shipping worldwide</li>
                <li>Two gift issues a year</li>
              </ul>
            </div>
            <p className="md:col-span-3">
              <span className="font-display font-light text-5xl tabular-nums">$14</span>
              <span className="ml-2 text-sm text-muted-fg">a month</span>
            </p>
            <div className="md:col-span-2 md:text-right">
              <a
                href="/subscribe/print"
                aria-label="Subscribe to Print and digital"
                className="inline-flex min-h-11 items-center rounded-sm bg-fg px-6 text-sm font-semibold text-bg transition-colors ease-standard hover:bg-accent hover:text-accent-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Subscribe
              </a>
            </div>
          </article>

          <article
            aria-labelledby="tier-library"
            className="grid grid-cols-1 gap-x-12 gap-y-4 border-y border-border py-10 md:grid-cols-12 md:items-baseline"
          >
            <h3 id="tier-library" className="font-display text-2xl md:col-span-3">
              Libraries &amp; schools
            </h3>
            <p className="font-display italic text-lg text-muted-fg md:col-span-7">
              Site licences for institutions, priced by reader count. We reply within two working
              days.
            </p>
            <div className="md:col-span-2 md:text-right">
              <a
                href="/contact/licensing"
                className="inline-flex min-h-11 items-center text-sm underline decoration-1 underline-offset-4 transition-colors ease-standard hover:decoration-accent rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Write to us
              </a>
            </div>
          </article>
        </div>

        <div className="mt-6 gap-x-12 md:grid md:grid-cols-12">
          <p className="font-display italic text-sm text-muted-fg md:col-span-7 md:col-start-4">
            Prices in US dollars, taxes included where applicable.
          </p>
        </div>
      </div>
    </section>
  );
}
