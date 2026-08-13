import { ArrowLeft, ChevronRight, Home, RefreshCw } from "lucide-react";

export default function NavigationHeader({ page, product, go, goBack, historyLength = 0 }) {
  if (page === "home") return null;

  const pageTitles = {
    shop: "Marketplace Feed",
    deals: "Flash Deals & Festival Offers",
    product: product?.name || "Product Details",
    cart: "Shopping Cart",
    checkout: "Secure Checkout",
    account: "Buyer Dashboard & Orders",
    wishlist: "Saved Wishlist",
    seller: "Seller Portal & Store Management",
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-2.5 flex items-center justify-between gap-4 text-xs font-mono">
        {/* Left: Back Button & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white transition-all font-semibold shrink-0 border border-slate-700/60"
            title="Go to previous page"
          >
            <ArrowLeft size={14} /> Back
          </button>

          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-1.5 text-slate-400 truncate">
            <button onClick={() => go("home")} className="hover:text-white flex items-center gap-1">
              <Home size={13} /> Home
            </button>
            <ChevronRight size={12} className="text-slate-600" />
            <span className="text-indigo-400 font-bold truncate">
              {pageTitles[page] || page}
            </span>
          </div>
        </div>

        {/* Right: Active Page Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Route: <strong className="text-slate-200 uppercase">{page}</strong></span>
        </div>
      </div>
    </div>
  );
}
