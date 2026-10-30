import { Fragment, useState } from "react";

type Billing = "monthly" | "yearly";

const tiers = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    description: "For side projects and trying Meterly out.",
    cta: "Get started",
    highlighted: false,
    features: ["100k API events / month", "7-day data retention", "1 project", "Community support"],
  },
  {
    name: "Team",
    monthly: 49,
    yearly: 39,
    description: "For growing teams shipping production APIs.",
    cta: "Start 14-day trial",
    highlighted: true,
    features: [
      "10M API events / month",
      "90-day data retention",
      "Unlimited projects",
      "Alerts & anomaly detection",
      "Email support",
    ],
  },
  {
    name: "Enterprise",
    monthly: null,
    yearly: null,
    description: "For organizations with scale and compliance needs.",
    cta: "Contact sales",
    highlighted: false,
    features: [
      "Unlimited API events",
      "Custom data retention",
      "SSO & SCIM",
      "Dedicated support & SLA",
      "On-prem deployment option",
    ],
  },
];

type Cell = boolean | string;

const comparison: { category: string; rows: { feature: string; values: [Cell, Cell, Cell] }[] }[] = [
  {
    category: "Usage",
    rows: [
      { feature: "Monthly API events", values: ["100k", "10M", "Unlimited"] },
      { feature: "Data retention", values: ["7 days", "90 days", "Custom"] },
      { feature: "Projects", values: ["1", "Unlimited", "Unlimited"] },
      { feature: "Team members", values: ["1", "Up to 20", "Unlimited"] },
    ],
  },
  {
    category: "Analytics",
    rows: [
      { feature: "Latency & error dashboards", values: [true, true, true] },
      { feature: "Per-customer usage breakdown", values: [false, true, true] },
      { feature: "Alerts & anomaly detection", values: [false, true, true] },
      { feature: "Custom reports & exports", values: [false, true, true] },
    ],
  },
  {
    category: "Security & support",
    rows: [
      { feature: "SSO / SAML", values: [false, false, true] },
      { feature: "Audit logs", values: [false, true, true] },
      { feature: "Uptime SLA", values: [false, "99.9%", "99.99%"] },
      { feature: "Support", values: ["Community", "Email", "Dedicated"] },
    ],
  },
];

const faqs = [
  {
    q: "What counts as an API event?",
    a: "Any single request captured by the Meterly SDK or gateway integration. Health checks and requests you filter out are not counted.",
  },
  {
    q: "What happens if I go over my limit?",
    a: "We never drop your data. On the Free plan, ingestion pauses until the next cycle; on Team, overages are billed at $2 per additional million events.",
  },
  {
    q: "Can I switch plans at any time?",
    a: "Yes. Upgrades take effect immediately and are prorated. Downgrades apply at the end of your current billing period.",
  },
  {
    q: "Do you offer discounts for startups or open source?",
    a: "We do. Eligible startups and open-source maintainers can get Team for free for the first year — reach out to our sales team.",
  },
];

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={`h-5 w-5 ${className}`} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CellValue({ value }: { value: Cell }) {
  if (value === true) return <CheckIcon className="mx-auto text-blue-600" />;
  if (value === false)
    return (
      <svg viewBox="0 0 20 20" className="mx-auto h-5 w-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M5 10h10" />
      </svg>
    );
  return <span className="text-sm text-gray-700">{value}</span>;
}

export default function Page() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-bold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6 text-blue-600">
              <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
            </svg>
            Meterly
          </div>
          <nav className="hidden gap-8 text-sm text-gray-600 md:flex">
            <a href="#" className="hover:text-gray-900">Product</a>
            <a href="#" className="hover:text-gray-900">Docs</a>
            <a href="#" className="font-medium text-gray-900">Pricing</a>
          </nav>
          <a href="#" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Sign up
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Pricing that scales with your API</h1>
        <p className="mt-4 text-lg text-gray-600">
          Start free, upgrade when you need more events, longer retention or advanced alerting.
        </p>

        <div className="mt-10 inline-flex items-center rounded-full bg-gray-200 p-1">
          {(["monthly", "yearly"] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBilling(b)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                billing === b ? "bg-white text-gray-900 shadow" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {b === "monthly" ? "Monthly" : "Yearly"}
              {b === "yearly" && (
                <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Save 20%</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="mx-auto mt-14 grid max-w-6xl gap-8 px-6 lg:grid-cols-3">
        {tiers.map((tier) => {
          const price = billing === "monthly" ? tier.monthly : tier.yearly;
          return (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl bg-white p-8 shadow-sm ${
                tier.highlighted ? "ring-2 ring-blue-600" : "ring-1 ring-gray-200"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h2 className="text-lg font-semibold">{tier.name}</h2>
              <p className="mt-2 text-sm text-gray-600">{tier.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                {price === null ? (
                  <span className="text-4xl font-bold">Custom</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-sm text-gray-500">/month</span>
                  </>
                )}
              </div>
              <p className="mt-1 h-5 text-xs text-gray-500">
                {price !== null && price > 0 && billing === "yearly" ? `Billed $${price * 12} yearly` : ""}
              </p>
              <a
                href="#"
                className={`mt-6 rounded-md px-4 py-2.5 text-center text-sm font-semibold ${
                  tier.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-blue-600 ring-1 ring-blue-200 hover:ring-blue-300"
                }`}
              >
                {tier.cta}
              </a>
              <ul className="mt-8 space-y-3 text-sm text-gray-700">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <CheckIcon className="flex-none text-blue-600" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      {/* Comparison */}
      <section className="mx-auto mt-24 max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">Compare plans</h2>
        <div className="mt-10 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Features</th>
                {tiers.map((t) => (
                  <th key={t.name} className="px-6 py-4 text-center text-sm font-semibold">
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((group) => (
                <Fragment key={group.category}>
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="px-6 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      {group.category}
                    </td>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.feature} className="border-t border-gray-100">
                      <td className="px-6 py-4 text-sm text-gray-900">{row.feature}</td>
                      {row.values.map((v, i) => (
                        <td key={i} className="px-6 py-4 text-center">
                          <CellValue value={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-24 max-w-3xl px-6 pb-24">
        <h2 className="text-center text-3xl font-bold tracking-tight">Frequently asked questions</h2>
        <dl className="mt-10 divide-y divide-gray-200 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="px-6 py-5">
              <dt>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between text-left font-medium"
                >
                  {faq.q}
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className={`h-5 w-5 text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  >
                    <path d="M5 8l5 5 5-5" />
                  </svg>
                </button>
              </dt>
              {openFaq === i && <dd className="mt-3 text-sm text-gray-600">{faq.a}</dd>}
            </div>
          ))}
        </dl>
        <p className="mt-8 text-center text-sm text-gray-600">
          Still have questions?{" "}
          <a href="#" className="font-medium text-blue-600 hover:underline">
            Talk to our team
          </a>
        </p>
      </section>

      <footer className="border-t border-gray-200 bg-white py-8 text-center text-sm text-gray-500">
        © 2026 Meterly, Inc.
      </footer>
    </main>
  );
}
