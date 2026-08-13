import { catColor } from "../data/products";

export default function Ticker() {
  const items = [
    { t: "Aeroloop Headphones", d: "-45%", c: "electronics" },
    { t: "Streetwear Pack", d: "-30%", c: "fashion" },
    { t: "Amber Accent Lamp", d: "Top pick", c: "home" },
    { t: "Prism Building Set", d: "-25%", c: "toys" },
    { t: "Glow Vitamin-C Serum", d: "-27%", c: "beauty" },
    { t: "Meal Starter Kit", d: "Recommended", c: "grocery" },
    { t: "Halo Earbuds", d: "New", c: "electronics" },
    { t: "Bounce Sneakers", d: "Trending", c: "fashion" },
  ];
  const row = (key) => (
    <div key={key} className="flex items-center shrink-0">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2 px-5 shrink-0">
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: catColor(it.c) }} />
          <span className="ff-mono" style={{ fontSize: 12.5, color: "#fff" }}>{it.t}</span>
          <span className="ff-mono font-bold" style={{ fontSize: 12.5, color: catColor(it.c) }}>{it.d}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden w-full" style={{ background: "var(--ink)" }} aria-hidden="true">
      <div className="flex ff-marquee-track" style={{ animation: "ff-marquee 32s linear infinite", width: "max-content" }}>
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
