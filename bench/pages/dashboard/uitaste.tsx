// Preset: soft-utility. Signature moves: panels on a canvas with header and footer strips (1),
// one radius per tier (2), status dot + label (4), divide-x stat strip instead of stat cards (5),
// kbd hints and segmented controls (6).

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const NAV = [
  { label: "Overview", href: "/admin", current: true, count: null },
  { label: "Orders", href: "/admin/orders", count: "18" },
  { label: "Products", href: "/admin/products", count: null },
  { label: "Inventory", href: "/admin/inventory", count: "5" },
  { label: "Customers", href: "/admin/customers", count: null },
  { label: "Discounts", href: "/admin/discounts", count: null },
  { label: "Reports", href: "/admin/reports", count: null },
];

const KPIS = [
  { term: "Revenue", value: "$48,210", note: "+12.4% vs last 30 days", key: true },
  { term: "Orders", value: "1,284", note: "+6.1%" },
  { term: "Average order", value: "$37.55", note: "+5.9%" },
  { term: "Refund rate", value: "1.8%", note: "Down from 2.3%" },
];

const RANGES = [
  { id: "7d", label: "7 days", checked: false },
  { id: "30d", label: "30 days", checked: true },
  { id: "90d", label: "90 days", checked: false },
];

// Daily revenue in hundreds of dollars, last 30 days.
const DAYS = [
  12, 14, 11, 15, 17, 19, 13, 12, 16, 15, 18, 21, 22, 14, 13, 15, 17, 16, 20, 23, 24, 15, 14, 18,
  19, 21, 22, 25, 27, 19,
];

type OrderStatus = "paid" | "fulfilled" | "pending" | "refunded";

const ORDER_STATUS: Record<OrderStatus, { label: string; dot: string; text: string }> = {
  pending: {
    label: "Awaiting payment",
    dot: "size-2 shrink-0 rounded-full border border-neutral-400",
    text: "text-sm",
  },
  paid: { label: "Paid", dot: "size-2 shrink-0 rounded-full bg-neutral-700", text: "text-sm" },
  fulfilled: {
    label: "Fulfilled",
    dot: "size-2 shrink-0 rounded-full bg-neutral-400",
    text: "text-sm",
  },
  refunded: {
    label: "Refunded",
    dot: "size-2 shrink-0 rounded-full bg-destructive",
    text: "text-sm font-semibold text-destructive",
  },
};

const ORDERS: {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: OrderStatus;
  placed: string;
}[] = [
  { id: "#10482", customer: "Hana Kobayashi", items: 3, total: "$84.00", status: "paid", placed: "11:42" },
  { id: "#10481", customer: "Luis Ortega", items: 1, total: "$29.50", status: "pending", placed: "11:17" },
  { id: "#10480", customer: "Amara Diallo", items: 2, total: "$61.20", status: "fulfilled", placed: "10:58" },
  { id: "#10479", customer: "Jonas Weber", items: 5, total: "$142.75", status: "fulfilled", placed: "10:31" },
  { id: "#10478", customer: "Chloé Martin", items: 1, total: "$18.00", status: "refunded", placed: "09:46" },
  { id: "#10477", customer: "Sam Patel", items: 2, total: "$54.40", status: "fulfilled", placed: "09:12" },
];

const LOW_STOCK = [
  { sku: "MUG-STN-12", name: "Stoneware mug, sand", left: 0, reorder: 40 },
  { sku: "TEE-ORG-M", name: "Organic tee, medium, ink", left: 3, reorder: 25 },
  { sku: "TOTE-CNV", name: "Canvas tote, natural", left: 6, reorder: 30 },
  { sku: "CND-FIG-8", name: "Fig candle, 8 oz", left: 8, reorder: 20 },
  { sku: "NB-DOT-A5", name: "Dot-grid notebook, A5", left: 9, reorder: 50 },
];

function Icon({ d }: { d: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 shrink-0"
    >
      <path d={d} />
    </svg>
  );
}

export default function Page() {
  const max = Math.max(...DAYS);

  return (
    <main className="min-h-dvh bg-muted font-body text-base text-fg md:grid md:grid-cols-[15rem_1fr]">
      <aside className="border-b border-border bg-bg md:min-h-dvh md:border-r md:border-b-0">
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <a
            href="/admin"
            className={`flex min-h-11 items-center gap-2 rounded-sm font-display font-bold text-lg md:min-h-9 ${focus}`}
          >
            <span aria-hidden="true" className="size-3 rounded-sm bg-accent" />
            Fernhouse
          </a>
          <span className="text-sm text-muted-fg">Admin</span>
        </div>
        <nav aria-label="Admin">
          <ul className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:overflow-visible">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={
                    item.current
                      ? `flex min-h-11 items-center justify-between gap-3 whitespace-nowrap rounded-sm bg-muted px-3 font-semibold md:min-h-9 ${focus}`
                      : `flex min-h-11 items-center justify-between gap-3 whitespace-nowrap rounded-sm px-3 text-muted-fg transition-colors ease-standard hover:bg-muted hover:text-fg md:min-h-9 ${focus}`
                  }
                >
                  {item.label}
                  {item.count ? (
                    <span className="text-sm text-muted-fg tabular-nums">{item.count}</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden border-t border-border px-4 py-3 md:block">
          <p className="flex items-center gap-2 text-sm text-muted-fg">
            <span aria-hidden="true" className="size-2 rounded-full bg-neutral-400" />
            Storefront online
          </p>
          <p className="mt-1 text-sm text-muted-fg">fernhouse.shop</p>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex flex-wrap items-center gap-3 border-b border-border bg-bg px-4 py-2 md:px-6">
          <form role="search" className="relative min-w-0 flex-1 md:max-w-120" action="/admin/search">
            <label htmlFor="admin-search" className="sr-only">
              Search orders, products and customers
            </label>
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-fg">
              <Icon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 2-4.35-4.35" />
            </span>
            <input
              id="admin-search"
              type="search"
              placeholder="Search orders, products, customers"
              className="min-h-11 w-full rounded-sm border border-border bg-bg pr-12 pl-9 placeholder-muted-fg focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:min-h-9"
            />
            <kbd className="pointer-events-none absolute inset-y-0 right-2 my-auto flex h-6 items-center rounded-sm border border-border bg-bg px-1.5 font-mono text-sm text-muted-fg">
              /
            </kbd>
          </form>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Notifications, 3 unread"
              className={`relative flex size-11 items-center justify-center rounded-sm text-muted-fg transition-colors ease-standard hover:bg-muted hover:text-fg md:size-9 ${focus}`}
            >
              <Icon d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9Zm4.3 13a2 2 0 0 0 3.4 0" />
              <span aria-hidden="true" className="absolute top-2 right-2 size-2 rounded-full bg-fg" />
            </button>
            <button
              type="button"
              className={`flex min-h-11 items-center gap-2 rounded-sm px-2 transition-colors ease-standard hover:bg-muted md:min-h-9 ${focus}`}
            >
              <span
                aria-hidden="true"
                className="flex size-7 items-center justify-center rounded-sm bg-muted font-display font-semibold text-sm"
              >
                IR
              </span>
              <span className="hidden text-sm sm:inline">Iris Rowe</span>
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display font-semibold text-2xl leading-tight tracking-tight">
                Good morning, Iris
              </h1>
              <p className="mt-1 text-sm text-muted-fg">
                Thursday 30 October · 18 orders to ship today
              </p>
            </div>
            <a
              href="/admin/orders?status=paid"
              className={`inline-flex min-h-11 items-center gap-2 rounded-sm bg-accent px-4 font-semibold text-accent-fg transition-colors ease-standard hover:bg-accent-700 md:min-h-9 ${focus}`}
            >
              Ship 18 orders
            </a>
          </div>

          <section
            aria-labelledby="perf-title"
            className="overflow-hidden rounded-md border border-border bg-bg"
          >
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
              <h2 id="perf-title" className="font-display font-medium text-lg">
                Store performance
              </h2>
              <fieldset className="inline-flex rounded-sm border border-border bg-muted p-0.5">
                <legend className="sr-only">Time range</legend>
                {RANGES.map((range) => (
                  <label
                    key={range.id}
                    className="flex min-h-11 cursor-pointer items-center rounded-sm px-3 text-sm text-muted-fg transition-colors ease-standard has-checked:bg-bg has-checked:font-semibold has-checked:text-fg has-focus-visible:outline-2 has-focus-visible:outline-ring md:min-h-8"
                  >
                    <input
                      type="radio"
                      name="perf-range"
                      value={range.id}
                      defaultChecked={range.checked}
                      className="sr-only"
                    />
                    {range.label}
                  </label>
                ))}
              </fieldset>
            </header>
            <dl className="grid grid-cols-1 divide-y divide-border border-b border-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
              {KPIS.map((kpi) => (
                <div key={kpi.term} className="px-4 py-3 sm:border-b sm:border-border lg:border-b-0">
                  <dt className="text-sm text-muted-fg">{kpi.term}</dt>
                  <dd
                    className={
                      kpi.key
                        ? "mt-1 font-display font-bold text-2xl tabular-nums"
                        : "mt-1 font-display font-medium text-2xl tabular-nums"
                    }
                  >
                    {kpi.value}
                  </dd>
                  <dd className="text-sm text-muted-fg">{kpi.note}</dd>
                </div>
              ))}
            </dl>
            <figure className="px-4 py-4">
              <figcaption className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-muted-fg">
                <span>Daily revenue, last 30 days</span>
                <span className="tabular-nums">Peak $2,700 on 28 Oct</span>
              </figcaption>
              <svg
                role="img"
                aria-label="Bar chart of daily revenue. Revenue rose from about $1,200 a day to $2,700 at the peak on 28 October."
                viewBox="0 0 300 100"
                preserveAspectRatio="none"
                className="mt-3 h-40 w-full md:h-48"
              >
                <line x1="0" x2="300" y1="99.5" y2="99.5" className="stroke-border" strokeWidth="1" />
                <line
                  x1="0"
                  x2="300"
                  y1="50"
                  y2="50"
                  className="stroke-border"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                {DAYS.map((v, i) => {
                  const h = (v / max) * 92;
                  return (
                    <rect
                      key={`oct-${i + 1}`}
                      x={i * 10 + 2}
                      y={100 - h}
                      width="6"
                      height={h}
                      className={i === 27 ? "fill-neutral-700" : "fill-neutral-300"}
                    />
                  );
                })}
              </svg>
              <div className="mt-1 flex justify-between text-sm text-muted-fg tabular-nums">
                <span>1 Oct</span>
                <span>15 Oct</span>
                <span>30 Oct</span>
              </div>
            </figure>
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted px-4 py-2">
              <p className="text-sm text-muted-fg">Updated 4 minutes ago · USD, before tax</p>
              <a
                href="/admin/reports/revenue"
                className={`inline-flex min-h-11 items-center gap-2 rounded-sm px-2 text-sm font-semibold transition-colors ease-standard hover:bg-bg md:min-h-8 ${focus}`}
              >
                Open revenue report
                <kbd className="rounded-sm border border-border bg-bg px-1.5 font-mono text-sm font-normal text-muted-fg">
                  G R
                </kbd>
              </a>
            </footer>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <section
              aria-labelledby="orders-title"
              className="overflow-hidden rounded-md border border-border bg-bg lg:col-span-8"
            >
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <h2 id="orders-title" className="font-display font-medium text-lg">
                  Recent orders
                </h2>
                <p className="text-sm text-muted-fg tabular-nums">42 today</p>
              </header>
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Six most recent orders</caption>
                <thead>
                  <tr className="border-b border-border bg-muted text-sm text-muted-fg">
                    <th scope="col" className="py-2 pl-4 font-normal">
                      Order
                    </th>
                    <th scope="col" className="hidden py-2 pl-3 font-normal sm:table-cell">
                      Customer
                    </th>
                    <th scope="col" className="py-2 pl-3 font-normal">
                      Status
                    </th>
                    <th scope="col" className="hidden py-2 pl-3 text-right font-normal md:table-cell">
                      Items
                    </th>
                    <th scope="col" className="py-2 pr-4 pl-3 text-right font-normal">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ORDERS.map((o) => (
                    <tr key={o.id} className="transition-colors ease-standard hover:bg-muted">
                      <td className="py-2 pl-4">
                        <a
                          href={`/admin/orders/${o.id.slice(1)}`}
                          className={`rounded-sm font-mono text-sm underline decoration-border underline-offset-4 hover:decoration-fg ${focus}`}
                        >
                          {o.id}
                        </a>
                        <span className="block text-sm text-muted-fg tabular-nums">{o.placed}</span>
                      </td>
                      <td className="hidden py-2 pl-3 sm:table-cell">{o.customer}</td>
                      <td className="py-2 pl-3">
                        <span className={`flex items-center gap-2 ${ORDER_STATUS[o.status].text}`}>
                          <span aria-hidden="true" className={ORDER_STATUS[o.status].dot} />
                          {ORDER_STATUS[o.status].label}
                        </span>
                      </td>
                      <td className="hidden py-2 pl-3 text-right tabular-nums md:table-cell">
                        {o.items}
                      </td>
                      <td className="py-2 pr-4 pl-3 text-right tabular-nums">{o.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <footer className="flex items-center justify-between gap-3 border-t border-border bg-muted px-4 py-2">
                <p className="text-sm text-muted-fg">Showing 6 of 42</p>
                <a
                  href="/admin/orders"
                  className={`inline-flex min-h-11 items-center rounded-sm px-2 text-sm font-semibold transition-colors ease-standard hover:bg-bg md:min-h-8 ${focus}`}
                >
                  All orders
                </a>
              </footer>
            </section>

            <section
              aria-labelledby="stock-title"
              className="self-start overflow-hidden rounded-md border border-border bg-bg lg:col-span-4"
            >
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <h2 id="stock-title" className="font-display font-medium text-lg">
                  Low stock
                </h2>
                <p className="text-sm text-muted-fg">Below 10 units</p>
              </header>
              <ul className="divide-y divide-border">
                {LOW_STOCK.map((item) => (
                  <li key={item.sku} className="flex items-start justify-between gap-3 px-4 py-2">
                    <span className="min-w-0">
                      <span className="block truncate">{item.name}</span>
                      <span className="block font-mono text-sm text-muted-fg">{item.sku}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      {item.left === 0 ? (
                        <span className="flex items-center justify-end gap-2 text-sm font-semibold text-destructive">
                          <span aria-hidden="true" className="size-2 rounded-full bg-destructive" />
                          Sold out
                        </span>
                      ) : (
                        <span className="block font-semibold tabular-nums">{item.left} left</span>
                      )}
                      <span className="block text-sm text-muted-fg tabular-nums">
                        Reorder {item.reorder}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <footer className="flex items-center justify-between gap-3 border-t border-border bg-muted px-4 py-2">
                <p className="text-sm text-muted-fg">Supplier cut-off 16:00</p>
                <a
                  href="/admin/inventory/purchase-order"
                  className={`inline-flex min-h-11 items-center rounded-sm px-2 text-sm font-semibold transition-colors ease-standard hover:bg-bg md:min-h-8 ${focus}`}
                >
                  Draft purchase order
                </a>
              </footer>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
