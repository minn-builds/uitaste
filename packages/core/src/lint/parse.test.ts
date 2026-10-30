import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { fileKindFromPath, LintParseError, parseFile } from "./parse.js";
import { toKebabCase } from "./parse-jsx.js";
import { elementChildren, textContent, walkElements } from "./tree.js";
import type { LintFile, SourceRange } from "./types.js";

const fixture = (name: string): LintFile => {
  const path = join(import.meta.dirname, "__fixtures__", name);
  const file = parseFile(path, readFileSync(path, "utf8"));
  if (!file) throw new Error("unsupported fixture");
  return file;
};
const text = (file: LintFile, loc: SourceRange) =>
  file.source.slice(loc.start.offset, loc.end.offset);

describe("fileKindFromPath", () => {
  it("maps extensions", () => {
    expect(fileKindFromPath("a/B.tsx")).toBe("jsx");
    expect(fileKindFromPath("a.JSX")).toBe("jsx");
    expect(fileKindFromPath("a.css")).toBe("css");
    expect(fileKindFromPath("a.htm")).toBe("html");
    expect(fileKindFromPath("a.vue")).toBeNull();
    expect(fileKindFromPath("Makefile")).toBeNull();
  });
  it("parseFile returns null for unsupported files", () => {
    expect(parseFile("x.md", "# hi")).toBeNull();
  });
});

describe("toKebabCase", () => {
  it("converts React style keys", () => {
    expect(toKebabCase("backgroundColor")).toBe("background-color");
    expect(toKebabCase("WebkitTransform")).toBe("-webkit-transform");
    expect(toKebabCase("msTransform")).toBe("-ms-transform");
    expect(toKebabCase("--brand-500")).toBe("--brand-500");
  });
});

describe("parseFile: tsx", () => {
  const file = fixture("Hero.tsx");

  it("builds the element tree with fragments flattened", () => {
    expect(file.kind).toBe("jsx");
    expect(file.roots.map((r) => r.tag)).toEqual(["section"]);
    const section = file.roots[0];
    if (!section) throw new Error("no root");
    expect(elementChildren(section).map((c) => c.tag)).toEqual(["h1", "p", "ul"]);
    const tags: string[] = [];
    walkElements(section, (el) => {
      tags.push(el.tag);
    });
    expect(tags).toEqual(["section", "h1", "p", "ul", "li"]);
    expect(text(file, section.loc).startsWith("<section")).toBe(true);
  });

  it("marks elements rendered from .map() as repeated", () => {
    const li = file.elements.find((e) => e.tag === "li");
    expect(li?.repeated).toBe(true);
    expect(li?.parent?.tag).toBe("ul");
    expect(file.elements.find((e) => e.tag === "ul")?.repeated).toBe(false);
  });

  it("collects text with trimmed locations", () => {
    const h1 = file.elements.find((e) => e.tag === "h1");
    if (!h1) throw new Error("no h1");
    expect(textContent(h1)).toBe("Build faster ✨");
    const t = file.texts.find((x) => x.value.startsWith("Build"));
    expect(t && text(file, t.loc)).toBe("Build faster ✨");
    expect(t?.parent).toBe(h1);
  });

  it("collects className strings from literals, templates and helpers with exact ranges", () => {
    const values = file.classNames.map((c) => [c.source, c.value.trim(), c.dynamic]);
    expect(values).toEqual([
      ["helper", "rounded-full px-4", true],
      ["helper", "text-sm", true],
      ["helper", "text-lg", true],
      ["className", "bg-gradient-to-r from-purple-500 to-pink-500 md:p-8", false],
      ["className", "text-5xl", true],
      ["className", "font-bold", true],
      ["className", "font-light", true],
      ["className", "text-lg", true],
      ["className", "opacity-80", true],
      ["className", "!mt-4", true],
      ["className", "rounded-xl shadow-lg", false],
    ]);
    for (const usage of file.classNames) {
      for (const cls of usage.classes) expect(text(file, cls.loc)).toBe(cls.value);
    }
    const p = file.elements.find((e) => e.tag === "p");
    expect(p?.classes.map((c) => c.utility)).toEqual(["text-lg", "opacity-80", "mt-4"]);
    expect(p?.classes[2]?.important).toBe(true);
    expect(file.classNames[0]?.element).toBeNull();
  });

  it("collects inline style declarations", () => {
    expect(file.declarations.map((d) => [d.property, d.value, d.origin])).toEqual([
      ["background-color", "#7c3aed", "inline"],
      ["padding", "4", "inline"],
    ]);
    const bg = file.declarations[0];
    if (!bg) throw new Error("no decl");
    expect(text(file, bg.valueLoc)).toBe("#7c3aed");
    expect(text(file, bg.loc)).toBe('backgroundColor: "#7c3aed"');
    expect(bg.element?.tag).toBe("h1");
    expect(bg.element?.style).toContain(bg);
  });

  it("records attributes", () => {
    const li = file.elements.find((e) => e.tag === "li");
    expect(li?.attributes.map((a) => [a.name, a.value, a.dynamic])).toEqual([
      ["key", null, true],
      ["className", "rounded-xl shadow-lg", false],
    ]);
  });

  it("handles member tags, spreads, string children and plain .jsx", () => {
    const f = parseFile(
      "x.jsx",
      'const A = (p) => <motion.div {...p} hidden><span>{"Hi"}</span></motion.div>;',
    );
    expect(f?.elements.map((e) => e.tag)).toEqual(["motion.div", "span"]);
    expect(f?.elements[0]?.attributes).toMatchObject([
      { name: "hidden", value: "", dynamic: false },
    ]);
    expect(f?.texts.map((t) => t.value)).toEqual(["Hi"]);
  });

  it("does not turn attribute expressions into text children", () => {
    const f = parseFile("x.tsx", 'const A = () => <img alt={"x"} title={`t`} />;');
    expect(f?.texts).toEqual([]);
    expect(f?.elements[0]?.children).toEqual([]);
    expect(f?.elements[0]?.attributes.map((a) => [a.name, a.value])).toEqual([
      ["alt", "x"],
      ["title", "t"],
    ]);
  });

  it("keeps class locations inside the string when it contains escapes", () => {
    const src = 'const A = () => <div className={"p-4\\x20m-2"} title="ok" />;';
    const f = parseFile("x.tsx", src);
    const usage = f?.classNames[0];
    expect(usage?.classes.map((c) => c.value)).toEqual(["p-4", "m-2"]);
    for (const c of usage?.classes ?? []) {
      expect(src.slice(c.loc.start.offset, c.loc.end.offset)).toBe("p-4\\x20m-2");
    }
    // biome-ignore lint/suspicious/noTemplateCurlyInString: JSX source under test contains a template literal
    const tpl = "const B = () => <div className={`a\\nb ${x}`} />;";
    const g = parseFile("y.tsx", tpl);
    expect(g?.classNames[0]?.classes.map((c) => c.value)).toEqual(["a", "b"]);
    expect(
      g?.classNames[0] &&
        tpl.slice(g.classNames[0].loc.start.offset, g.classNames[0].loc.end.offset),
    ).toBe("a\\nb ");
  });

  it("throws LintParseError with a position on syntax errors", () => {
    expect(() => parseFile("broken.tsx", 'const x = <div className="a">\n')).toThrow(
      LintParseError,
    );
    try {
      parseFile("broken.tsx", "const x = ;");
    } catch (err) {
      expect(err).toBeInstanceOf(LintParseError);
      expect(err).toMatchObject({ line: 1, column: 11 });
    }
  });
});

describe("parseFile: css", () => {
  const file = fixture("styles.css");

  it("collects declarations with selector, at-rules and exact ranges", () => {
    expect(
      file.declarations.map((d) => [d.property, d.value, d.selector, d.atRules, d.important]),
    ).toEqual([
      ["--brand", "#7c3aed", ":root", [], false],
      ["border-radius", "12px", ".card", [], false],
      ["box-shadow", "0 1px 2px rgb(0 0 0 / 0.1)", ".card", [], true],
      ["padding", "2rem", ".card,\n  .tile", ["media (min-width: 40rem)"], false],
    ]);
    for (const d of file.declarations) {
      expect(text(file, d.valueLoc)).toBe(d.raw);
      expect(text(file, d.loc).startsWith(d.property)).toBe(true);
    }
    const shadow = file.declarations[2];
    expect(shadow && text(file, shadow.loc)).toBe(
      "box-shadow: 0 1px 2px rgb(0 0 0 / 0.1) !important",
    );
    expect(file.declarations[1]?.loc.start).toMatchObject({ line: 6, column: 3 });
  });

  it("collects @apply classes", () => {
    expect(file.classNames).toHaveLength(1);
    const apply = file.classNames[0];
    expect(apply?.source).toBe("@apply");
    expect(apply?.classes.map((c) => [c.utility, c.variants])).toEqual([
      ["rounded-full", []],
      ["px-6", ["md"]],
    ]);
    for (const c of apply?.classes ?? []) expect(text(file, c.loc)).toBe(c.value);
  });

  it("throws LintParseError on invalid css", () => {
    expect(() => parseFile("bad.css", ".a { color: red")).toThrow(LintParseError);
  });
});

describe("parseFile: html", () => {
  const file = fixture("page.html");

  it("builds the tree, skipping synthesized wrappers and raw-text content", () => {
    expect(file.roots.map((r) => r.tag)).toEqual(["html"]);
    expect(file.elements.map((e) => e.tag)).toEqual([
      "html",
      "head",
      "style",
      "body",
      "main",
      "div",
      "div",
    ]);
    const main = file.elements.find((e) => e.tag === "main");
    expect(main && elementChildren(main).map((c) => textContent(c))).toEqual(["🚀 Fast", "Simple"]);
  });

  it("collects class attributes with exact ranges", () => {
    expect(file.classNames.map((c) => [c.source, c.value, c.element?.tag])).toEqual([
      ["class", "grid grid-cols-3 gap-6", "main"],
      ["class", "card", "div"],
      ["class", "card", "div"],
    ]);
    for (const u of file.classNames)
      for (const c of u.classes) expect(text(file, c.loc)).toBe(c.value);
  });

  it("collects <style> and style attribute declarations", () => {
    expect(file.declarations.map((d) => [d.property, d.value, d.origin, d.selector])).toEqual([
      ["font-family", "Inter, sans-serif", "stylesheet", "h1"],
      ["color", "#fff", "inline", null],
      ["margin-top", "8px", "inline", null],
    ]);
    for (const d of file.declarations) expect(text(file, d.valueLoc)).toBe(d.raw);
    expect(file.declarations[1]?.element?.style).toHaveLength(2);
  });

  it("decodes entities in class values without shifting locations", () => {
    const src = '<p class="a&amp;b c">x</p>';
    const f = parseFile("e.html", src);
    const usage = f?.classNames[0];
    expect(usage?.value).toBe("a&b c");
    expect(usage?.classes.map((c) => c.value)).toEqual(["a&b", "c"]);
    for (const c of usage?.classes ?? []) {
      expect(src.slice(c.loc.start.offset, c.loc.end.offset)).toBe("a&amp;b c");
    }
  });

  it("parses fragments without a document wrapper", () => {
    const f = parseFile("frag.html", "<div class='a b'><p>Hi</p></div>");
    expect(f?.roots.map((r) => r.tag)).toEqual(["div"]);
    expect(f?.classNames[0]?.classes.map((c) => c.value)).toEqual(["a", "b"]);
  });
});
