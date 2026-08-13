import { useState } from "react";
import {
  Package, Truck, CheckCircle2, Clock, MapPin, Search, ChevronRight,
  MessageSquare, ExternalLink, ShieldCheck, ArrowRight, RefreshCw
} from "lucide-react";
import { money } from "../utils/format";
import CategoryGlyph from "./CategoryGlyph";

export default function OrderTrackingView({ orders = [], onOpenSellerChat, go }) {
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!orders || orders.length === 0) {
    return (
      <div className="ff-card p-10 text-center max-w-xl mx-auto my-12">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 grid place-items-center mx-auto mb-4">
          <Package size={32} />
        </div>
        <h3 className="ff-display font-bold text-xl text-slate-900">No Orders Placed Yet</h3>
        <p className="ff-body text-slate-500 text-sm mt-2 max-w-md mx-auto">
          Log in as buyer, add items to your cart, and place an order to track live delivery progress here.
        </p>
        <button
          onClick={() => go("shop")}
          className="ff-btn ff-btn-primary px-6 py-3 text-sm mt-6 shadow-md"
        >
          Browse Shop & Place Drop
        </button>
      </div>
    );
  }

  const filteredOrders = searchQuery
    ? orders.filter((o) => o.id.toLowerCase().includes(searchQuery.toLowerCase()))
    : orders;

  return (
    <div className="max-w-6xl mx-auto space-y-8 ff-rise">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "var(--flux)" }}
        />
        <div>
          <span className="ff-mono uppercase text-xs font-bold text-indigo-400 tracking-wider">
            Live Buyer Order Intelligence
          </span>
          <h2 className="ff-display font-bold text-2xl sm:text-3xl mt-1">Real-Time Order Tracking</h2>
          <p className="ff-body text-slate-400 text-xs sm:text-sm mt-1 max-w-lg">
            Track door-to-door courier dispatch, verified milestone checkpoints, and chat directly with sellers.
          </p>
        </div>

        {/* Search Order Input */}
        <div className="relative min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID e.g. FX-10928..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 outline-none focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Selector List */}
        <div className="space-y-3">
          <div className="ff-mono uppercase text-xs font-bold text-slate-500 px-1">
            Your Placed Orders ({orders.length})
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredOrders.map((o) => {
              const isSelected = o.id === activeOrder?.id;
              return (
                <div
                  key={o.id}
                  onClick={() => setSelectedOrderId(o.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-indigo-50/70 border-indigo-600 shadow-md ring-1 ring-indigo-600/30"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="ff-mono font-bold text-sm text-slate-900">{o.id}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {o.statusLabel || "Processing"}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center justify-between">
                    <span>{o.date}</span>
                    <span className="font-bold text-slate-900">{money(o.total)}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {o.items?.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-7 h-7 rounded-lg overflow-hidden border border-white bg-slate-100 shrink-0">
                          <CategoryGlyph product={item} className="w-full h-full" iconSize={10} />
                        </div>
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium ml-auto">
                      {o.items?.length} item{o.items?.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Order Details & Interactive Tracker */}
        {activeOrder && (
          <div className="lg:col-span-2 space-y-6">
            {/* Live Progress Timeline */}
            <div className="ff-card p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="ff-mono font-bold text-xl text-slate-900">{activeOrder.id}</span>
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold font-mono">
                      TRACKING: {activeOrder.trackingNumber || `TRK-${activeOrder.id}`}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span>Placed on {activeOrder.date}</span>
                    <span>•</span>
                    <span>Carrier: Flux Express Logistics</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      if (activeOrder) {
                        const statuses = [
                          { label: "Order Placed", idx: 0 },
                          { label: "Processing", idx: 1 },
                          { label: "Out for Delivery", idx: 2 },
                          { label: "Delivered", idx: 3 },
                        ];
                        const currentIdx = statuses.findIndex(s => s.label === (activeOrder.statusLabel || "Processing"));
                        const nextIdx = (currentIdx + 1) % statuses.length;
                        const nextStatus = statuses[nextIdx];

                        activeOrder.statusLabel = nextStatus.label;
                        if (activeOrder.timeline) {
                          activeOrder.timeline = activeOrder.timeline.map((step, i) => ({
                            ...step,
                            completed: i <= nextIdx,
                            active: i === nextIdx,
                          }));
                        }
                        setSelectedOrderId((id) => id); // trigger re-render
                      }
                    }}
                    className="ff-btn px-3 py-2 text-xs border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold flex items-center gap-1.5 transition-all"
                    title="Simulate courier progress in real time"
                  >
                    <RefreshCw size={13} className="text-indigo-600" /> Advance Courier Step 🚚
                  </button>

                  <button
                    onClick={() => onOpenSellerChat && onOpenSellerChat(activeOrder.items?.[0], activeOrder)}
                    className="ff-btn px-4 py-2.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 shadow-sm"
                  >
                    <MessageSquare size={15} /> Chat Seller
                  </button>
                </div>
              </div>

              {/* Status Timeline Steps */}
              <div>
                <h4 className="ff-display font-bold text-sm text-slate-900 mb-6 flex items-center gap-2">
                  <Clock size={16} className="text-indigo-600" /> Dispatch Timeline & Milestones
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                  {(activeOrder.timeline || [
                    { step: "Order Placed", desc: "Payment verified", time: activeOrder.date, completed: true },
                    { step: "Processing", desc: "Seller packed item", time: "In progress", active: true },
                    { step: "Out for Delivery", desc: "Handed to courier", time: "Pending", completed: false },
                    { step: "Delivered", desc: "Doorstep confirmation", time: "Pending", completed: false },
                  ]).map((t, idx) => {
                    const isDone = t.completed;
                    const isActive = t.active;
                    return (
                      <div key={idx} className="flex flex-col items-center text-center relative z-10">
                        <div
                          className={`w-10 h-10 rounded-full grid place-items-center font-bold text-xs shadow-md mb-3 transition-all ${
                            isDone
                              ? "bg-emerald-500 text-white"
                              : isActive
                              ? "bg-indigo-600 text-white ring-4 ring-indigo-100 animate-pulse"
                              : "bg-slate-100 text-slate-400 border border-slate-200"
                          }`}
                        >
                          {isDone ? <CheckCircle2 size={20} /> : isActive ? <Truck size={20} /> : idx + 1}
                        </div>
                        <div className="font-semibold text-xs text-slate-900">{t.step}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{t.desc}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-1">{t.time}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Courier Map Visualizer */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono text-indigo-400">
                    <MapPin size={15} /> LIVE LOGISTICS ROUTE
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <RefreshCw size={12} className="animate-spin" /> Updating position
                  </span>
                </div>

                <div className="relative h-28 bg-slate-800/80 rounded-xl p-4 flex items-center justify-between overflow-hidden border border-slate-700/60">
                  {/* Dotted Route Line */}
                  <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-slate-600" />

                  {/* Courier Van moving graphic */}
                  <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-indigo-600 px-3 py-1.5 rounded-full shadow-lg border border-indigo-400 flex items-center gap-2 text-xs font-bold text-white z-10 animate-pulse">
                    <Truck size={15} /> In Transit (Courier #482)
                  </div>

                  {/* Origin */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-500 grid place-items-center text-slate-300 text-xs">
                      🏬
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">Seller Hub</span>
                  </div>

                  {/* Destination */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 grid place-items-center text-emerald-300 text-xs font-bold">
                      🏠
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 mt-1">Your Address</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-300 pt-1">
                  <span>Estimated Arrival: <strong className="text-white font-mono">Tomorrow by 4:00 PM</strong></span>
                  <span className="text-slate-400 font-mono">Address: {activeOrder.shippingAddress?.street || "742 Evergreen Terrace"}</span>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h4 className="ff-display font-bold text-sm text-slate-900">Items in this Order</h4>

                <div className="space-y-3">
                  {activeOrder.items?.map((item, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-white">
                          <CategoryGlyph product={item} className="w-full h-full" iconSize={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-slate-900 truncate">{item.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            Qty: {item.qty} {item.color && `· ${item.color}`} {item.size && `· ${item.size}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-xs text-slate-900">{money(item.price * item.qty)}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{money(item.price)} each</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
