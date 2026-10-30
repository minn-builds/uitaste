import type { Position, SourceRange } from "./types.js";

/** Maps 0-based offsets of one source string to 1-based line/column positions. */
export class LineIndex {
  readonly #lineStarts: number[];
  readonly #length: number;

  constructor(source: string) {
    const starts = [0];
    for (let i = 0; i < source.length; i++) {
      if (source.charCodeAt(i) === 10) starts.push(i + 1);
    }
    this.#lineStarts = starts;
    this.#length = source.length;
  }

  position(offset: number): Position {
    const clamped = Math.max(0, Math.min(offset, this.#length));
    const starts = this.#lineStarts;
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if ((starts[mid] ?? 0) <= clamped) lo = mid;
      else hi = mid - 1;
    }
    return { line: lo + 1, column: clamped - (starts[lo] ?? 0) + 1, offset: clamped };
  }

  range(start: number, end: number): SourceRange {
    return { start: this.position(start), end: this.position(end) };
  }
}
