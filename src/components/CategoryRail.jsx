import { CATEGORIES } from "../data/products";
import SectionHeading from "./SectionHeading";

export default function CategoryRail({ active, onPick }) {
  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-10">
      <SectionHeading eyebrow="Browse" title="Shop by category" />
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        <button
          onClick={() => onPick("all")}
          className="ff-focus ff-btn shrink-0 px-5 py-3 text-sm flex items-center gap-2"
          style={{ background: active === "all" ? "var(--ink)" : "#fff", color: active === "all" ? "#fff" : "var(--ink)", border: "1px solid var(--line)" }}
        >
          All
        </button>
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const isActive = active === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onPick(c.id)}
              className="ff-focus shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-medium transition-all"
              style={{
                background: isActive ? c.color : "#fff",
                color: isActive ? "#fff" : "var(--ink)",
                border: `1px solid ${isActive ? c.color : "var(--line)"}`,
                boxShadow: isActive ? `0 8px 20px -8px ${c.color}` : "none",
              }}
            >
              <Icon size={16} /> {c.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}
