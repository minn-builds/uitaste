const PLANS = [
  {
    id: "starter",
    name: "Starter",
    blurb: "One inbox, up to 3 agents.",
    price: "$0",
    unit: "free forever",
    checked: false,
  },
  {
    id: "team",
    name: "Team",
    blurb: "Routing rules, SLAs and shared views.",
    price: "$18",
    unit: "per agent / month",
    checked: true,
  },
  {
    id: "scale",
    name: "Scale",
    blurb: "SSO, audit log, EU or US data region.",
    price: "$42",
    unit: "per agent / month",
    checked: false,
  },
] as const;

const LIMITS: { label: string; values: readonly [string, string, string] }[] = [
  { label: "Inboxes", values: ["1", "10", "Unlimited"] },
  { label: "Automations", values: ["5", "100", "Unlimited"] },
  { label: "History", values: ["30 days", "2 years", "Unlimited"] },
  { label: "API calls / min", values: ["60", "600", "3,000"] },
];

const SUMMARY = [
  { term: "Plan", value: "Team, monthly" },
  { term: "Agents", value: "8 × $18" },
  { term: "Tax", value: "Calculated at checkout" },
];

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export default function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="bg-muted text-fg font-body border-t border-border"
    >
      <div className="mx-auto max-w-300 px-4 py-10 md:px-6 md:py-16">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2
              id="pricing-title"
              className="font-display font-semibold text-2xl tracking-tight leading-tight"
            >
              Pricing
            </h2>
            <p className="mt-1 max-w-160 text-balance text-base text-muted-fg">
              Pay per agent who answers requests. Viewers and admins are free on every plan.
            </p>
          </div>
          <p className="text-sm text-muted-fg">Prices in USD, excluding tax.</p>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
          <form className="md:col-span-7" aria-label="Choose a plan">
            <fieldset>
              <legend className="text-sm font-semibold text-muted-fg">Plan</legend>
              <div className="mt-2 flex flex-col gap-2">
                {PLANS.map((plan) => (
                  <label
                    key={plan.id}
                    className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-bg px-4 py-3 hover:border-neutral-300 has-checked:border-accent transition-colors ease-standard"
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      defaultChecked={plan.checked}
                      className={`mt-1 size-4 shrink-0 accent-accent ${focus}`}
                    />
                    <span className="flex min-w-0 flex-1 items-start justify-between gap-4">
                      <span>
                        <span className="block font-display font-medium text-lg">{plan.name}</span>
                        <span className="block text-sm text-muted-fg">{plan.blurb}</span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-lg font-semibold tabular-nums">
                          {plan.price}
                        </span>
                        <span className="block text-sm text-muted-fg">{plan.unit}</span>
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 overflow-x-auto rounded-md border border-border bg-bg">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Plan limits</caption>
                <thead>
                  <tr className="border-b border-border bg-muted text-sm text-muted-fg">
                    <th scope="col" className="py-2 pl-4 font-normal">
                      Limit
                    </th>
                    {PLANS.map((plan) => (
                      <th key={plan.id} scope="col" className="py-2 pr-4 text-right font-normal">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {LIMITS.map((row) => (
                    <tr key={row.label}>
                      <th scope="row" className="py-2 pl-4 text-base font-normal text-muted-fg">
                        {row.label}
                      </th>
                      {row.values.map((value, i) => (
                        <td
                          key={PLANS[i]?.id}
                          className="py-2 pr-4 text-right text-base tabular-nums"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </form>

          <aside
            aria-labelledby="summary-title"
            className="self-start rounded-lg border border-border bg-bg shadow-sm md:col-span-5"
          >
            <div className="border-b border-border px-4 py-3">
              <h3 id="summary-title" className="font-display font-medium text-base">
                Summary
              </h3>
            </div>
            <dl className="divide-y divide-border px-4">
              {SUMMARY.map((item) => (
                <div key={item.term} className="flex items-baseline justify-between gap-4 py-2">
                  <dt className="text-sm text-muted-fg">{item.term}</dt>
                  <dd className="text-right text-base tabular-nums">{item.value}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-base font-semibold">Due today</dt>
                <dd className="font-display font-bold text-2xl tabular-nums">$144</dd>
              </div>
            </dl>
            <div className="border-t border-border px-4 py-4">
              <a
                href="/checkout?plan=team"
                className={`flex min-h-11 w-full items-center justify-center rounded-sm bg-accent px-4 text-base font-semibold text-accent-fg hover:bg-accent-700 transition-colors ease-standard ${focus}`}
              >
                Continue with Team
              </a>
              <p className="mt-3 text-sm text-muted-fg">
                Cancel or switch plans from Settings. Unused days are credited.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
