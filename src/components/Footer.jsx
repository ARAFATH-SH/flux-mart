import Logo from "./Logo";

export default function Footer({ go }) {
  return (
    <footer className="mt-20 border-t" style={{ borderColor: "var(--line)", background: "#fff" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <Logo />
          <p className="ff-body mt-4 max-w-xs" style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>
            A marketplace that moves with the deals. New drops surface the moment they land.
          </p>
        </div>
        {[
          { h: "Shop", items: [{ label: "All categories", p: "shop" }, { label: "Today's deals", p: "deals" }, { label: "New arrivals", p: "shop" }] },
          { h: "Support", items: [{ label: "Track order", p: "account" }, { label: "Shipping info", p: "home" }, { label: "Contact us", p: "home" }] },
          { h: "Merchants", items: [{ label: "Become a seller", p: "seller" }, { label: "Seller Dashboard", p: "seller" }] },
        ].map((col) => (
          <div key={col.h}>
            <div className="ff-mono uppercase mb-3" style={{ fontSize: 11, letterSpacing: ".08em", color: "var(--ink)" }}>{col.h}</div>
            <ul className="flex flex-col gap-2.5">
              {col.items.map((it) => (
                <li key={it.label}><button onClick={() => go(it.p)} className="ff-body hover:underline text-left" style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{it.label}</button></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t py-5" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="ff-mono" style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>© 2026 Flux Market. All rights reserved.</span>
          <span className="ff-mono" style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>Made for people who shop in the moment.</span>
        </div>
      </div>
    </footer>
  );
}
