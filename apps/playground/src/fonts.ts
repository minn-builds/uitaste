/** Font CSS per preset id, loaded lazily so a route only fetches its own faces. */
const loaders: Record<string, (() => Promise<unknown>)[]> = {
  editorial: [
    () => import("@fontsource/fraunces/300.css"),
    () => import("@fontsource/fraunces/400.css"),
    () => import("@fontsource/fraunces/600.css"),
    () => import("@fontsource/source-serif-4/400.css"),
    () => import("@fontsource/source-serif-4/600.css"),
    () => import("@fontsource/ibm-plex-mono/400.css"),
    () => import("@fontsource/ibm-plex-mono/500.css"),
  ],
  swiss: [
    () => import("@fontsource/schibsted-grotesk/500.css"),
    () => import("@fontsource/schibsted-grotesk/700.css"),
    () => import("@fontsource/schibsted-grotesk/900.css"),
    () => import("@fontsource/hanken-grotesk/400.css"),
    () => import("@fontsource/hanken-grotesk/500.css"),
    () => import("@fontsource/hanken-grotesk/700.css"),
    () => import("@fontsource/ibm-plex-mono/400.css"),
    () => import("@fontsource/ibm-plex-mono/500.css"),
  ],
  "soft-utility": [
    () => import("@fontsource/red-hat-display/500.css"),
    () => import("@fontsource/red-hat-display/600.css"),
    () => import("@fontsource/red-hat-display/700.css"),
    () => import("@fontsource/source-sans-3/400.css"),
    () => import("@fontsource/source-sans-3/600.css"),
    () => import("@fontsource/jetbrains-mono/400.css"),
    () => import("@fontsource/jetbrains-mono/500.css"),
  ],
  brutal: [
    () => import("@fontsource/archivo-black/400.css"),
    () => import("@fontsource/atkinson-hyperlegible/400.css"),
    () => import("@fontsource/atkinson-hyperlegible/700.css"),
    () => import("@fontsource/space-mono/400.css"),
    () => import("@fontsource/space-mono/700.css"),
  ],
};

export async function loadFonts(id: string): Promise<void> {
  await Promise.all((loaders[id] ?? []).map((load) => load()));
}
