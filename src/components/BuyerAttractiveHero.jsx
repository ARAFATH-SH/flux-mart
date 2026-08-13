import { useState, useEffect } from "react";
import {
  Sparkles, ArrowRight, ShoppingBag, ShieldCheck, Truck, Star,
  Flame, Clock, Percent, Zap, ChevronRight, CheckCircle2
} from "lucide-react";
import { PRODUCTS } from "../data/products";
import { money } from "../utils/format";
import CategoryGlyph from "./CategoryGlyph";

export default function BuyerAttractiveHero({ go, openProduct, addToCart }) {
  const featuredProducts = [
    {
      ...PRODUCTS[0],
      heroTagline: "Ultimate Active Noise Cancellation & 40-Hour Battery",
      discountBadge: "SAVE 40% TODAY",
      soldCount: "1,480+ claimed in 24h",
      highlightColor: "from-indigo-600 to-purple-600",
    },
    {
      ...PRODUCTS[3],
      heroTagline: "Minimalist Ambient Lighting for Smart Modern Workspaces",
      discountBadge: "FLASH DEAL 35% OFF",
      soldCount: "890+ claimed today",
      highlightColor: "from-amber-500 to-orange-600",
    },
    {
      ...PRODUCTS[4],
      heroTagline: "Ultra-Durable Heavyweight Cotton Streetwear Hoodie",
      discountBadge: "LIMITED EDITION DROP",
      soldCount: "2,100+ claimed this week",
      highlightColor: "from-rose-600 to-pink-600",
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = featuredProducts[activeSlide];

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 pt-4 pb-8">
      {/* Main Hero Card Container */}
      <div className="relative rounded-[32px] overflow-hidden bg-slate-900 text-white border border-slate-800 shadow-2xl ff-rise">
        {/* Dynamic Background Glow Gradient */}
        <div
          className="absolute inset-0 opacity-40 transition-all duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 70% 30%, ${
              activeSlide === 0 ? "#4F46E5" : activeSlide === 1 ? "#F59E0B" : "#E11D48"
            } 0%, transparent 60%)`,
          }}
        />

        <div className="grid lg:grid-cols-12 items-center p-6 sm:p-10 lg:p-12 gap-8 relative z-10">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="ff-mono uppercase text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Flame size={14} className="text-amber-400 animate-bounce" /> FEATURED MARKET SPOTLIGHT
              </span>
              <span className="ff-mono text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 size={13} /> {current.soldCount}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="ff-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
                {current.name}
              </h1>
              <p className="ff-body text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed">
                {current.heroTagline}
              </p>
            </div>

            {/* Price & Rating Display */}
            <div className="flex items-center gap-5 pt-1">
              <div>
                <span className="text-xs font-mono text-slate-400 block uppercase">Special Drop Price</span>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="ff-display font-bold text-3xl sm:text-4xl text-white">{money(current.price)}</span>
                  {current.was && (
                    <span className="ff-mono line-through text-slate-400 text-lg">{money(current.was)}</span>
                  )}
                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-rose-500 text-white shadow-sm">
                    {current.discountBadge}
                  </span>
                </div>
              </div>

              <div className="border-l border-slate-700/80 pl-5">
                <div className="flex items-center gap-1 text-amber-400 font-bold font-mono text-sm">
                  <Star size={15} fill="currentColor" /> {current.rating} / 5.0
                </div>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                  {current.reviews} Verified Buyer Reviews
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => openProduct(current)}
                className="px-7 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 group transform hover:scale-[1.02]"
              >
                Get This Drop Now
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => addToCart(current)}
                className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <ShoppingBag size={17} /> Add To Cart
              </button>
            </div>

            {/* Carousel Dots */}
            <div className="flex items-center gap-2 pt-4">
              {featuredProducts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activeSlide === idx ? "w-8 bg-indigo-400" : "w-2 bg-slate-700 hover:bg-slate-500"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Hero Visual Product Display */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md h-72 sm:h-96 rounded-3xl bg-slate-800/80 border border-slate-700/80 p-6 flex items-center justify-center shadow-2xl group cursor-pointer" onClick={() => openProduct(current)}>
              <CategoryGlyph product={current} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" iconSize={64} />

              {/* Floating Verified Badge */}
              <div className="absolute -bottom-4 right-4 bg-slate-900/95 backdrop-blur border border-slate-700 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 grid place-items-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">100% Authentic Guarantee</div>
                  <div className="text-[10px] text-slate-400 font-mono">Shipped direct from verified brand</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buyer Guarantee Rail */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { icon: Truck, title: "2-Day Express Shipping", desc: "Free on orders over $35" },
          { icon: ShieldCheck, title: "100% Buyer Guarantee", desc: "30-day return policy" },
          { icon: Sparkles, title: "Verified Sellers Only", desc: "Curated quality products" },
          { icon: Star, title: "4.9/5 Customer Score", desc: "Over 18,400+ satisfied buyers" },
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center shrink-0">
              <item.icon size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{item.title}</div>
              <div className="text-[11px] text-slate-500 font-mono">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
