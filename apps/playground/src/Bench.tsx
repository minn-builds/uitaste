import { useEffect, useState } from "react";
import { loadFonts } from "./fonts";

type Page = { default: () => React.JSX.Element };
const modules = import.meta.glob<Page>("../../../bench/pages/*/*.tsx", { eager: true });

/** Renders bench/pages/<id>/<variant>.tsx. Baseline gets no preset; uitaste gets data-preset. */
export function Bench({
  id,
  variant,
  preset,
}: {
  id: string;
  variant: string;
  preset?: string | undefined;
}) {
  const [ready, setReady] = useState(variant === "baseline");
  useEffect(() => {
    if (variant !== "uitaste" || !preset) return;
    let cancelled = false;
    document.documentElement.dataset.preset = preset;
    loadFonts(preset)
      .then(() => document.fonts.ready)
      .catch((error: unknown) => console.error(`Font loading failed for ${preset}`, error))
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [variant, preset]);
  const mod = modules[`../../../bench/pages/${id}/${variant}.tsx`];
  if (!mod)
    return (
      <p>
        Missing bench page {id}/{variant}
      </p>
    );
  const Page = mod.default;
  return (
    <div data-ready={ready}>
      <Page />
    </div>
  );
}
