import { useState } from "react";
import { X, ShoppingBag, Trash2, ArrowRight, Truck, Sparkles, Tag, ShieldCheck } from "lucide-react";
import { money } from "../utils/format";
import CategoryGlyph from "./CategoryGlyph";

export default function CartDrawer({ isOpen, onClose, cart, updateQty, removeItem, go, showToast }) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState("");

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const freeShippingThreshold = 35;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPct = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const discountAmount = (subtotal * appliedDiscount) / 100;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === "FLUX20" || code === "FESTIVAL60") {
      setAppliedDiscount(20);
      setCouponSuccess(`Coupon ${code} applied! 20% discount activated.`);
      if (showToast) showToast(`Applied ${code}! 20% off total.`);
    } else if (code === "B2G1FREE") {
      setAppliedDiscount(15);
      setCouponSuccess(`Coupon B2G1FREE applied! 15% discount activated.`);
      if (showToast) showToast(`Applied B2G1FREE! 15% off total.`);
    } else {
      setCouponSuccess("");
      if (showToast) showToast("Invalid coupon code. Try FLUX20 or FESTIVAL60");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop to close */}
      <div className="flex-1" onClick={onClose} />

      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl ff-rise border-l border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 grid place-items-center text-white shadow-md">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 className="ff-display font-bold text-base text-white">Your Shopping Cart</h3>
              <div className="text-[11px] text-slate-400 font-mono">
                {cart.reduce((s, i) => s + i.qty, 0)} Items Selected
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 grid place-items-center text-slate-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="p-3.5 bg-indigo-50/70 border-b border-indigo-100 shrink-0">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-950 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck size={15} className="text-indigo-600" />
              {remainingForFreeShipping === 0
                ? "🎉 You unlocked FREE Express Delivery!"
                : `Add ${money(remainingForFreeShipping)} more for FREE Delivery`}
            </span>
            <span className="font-mono text-[11px] font-bold text-indigo-600">
              {freeShippingPct.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-indigo-200/80 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${freeShippingPct}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag size={48} className="text-slate-300 mx-auto" />
              <h4 className="font-bold text-base text-slate-800">Your Cart is Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore drops in the feed and add items to your cart.
              </p>
              <button
                onClick={() => { onClose(); go("shop"); }}
                className="ff-btn px-5 py-2.5 text-xs bg-indigo-600 text-white font-semibold shadow-sm"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.key || item.id}
                className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                  <CategoryGlyph product={item} className="w-full h-full object-contain" iconSize={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-slate-900 truncate">{item.name}</h5>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    {money(item.price)} each
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border rounded-lg bg-slate-50">
                      <button
                        onClick={() => updateQty(item.key, -1)}
                        className="w-6 h-6 text-xs font-bold text-slate-600 grid place-items-center hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.key, 1)}
                        className="w-6 h-6 text-xs font-bold text-slate-600 grid place-items-center hover:bg-slate-200"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.key)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono font-bold text-xs text-slate-900">
                  {money(item.price * item.qty)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Voucher Form & Summary */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-200 space-y-3 shrink-0">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Promo Code (FLUX20)"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-indigo-600 text-white rounded-xl transition-colors shrink-0"
              >
                Apply
              </button>
            </form>

            {couponSuccess && (
              <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                ✓ {couponSuccess}
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{money(subtotal)}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({appliedDiscount}% OFF):</span>
                  <span>-{money(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping:</span>
                <span>{remainingForFreeShipping === 0 ? "FREE" : "$4.99"}</span>
              </div>

              <div className="flex justify-between font-bold text-sm text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Estimated Total:</span>
                <span className="text-indigo-600">{money(total + (remainingForFreeShipping === 0 ? 0 : 4.99))}</span>
              </div>
            </div>

            {/* Checkout Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => { onClose(); go("cart"); }}
                className="py-3 text-xs font-semibold border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors"
              >
                View Full Cart
              </button>

              <button
                onClick={() => { onClose(); go("checkout"); }}
                className="py-3 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                Checkout <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
