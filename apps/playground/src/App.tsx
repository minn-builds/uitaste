import { useEffect, useState } from "react";
import benchPromptsJson from "../../../bench/prompts.json";
import { Bench } from "./Bench";
import { loadFonts } from "./fonts";
import presets from "./presets.generated.json";
import { TokenProof } from "./TokenProof";

type Example = { default: () => React.JSX.Element };
const modules = import.meta.glob<Example>("../../../packages/presets/*/examples/*.tsx", {
  eager: true,
});

function example(id: string, name: string): () => React.JSX.Element {
  const mod = modules[`../../../packages/presets/${id}/examples/${name}.tsx`];
  if (!mod) throw new Error(`Missing example ${id}/${name}`);
  return mod.default;
}

function useTokensReady(id: string) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    document.documentElement.dataset.preset = id;
    loadFonts(id)
      .then(() => document.fonts.ready)
      .catch((error: unknown) => console.error(`Font loading failed for ${id}`, error))
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);
  return ready;
}

function PresetPage({ id }: { id: string }) {
  const ready = useTokensReady(id);
  const Hero = example(id, "Hero");
  const Pricing = example(id, "Pricing");
  const DashboardCard = example(id, "DashboardCard");
  return (
    <div data-ready={ready}>
      <Hero />
      <Pricing />
      <DashboardCard />
    </div>
  );
}

function Index() {
  const first = presets[0]?.id ?? "";
  useTokensReady(first);
  return (
    <main className="mx-auto max-w-4xl p-6 md:p-12">
      <h1 className="font-display text-5xl leading-tight">tastekit playground</h1>
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {presets.map((p) => (
          <li key={p.id} className="flex flex-wrap items-baseline justify-between gap-4 py-4">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl">{p.name}</h2>
              <p className="mt-1 text-sm text-muted-fg">{p.description}</p>
            </div>
            <div className="flex gap-4 text-sm">
              <a className="underline underline-offset-4" href={`/presets/${p.id}`}>
                Examples
              </a>
              <a className="underline underline-offset-4" href={`/tokens/${p.id}`}>
                Tokens
              </a>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Tokens({ id }: { id: string }) {
  useTokensReady(id);
  return <TokenProof />;
}

const benchPrompts = benchPromptsJson as { id: string; preset: string }[];

export function App() {
  const [, kind, id, variant] = window.location.pathname.split("/");
  if (kind === "bench" && id && (variant === "baseline" || variant === "tastekit")) {
    return (
      <Bench id={id} variant={variant} preset={benchPrompts.find((p) => p.id === id)?.preset} />
    );
  }
  const known = presets.some((p) => p.id === id);
  if (id && known && kind === "presets") return <PresetPage id={id} />;
  if (id && known && kind === "tokens") return <Tokens id={id} />;
  return <Index />;
}
