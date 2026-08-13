import { useState, useEffect, useMemo } from "react";
import { ChevronRight, Flame } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { money } from "../utils/format";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";

export default function DealsPage({ go, openProduct, addToCart, wishlist, toggleWish, products = PRODUCTS }) {
  const [time, setTime] = useState(4 * 3600 + 18 * 60 + 22);
  useEffect(() => {
    const t = setInterval(() => setTime((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(time / 3600)).padStart(2, "0");
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const s = String(time % 60).padStart(2, "0");

  const [sort, setSort] = useState("discount");

  const deals = useMemo(() => {
    const list = products.filter((p) => p.was && p.was > p.price);
    const discountPct = (p) => Math.round(((p.was - p.price) / p.was) * 100);
    if (sort === "discount") return [...list].sort((a, b) => discountPct(b) - discountPct(a));
    if (sort === "low") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [sort]);

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-10">
      <div className="flex items-center gap-1.5 mb-6 ff-mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>
        <button onClick={() => go("home")} className="hover:underline">Home</button> <ChevronRight size={12} />
        <span style={{ color: "var(--ink)" }}>Deals</span>
      </div>

      <div
        className="p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10"
        style={{ background: "linear-gradient(120deg, var(--coral), #FF8A5B)", borderRadius: 28 }}
      >
        <div className="absolute rounded-full" style={{ width: 260, height: 260, background: "#fff", opacity: 0.12, filter: "blur(80px)", top: -60, right: -40 }} />
        <div className="relative">
          <span className="ff-mono inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ fontSize: 11, letterSpacing: ".08em", background: "rgba(255,255,255,.15)", color: "#fff" }}>
            <Flame size={13} /> LIVE — FLASH DROP RUNNING
          </span>
          <h1 className="ff-display font-bold" style={{ fontSize: 30, color: "#fff" }}>{deals.length} deals in the feed right now</h1>
          <p className="ff-body mt-1.5" style={{ fontSize: 14, color: "rgba(255,255,255,.85)" }}>Prices drop as the ticker turns over — grab it before it resets.</p>
        </div>
        <div className="relative shrink-0 ff-card px-6 py-4" style={{ background: "rgba(16,16,26,.25)", border: "1px solid rgba(255,255,255,.25)", backdropFilter: "blur(6px)" }}>
          <span className="ff-mono" style={{ fontSize: 10.5, color: "rgba(255,255,255,.8)" }}>ENDS IN</span>
          <div className="ff-mono font-bold flex gap-1.5" style={{ fontSize: 26, color: "#fff" }}>
            <span>{h}</span><span style={{ opacity: 0.5 }}>:</span><span>{m}</span><span style={{ opacity: 0.5 }}>:</span><span>{s}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <SectionHeading eyebrow="Today's drop" title="All deals" />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="ff-focus ff-body text-sm px-4 py-2.5 rounded-full border bg-white"
          style={{ borderColor: "var(--line)" }}
        >
          <option value="discount">Sort: Biggest discount</option>
          <option value="low">Price: Low to high</option>
          <option value="high">Price: High to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      {deals.length === 0 ? (
        <div className="ff-card p-14 text-center">
          <p className="ff-display font-bold" style={{ fontSize: 20, color: "var(--ink)" }}>No deals live right now</p>
          <p className="ff-body mt-2" style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>Check back soon — the feed refreshes constantly.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {deals.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={openProduct} onAdd={addToCart} wished={wishlist.includes(p.id)} onWish={toggleWish} />
          ))}
        </div>
      )}
    </section>
  );
}