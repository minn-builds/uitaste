import type { BrowserLike } from "@uitaste/core";

export const PLAYWRIGHT_HELP =
  "Playwright is required for the shoot tool. Install it and its browser in the project:\n" +
  "  npm i -D playwright && npx playwright install chromium";

/** Launches headless chromium; the caller closes it. */
export type Launcher = () => Promise<BrowserLike & { close(): Promise<void> }>;

/** Playwright is an optional peer: loaded lazily so the other tools work without it. */
export const launchChromium: Launcher = async () => {
  let pw: typeof import("playwright");
  try {
    pw = await import("playwright");
  } catch {
    throw new Error(PLAYWRIGHT_HELP);
  }
  try {
    return (await pw.chromium.launch()) as unknown as BrowserLike & { close(): Promise<void> };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/Executable doesn't exist|playwright install/i.test(msg)) {
      throw new Error("Chromium is not installed. Run: npx playwright install chromium");
    }
    throw e;
  }
};
