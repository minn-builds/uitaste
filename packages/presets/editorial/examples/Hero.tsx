/**
 * Editorial hero: a magazine opening spread. Mono folio line, heavy rule,
 * 3/9 asymmetric split with a margin column, light display headline with one
 * italic phrase, italic deck and a drop-capped first paragraph.
 */
export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-bg text-fg font-body">
      <div className="mx-auto max-w-320 px-6 pt-10 pb-24 md:px-12">
        <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-border pb-4">
          <a
            href="/"
            className="font-display text-2xl text-fg rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            The Long Field
          </a>
          <nav aria-label="Sections">
            <ul className="flex flex-wrap gap-x-6 text-sm">
              <li>
                <a
                  href="/essays"
                  aria-current="page"
                  className="inline-flex min-h-11 items-center text-fg underline decoration-fg decoration-1 underline-offset-4 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Essays
                </a>
              </li>
              <li>
                <a
                  href="/reports"
                  className="inline-flex min-h-11 items-center text-muted-fg transition-colors ease-standard hover:text-fg rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Field reports
                </a>
              </li>
              <li>
                <a
                  href="/archive"
                  className="inline-flex min-h-11 items-center text-muted-fg transition-colors ease-standard hover:text-fg rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Archive
                </a>
              </li>
            </ul>
          </nav>
        </header>

        <p className="mt-16 font-mono text-xs uppercase tracking-widest text-muted-fg">
          Issue 14 &middot; Autumn 2026 &middot; 18 min read
        </p>

        <div className="mt-4 grid grid-cols-1 gap-x-12 gap-y-8 border-t-2 border-fg pt-8 md:grid-cols-12">
          <aside className="flex flex-col gap-2 md:col-span-3 md:pt-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">Cover story</p>
            <p className="text-sm text-muted-fg">
              Words by <span className="text-fg">Ines Okafor</span>
              <br />
              Photographs by <span className="text-fg">Teo Varga</span>
            </p>
          </aside>

          <div className="md:col-span-9">
            <h1
              id="hero-title"
              className="font-display font-light text-3xl text-fg break-words hyphens-manual sm:text-4xl md:text-5xl"
            >
              The last cartographers of the <em className="italic">North Sea</em> coast
            </h1>
            <p className="mt-6 max-w-160 font-display font-light italic text-lg text-muted-fg md:text-xl">
              The shoreline moves a little every winter. A handful of surveyors still walk it with
              chains and notebooks, redrawing the map by hand.
            </p>
          </div>

          <div className="md:col-span-7 md:col-start-4">
            <p className="max-w-160 text-base text-fg first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-5xl first-letter:text-accent">
              At low tide on the flats near Westhever, Marit Dahl sets her tripod on sand that did
              not exist ten years ago. She has walked this stretch every February since 1991, and
              every year the line she draws lands somewhere new.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href="/essays/cartographers"
                className="inline-flex min-h-11 items-center rounded-sm bg-fg px-6 text-sm font-semibold text-bg transition-colors ease-standard hover:bg-accent hover:text-accent-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Read the cover story
              </a>
              <a
                href="/issues/14"
                className="inline-flex min-h-11 items-center text-sm text-fg underline decoration-1 underline-offset-4 transition-colors ease-standard hover:decoration-accent rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Contents of issue 14 <span aria-hidden="true">&nbsp;&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
