import { useState, useEffect, useRef } from "react";
import {
  ShoppingBag, Heart, Search, User, Menu, X, ChevronDown, Sparkles,
  Package, LogIn, ArrowRight, Star
} from "lucide-react";
import { CATEGORIES } from "../data/products";
import Logo from "./Logo";
import Ticker from "./Ticker";
import CategoryGlyph from "./CategoryGlyph";
import { money } from "../utils/format";

export default function Header({
  page, go, cartCount, cartBump, query, setQuery, onSearch, wishCount,
  setActiveCat, seller, buyer, openAuthModal, onToggleAIChat, onToggleCartDrawer,
  products = [], openProduct, orderCount = 0
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const catRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "shop", label: "Shop all" },
    { id: "deals", label: "Deals" },
    { id: "seller", label: seller ? "Seller Hub" : "Become a Seller" },
  ];

  const pickCategory = (id) => {
    setActiveCat(id);
    go("shop");
    setCatOpen(false);
    setMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setSearchFocused(false);
    if (onSearch) onSearch();
  };

  // Search Predictions Autocomplete List
  const searchResults = query?.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <header className="sticky top-0 z-40" style={{ background: "var(--paper)" }}>
      <Ticker />

      <div
        className="border-b transition-shadow"
        style={{
          borderColor: "var(--line)",
          background: "rgba(241,242,246,.94)",
          backdropFilter: "blur(12px)",
          boxShadow: scrolled ? "0 8px 24px -18px rgba(16,16,26,.4)" : "none",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div
            className="flex items-center justify-between gap-6"
            style={{ height: scrolled ? 72 : 88, transition: "height .2s ease" }}
          >
            {/* Brand Logo */}
            <button className="ff-focus rounded-lg shrink-0" onClick={() => go("home")} aria-label="Flux Market home page">
              <Logo size={scrolled ? 34 : 40} />
            </button>

            {/* Main Interactive Compact Search Bar */}
            <div className="hidden md:block flex-1 max-w-sm lg:max-w-md mx-3 relative" ref={searchRef}>
              <form
                onSubmit={handleSearchSubmit}
                className={`flex items-center rounded-full border bg-white overflow-hidden transition-all ${
                  searchFocused ? "ring-2 ring-indigo-500/30 border-indigo-600 shadow-md" : "border-slate-300 hover:border-slate-400"
                }`}
              >
                <Search size={15} className="ml-3 shrink-0" color="var(--ink-soft)" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSearchFocused(true);
                  }}
                  onFocus={() => setSearchFocused(true)}
                  placeholder="Search products..."
                  className="ff-body flex-1 px-3 py-1.5 text-xs outline-none bg-transparent"
                  aria-label="Search Marketplace Products"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => { setQuery(""); setSearchFocused(false); }}
                    className="p-1 text-slate-400 hover:text-slate-700"
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}

                <button
                  type="submit"
                  className="ff-btn ff-btn-primary px-4 py-1.5 m-0.5 text-xs font-bold rounded-full transition-all shrink-0 shadow-sm"
                >
                  Search
                </button>
              </form>

              {/* Predictive Live Autocomplete Search Dropdown */}
              {searchFocused && query?.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-50 ff-rise space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2 pt-1 border-b border-slate-100 pb-2">
                    <span>MATCHING PRODUCTS ({searchResults.length})</span>
                    <span>Press Enter to View All</span>
                  </div>

                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No matching products found for "<strong className="text-slate-800">{query}</strong>"
                    </div>
                  ) : (
                    searchResults.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          if (openProduct) openProduct(prod);
                          setSearchFocused(false);
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center gap-3 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <CategoryGlyph product={prod} className="w-full h-full object-contain" iconSize={14} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">{prod.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                            <span className="capitalize">{prod.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                              <Star size={11} fill="currentColor" /> {prod.rating}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs font-bold font-mono text-indigo-600 shrink-0">
                          {money(prod.price)}
                        </div>
                      </div>
                    ))
                  )}

                  <button
                    onClick={handleSearchSubmit}
                    className="w-full py-2.5 text-xs font-bold text-center text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center justify-center gap-1 mt-1"
                  >
                    View all matching market results <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 mr-2" aria-label="Main Navigation">
              <div className="relative" ref={catRef}>
                <button
                  onClick={() => setCatOpen((v) => !v)}
                  className="ff-focus ff-body px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 flex items-center gap-1"
                  style={{
                    color: catOpen ? "var(--ink)" : "var(--ink-soft)",
                    background: catOpen ? "#fff" : "transparent",
                    border: catOpen ? "1px solid var(--line)" : "1px solid transparent",
                  }}
                  aria-haspopup="true"
                  aria-expanded={catOpen}
                >
                  Categories <ChevronDown size={14} style={{ transform: catOpen ? "rotate(180deg)" : "none", transition: "transform .15s ease" }} />
                </button>

                {catOpen && (
                  <div
                    className="absolute left-0 top-full mt-2 rounded-2xl bg-white p-2 grid grid-cols-2 gap-1 ff-rise"
                    style={{ width: 320, border: "1px solid var(--line)", boxShadow: "0 20px 40px -16px rgba(16,16,26,.25)" }}
                  >
                    {CATEGORIES.map((c) => {
                      const Icon = c.icon;
                      return (
                        <button
                          key={c.id}
                          onClick={() => pickCategory(c.id)}
                          className="ff-focus ff-hover-paper flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left"
                        >
                          <span className="w-8 h-8 rounded-lg grid place-items-center shrink-0" style={{ background: `${c.color}1A` }}>
                            <Icon size={16} color={c.color} />
                          </span>
                          <span className="ff-body font-medium" style={{ fontSize: 13, color: "var(--ink)" }}>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {navItems.map((n) => (
                <button
                  key={n.id}
                  onClick={() => go(n.id)}
                  className="ff-focus ff-body px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all"
                  style={{
                    color: page === n.id ? "var(--ink)" : "var(--ink-soft)",
                    background: page === n.id ? "#fff" : "transparent",
                    border: page === n.id ? "1px solid var(--line)" : "1px solid transparent",
                  }}
                >
                  {n.label}
                </button>
              ))}
            </nav>

            {/* Quick Action Icons */}
            <div className="flex items-center gap-2.5">
              {/* AI Assistant Floating Button */}
              <button
                onClick={onToggleAIChat}
                className="ff-focus px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md hover:scale-105"
                title="Open AI Shopping Assistant"
              >
                <Sparkles size={15} className="text-amber-300 animate-pulse" />
                <span className="hidden sm:inline">AI Assistant</span>
              </button>

              {/* Buyer Account Button */}
              {buyer ? (
                <button
                  onClick={() => go("account")}
                  className="ff-focus px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold flex items-center gap-2 border border-slate-300 transition-all shadow-sm relative"
                >
                  <img src={buyer.avatar} alt={buyer.name} className="w-5 h-5 rounded-full bg-indigo-100 object-cover" />
                  <span className="hidden md:inline max-w-[90px] truncate">{buyer.name.split(" ")[0]}</span>
                  {orderCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-mono text-[9px] grid place-items-center">
                      {orderCount}
                    </span>
                  )}
                </button>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="ff-focus px-4 py-2 rounded-full bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
                >
                  <LogIn size={15} /> Buyer Login
                </button>
              )}

              {/* Saved Wishlist */}
              <button onClick={() => go("wishlist")} className="ff-focus relative w-11 h-11 rounded-full hidden sm:grid place-items-center bg-slate-100 hover:bg-white border border-slate-200 transition-all" aria-label="View Saved Wishlist">
                <Heart size={20} color="var(--ink)" />
                {wishCount > 0 && (
                  <span className="ff-mono absolute top-1 right-1 rounded-full grid place-items-center font-bold" style={{ width: 16, height: 16, fontSize: 9, background: "var(--coral)", color: "#fff" }}>
                    {wishCount}
                  </span>
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button onClick={() => (onToggleCartDrawer ? onToggleCartDrawer() : go("cart"))} className="ff-focus relative w-11 h-11 rounded-full grid place-items-center bg-slate-100 hover:bg-white border border-slate-200 transition-all" aria-label="Open Shopping Cart">
                <ShoppingBag size={20} color="var(--ink)" />
                {cartCount > 0 && (
                  <span key={cartBump} className="ff-mono ff-pop absolute -top-0.5 -right-0.5 rounded-full grid place-items-center font-bold" style={{ width: 18, height: 18, fontSize: 10, background: "var(--flux)", color: "#fff" }}>
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Toggle */}
              <button onClick={() => setMenuOpen((v) => !v)} className="ff-focus w-11 h-11 rounded-full grid place-items-center lg:hidden bg-slate-100 hover:bg-white border border-slate-200" aria-label="Toggle Navigation Menu">
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="lg:hidden border-b bg-white px-5 py-4 flex flex-col gap-2" style={{ borderColor: "var(--line)" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (onSearch) onSearch();
              setMenuOpen(false);
            }}
            className="flex items-center rounded-full border overflow-hidden"
            style={{ borderColor: "var(--line)" }}
          >
            <Search size={15} className="ml-3.5" color="var(--ink-soft)" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-2.5 py-2.5 text-xs outline-none"
            />
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold">Search</button>
          </form>

          <div className="ff-mono uppercase px-3 pt-2 pb-1" style={{ fontSize: 10.5, letterSpacing: ".08em", color: "var(--ink-soft)" }}>
            Categories
          </div>
          <div className="grid grid-cols-2 gap-1 mb-2">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => pickCategory(c.id)}
                  className="ff-focus flex items-center gap-2 px-3 py-2 rounded-xl text-left bg-slate-50"
                >
                  <Icon size={14} color={c.color} />
                  <span className="ff-body font-medium text-xs text-slate-800">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}