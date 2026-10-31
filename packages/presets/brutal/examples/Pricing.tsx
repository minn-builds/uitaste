const FOCUS = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-fg";

const PLANS = [
  {
    id: "hobby",
    name: "Hobby",
    price: "$0",
    period: "Free, forever",
    note: "One person, side projects.",
    features: [
      ["Build minutes", "300 / mo"],
      ["Preview URLs", "5 live"],
      ["Concurrent builds", "1"],
      ["Rollbacks", "Last 3"],
    ],
    slab: "lg:col-span-4 lg:mt-12 border-3 border-fg bg-bg text-fg",
    cta: `flex items-center justify-center min-h-12 px-6 border-3 border-fg bg-bg font-bold hover:bg-fg hover:text-bg transition ease-standard ${FOCUS}`,
    recommended: false,
  },
  {
    id: "crew",
    name: "Crew",
    price: "$32",
    period: "Per month, flat",
    note: "Unlimited seats. Most teams land here.",
    features: [
      ["Build minutes", "6,000 / mo"],
      ["Preview URLs", "Unlimited"],
      ["Concurrent builds", "4"],
      ["Rollbacks", "Any deploy"],
    ],
    slab: "order-first lg:order-none lg:col-span-5 border-3 border-fg bg-accent text-accent-fg shadow-lg",
    cta: `flex items-center justify-center min-h-12 px-6 border-3 border-fg bg-fg text-bg font-bold transition ease-standard hover:bg-bg hover:text-fg motion-reduce:transition-none ${FOCUS}`,
    recommended: true,
  },
  {
    id: "fleet",
    name: "Fleet",
    price: "$140",
    period: "Per month, flat",
    note: "Audit log, SSO, a human on call.",
    features: [
      ["Build minutes", "40,000 / mo"],
      ["Preview URLs", "Unlimited"],
      ["Concurrent builds", "16"],
      ["Rollbacks", "Any deploy"],
    ],
    slab: "lg:col-span-3 lg:mt-20 border-3 border-fg bg-bg text-fg",
    cta: `flex items-center justify-center min-h-12 px-6 border-3 border-fg bg-bg font-bold hover:bg-fg hover:text-bg transition ease-standard ${FOCUS}`,
    recommended: false,
  },
] as const;

export default function Pricing() {
  return (
    <section
      id="prices"
      aria-labelledby="pricing-title"
      className="bg-bg text-fg font-body px-4 md:px-8 py-12 md:py-20 border-t-3 border-fg"
    >
      <div className="grid grid-cols-12 gap-x-8 gap-y-6">
        <div className="col-span-12 md:col-span-7">
          <p className="inline-block bg-fg text-bg font-mono font-bold uppercase text-sm px-2 py-0.5">
            Pricing
          </p>
          <h2
            id="pricing-title"
            className="mt-6 font-display uppercase text-xl md:text-2xl leading-none"
          >
            <span className="block">Pay for builds,</span>
            <span className="block">not seats.</span>
          </h2>
        </div>
        <p className="col-span-12 md:col-span-4 md:col-start-9 self-end max-w-prose text-base">
          Every plan includes every teammate. Prices in USD, billed monthly, cancel from the
          dashboard in two clicks.
        </p>
      </div>

      <ol
        aria-label="Plans"
        className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {PLANS.map((plan) => (
          <li key={plan.id} className={plan.slab}>
            <div className="flex items-center justify-between gap-4 border-b-3 border-fg px-6 py-4">
              <h3 className="font-display uppercase text-lg leading-none">{plan.name}</h3>
              {plan.recommended ? (
                <span className="bg-fg text-bg font-mono font-bold uppercase text-sm px-2 py-0.5">
                  Pick this
                </span>
              ) : null}
            </div>
            <div className="px-6 pt-6">
              <p className="font-display text-2xl leading-none">{plan.price}</p>
              <p className="mt-2 font-mono text-base">{plan.period}</p>
              <p className="mt-4 text-base">{plan.note}</p>
            </div>
            <dl className="mt-6 mx-6 border-y-3 border-fg divide-y divide-fg">
              {plan.features.map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-4 py-2">
                  <dt className="text-base">{label}</dt>
                  <dd className="font-mono font-bold text-base text-right">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="p-6">
              <a href={`/signup?plan=${plan.id}`} className={plan.cta}>
                Choose {plan.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
