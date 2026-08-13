import { useState, useEffect } from "react";
import {
  ChevronRight, Sparkles, Zap, Flame, Gift, Tag, Award, Star,
  ShoppingBag, ArrowRight, ShieldCheck, Clock, Percent, ExternalLink
} from "lucide-react";
import { PRODUCTS } from "../data/products";
import BuyerAttractiveHero from "../components/BuyerAttractiveHero";
import CategoryRail from "../components/CategoryRail";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";
import CategoryGlyph from "../components/CategoryGlyph";
import { money } from "../utils/format";

export default function HomePage({ go, openProduct, addToCart, wishlist, toggleWish, setActiveCat, products = PRODUCTS }) {
  // Countdown Timer for Festival Banner
  const [festiveTimer, setFestiveTimer] = useState(18 * 3600 + 42 * 60 + 15);
  useEffect(() => {
    const t = setInterval(() => setFestiveTimer((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const fH = String(Math.floor(festiveTimer / 3600)).padStart(2, "0");
  const fM = String(Math.floor((festiveTimer % 3600) / 60)).padStart(2, "0");
  const fS = String(festiveTimer % 60).padStart(2, "0");

  const trending = products.slice(0, 4);
  const bestSellers = products.slice(0, 6);
  const justIn = products.slice(6, 10);

  const brandOffers = [
    {
      id: "b1",
      brand: "AeroTech Official",
      title: "Active Noise Cancellation Audio Drop",
      discount: "UP TO 40% OFF",
      code: "AERO40",
      bgGradient: "from-indigo-900 via-slate-900 to-purple-950",
      accent: "text-indigo-400 border-indigo-500/30",
      btnBg: "bg-indigo-600 hover:bg-indigo-500",
      category: "electronics",
      image: products[0]?.image,
    },
    {
      id: "b2",
      brand: "Kinfolk Organics",
      title: "Eco-Friendly Living & Home Essentials",
      discount: "FLAT 25% OFF",
      code: "KINFOLK25",
      bgGradient: "from-emerald-950 via-slate-900 to-teal-950",
      accent: "text-emerald-400 border-emerald-500/30",
      btnBg: "bg-emerald-600 hover:bg-emerald-500",
      category: "home",
      image: products[3]?.image,
    },
    {
      id: "b3",
      brand: "StreetLuxe Apparel",
      title: "New Season Heavyweight Streetwear",
      discount: "BUY 1 GET 1 50% OFF",
      code: "STREET50",
      bgGradient: "from-amber-950 via-slate-900 to-orange-950",
      accent: "text-amber-400 border-amber-500/30",
      btnBg: "bg-amber-600 hover:bg-amber-500",
      category: "fashion",
      image: products[4]?.image,
    },
  ];

  return (
    <>
      {/* 🎆 FESTIVAL MEGA BANNER (TOP HERO DASHBOARD) */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-6 pb-2">
        <div className="relative rounded-3xl bg-slate-950 text-white p-6 sm:p-10 overflow-hidden border border-indigo-500/20 shadow-2xl ff-rise">
          {/* Neon Glow Blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="ff-mono uppercase text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-indigo-600 text-white flex items-center gap-1.5 shadow-md">
                  <Sparkles size={14} className="text-amber-300 animate-spin-slow" />
                  GRAND FESTIVAL SALE 2026
                </span>
                <span className="ff-mono text-xs text-indigo-300 font-semibold px-2.5 py-0.5 rounded-full bg-indigo-900/60 border border-indigo-700/50">
                  ⚡ UP TO 60% OFF SITEWIDE
                </span>
              </div>

              <h1 className="ff-display font-bold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                Mid-Summer Festival Mega Drop
              </h1>

              <p className="ff-body text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Unlock exclusive festival discounts across tech, streetwear, home decor, and lifestyle. Stacks with member coupons!
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => go("shop")}
                  className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                >
                  Shop Festival Drops <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => go("deals")}
                  className="px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <Gift size={16} className="text-rose-400" /> View Festival Offers
                </button>
              </div>
            </div>

            {/* Countdown Clock Box */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-center shrink-0 min-w-[260px] shadow-xl">
              <span className="text-xs font-mono font-bold text-indigo-400 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                <Clock size={14} className="animate-pulse text-indigo-400" /> FESTIVAL DROPS END IN
              </span>
              <div className="flex items-center gap-2 font-mono text-3xl sm:text-4xl font-bold text-white">
                <div className="bg-slate-800 px-3 py-2 rounded-2xl border border-slate-700">{fH}</div>
                <span className="text-indigo-400 animate-pulse">:</span>
                <div className="bg-slate-800 px-3 py-2 rounded-2xl border border-slate-700">{fM}</div>
                <span className="text-indigo-400 animate-pulse">:</span>
                <div className="bg-slate-800 px-3 py-2 rounded-2xl border border-slate-700">{fS}</div>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-3 flex items-center gap-1">
                <span>Voucher Code:</span>
                <span className="font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">FESTIVAL60</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-Converting Buyer Spotlight Hero */}
      <BuyerAttractiveHero go={go} openProduct={openProduct} addToCart={addToCart} />

      {/* Category Rail */}
      <CategoryRail active="all" onPick={(id) => { setActiveCat(id); go("shop"); }} />

      {/* 🏷️ SPECIAL OFFER BANNERS (3 CARDS) */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex flex-col justify-between h-48 shadow-lg hover:shadow-indigo-500/20 transition-all group cursor-pointer" onClick={() => go("deals")}>
            <div>
              <span className="text-[11px] font-mono font-bold bg-white/20 px-2.5 py-1 rounded-full text-white">LIMITED OFFER</span>
              <h3 className="ff-display font-bold text-xl mt-2">Buy 2 Get 1 FREE</h3>
              <p className="text-xs text-indigo-100 mt-1">On all Fashion & Streetwear drops</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/20">
              <span className="font-mono text-xs font-bold text-amber-300">CODE: B2G1FREE</span>
              <span className="w-8 h-8 rounded-full bg-white/20 grid place-items-center group-hover:translate-x-1 transition-transform">
                <ArrowRight size={15} />
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white flex flex-col justify-between h-48 shadow-lg border border-slate-800 hover:border-slate-700 transition-all group cursor-pointer" onClick={() => go("deals")}>
            <div>
              <span className="text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full">TECH DEAL</span>
              <h3 className="ff-display font-bold text-xl mt-2">Extra $20 OFF Audio</h3>
              <p className="text-xs text-slate-400 mt-1">Noise Cancelling Headphones & Speakers</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="font-mono text-xs font-bold text-amber-300">CODE: TECHFLUX20</span>
              <span className="w-8 h-8 rounded-full bg-slate-800 grid place-items-center group-hover:translate-x-1 transition-transform">
                <ArrowRight size={15} />
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-600 to-orange-600 text-white flex flex-col justify-between h-48 shadow-lg hover:shadow-rose-500/20 transition-all group cursor-pointer" onClick={() => go("shop")}>
            <div>
              <span className="text-[11px] font-mono font-bold bg-white/20 px-2.5 py-1 rounded-full text-white">EXPRESS LOGISTICS</span>
              <h3 className="ff-display font-bold text-xl mt-2">Free Express Shipping</h3>
              <p className="text-xs text-rose-100 mt-1">On all orders above $35 sitewide</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/20">
              <span className="font-mono text-xs font-bold text-white">AUTOMATIC AT CHECKOUT</span>
              <span className="w-8 h-8 rounded-full bg-white/20 grid place-items-center group-hover:translate-x-1 transition-transform">
                <ArrowRight size={15} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 BEST SELLING PRODUCTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="ff-mono uppercase text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                <Flame size={13} className="text-amber-600" /> HIGHEST DEMAND DROPS
              </span>
            </div>
            <h2 className="ff-display font-bold text-2xl sm:text-3xl text-slate-900 mt-1">Best Selling Products</h2>
            <p className="ff-body text-xs sm:text-sm text-slate-500 mt-0.5">Top performing items moving fastest across buyer feeds this week.</p>
          </div>

          <button
            onClick={() => go("shop")}
            className="ff-btn px-4 py-2 text-xs bg-slate-900 hover:bg-indigo-600 text-white font-semibold flex items-center gap-1.5 self-start md:self-auto shadow-sm"
          >
            Explore Full Market <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellers.map((p, idx) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              {/* Best seller rank badge */}
              <div className="absolute top-4 left-4 z-10 bg-slate-900 text-white font-mono text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Award size={12} className="text-amber-400" /> #{idx + 1} Best Seller
              </div>

              <div>
                <div
                  onClick={() => openProduct(p)}
                  className="w-full h-56 rounded-2xl overflow-hidden bg-slate-50 mb-4 cursor-pointer relative group-hover:scale-[1.02] transition-transform"
                >
                  <CategoryGlyph product={p} className="w-full h-full object-contain p-4" iconSize={40} />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span className="uppercase font-semibold">{p.category}</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star size={12} fill="currentColor" /> {p.rating} ({p.reviews})
                    </span>
                  </div>

                  <h3
                    onClick={() => openProduct(p)}
                    className="font-semibold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer line-clamp-1"
                  >
                    {p.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">{p.blurb}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-base text-slate-900">{money(p.price)}</div>
                  {p.was && <div className="text-[11px] font-mono line-through text-slate-400">{money(p.was)}</div>}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openProduct(p)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => addToCart(p)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-all"
                  >
                    <ShoppingBag size={13} /> +Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🏢 BRAND OFFER BANNERS */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        <SectionHeading eyebrow="Official Merchants" title="Featured Brand Offers" />

        <div className="grid lg:grid-cols-3 gap-6">
          {brandOffers.map((b) => (
            <div
              key={b.id}
              className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${b.bgGradient} text-white flex flex-col justify-between shadow-xl relative overflow-hidden border border-slate-800 hover:scale-[1.01] transition-transform`}
            >
              <div className="space-y-3">
                <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border bg-white/10 ${b.accent}`}>
                  OFFICIAL BRAND PROMO
                </span>

                <div>
                  <h4 className="font-mono text-xs text-slate-400 font-semibold">{b.brand}</h4>
                  <h3 className="ff-display font-bold text-2xl text-white mt-1">{b.title}</h3>
                </div>

                <div className="text-2xl font-bold font-mono text-amber-300">{b.discount}</div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-300">
                  CODE: <strong className="text-white">{b.code}</strong>
                </span>
                <button
                  onClick={() => { setActiveCat(b.category); go("shop"); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors flex items-center gap-1.5 ${b.btnBg}`}
                >
                  Shop Brand <ExternalLink size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRENDING SECTION */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        <SectionHeading
          eyebrow="Hot right now"
          title="Trending in the feed"
          action={
            <button onClick={() => go("shop")} className="ff-focus ff-btn ff-btn-ghost px-5 py-2.5 text-sm flex items-center gap-1.5">
              See all <ChevronRight size={15} />
            </button>
          }
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={openProduct} onAdd={addToCart} wished={wishlist.includes(p.id)} onWish={toggleWish} />
          ))}
        </div>
      </section>

      {/* MEMBER CTA */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-6">
        <div className="px-8 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: "linear-gradient(120deg, var(--coral), #FF8A5B)", borderRadius: 28 }}>
          <div>
            <span className="ff-mono" style={{ fontSize: 11, color: "rgba(255,255,255,.8)" }}>MEMBERS ONLY</span>
            <h3 className="ff-display font-bold mt-1" style={{ fontSize: 28, color: "#fff" }}>Unlock 15% off your first drop</h3>
            <p className="ff-body mt-1" style={{ fontSize: 14, color: "rgba(255,255,255,.85)" }}>Create an account — takes about 20 seconds.</p>
          </div>
          <button onClick={() => go("account")} className="ff-btn px-7 py-3.5 text-sm shrink-0" style={{ background: "#fff", color: "var(--ink)" }}>Create account</button>
        </div>
      </section>

      {/* JUST LANDED */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        <SectionHeading eyebrow="Fresh" title="Just landed" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {justIn.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={openProduct} onAdd={addToCart} wished={wishlist.includes(p.id)} onWish={toggleWish} />
          ))}
        </div>
      </section>
    </>
  );
}
