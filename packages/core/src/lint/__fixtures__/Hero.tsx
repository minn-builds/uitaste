import { cn } from "./cn";

const button = cva("rounded-full px-4", {
  variants: { size: { sm: "text-sm", lg: "text-lg" } },
  defaultVariants: { size: "sm" },
});

export function Hero({ active, items }: { active: boolean; items: string[] }) {
  return (
    <section className="bg-gradient-to-r from-purple-500 to-pink-500 md:p-8">
      <h1
        className={`text-5xl ${active ? "font-bold" : "font-light"}`}
        style={{ backgroundColor: "#7c3aed", padding: 4 }}
      >
        Build faster ✨
      </h1>
      <>
        <p className={cn("text-lg", active && "opacity-80", { "!mt-4": active })}>Ship it</p>
      </>
      <ul>
        {items.map((item) => (
          <li key={item} className="rounded-xl shadow-lg">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
