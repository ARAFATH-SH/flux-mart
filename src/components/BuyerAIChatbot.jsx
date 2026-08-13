import { useState, useRef, useEffect } from "react";
import { Sparkles, Bot, X, Send, ShoppingBag, ArrowRight, Star, Tag, ChevronRight } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { money } from "../utils/format";
import CategoryGlyph from "./CategoryGlyph";

export default function BuyerAIChatbot({ isOpen, onToggle, products = PRODUCTS, openProduct, addToCart }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "👋 Hi! I'm your Flux AI Shopping Assistant. Tell me what product you're looking for, your budget, or your style preferences!",
      time: "Now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const searchProductsWithAI = (queryText) => {
    const text = queryText.toLowerCase();
    let matches = [...products];

    // Filter by price if numbers found
    const priceMatch = text.match(/under\s*\$?(\d+)|below\s*\$?(\d+)|less than\s*\$?(\d+)/i);
    if (priceMatch) {
      const maxPrice = parseFloat(priceMatch[1] || priceMatch[2] || priceMatch[3]);
      if (!isNaN(maxPrice)) {
        matches = matches.filter((p) => p.price <= maxPrice);
      }
    }

    // Category matching
    const categories = ["electronics", "fashion", "home", "grocery", "toys", "beauty", "sports", "books", "pets", "automotive"];
    const matchedCategory = categories.find((cat) => text.includes(cat));
    if (matchedCategory) {
      matches = matches.filter((p) => p.category === matchedCategory);
    }

    // Specific product keyword matching
    const keywords = ["headphone", "earbud", "lamp", "shirt", "pant", "backpack", "serum", "dino", "mat", "bed", "toy", "speaker", "dumbbell", "cold-brew"];
    const matchedKeyword = keywords.find((kw) => text.includes(kw));
    if (matchedKeyword) {
      matches = matches.filter((p) => p.name.toLowerCase().includes(matchedKeyword) || p.blurb?.toLowerCase().includes(matchedKeyword));
    }

    // Flash deals / discount check
    if (text.includes("deal") || text.includes("discount") || text.includes("sale") || text.includes("off")) {
      matches = matches.filter((p) => p.was || p.badge);
    }

    // If matches empty, fall back to top rated items
    if (matches.length === 0) {
      matches = products.filter((p) => p.rating >= 4.7).slice(0, 3);
    }

    return matches.slice(0, 3);
  };

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const foundProducts = searchProductsWithAI(query);

      let responseMsg = `I found ${foundProducts.length} great recommendation${foundProducts.length > 1 ? "s" : ""} based on your search:`;
      if (foundProducts.length === 0) {
        responseMsg = "Here are some of our top trending products on Flux Market:";
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: responseMsg,
        recommendedProducts: foundProducts,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const promptPresets = [
    "🎧 Tech & Headphones under $100",
    "🔥 Flash Deals & Discounts",
    "🏠 Minimalist Home Decor",
    "🎁 Best Rated Gifts",
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs shadow-2xl flex items-center gap-2.5 transition-all duration-300 transform hover:scale-105 border border-indigo-500/30 ${
          isOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"
        }`}
        aria-label="Open AI Assistant"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
        </span>
        <Sparkles size={16} className="text-amber-300 animate-spin-slow" />
        <span>Flux AI Shopping Bot</span>
      </button>

      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 sm:right-6 z-50 max-w-sm sm:max-w-md w-[calc(100vw-2.5rem)] h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden ff-rise">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 grid place-items-center text-white shadow-md">
                <Bot size={20} />
              </div>
              <div>
                <div className="font-semibold text-sm flex items-center gap-1.5">
                  Flux AI Shopping Assistant
                  <Sparkles size={13} className="text-amber-400" />
                </div>
                <div className="text-[11px] text-indigo-300 font-mono">
                  Smart Product Finder
                </div>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 grid place-items-center text-slate-300 transition-colors"
              aria-label="Close AI Assistant"
            >
              <X size={16} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60">
            {messages.map((m) => (
              <div key={m.id} className="space-y-2">
                <div className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      m.sender === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">{m.time}</span>
                </div>

                {/* Product Recommendation Cards */}
                {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                  <div className="space-y-2 pl-2 my-2">
                    {m.recommendedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                          <CategoryGlyph product={p} className="w-full h-full" iconSize={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-900 truncate">{p.name}</div>
                          <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                            <span className="font-bold text-slate-900">{money(p.price)}</span>
                            {p.was && <span className="line-through text-slate-400 font-mono text-[10px]">{money(p.was)}</span>}
                            <span className="flex items-center gap-0.5 text-amber-500 font-mono ml-auto">
                              <Star size={11} fill="currentColor" /> {p.rating}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => openProduct(p)}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors flex items-center gap-1"
                            >
                              View <ChevronRight size={12} />
                            </button>
                            <button
                              onClick={() => addToCart(p)}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-all flex items-center gap-1"
                            >
                              <ShoppingBag size={11} /> +Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 text-xs px-3 py-2 rounded-2xl w-fit">
                <Bot size={14} className="text-indigo-600 animate-spin-slow" />
                <span className="font-medium text-[11px]">Searching market catalog...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Prompt Presets */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {promptPresets.map((pr, i) => (
              <button
                key={i}
                onClick={() => handleSend(pr)}
                className="text-[11px] font-medium px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-xl transition-all shrink-0 whitespace-nowrap"
              >
                {pr}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI: e.g. 'Show wireless earbuds under $80'..."
              className="flex-1 bg-slate-100 px-3.5 py-2.5 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white grid place-items-center transition-all shadow-md shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
