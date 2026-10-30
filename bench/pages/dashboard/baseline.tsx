import { useState } from "react";

const navItems = [
  { label: "Dashboard", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { label: "Orders", icon: "M6 2l-3 4v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" },
  { label: "Products", icon: "M21 16V8l-9-5-9 5v8l9 5zM3.3 7L12 12l8.7-5M12 22V12" },
  { label: "Customers", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
  { label: "Analytics", icon: "M3 3v18h18M7 15l4-4 3 3 5-6" },
  { label: "Settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" },
];

const kpis = [
  { label: "Total revenue", value: "$48,295", change: "+12.5%", up: true },
  { label: "Orders", value: "1,284", change: "+8.2%", up: true },
  { label: "Avg. order value", value: "$37.61", change: "-2.1%", up: false },
  { label: "Conversion rate", value: "3.42%", change: "+0.4%", up: true },
];

type Status = "Paid" | "Pending" | "Shipped" | "Refunded";

const orders: { id: string; customer: string; date: string; total: string; status: Status }[] = [
  { id: "#10482", customer: "Olivia Martin", date: "Oct 30, 2026", total: "$129.00", status: "Paid" },
  { id: "#10481", customer: "Jackson Lee", date: "Oct 30, 2026", total: "$54.20", status: "Pending" },
  { id: "#10480", customer: "Isabella Nguyen", date: "Oct 29, 2026", total: "$312.75", status: "Shipped" },
  { id: "#10479", customer: "William Kim", date: "Oct 29, 2026", total: "$89.99", status: "Paid" },
  { id: "#10478", customer: "Sofia Davis", date: "Oct 28, 2026", total: "$24.50", status: "Refunded" },
  { id: "#10477", customer: "Liam Johnson", date: "Oct 28, 2026", total: "$198.00", status: "Shipped" },
];

const statusStyles: Record<Status, string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Refunded: "bg-red-100 text-red-700",
};

const lowStock = [
  { name: "Linen Tote Bag", sku: "TB-201", stock: 3, threshold: 20 },
  { name: "Ceramic Mug — Sage", sku: "MG-114", stock: 5, threshold: 25 },
  { name: "Wool Beanie — Navy", sku: "BN-078", stock: 8, threshold: 30 },
  { name: "Notebook A5 Dotted", sku: "NB-332", stock: 11, threshold: 40 },
];

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  );
}

export default function Page() {
  const [active, setActive] = useState("Dashboard");
  const [range, setRange] = useState("30d");

  return (
    <main className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col bg-gray-900 text-gray-300 lg:flex">
        <div className="flex items-center gap-2 px-6 py-5 text-lg font-bold text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
            <Icon d="M6 2l-3 4v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18" className="h-5 w-5 text-white" />
          </div>
          ShopAdmin
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActive(item.label)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active === item.label ? "bg-gray-800 text-white" : "hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon d={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-700" />
            <div className="text-sm">
              <div className="font-medium text-white">Alex Morgan</div>
              <div className="text-xs text-gray-400">Store owner</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
          <div className="relative w-full max-w-md">
            <Icon d="M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search orders, products, customers..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pr-4 pl-10 text-sm focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
              <Icon d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="h-9 w-9 rounded-full bg-indigo-200" />
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, Alex. Here's what's happening with your store.</p>
            </div>
            <div className="flex rounded-lg border border-gray-200 bg-white p-1 text-sm">
              {["7d", "30d", "90d"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`rounded-md px-3 py-1.5 font-medium ${range === r ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-gray-500">{k.label}</p>
                <p className="mt-2 text-3xl font-semibold">{k.value}</p>
                <p className={`mt-2 flex items-center gap-1 text-sm font-medium ${k.up ? "text-green-600" : "text-red-600"}`}>
                  <Icon d={k.up ? "M7 17L17 7M17 7H8M17 7v9" : "M7 7l10 10M17 17H8M17 17V8"} className="h-4 w-4" />
                  {k.change}
                  <span className="font-normal text-gray-500">vs last period</span>
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {/* Revenue chart */}
            <div className="rounded-xl bg-white p-6 shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Revenue</h2>
                <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  View report
                </button>
              </div>
              <div className="mt-6 flex h-72 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-sm text-gray-400">
                Revenue chart placeholder
              </div>
            </div>

            {/* Low stock */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Low stock alerts</h2>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                  {lowStock.length} items
                </span>
              </div>
              <ul className="mt-4 divide-y divide-gray-100">
                {lowStock.map((item) => (
                  <li key={item.sku} className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-gray-100" />
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">SKU {item.sku}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${item.stock <= 5 ? "text-red-600" : "text-amber-600"}`}>
                        {item.stock} left
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                      <div
                        className={`h-1.5 rounded-full ${item.stock <= 5 ? "bg-red-500" : "bg-amber-500"}`}
                        style={{ width: `${(item.stock / item.threshold) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Restock items
              </button>
            </div>
          </div>

          {/* Recent orders */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-lg font-semibold">Recent orders</h2>
              <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View all
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs tracking-wider text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-3 font-medium">Order</th>
                    <th className="px-6 py-3 font-medium">Customer</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-indigo-600">{o.id}</td>
                      <td className="px-6 py-4">{o.customer}</td>
                      <td className="px-6 py-4 text-gray-500">{o.date}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[o.status]}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium">{o.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
