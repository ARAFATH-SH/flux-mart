import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { PRODUCTS, catColor } from "../data/products";
import { money } from "../utils/format";
import CategoryGlyph from "../components/CategoryGlyph";

export default function CartPage({ cart, go, updateQty, removeItem, openProduct, products = PRODUCTS }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 35 || subtotal === 0 ? 0 : 5.99;
  const tax = subtotal * 0.084;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-5 py-24 text-center">
        <div className="w-16 h-16 rounded-full grid place-items-center mx-auto mb-5" style={{ background: "var(--paper)" }}>
          <ShoppingBag size={26} color="var(--ink-soft)" />
        </div>
        <h1 className="ff-display font-bold" style={{ fontSize: 24, color: "var(--ink)" }}>Your cart is empty</h1>
        <p className="ff-body mt-2" style={{ fontSize: 14, color: "var(--ink-soft)" }}>Nothing here yet — the feed is full of things worth grabbing.</p>
        <button onClick={() => go("shop")} className="ff-btn ff-btn-primary px-6 py-3 text-sm mt-6">Browse the shop</button>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 py-10">
      <h1 className="ff-display font-bold mb-1" style={{ fontSize: 30, color: "var(--ink)" }}>Your cart</h1>
      <p className="ff-mono mb-8" style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{cart.length} item{cart.length > 1 ? "s" : ""}</p>
      <div className="ff-side-grid gap-8 items-start">
        <div className="flex flex-col gap-4">
          {cart.map((item) => {
            const color = catColor(item.category);
            return (
              <div key={item.key} className="ff-card p-4 flex gap-4">
                <button onClick={() => openProduct(products.find((p) => p.id === item.id) || item)} className="shrink-0">
                  <CategoryGlyph product={item} className="w-24 h-24 rounded-2xl" iconSize={20} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="ff-body font-semibold" style={{ fontSize: 14.5, color: "var(--ink)" }}>{item.name}</h3>
                    <button onClick={() => removeItem(item.key)} aria-label="Remove item" className="ff-focus ff-trash shrink-0"><Trash2 size={16} /></button>
                  </div>
                  <p className="ff-mono mt-0.5" style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>
                    {item.color ? `Color: ${item.color} · ` : ""}{item.size ? `Size: ${item.size} · ` : ""}{money(item.price)} each
                  </p>
                  <div className="flex items-end justify-between mt-3">
                    <div className="flex items-center border rounded-full" style={{ borderColor: "var(--line)" }}>
                      <button onClick={() => updateQty(item.key, -1)} className="ff-focus w-8 h-8 grid place-items-center" aria-label="Decrease"><Minus size={13} /></button>
                      <span className="ff-mono w-7 text-center" style={{ fontSize: 13 }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.key, 1)} className="ff-focus w-8 h-8 grid place-items-center" aria-label="Increase"><Plus size={13} /></button>
                    </div>
                    <span className="ff-display font-bold" style={{ fontSize: 16, color }}>{money(item.price * item.qty)}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <button onClick={() => go("shop")} className="ff-focus flex items-center gap-1.5 ff-body font-medium mt-2" style={{ fontSize: 13.5, color: "var(--ink)" }}>
            <ArrowLeft size={15} /> Continue shopping
          </button>
        </div>

        <div className="ff-card p-6 sticky top-28">
          <h2 className="ff-display font-bold mb-4" style={{ fontSize: 19, color: "var(--ink)" }}>Order summary</h2>
          <div className="flex flex-col gap-2.5 ff-body" style={{ fontSize: 13.5 }}>
            <div className="flex justify-between"><span style={{ color: "var(--ink-soft)" }}>Subtotal</span><span className="font-semibold">{money(subtotal)}</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--ink-soft)" }}>Shipping</span><span className="font-semibold" style={{ color: shipping === 0 ? "var(--grocery)" : "var(--ink)" }}>{shipping === 0 ? "Free" : money(shipping)}</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--ink-soft)" }}>Estimated tax</span><span className="font-semibold">{money(tax)}</span></div>
          </div>
          <div className="border-t my-4" style={{ borderColor: "var(--line)" }} />
          <div className="flex justify-between items-baseline mb-5">
            <span className="ff-body font-semibold" style={{ fontSize: 15 }}>Total</span>
            <span className="ff-display font-bold" style={{ fontSize: 22, color: "var(--ink)" }}>{money(total)}</span>
          </div>
          <button onClick={() => go("checkout")} className="ff-btn ff-btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2">
            Proceed to checkout <ArrowRight size={15} />
          </button>
          <p className="ff-mono text-center mt-3" style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>Secure checkout · free returns · 24/7 support</p>
        </div>
      </div>
    </section>
  );
}
