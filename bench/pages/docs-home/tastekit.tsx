// Preset: swiss. Signature moves: asymmetric column spans (2/10, 4/8, 7/5), thick rules as
// structure, numbered sections in the label column, one red signal, tabular mono numbers.

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const NAV = [
  { label: "Docs", href: "#docs", current: true },
  { label: "API", href: "#api", current: false },
  { label: "Changelog", href: "#changelog", current: false },
  { label: "GitHub", href: "https://github.com/forge-cli/forge", current: false },
];

const GUIDES = [
  {
    index: "2.1",
    title: "Your first pipeline",
    body: "Write a forge.toml, chain three tasks and watch Forge skip the ones whose inputs did not change.",
    meta: "12 min · Beginner",
    href: "#guide-pipeline",
    span: "md:col-span-5",
  },
  {
    index: "2.2",
    title: "Caching and remote stores",
    body: "Share build outputs across laptops and CI with an S3 or GCS bucket. Cold builds drop from minutes to seconds.",
    meta: "18 min · Intermediate",
    href: "#guide-cache",
    span: "md:col-span-5",
  },
  {
    index: "2.3",
    title: "Writing plugins",
    body: "Extend Forge with a task type in TypeScript or Rust.",
    meta: "25 min · Advanced",
    href: "#guide-plugins",
    span: "md:col-span-4",
  },
  {
    index: "2.4",
    title: "Running in CI",
    body: "Recipes for GitHub Actions, GitLab and Buildkite.",
    meta: "8 min · Recipe",
    href: "#guide-ci",
    span: "md:col-span-3",
  },
  {
    index: "2.5",
    title: "Migrating from Make",
    body: "Map targets, phony rules and variables to tasks.",
    meta: "15 min · Recipe",
    href: "#guide-make",
    span: "md:col-span-3",
  },
];

const API = [
  { name: "forge run", kind: "Command", desc: "Run one or more tasks and their dependencies", since: "0.1" },
  { name: "forge watch", kind: "Command", desc: "Re-run tasks when their inputs change", since: "0.4" },
  { name: "forge graph", kind: "Command", desc: "Print the task graph as text, DOT or JSON", since: "0.6" },
  { name: "forge cache", kind: "Command", desc: "Inspect, prune or push the local cache", since: "0.9" },
  { name: "[task]", kind: "Config", desc: "Task table in forge.toml: cmd, inputs, outputs, deps", since: "0.1" },
  { name: "defineTask()", kind: "Plugin API", desc: "Register a custom task type from a plugin", since: "1.2" },
];

const CHANGES = [
  { version: "1.8.0", date: "2026-10-21", note: "Remote cache uploads run in parallel; pushes are 3.4× faster on large outputs." },
  { version: "1.7.2", date: "2026-10-02", note: "Fix: forge watch no longer misses renames on macOS." },
  { version: "1.7.0", date: "2026-09-14", note: "New forge graph --json output for editor integrations." },
];

export default function Page() {
  return (
    <main className="bg-bg text-fg font-body min-h-dvh">
      <header className="border-b border-border">
        <nav
          aria-label="Primary"
          className="grid grid-cols-12 gap-x-3 px-3 md:px-6 items-baseline"
        >
          <a
            href="/"
            className={`col-span-12 md:col-span-2 py-2 font-display font-bold text-base ${FOCUS}`}
          >
            Forge <span className="font-mono font-normal text-sm text-muted-fg">docs</span>
          </a>
          <ul className="col-span-12 md:col-span-7 flex flex-wrap gap-x-4">
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
          <p className="hidden md:block md:col-span-3 py-2 font-mono text-sm text-muted-fg text-right">
            v1.8.0
          </p>
        </nav>
      </header>

      {/* 01 Search: headline-led, 2/10 split */}
      <section aria-labelledby="title" className="px-3 md:px-6 pt-6 md:pt-12 pb-8 md:pb-12">
        <div className="grid grid-cols-12 gap-x-3 gap-y-3 border-t-4 border-fg pt-3">
          <p className="col-span-12 md:col-span-2 font-mono text-sm text-muted-fg">01 / Docs</p>
          <div className="col-span-12 md:col-span-10">
            <h1 id="title" className="font-display font-bold text-2xl md:text-4xl leading-tight">
              <span className="block">Forge builds</span>
              <span className="block">only what changed.</span>
            </h1>
          </div>
          <p className="col-span-12 md:col-start-3 md:col-span-5 pt-2 text-base">
            Forge is an open source task runner for monorepos. Describe tasks once in forge.toml;
            Forge hashes their inputs, runs them in parallel and replays cached outputs.
          </p>
          <form
            role="search"
            className="col-span-12 md:col-start-3 md:col-span-6 pt-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="docs-search" className="block text-sm font-medium">
              Search the docs
            </label>
            <div className="flex items-end gap-x-3">
              <input
                id="docs-search"
                type="search"
                placeholder="cache, watch, plugins…"
                className="w-full min-w-0 bg-bg px-0 py-1.5 text-base border-0 border-b-2 border-fg rounded-none placeholder-muted-fg focus:outline-none focus:border-accent transition-colors ease-standard"
              />
              <button
                type="submit"
                className={`shrink-0 inline-flex items-center min-h-6 px-3 bg-accent text-accent-fg font-medium text-base rounded-none hover:bg-accent-700 transition-colors ease-standard ${FOCUS}`}
              >
                Search
              </button>
            </div>
            <p className="pt-1 font-mono text-sm text-muted-fg">Press / anywhere to focus</p>
          </form>
        </div>
      </section>

      {/* 02 Getting started: inverted install block, 4/8 */}
      <section aria-labelledby="start" className="px-3 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-12 gap-x-3 gap-y-4 border-t-4 border-fg pt-3">
          <p className="col-span-12 md:col-span-2 font-mono text-sm text-muted-fg">02</p>
          <div className="col-span-12 md:col-span-3">
            <h2 id="start" className="font-display font-bold text-xl md:text-2xl">
              Getting started
            </h2>
            <p className="pt-2 text-base text-muted-fg">
              Node 20 or later. macOS, Linux and Windows.
            </p>
          </div>
          <div className="col-span-12 md:col-span-7">
            <div className="bg-fg text-bg p-3">
              <p className="font-mono text-sm text-bg/70">Install</p>
              <pre className="pt-1 font-mono text-base overflow-x-auto">
                <code>npm install --global @forge-cli/forge</code>
              </pre>
            </div>
            <ol className="mt-3 divide-y divide-border border-b border-border">
              <li className="grid grid-cols-12 gap-x-3 py-2">
                <span className="col-span-2 md:col-span-1 font-mono text-sm text-muted-fg">1</span>
                <p className="col-span-10 md:col-span-11 text-base">
                  Run <code className="font-mono">forge init</code> in your repo root to write a
                  starter forge.toml.
                </p>
              </li>
              <li className="grid grid-cols-12 gap-x-3 py-2">
                <span className="col-span-2 md:col-span-1 font-mono text-sm text-muted-fg">2</span>
                <p className="col-span-10 md:col-span-11 text-base">
                  Run <code className="font-mono">forge run build</code>. The second run finishes
                  from cache.
                </p>
              </li>
              <li className="grid grid-cols-12 gap-x-3 py-2">
                <span className="col-span-2 md:col-span-1 font-mono text-sm text-muted-fg">3</span>
                <p className="col-span-10 md:col-span-11 text-base">
                  Open <code className="font-mono">forge graph</code> to see what depends on what.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* 03 Guides: rule-topped blocks with mixed spans */}
      <section id="docs" aria-labelledby="guides" className="px-3 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-12 gap-x-3 gap-y-3 border-t-4 border-fg pt-3">
          <p className="col-span-12 md:col-span-2 font-mono text-sm text-muted-fg">03</p>
          <h2 id="guides" className="col-span-12 md:col-span-10 font-display font-bold text-xl md:text-2xl">
            Guides
          </h2>
        </div>
        <ul className="mt-4 grid grid-cols-12 gap-x-3 gap-y-6">
          {GUIDES.map((g, i) => (
            <li
              key={g.index}
              className={`col-span-12 ${g.span} ${i === 0 || i === 2 ? "md:col-start-3" : ""}`}
            >
              <a href={g.href} className={`group block border-t-2 border-fg pt-2 pb-1 ${FOCUS}`}>
                <span className="block font-mono text-sm text-muted-fg">{g.index}</span>
                <span className="block pt-1 font-display font-bold text-lg group-hover:text-accent transition-colors ease-standard">
                  {g.title}
                </span>
                <span className="block pt-1 text-base text-muted-fg">{g.body}</span>
                <span className="block pt-2 font-mono text-sm">{g.meta}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 04 API reference: full-width table */}
      <section id="api" aria-labelledby="api-title" className="px-3 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-12 gap-x-3 gap-y-3 border-t-4 border-fg pt-3">
          <p className="col-span-12 md:col-span-2 font-mono text-sm text-muted-fg">04</p>
          <div className="col-span-12 md:col-span-10">
            <h2 id="api-title" className="font-display font-bold text-xl md:text-2xl">
              API reference
            </h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              <li className="hidden md:grid grid-cols-10 gap-x-3 py-2 text-sm font-medium text-muted-fg">
                <span className="col-span-3">Name</span>
                <span className="col-span-2">Kind</span>
                <span className="col-span-4">Description</span>
                <span className="col-span-1 text-right">Since</span>
              </li>
              {API.map((row) => (
                <li key={row.name}>
                  <a
                    href={`#api-${row.name.replace(/[^a-z]/gi, "")}`}
                    className={`grid grid-cols-10 gap-x-3 gap-y-1 py-2 hover:bg-muted transition-colors ease-standard ${FOCUS}`}
                  >
                    <code className="col-span-7 md:col-span-3 font-mono text-base">{row.name}</code>
                    <span className="col-span-3 md:col-span-2 text-sm text-muted-fg text-right md:text-left">
                      {row.kind}
                    </span>
                    <span className="col-span-10 md:col-span-4 text-base">{row.desc}</span>
                    <span className="hidden md:block md:col-span-1 font-mono text-sm text-right tabular-nums">
                      {row.since}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 05 Changelog: 7/5 with the latest release marked in red */}
      <section id="changelog" aria-labelledby="changes" className="px-3 md:px-6 py-8 md:py-16">
        <div className="grid grid-cols-12 gap-x-3 gap-y-4 border-t-4 border-fg pt-3">
          <p className="col-span-12 md:col-span-2 font-mono text-sm text-muted-fg">05</p>
          <div className="col-span-12 md:col-span-3">
            <h2 id="changes" className="font-display font-bold text-xl md:text-2xl">
              Changelog
            </h2>
            <a
              href="#changelog-all"
              className={`mt-2 inline-flex items-center min-h-6 text-base font-medium underline underline-offset-4 decoration-2 hover:text-accent transition-colors ease-standard ${FOCUS}`}
            >
              All 64 releases
            </a>
          </div>
          <ol className="col-span-12 md:col-span-7 divide-y divide-border border-b border-border">
            {CHANGES.map((c, i) => (
              <li key={c.version} className="grid grid-cols-7 gap-x-3 gap-y-1 py-3">
                <p className="col-span-7 md:col-span-2 font-mono text-base">
                  <span className={i === 0 ? "border-b-2 border-accent" : undefined}>{c.version}</span>
                  <span className="block font-mono text-sm text-muted-fg">{c.date}</span>
                </p>
                <p className="col-span-7 md:col-span-5 text-base">{c.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="border-t border-border px-3 md:px-6 py-4">
        <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-sm text-muted-fg">
          <p className="col-span-12 md:col-span-2 font-display font-bold text-fg">Forge</p>
          <p className="col-span-12 md:col-span-5">MIT licensed. 214 contributors.</p>
          <a
            href="#edit"
            className={`col-span-12 md:col-span-5 inline-flex items-center min-h-6 underline underline-offset-4 hover:text-fg transition-colors ease-standard ${FOCUS}`}
          >
            Edit this page on GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
