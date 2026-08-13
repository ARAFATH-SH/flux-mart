import { useState, useEffect } from "react";
import { Flame, ArrowRight, Truck } from "lucide-react";
import KineticHeadline from "./KineticHeadline";

export default function Hero({ go }) {
  const [time, setTime] = useState(4 * 3600 + 18 * 60 + 22);
  useEffect(() => {
    const t = setInterval(() => setTime((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(time / 3600)).padStart(2, "0");
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const s = String(time % 60).padStart(2, "0");

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 pt-12 md:pt-16 pb-6">
      <div className="ff-hero-grid gap-6">
        <div className="p-8 md:p-12 relative overflow-hidden flex flex-col justify-center" style={{ background: "var(--ink)", minHeight: 400, borderRadius: 28 }}>
          <div className="absolute rounded-full" style={{ width: 340, height: 340, background: "var(--flux)", opacity: 0.35, filter: "blur(90px)", top: -80, right: -80, animation: "ff-blob 10s ease-in-out infinite" }} />
          <div className="absolute rounded-full" style={{ width: 260, height: 260, background: "var(--coral)", opacity: 0.25, filter: "blur(90px)", bottom: -60, left: -40, animation: "ff-blob 12s ease-in-out infinite reverse" }} />
          <div className="relative">
            <span className="ff-mono inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ fontSize: 11, letterSpacing: ".08em", background: "rgba(255,255,255,.1)", color: "#fff" }}>
              <Flame size={13} color="var(--coral)" /> LIVE — FLASH DROP RUNNING
            </span>
            <div style={{ color: "#fff" }}><KineticHeadline /></div>
            <p className="ff-body mt-5 max-w-md" style={{ fontSize: 15.5, color: "rgba(255,255,255,.65)" }}>
              Six categories, one feed. Prices shift, drops land, and the ticker up top never stops moving — grab it before it turns over.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <button onClick={() => go("shop")} className="ff-btn px-6 py-3.5 text-sm flex items-center gap-2" style={{ background: "var(--flux)", color: "#fff" }}>
                Shop the drop <ArrowRight size={15} />
              </button>
              <button onClick={() => go("shop")} className="ff-btn px-6 py-3.5 text-sm" style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1px solid rgba(255,255,255,.2)" }}>
                Browse categories
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="ff-card p-6 flex-1 flex flex-col justify-between" style={{ background: "linear-gradient(160deg, var(--flux), var(--flux-deep))", border: "none" }}>
            <div>
              <span className="ff-mono" style={{ fontSize: 11, color: "rgba(255,255,255,.7)" }}>ENDS IN</span>
              <div className="ff-mono font-bold flex gap-2 mt-2" style={{ fontSize: 34, color: "#fff" }}>
                <span>{h}</span><span style={{ opacity: 0.5 }}>:</span><span>{m}</span><span style={{ opacity: 0.5 }}>:</span><span>{s}</span>
              </div>
            </div>
            <div>
              <div className="ff-body font-semibold" style={{ fontSize: 15, color: "#fff" }}>Blue Hour Flash Sale</div>
              <div className="ff-body" style={{ fontSize: 12.5, color: "rgba(255,255,255,.7)" }}>Extra 15% off, stacks with drop pricing.</div>
            </div>
          </div>
          <div className="ff-card p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full grid place-items-center shrink-0" style={{ background: "var(--paper)" }}>
              <Truck size={19} color="var(--ink)" />
            </div>
            <div>
              <div className="ff-body font-semibold" style={{ fontSize: 14, color: "var(--ink)" }}>Free delivery over $35</div>
              <div className="ff-body" style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>Arrives in 2–4 days, tracked live.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
