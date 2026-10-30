import { type ReactNode, useState } from "react";

const guides = [
  {
    title: "Configuration",
    description: "Learn how to configure Forge with forge.toml and environment variables.",
    icon: (
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    ),
  },
  {
    title: "Templates",
    description: "Scaffold new projects from built-in or community templates.",
    icon: <path d="M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z" />,
  },
  {
    title: "Plugins",
    description: "Extend Forge with custom commands, hooks and generators.",
    icon: <path d="M12 2v6 M8 8h8v4a4 4 0 0 1-8 0V8Z M12 16v6" />,
  },
  {
    title: "CI/CD Integration",
    description: "Run Forge in GitHub Actions, GitLab CI and other pipelines.",
    icon: <path d="M4 12a8 8 0 0 1 14-5.3L20 9 M20 4v5h-5 M20 12a8 8 0 0 1-14 5.3L4 15 M4 20v-5h5" />,
  },
  {
    title: "Deployment",
    description: "Ship builds to your cloud provider with a single command.",
    icon: <path d="M12 2 4 7v10l8 5 8-5V7l-8-5Z M12 22V12 M20 7l-8 5-8-5" />,
  },
  {
    title: "Troubleshooting",
    description: "Diagnose common problems and read verbose logs.",
    icon: <path d="M12 9v4 M12 17h.01 M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />,
  },
];

const apiCommands = [
  { name: "forge init", description: "Create a new Forge project in the current directory." },
  { name: "forge build", description: "Compile the project using the active configuration." },
  { name: "forge run <task>", description: "Run a named task defined in forge.toml." },
  { name: "forge plugin add", description: "Install a plugin from the registry." },
  { name: "forge deploy", description: "Deploy the latest build to a target environment." },
  { name: "forge doctor", description: "Check your environment for common issues." },
];

const changelog = [
  {
    version: "v2.4.0",
    date: "Oct 21, 2026",
    tag: "Feature",
    items: ["Added `forge doctor` command", "Parallel task execution with --jobs flag"],
  },
  {
    version: "v2.3.2",
    date: "Oct 3, 2026",
    tag: "Fix",
    items: ["Fixed config resolution on Windows paths", "Improved error messages for missing plugins"],
  },
  {
    version: "v2.3.0",
    date: "Sep 12, 2026",
    tag: "Feature",
    items: ["New template registry", "Support for TOML includes"],
  },
];

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function Page() {
  const [copied, setCopied] = useState(false);
  const installCmd = "npm install -g @forge/cli";

  const handleCopy = () => {
    navigator.clipboard?.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path d="M4 17l6-6-6-6 M12 19h8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-lg font-semibold">Forge</span>
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">v2.4</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
            <a href="#getting-started" className="hover:text-gray-900">Docs</a>
            <a href="#guides" className="hover:text-gray-900">Guides</a>
            <a href="#api" className="hover:text-gray-900">API</a>
            <a href="#changelog" className="hover:text-gray-900">Changelog</a>
            <a href="#" className="flex items-center gap-1 hover:text-gray-900">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
              </svg>
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Hero + search */}
      <section className="bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Forge Documentation</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Everything you need to build, automate and ship with the Forge CLI.
          </p>
          <div className="relative mx-auto mt-8 max-w-xl">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Search the docs..."
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-16 text-base shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 rounded border border-gray-300 bg-gray-50 px-2 py-0.5 text-xs text-gray-500">
              ⌘K
            </kbd>
          </div>
        </div>
      </section>

      {/* Getting started */}
      <section id="getting-started" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Getting Started</h2>
            <p className="mt-4 text-gray-600">
              Install Forge globally with npm, then run <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">forge init</code> to
              scaffold your first project. Forge works on macOS, Linux and Windows with Node.js 20 or later.
            </p>
            <ol className="mt-6 space-y-3 text-sm text-gray-700">
              {["Install the CLI", "Initialize a project", "Run your first build"].map((step, i) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <a
              href="#"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700"
            >
              Read the quickstart
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M5 12h14 M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <div className="overflow-hidden rounded-xl bg-gray-900 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="p-5 font-mono text-sm leading-relaxed text-gray-100">
              <code>
                <span className="text-gray-500"># Install</span>
                {"\n"}
                <span className="text-green-400">$</span> {installCmd}
                {"\n\n"}
                <span className="text-gray-500"># Create a project</span>
                {"\n"}
                <span className="text-green-400">$</span> forge init my-app
                {"\n\n"}
                <span className="text-gray-500"># Build it</span>
                {"\n"}
                <span className="text-green-400">$</span> cd my-app && forge build
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Guides */}
      <section id="guides" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold tracking-tight">Guides</h2>
          <p className="mt-2 text-gray-600">In-depth walkthroughs for the most common workflows.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <a
                key={guide.title}
                href="#"
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon>{guide.icon}</Icon>
                </div>
                <h3 className="mt-4 font-semibold group-hover:text-indigo-600">{guide.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{guide.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* API reference + changelog */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-3">
        <div id="api" className="lg:col-span-2">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold tracking-tight">API Reference</h2>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View all commands →
            </a>
          </div>
          <ul className="mt-8 divide-y divide-gray-200 rounded-xl border border-gray-200">
            {apiCommands.map((cmd) => (
              <li key={cmd.name}>
                <a href="#" className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50">
                  <div>
                    <code className="font-mono text-sm font-semibold text-indigo-600">{cmd.name}</code>
                    <p className="mt-1 text-sm text-gray-600">{cmd.description}</p>
                  </div>
                  <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div id="changelog">
          <h2 className="text-3xl font-bold tracking-tight">Changelog</h2>
          <div className="mt-8 space-y-6 border-l-2 border-gray-200 pl-6">
            {changelog.map((entry) => (
              <div key={entry.version} className="relative">
                <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-indigo-600" />
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{entry.version}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      entry.tag === "Feature" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {entry.tag}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{entry.date}</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-gray-600">
                  {entry.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <a href="#" className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
            Full changelog →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 sm:flex-row">
          <p>© 2026 Forge contributors. MIT License.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900">GitHub</a>
            <a href="#" className="hover:text-gray-900">Discord</a>
            <a href="#" className="hover:text-gray-900">Contributing</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
