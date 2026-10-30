import { describe, expect, it } from "vitest";
import { classTokensAt, parseClassToken, splitClasses } from "./classes.js";
import { LineIndex } from "./location.js";

describe("LineIndex", () => {
  it("maps offsets to 1-based line/column", () => {
    const idx = new LineIndex("ab\ncd\n");
    expect(idx.position(0)).toEqual({ line: 1, column: 1, offset: 0 });
    expect(idx.position(3)).toEqual({ line: 2, column: 1, offset: 3 });
    expect(idx.position(4)).toEqual({ line: 2, column: 2, offset: 4 });
    expect(idx.position(99)).toEqual({ line: 3, column: 1, offset: 6 });
    expect(idx.range(3, 5).end).toEqual({ line: 2, column: 3, offset: 5 });
  });

  it("handles CRLF, offsets out of bounds and empty files", () => {
    const crlf = new LineIndex("a\r\nb");
    expect(crlf.position(1)).toEqual({ line: 1, column: 2, offset: 1 });
    expect(crlf.position(3)).toEqual({ line: 2, column: 1, offset: 3 });
    expect(crlf.position(-5)).toEqual({ line: 1, column: 1, offset: 0 });
    expect(crlf.position(100)).toEqual({ line: 2, column: 2, offset: 4 });
    const empty = new LineIndex("");
    expect(empty.position(0)).toEqual({ line: 1, column: 1, offset: 0 });
    expect(empty.position(3)).toEqual({ line: 1, column: 1, offset: 0 });
  });
});

describe("parseClassToken", () => {
  it("splits variants at top-level colons only", () => {
    expect(parseClassToken("md:hover:bg-[url(a:b)]")).toEqual({
      value: "md:hover:bg-[url(a:b)]",
      variants: ["md", "hover"],
      utility: "bg-[url(a:b)]",
      important: false,
    });
    expect(parseClassToken("[&>*:first-child]:p-4").variants).toEqual(["[&>*:first-child]"]);
  });

  it("detects prefix and suffix important", () => {
    expect(parseClassToken("md:!mt-4")).toMatchObject({ utility: "mt-4", important: true });
    expect(parseClassToken("mt-4!")).toMatchObject({ utility: "mt-4", important: true });
  });
});

describe("splitClasses", () => {
  it("returns tokens with source ranges", () => {
    const src = 'x="  a  md:b\n c"';
    const tokens = splitClasses("  a  md:b\n c", 3, new LineIndex(src));
    expect(tokens.map((t) => t.value)).toEqual(["a", "md:b", "c"]);
    expect(tokens.map((t) => src.slice(t.loc.start.offset, t.loc.end.offset))).toEqual([
      "a",
      "md:b",
      "c",
    ]);
    expect(tokens[2]?.loc.start).toMatchObject({ line: 2, column: 2 });
  });
});

describe("classTokensAt", () => {
  it("uses the whole raw range when the source has escapes", () => {
    const src = '"a\\x20b"';
    const tokens = classTokensAt("a b", "a\\x20b", 1, new LineIndex(src));
    expect(tokens.map((t) => t.value)).toEqual(["a", "b"]);
    for (const t of tokens) expect(src.slice(t.loc.start.offset, t.loc.end.offset)).toBe("a\\x20b");
  });
});
