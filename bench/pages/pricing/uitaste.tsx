// Preset: swiss. Signature moves: asymmetric 2/10 and 4/8 spans (1), steep size jumps (2),
// thick rules as structure (3), numbered sections (4), one red signal (5), mono tabular numbers (6).
import { useState } from "react";

type Billing = "monthly" | "yearly";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const PLANS = [
  {
    id: "free",
    name: "Free",
    blurb: "For a side project or a first integration.",
    monthly: 0,
    yearly: 0,
    unit: "forever",
    cta: "Create a free key",
    recommended: false,
  },
  {
    id: "team",
    name: "Team",
    blurb: "For product teams shipping a public API.",
    monthly: 49,
    yearly: 490,
    unit: "per workspace",
    cta: "Start a 14-day trial",
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    blurb: "For regulated platforms and high volume.",
    monthly: null,
    yearly: null,
    unit: "annual contract",
    cta: "Talk to sales",
    recommended: false,
  },
] as const;

const FEATURES: { group: string; rows: { label: string; values: readonly [string, string, string] }[] }[] =
  [
    {
      group: "Usage",
      rows: [
        { label: "Tracked requests / month", values: ["100,000", "25 million", "Unlimited"] },
        { label: "Data retention", values: ["7 days", "13 months", "Up to 7 years"] },
        { label: "APIs per workspace", values: ["1", "20", "Unlimited"] },
        { label: "Seats", values: ["2", "15", "Unlimited"] },
      ],
    },
    {
      group: "Analytics",
      rows: [
        { label: "Latency percentiles", values: ["p50, p95", "p50, p95, p99", "p50 to p99.9"] },
        { label: "Per-consumer breakdown", values: ["—", "Yes", "Yes"] },
        { label: "Alerting", values: ["Email", "Email, Slack, PagerDuty", "All + webhooks"] },
        { label: "Raw export", values: ["—", "CSV, Parquet", "S3, BigQuery, Snowflake"] },
      ],
    },
    {
      group: "Security",
      rows: [
        { label: "SSO (SAML)", values: ["—", "—", "Yes"] },
        { label: "Audit log", values: ["—", "90 days", "Unlimited"] },
        { label: "Data region", values: ["EU", "EU or US", "EU, US or dedicated"] },
        { label: "Support", values: ["Docs", "Email, 1 business day", "Named engineer, 1 hour"] },
      ],
    },
  ];

const FAQ = [
  {
    q: "What counts as a tracked request?",
    a: "One HTTP call that reaches your API and is sampled by the Meterly SDK. Health checks and requests you filter out in the SDK config are not counted.",
  },
  {
    q: "What happens if we go over the Team limit?",
    a: "Nothing stops. Extra requests cost $1.50 per million, billed at the end of the month. You get an email at 80% and 100% of the included volume.",
  },
  {
    q: "Can we switch between monthly and yearly?",
    a: "Yes, from Settings at any time. Moving to yearly credits the unused part of your current month. Yearly is billed once and charges 10 months for 12.",
  },
  {
    q: "Do you store request bodies?",
    a: "No. The SDK sends method, route template, status, latency and an optional consumer ID. Payloads never leave your servers.",
  },
];

function price(plan: (typeof PLANS)[number], billing: Billing) {
  const value = billing === "monthly" ? plan.monthly : plan.yearly;
  if (value === null) return { amount: "Custom", period: plan.unit };
  if (value === 0) return { amount: "$0", period: plan.unit };
  return {
    amount: `$${value}`,
    period: billing === "monthly" ? `${plan.unit} / month` : `${plan.unit} / year`,
  };
}

function PlanLink({ plan }: { plan: (typeof PLANS)[number] }) {
  return (
    <a
      href={`/signup?plan=${plan.id}`}
      className={
        plan.recommended
          ? `inline-flex min-h-11 items-center whitespace-nowrap rounded-none bg-accent px-4 font-medium text-accent-fg transition-colors ease-standard hover:bg-accent-700 ${focus}`
          : `inline-flex min-h-11 items-center whitespace-nowrap font-medium underline decoration-2 underline-offset-4 transition-colors ease-standard hover:text-accent ${focus}`
      }
    >
      {plan.cta}
    </a>
  );
}

export default function Page() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <main className="min-h-dvh bg-bg font-body text-base text-fg">
      <header className="border-b border-border px-3 md:px-6">
        <nav aria-label="Primary" className="grid grid-cols-12 items-center gap-x-3">
          <a
            href="/"
            className={`col-span-6 flex min-h-11 items-center font-display font-bold text-lg md:col-span-2 ${focus}`}
          >
            Meterly
          </a>
          <ul className="col-span-12 order-last flex gap-6 overflow-x-auto text-sm font-medium md:order-none md:col-span-8">
            {[
              { label: "Product", href: "/product" },
              { label: "Docs", href: "/docs" },
              { label: "Pricing", href: "/pricing", current: true },
              { label: "Changelog", href: "/changelog" },
            ].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={
                    item.current
                      ? `flex min-h-11 items-center border-b-2 border-accent ${focus}`
                      : `flex min-h-11 items-center border-b-2 border-transparent text-muted-fg transition-colors ease-standard hover:text-fg ${focus}`
                  }
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/login"
            className={`col-span-6 flex min-h-11 items-center justify-end text-sm font-medium md:col-span-2 ${focus}`}
          >
            Sign in
          </a>
        </nav>
      </header>

      <section aria-labelledby="pricing-title" className="px-3 pt-8 pb-12 md:px-6 md:pt-16 md:pb-16">
        <div className="grid grid-cols-12 gap-x-3 gap-y-4 border-t-4 border-fg pt-3">
          <p className="col-span-12 font-mono text-sm text-muted-fg md:col-span-2">01 / Pricing</p>
          <div className="col-span-12 md:col-span-10">
            <h1
              id="pricing-title"
              className="font-display font-bold text-3xl leading-none md:text-5xl"
            >
              Pay for requests
              <br />
              you actually measure.
            </h1>
          </div>
          <p className="col-span-12 max-w-160 text-muted-fg md:col-span-5 md:col-start-3">
            Every plan includes the dashboard, the SDKs for Node, Go, Python and Ruby, and
            per-route latency. You pay more only for volume, retention and control.
          </p>
          <fieldset className="col-span-12 md:col-span-4 md:col-start-9 md:self-end">
            <legend className="font-mono text-sm text-muted-fg">Billing</legend>
            <div className="mt-2 inline-flex border-2 border-fg">
              {(["monthly", "yearly"] as const).map((b) => (
                <label
                  key={b}
                  className="flex min-h-11 cursor-pointer items-center px-4 text-sm font-medium transition-colors ease-standard has-checked:bg-fg has-checked:text-bg hover:bg-muted has-checked:hover:bg-fg has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring"
                >
                  <input
                    type="radio"
                    name="billing"
                    value={b}
                    checked={billing === b}
                    onChange={() => setBilling(b)}
                    className="sr-only"
                  />
                  {b === "monthly" ? "Monthly" : "Yearly, 2 months free"}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <ol aria-label="Plans" className="mt-10 flex flex-col gap-8 md:hidden">
          {PLANS.map((plan, planIndex) => {
            const p = price(plan, billing);
            return (
              <li key={plan.id} className="border-t-4 border-fg pt-2">
                {plan.recommended ? (
                  <p className="flex items-baseline justify-between gap-x-2 bg-fg px-2 py-1 text-bg">
                    <span className="font-display font-bold">{plan.name}</span>
                    <span className="font-mono text-sm">Recommended</span>
                  </p>
                ) : (
                  <p className="py-1 font-display font-bold">{plan.name}</p>
                )}
                <p className="pt-2 font-mono text-2xl">{p.amount}</p>
                <p className="text-sm text-muted-fg">{p.period}</p>
                <p className="pt-2 text-sm">{plan.blurb}</p>
                <dl className="mt-3 divide-y divide-border border-y border-border">
                  {FEATURES.flatMap((g) => g.rows).map((row) => (
                    <div key={row.label} className="grid grid-cols-12 gap-x-3 py-2">
                      <dt className="col-span-6 text-sm text-muted-fg">{row.label}</dt>
                      <dd className="col-span-6 text-sm">{row.values[planIndex]}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-3">
                  <PlanLink plan={plan} />
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 hidden md:block">
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">Plan comparison, billed {billing}</caption>
            <thead>
              <tr className="divide-x divide-border border-b border-fg">
                <td className="w-3/12 py-2 pr-2" />
                {PLANS.map((plan) => (
                  <th key={plan.id} scope="col" className="p-0 align-top">
                    {plan.recommended ? (
                      <div className="border-t-4 border-fg bg-fg py-2 pr-2 pl-3 text-bg">
                        <span className="block font-display font-bold">{plan.name}</span>
                        <span className="block font-mono text-sm">Recommended</span>
                      </div>
                    ) : (
                      <div className="border-t-4 border-bg py-2 pr-2 pl-3">
                        <span className="block font-display font-bold">{plan.name}</span>
                        <span className="block font-mono text-sm text-muted-fg">&nbsp;</span>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="divide-x divide-border">
                <th scope="row" className="py-4 pr-2 align-top text-sm font-medium text-muted-fg">
                  Price
                </th>
                {PLANS.map((plan) => {
                  const p = price(plan, billing);
                  return (
                    <td key={plan.id} className="py-4 pr-2 pl-3 align-top">
                      <span className="block font-mono text-3xl">{p.amount}</span>
                      <span className="block text-sm text-muted-fg">{p.period}</span>
                      <span className="mt-2 block text-sm">{plan.blurb}</span>
                    </td>
                  );
                })}
              </tr>
              {FEATURES.map((group) => [
                <tr key={group.group}>
                  <th
                    scope="colgroup"
                    colSpan={4}
                    className="border-t-4 border-fg pt-6 pb-2 text-left font-display font-bold"
                  >
                    {group.group}
                  </th>
                </tr>,
                ...group.rows.map((row) => (
                  <tr key={row.label} className="divide-x divide-border">
                    <th scope="row" className="py-2 pr-2 text-sm font-medium text-muted-fg">
                      {row.label}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={PLANS[i]?.id} className="py-2 pr-2 pl-3 font-mono text-sm">
                        {v}
                      </td>
                    ))}
                  </tr>
                )),
              ])}
              <tr className="divide-x divide-border">
                <td className="py-4 pr-2" />
                {PLANS.map((plan) => (
                  <td key={plan.id} className="py-4 pr-2 pl-3">
                    <PlanLink plan={plan} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="px-3 pb-16 md:px-6 md:pb-24">
        <div className="grid grid-cols-12 gap-x-3 gap-y-6 border-t-4 border-fg pt-3">
          <p className="col-span-12 font-mono text-sm text-muted-fg md:col-span-2">02 / Questions</p>
          <h2
            id="faq-title"
            className="col-span-12 font-display font-bold text-2xl leading-tight md:col-span-3"
          >
            Before you
            <br />
            choose a plan
          </h2>
          <dl className="col-span-12 border-b border-border md:col-span-7">
            {FAQ.map((item, i) => (
              <div key={item.q} className="grid grid-cols-12 gap-x-3 border-t border-border py-4">
                <dt className="col-span-12 flex gap-3 font-medium md:col-span-5">
                  <span className="font-mono text-sm text-muted-fg">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.q}
                </dt>
                <dd className="col-span-12 pt-2 text-muted-fg md:col-span-7 md:pt-0">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <footer className="bg-fg px-3 py-8 text-bg md:px-6">
        <div className="grid grid-cols-12 gap-x-3 gap-y-4">
          <p className="col-span-12 font-display font-bold text-lg md:col-span-2">Meterly</p>
          <p className="col-span-12 max-w-160 text-sm md:col-span-6">
            Prices in USD, excluding VAT. Need a quote for more than 1 billion requests a month?{" "}
            <a
              href="mailto:sales@meterly.dev"
              className={`underline decoration-2 underline-offset-4 ${focus}`}
            >
              sales@meterly.dev
            </a>
          </p>
          <p className="col-span-12 font-mono text-sm md:col-span-4 md:text-right">
            Status: all regions operational
          </p>
        </div>
      </footer>
    </main>
  );
}
