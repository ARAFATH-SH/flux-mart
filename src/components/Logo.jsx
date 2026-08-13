import { Zap } from "lucide-react";

export default function Logo({ size = 34 }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="grid place-items-center rounded-2xl shrink-0"
        style={{ width: size, height: size, background: "var(--ink)" }}
      >
        <Zap size={size * 0.56} color="#fff" strokeWidth={2.4} />
      </div>
      <div className="leading-none">
        <div className="ff-display font-bold tracking-tight" style={{ fontSize: 19, color: "var(--ink)" }}>flux</div>
        <div className="ff-mono" style={{ fontSize: 10, color: "var(--ink-soft)", letterSpacing: ".08em" }}>MARKET</div>
      </div>
    </div>
  );
}
