import { useState, useMemo } from "react";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "../data/products";
import { money } from "../utils/format";
import ProductCard from "../components/ProductCard";

export default function ShopPage({ go, openProduct, addToCart, wishlist, toggleWish, activeCat, setActiveCat, query, products = PRODUCTS }) {
  const [sort, setSort] = useState("relevant");
  const [price, setPrice] = useState(200);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => (activeCat === "all" ? true : p.category === activeCat));
    if (query) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.includes(query.toLowerCase()));
    list = list.filter((p) => p.price <= price);
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [activeCat, query, price, sort]);

  const Filters = (
    <div className="flex flex-col gap-7">
      <div>
        <div className="ff-mono uppercase mb-3" style={{ fontSize: 11, letterSpacing: ".07em", color: "var(--ink)" }}>Category</div>
        <div className="flex flex-col gap-1.5">
          <button onClick={() => setActiveCat("all")} className="ff-focus text-left px-3 py-2 rounded-xl text-sm flex items-center justify-between" style={{ background: activeCat === "all" ? "var(--paper)" : "transparent", fontWeight: activeCat === "all" ? 700 : 500 }}>All categories</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} className="ff-focus text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2.5" style={{ background: activeCat === c.id ? "var(--paper)" : "transparent", fontWeight: activeCat === c.id ? 700 : 500 }}>
              <span className="w-2 h-2 rounded-full" style={{ background: c.color }} /> {c.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="ff-mono uppercase mb-3 flex justify-between" style={{ fontSize: 11, letterSpacing: ".07em", color: "var(--ink)" }}>
          <span>Max price</span><span>{money(price)}</span>
        </div>
        <input type="range" min="10" max="200" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full" style={{ accentColor: "var(--flux)" }} />
      </div>
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-10">
      <div className="flex items-center gap-1.5 mb-5 ff-mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>
        <button onClick={() => go("home")} className="hover:underline">Home</button> <ChevronRight size={12} /> <span style={{ color: "var(--ink)" }}>Shop</span>
      </div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="ff-display font-bold" style={{ fontSize: 30, color: "var(--ink)" }}>{query ? `Results for "${query}"` : "Shop all"}</h1>
          <p className="ff-mono mt-1" style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{filtered.length} products</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFiltersOpen(true)} className="ff-focus ff-btn ff-btn-ghost lg:hidden px-4 py-2.5 text-sm flex items-center gap-1.5"><SlidersHorizontal size={14} /> Filters</button>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="ff-focus ff-body text-sm px-4 py-2.5 rounded-full border bg-white" style={{ borderColor: "var(--line)" }}>
            <option value="relevant">Sort: Relevant</option>
            <option value="low">Price: Low to high</option>
            <option value="high">Price: High to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>

      <div className="ff-shop-grid gap-8">
        <aside className="hidden lg:block">{Filters}</aside>
        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <span className="ff-display font-bold" style={{ fontSize: 18 }}>Filters</span>
                <button onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X size={20} /></button>
              </div>
              {Filters}
              <button onClick={() => setFiltersOpen(false)} className="ff-btn ff-btn-primary w-full py-3 mt-8 text-sm">Show {filtered.length} results</button>
            </div>
          </div>
        )}
        <div>
          {filtered.length === 0 ? (
            <div className="ff-card p-14 text-center">
              <p className="ff-display font-bold" style={{ fontSize: 20, color: "var(--ink)" }}>Nothing matches yet</p>
              <p className="ff-body mt-2" style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>Try a wider price range or a different category.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={openProduct} onAdd={addToCart} wished={wishlist.includes(p.id)} onWish={toggleWish} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
