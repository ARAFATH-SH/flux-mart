import { useState } from "react";
import { Check, CreditCard, ShieldCheck, MapPin, ChevronLeft, ArrowRight, UserCheck, Sparkles, Package } from "lucide-react";
import { money } from "../utils/format";
import CategoryGlyph from "../components/CategoryGlyph";

export default function CheckoutPage({ cart, go, clearCart, buyer, openAuthModal, onPlaceOrder }) {
  const [step, setStep] = useState(1);
  const [placed, setPlaced] = useState(false);
  const [orderNo] = useState(() => `FX-${Math.floor(10000 + Math.random() * 89999)}`);
  const [fullName, setFullName] = useState(buyer?.name || "");
  const [email, setEmail] = useState(buyer?.email || "");

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 35 || subtotal === 0 ? 0 : 5.99;
  const tax = subtotal * 0.084;
  const total = subtotal + shipping + tax;

  const steps = ["Shipping", "Payment", "Review"];

  const handlePlaceOrder = () => {
    const newOrder = {
      id: orderNo,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "processing",
      statusLabel: "Processing & Packing",
      trackingNumber: `FX-TRK-${Math.floor(100000 + Math.random() * 899999)}`,
      estimatedDelivery: "2-3 Business Days",
      items: [...cart],
      total: total,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      shippingAddress: {
        name: fullName || buyer?.name || "Valued Buyer",
        street: "742 Evergreen Terrace",
        city: "Springfield, OR",
        zip: "97477",
      },
      timeline: [
        { step: "Order Placed", desc: "Payment confirmed", time: "Just now", completed: true },
        { step: "Processing", desc: "Seller packing items", time: "In progress", active: true },
        { step: "Out for Delivery", desc: "Handed to courier", time: "Pending", completed: false },
        { step: "Delivered", desc: "Doorstep delivery", time: "Pending", completed: false },
      ],
    };

    if (onPlaceOrder) {
      onPlaceOrder(newOrder);
    }
    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <section className="max-w-xl mx-auto px-5 py-20 text-center ff-rise">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full grid place-items-center mx-auto mb-6 shadow-inner">
          <Check size={40} strokeWidth={3} />
        </div>
        <span className="ff-mono uppercase text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          ORDER CONFIRMED & DISPATCHED
        </span>
        <h1 className="ff-display font-bold mt-3" style={{ fontSize: 28, color: "var(--ink)" }}>
          Order Successfully Placed!
        </h1>
        <p className="ff-body mt-2 text-slate-600 text-sm max-w-md mx-auto">
          We've sent a detailed receipt to <strong>{email || buyer?.email || "your email"}</strong>. You can now track live courier shipment progress.
        </p>

        <div className="ff-card p-6 mt-6 bg-slate-900 text-white rounded-3xl">
          <span className="ff-mono text-xs text-slate-400">ORDER REFERENCE NUMBER</span>
          <div className="ff-mono font-bold text-2xl text-indigo-400 mt-1">{orderNo}</div>
          <div className="text-xs text-slate-400 mt-2 font-mono flex items-center justify-center gap-2">
            <span>{cart.length} Item(s)</span> · <span>Total: {money(total)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button
            onClick={() => go("account")}
            className="ff-btn px-6 py-3.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center justify-center gap-2 font-semibold"
          >
            <Package size={16} /> Track Live Order Status
          </button>
          <button
            onClick={() => go("shop")}
            className="ff-btn ff-btn-ghost px-6 py-3.5 text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 py-10">
      {/* Buyer Authentication Notice Banner */}
      {!buyer && (
        <div className="mb-8 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-indigo-600 shrink-0" />
            <div>
              <div className="font-semibold text-xs text-indigo-950">Logged in Buyers get Live Order Tracking</div>
              <div className="text-[11px] text-indigo-700">Sign in now to save order details & track delivery milestones.</div>
            </div>
          </div>
          <button
            onClick={() => openAuthModal && openAuthModal()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto shrink-0"
          >
            Log In / Sign Up
          </button>
        </div>
      )}

      <h1 className="ff-display font-bold mb-8" style={{ fontSize: 28, color: "var(--ink)" }}>Checkout</h1>

      <div className="flex items-center gap-3 mb-10 max-w-xl">
        {steps.map((s, i) => {
          const n = i + 1;
          const state = n < step ? "done" : n === step ? "active" : "todo";
          return (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-full grid place-items-center ff-mono font-bold" style={{ fontSize: 12, background: state === "todo" ? "var(--paper)" : "var(--ink)", color: state === "todo" ? "var(--ink-soft)" : "#fff" }}>
                  {state === "done" ? <Check size={14} /> : n}
                </div>
                <span className="ff-body font-medium hidden sm:inline" style={{ fontSize: 13, color: state === "todo" ? "var(--ink-soft)" : "var(--ink)" }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className="h-0.5 flex-1 rounded-full" style={{ background: n < step ? "var(--ink)" : "var(--line)" }} />}
            </div>
          );
        })}
      </div>

      <div className="ff-side-grid gap-8 items-start">
        <div className="ff-card p-7">
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <h2 className="ff-display font-bold" style={{ fontSize: 19 }}>Shipping information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="ff-body font-medium" style={{ fontSize: 12.5 }}>Full name</span>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                    style={{ borderColor: "var(--line)" }}
                    placeholder="Full name"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="ff-body font-medium" style={{ fontSize: 12.5 }}>Email</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                    style={{ borderColor: "var(--line)" }}
                    placeholder="you@email.com"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="ff-body font-medium" style={{ fontSize: 12.5 }}>Phone number</span>
                  <input className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm" style={{ borderColor: "var(--line)" }} placeholder="+1 (555) 000-0000" />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="ff-body font-medium" style={{ fontSize: 12.5 }}>Address</span>
                  <input className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm" style={{ borderColor: "var(--line)" }} placeholder="742 Evergreen Terrace" />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="ff-body font-medium" style={{ fontSize: 12.5 }}>City</span>
                  <input className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm" style={{ borderColor: "var(--line)" }} placeholder="Springfield" />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="ff-body font-medium" style={{ fontSize: 12.5 }}>ZIP code</span>
                  <input className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm" style={{ borderColor: "var(--line)" }} placeholder="97477" />
                </label>
              </div>
              <div>
                <span className="ff-body font-medium block mb-2" style={{ fontSize: 12.5 }}>Delivery method</span>
                <div className="flex flex-col gap-2.5">
                  {[{ n: "Standard", d: "2–4 days", p: "Free" }, { n: "Express", d: "1–2 days", p: "$9.99" }].map((d, i) => (
                    <label key={d.n} className="flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer" style={{ borderColor: i === 0 ? "var(--ink)" : "var(--line)", background: i === 0 ? "var(--paper)" : "transparent" }}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="delivery" defaultChecked={i === 0} style={{ accentColor: "var(--flux)" }} />
                        <div><div className="ff-body font-semibold" style={{ fontSize: 13.5 }}>{d.n}</div><div className="ff-body" style={{ fontSize: 12, color: "var(--ink-soft)" }}>{d.d}</div></div>
                      </div>
                      <span className="ff-mono font-semibold" style={{ fontSize: 12.5 }}>{d.p}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h2 className="ff-display font-bold" style={{ fontSize: 19 }}>Payment details</h2>
              <label className="flex flex-col gap-1.5">
                <span className="ff-body font-medium" style={{ fontSize: 12.5 }}>Card number</span>
                <div className="ff-focus relative">
                  <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" color="var(--ink-soft)" />
                  <input className="ff-body pl-10 pr-3.5 py-2.5 rounded-xl border text-sm w-full" style={{ borderColor: "var(--line)" }} placeholder="4242 4242 4242 4242" />
                </div>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="ff-body font-medium" style={{ fontSize: 12.5 }}>Expiry</span>
                  <input className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm" style={{ borderColor: "var(--line)" }} placeholder="MM/YY" />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="ff-body font-medium" style={{ fontSize: 12.5 }}>CVC</span>
                  <input className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm" style={{ borderColor: "var(--line)" }} placeholder="123" />
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="ff-body font-medium" style={{ fontSize: 12.5 }}>Billing ZIP</span>
                <input className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm" style={{ borderColor: "var(--line)", maxWidth: 180 }} placeholder="ZIP" />
              </label>
              <div className="flex items-center gap-2 ff-mono px-3.5 py-2.5 rounded-xl" style={{ background: "var(--paper)", fontSize: 11.5, color: "var(--ink-soft)" }}>
                <ShieldCheck size={14} /> Payment is encrypted and never stored on our servers.
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <h2 className="ff-display font-bold" style={{ fontSize: 19 }}>Review your order</h2>
              <div className="flex flex-col gap-3">
                {cart.map((item) => (
                  <div key={item.key} className="flex items-center gap-3">
                    <CategoryGlyph product={item} className="w-14 h-14 rounded-xl shrink-0" iconSize={14} />
                    <div className="flex-1 min-w-0">
                      <div className="ff-body font-semibold truncate" style={{ fontSize: 13.5 }}>{item.name}</div>
                      <div className="ff-mono" style={{ fontSize: 11, color: "var(--ink-soft)" }}>Qty {item.qty}</div>
                    </div>
                    <span className="ff-mono font-semibold" style={{ fontSize: 13 }}>{money(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="ff-mono flex items-center gap-2 px-3.5 py-2.5 rounded-xl" style={{ background: "var(--paper)", fontSize: 11.5, color: "var(--ink-soft)" }}>
                <MapPin size={14} /> Shipping to address entered in step 1 · Standard delivery
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: "var(--line)" }}>
            <button onClick={() => (step === 1 ? go("cart") : setStep((s) => s - 1))} className="ff-focus ff-btn ff-btn-ghost px-5 py-2.5 text-sm flex items-center gap-1.5"><ChevronLeft size={15} /> Back</button>
            <button
              onClick={() => (step < 3 ? setStep((s) => s + 1) : handlePlaceOrder())}
              className="ff-btn ff-btn-primary px-6 py-2.5 text-sm flex items-center gap-1.5 shadow-md"
            >
              {step < 3 ? "Continue" : "Place order"} <ArrowRight size={15} />
            </button>
          </div>
        </div>

        <div className="ff-card p-6 sticky top-28">
          <h2 className="ff-display font-bold mb-4" style={{ fontSize: 17 }}>Order summary</h2>
          <div className="flex flex-col gap-2.5 ff-body" style={{ fontSize: 13.5 }}>
            <div className="flex justify-between"><span style={{ color: "var(--ink-soft)" }}>Subtotal</span><span className="font-semibold">{money(subtotal)}</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--ink-soft)" }}>Shipping</span><span className="font-semibold" style={{ color: shipping === 0 ? "var(--grocery)" : "var(--ink)" }}>{shipping === 0 ? "Free" : money(shipping)}</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--ink-soft)" }}>Tax</span><span className="font-semibold">{money(tax)}</span></div>
          </div>
          <div className="border-t my-4" style={{ borderColor: "var(--line)" }} />
          <div className="flex justify-between items-baseline">
            <span className="ff-body font-semibold" style={{ fontSize: 15 }}>Total</span>
            <span className="ff-display font-bold" style={{ fontSize: 22, color: "var(--ink)" }}>{money(total)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

