import { useState, useEffect } from "react";
import { ChevronRight, Heart, Minus, Plus, Truck, RotateCcw, ShieldCheck, MessageSquare, CheckCircle2 } from "lucide-react";
import { PRODUCTS, catColor, catIcon } from "../data/products";
import { money } from "../utils/format";
import Stars from "../components/Stars";
import CategoryGlyph from "../components/CategoryGlyph";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";

export default function ProductPage({ product, go, addToCart, wishlist, toggleWish, openProduct, onOpenSellerChat, products = PRODUCTS }) {
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(product.colors?.[0]);
  const [size, setSize] = useState(product.sizes?.[0]);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [tab, setTab] = useState("desc");
  const color2 = catColor(product.category);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  useEffect(() => {
    setQty(1);
    setColor(product.colors?.[0]);
    setSize(product.sizes?.[0]);
    setActiveImgIndex(0);
    setTab("desc");
    window.scrollTo(0, 0);
  }, [product.id]);

  // Gallery image preview list

  const handleChatSellerClick = () => {
    if (!buyer) {
      if (openAuthModal) openAuthModal();
    } else {
      if (onOpenSellerChat) onOpenSellerChat(product);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    if (!buyer) {
      if (openAuthModal) openAuthModal();
      return;
    }

    const newReview = {
      id: `rev_${Date.now()}`,
      productName: product.name,
      customer: buyer.name,
      rating: userRating,
      date: new Date().toISOString().split("T")[0],
      comment: reviewText,
    };

    if (onAddReview) {
      onAddReview(product.id, newReview);
    }

    setReviewText("");
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const reviewList = product.reviewList || [
    { n: "Priya S.", r: 5, c: "Exactly as pictured, showed up two days early. Excellent sound quality!" },
    { n: "Marcus T.", r: 4, c: "Good value at this price point, durable build and solid materials." }
  ];

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-10 ff-rise">
      <div className="flex items-center gap-1.5 mb-6 ff-mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>
        <button onClick={() => go("home")} className="hover:underline">Home</button> <ChevronRight size={12} />
        <button onClick={() => go("shop")} className="hover:underline capitalize">{product.category}</button> <ChevronRight size={12} />
        <span style={{ color: "var(--ink)" }}>{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-80 sm:h-[440px] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-sm flex items-center justify-center p-4">
            <CategoryGlyph
              product={{ ...product, image: images[selectedImgIdx] || product.image }}
              className="w-full h-full object-contain"
              iconSize={48}
            />
            {product.badge && (
              <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-slate-900 text-white shadow-md">
                {product.badge}
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImgIdx(i)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-slate-50 ${
                    selectedImgIdx === i ? "border-indigo-600 ring-2 ring-indigo-600/30 scale-105" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <CategoryGlyph product={{ ...product, image: img }} className="w-full h-full object-cover" iconSize={20} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="ff-mono uppercase font-semibold" style={{ fontSize: 11, letterSpacing: ".08em", color: color2 }}>{product.category}</span>
            <span className="ff-mono inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
              Verified Stock
            </span>
          </div>

          <h1 className="ff-display font-bold mt-2 leading-tight" style={{ fontSize: 30, color: "var(--ink)" }}>{product.name}</h1>
          <div className="flex items-center gap-2 mt-3">
            <Stars rating={product.rating} size={15} />
            <span className="ff-mono" style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{product.rating} · {product.reviews} reviews</span>
          </div>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="ff-display font-bold" style={{ fontSize: 34, color: "var(--ink)" }}>{money(product.price)}</span>
            {product.was && <span className="ff-mono line-through" style={{ fontSize: 15, color: "var(--ink-soft)" }}>{money(product.was)}</span>}
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold grid place-items-center text-sm shadow-sm">
                {product.category.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="ff-body font-semibold text-sm flex items-center gap-1.5" style={{ color: "var(--ink)" }}>
                  {product.category.toUpperCase()} Official Store
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">VERIFIED</span>
                </div>
                <div className="ff-mono text-xs text-slate-500">99.2% Positive rating · Direct Merchant</div>
              </div>
            </div>
            <button
              onClick={handleChatSellerClick}
              className="ff-btn px-4 py-2 text-xs border border-indigo-200 bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 font-semibold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
            >
              <MessageSquare size={14} /> Chat Seller
            </button>
          </div>

          {product.colors && (
            <div className="mt-6">
              <div className="ff-mono uppercase mb-2" style={{ fontSize: 11, letterSpacing: ".07em", color: "var(--ink)" }}>Color</div>
              <div className="flex gap-2.5">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)} aria-label={`Color ${c}`} className="ff-focus w-9 h-9 rounded-full border-2" style={{ background: c, borderColor: color === c ? "var(--flux)" : "var(--line)" }} />
                ))}
              </div>
            </div>
          )}
          {product.sizes && (
            <div className="mt-6">
              <div className="ff-mono uppercase mb-2" style={{ fontSize: 11, letterSpacing: ".07em", color: "var(--ink)" }}>Size</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)} className="ff-focus px-4 py-2 rounded-xl text-sm font-medium border" style={{ borderColor: size === s ? "var(--ink)" : "var(--line)", background: size === s ? "var(--ink)" : "#fff", color: size === s ? "#fff" : "var(--ink)" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-7">
            <div className="flex items-center border rounded-full" style={{ borderColor: "var(--line)" }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="ff-focus w-10 h-10 grid place-items-center" aria-label="Decrease quantity"><Minus size={15} /></button>
              <span className="ff-mono w-8 text-center" style={{ fontSize: 14 }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="ff-focus w-10 h-10 grid place-items-center" aria-label="Increase quantity"><Plus size={15} /></button>
            </div>
            <button onClick={() => addToCart(product, qty, { color, size })} className="ff-btn ff-btn-primary flex-1 py-3.5 text-sm shadow-md hover:shadow-indigo-500/25">Add to cart — {money(product.price * qty)}</button>
            <button onClick={() => toggleWish(product.id)} className="ff-focus w-12 h-12 rounded-full border grid place-items-center shrink-0" style={{ borderColor: "var(--line)" }} aria-label="Save to wishlist">
              <Heart size={18} fill={wishlist.includes(product.id) ? "var(--coral)" : "none"} color={wishlist.includes(product.id) ? "var(--coral)" : "var(--ink)"} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8 pt-7 border-t" style={{ borderColor: "var(--line)" }}>
            {[{ icon: Truck, t: "Free delivery", s: "Orders over $35" }, { icon: RotateCcw, t: "Easy returns", s: "30-day window" }, { icon: ShieldCheck, t: "Buyer protection", s: "Secure checkout" }].map((f) => (
              <div key={f.t} className="flex flex-col items-center text-center gap-1.5">
                <f.icon size={18} color="var(--ink-soft)" />
                <span className="ff-body font-semibold" style={{ fontSize: 12 }}>{f.t}</span>
                <span className="ff-body" style={{ fontSize: 11, color: "var(--ink-soft)" }}>{f.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-14 border-t pt-8" style={{ borderColor: "var(--line)" }}>
        <div className="flex gap-6 mb-6">
          {[{ id: "desc", l: "Description" }, { id: "reviews", l: `Reviews (${product.reviews})` }].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className="ff-focus ff-body font-semibold pb-3 text-sm" style={{ color: tab === t.id ? "var(--ink)" : "var(--ink-soft)", borderBottom: tab === t.id ? `2px solid ${color2}` : "2px solid transparent" }}>
              {t.l}
            </button>
          ))}
        </div>
        {tab === "desc" ? (
          <p className="ff-body max-w-2xl" style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.7 }}>
            {product.blurb || "A dependable pick from this week's feed — solid ratings, fast turnaround, easy returns."}
          </p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-4">
              {reviewList.map((rv, idx) => (
                <div key={idx} className="ff-card p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="ff-body font-semibold text-sm text-slate-900">{rv.customer || rv.n}</span>
                    <Stars rating={rv.rating || rv.r} size={12} />
                  </div>
                  <p className="ff-body text-xs text-slate-600 leading-relaxed">{rv.comment || rv.c}</p>
                </div>
              ))}
            </div>
            <div className="ff-card p-6 border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-600" />
                <h3 className="ff-display font-bold text-base text-slate-900">Write a Buyer Review</h3>
              </div>
              {reviewSubmitted && (
                <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <UserCheck size={16} /> Review submitted successfully!
                </div>
              )}
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1.5">Your Star Rating</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setUserRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="p-1">
                        <Star size={22} fill={(hoverRating || userRating) >= star ? "#F59E0B" : "none"} color={(hoverRating || userRating) >= star ? "#F59E0B" : "#CBD5E1"} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea rows={3} value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your experience..." className="w-full p-3 rounded-xl border text-xs" />
                <button type="submit" className="ff-btn w-full py-2.5 text-xs bg-indigo-600 text-white font-semibold flex items-center justify-center gap-2">
                  <Send size={14} /> Submit Review
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <SectionHeading eyebrow="Pairs well" title="You might also like" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={openProduct} onAdd={addToCart} wished={wishlist.includes(p.id)} onWish={toggleWish} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
