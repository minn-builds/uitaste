const PLANS = [
  { id: "solo", name: "Solo", price: "€0", period: "per month", recommended: false },
  { id: "studio", name: "Studio", price: "€24", period: "per seat, per month", recommended: true },
  { id: "office", name: "Office", price: "€60", period: "per seat, per month", recommended: false },
] as const;

const FEATURES: { label: string; values: readonly [string, string, string] }[] = [
  { label: "Projects", values: ["3", "Unlimited", "Unlimited"] },
  { label: "Seats", values: ["1", "Up to 20", "Unlimited"] },
  { label: "Grid templates", values: ["12-column", "All", "All + custom"] },
  { label: "Export", values: ["PNG", "PNG, SVG, PDF", "PNG, SVG, PDF"] },
  { label: "Support", values: ["Docs", "Email, 1 day", "Named contact"] },
];

export default function Pricing() {
  return (
    <section
      aria-labelledby="pricing-title"
      className="bg-bg text-fg font-body px-3 md:px-6 pt-8 md:pt-12"
    >
      <div className="grid grid-cols-12 gap-x-3 gap-y-3 border-t-4 border-fg pt-3">
        <p className="col-span-12 md:col-span-2 font-mono text-sm text-muted-fg">02 / Pricing</p>
        <div className="col-span-12 md:col-span-6">
          <h2 id="pricing-title" className="font-display font-bold text-xl md:text-2xl">
            Three plans. One grid.
          </h2>
          <p className="pt-2 text-base text-muted-fg">
            Prices exclude VAT. Annual billing takes two months off. Change plans at any time.
          </p>
        </div>
      </div>

      <ol aria-label="Plans" className="mt-8 flex flex-col gap-6 md:hidden">
        {PLANS.map((plan, planIndex) => (
          <li key={plan.id}>
            <div className="border-t-4 border-fg pt-2">
              {plan.recommended ? (
                <p className="flex items-baseline justify-between gap-x-2 bg-fg text-bg px-2 py-1">
                  <span className="font-display font-bold text-base">{plan.name}</span>
                  <span className="font-mono text-sm">Recommended</span>
                </p>
              ) : (
                <p className="py-1 font-display font-bold text-base">{plan.name}</p>
              )}
              <p className="pt-2 font-mono text-2xl">{plan.price}</p>
              <p className="text-sm text-muted-fg">{plan.period}</p>
              <dl className="mt-2 divide-y divide-border border-y border-border">
                {FEATURES.map((feature) => (
                  <div key={feature.label} className="grid grid-cols-12 gap-x-3 py-1.5">
                    <dt className="col-span-5 text-sm font-medium text-muted-fg">
                      {feature.label}
                    </dt>
                    <dd className="col-span-7">{feature.values[planIndex]}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={`/signup?plan=${plan.id}`}
                className={
                  plan.recommended
                    ? "mt-3 inline-flex items-center min-h-6 px-3 whitespace-nowrap bg-accent text-accent-fg font-medium rounded-none hover:bg-accent-700 transition-colors ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    : "mt-3 inline-flex items-center min-h-6 whitespace-nowrap font-medium underline underline-offset-4 decoration-2 hover:text-accent transition-colors ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                }
              >
                Choose {plan.name}
              </a>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 hidden md:block">
        <table className="w-full table-fixed border-collapse text-left text-base">
          <caption className="sr-only">Plan comparison</caption>
          <thead>
            <tr className="border-b border-fg divide-x divide-border">
              <td className="w-2/12 py-2 pr-2" />
              {PLANS.map((plan) => (
                <th key={plan.id} scope="col" className="align-top p-0">
                  {plan.recommended ? (
                    <div className="pl-3 pr-2 py-2 bg-fg text-bg border-t-4 border-fg">
                      <span className="block font-display font-bold text-base">{plan.name}</span>
                      <span className="block font-mono text-sm">Recommended</span>
                    </div>
                  ) : (
                    <div className="pl-3 pr-2 py-2 border-t-4 border-bg">
                      <span className="block font-display font-bold text-base">{plan.name}</span>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr className="divide-x divide-border">
              <th scope="row" className="py-3 pr-2 align-top text-sm font-medium text-muted-fg">
                Price
              </th>
              {PLANS.map((plan) => (
                <td key={plan.id} className="pl-3 pr-2 py-3 align-top">
                  <span className="block font-mono text-xl md:text-2xl">{plan.price}</span>
                  <span className="block text-sm text-muted-fg">{plan.period}</span>
                </td>
              ))}
            </tr>
            {FEATURES.map((feature) => (
              <tr key={feature.label} className="divide-x divide-border">
                <th scope="row" className="py-2 pr-2 text-sm font-medium text-muted-fg">
                  {feature.label}
                </th>
                {PLANS.map((plan, i) => (
                  <td key={plan.id} className="pl-3 pr-2 py-2">
                    {feature.values[i]}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="divide-x divide-border">
              <td className="py-3 pr-2" />
              {PLANS.map((plan) => (
                <td key={plan.id} className="pl-3 pr-2 py-3">
                  <a
                    href={`/signup?plan=${plan.id}`}
                    className={
                      plan.recommended
                        ? "inline-flex items-center min-h-6 px-3 whitespace-nowrap bg-accent text-accent-fg font-medium rounded-none hover:bg-accent-700 transition-colors ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        : "inline-flex items-center min-h-6 whitespace-nowrap font-medium underline underline-offset-4 decoration-2 hover:text-accent transition-colors ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    }
                  >
                    Choose {plan.name}
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
