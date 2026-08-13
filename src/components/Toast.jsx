import { Check } from "lucide-react";

export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ff-rise">
      <div className="flex items-center gap-3 pl-4 pr-5 py-3 rounded-full shadow-xl" style={{ background: "var(--ink)" }}>
        <div className="w-6 h-6 rounded-full grid place-items-center shrink-0" style={{ background: "var(--flux)" }}>
          <Check size={14} color="#fff" strokeWidth={3} />
        </div>
        <span className="ff-body text-sm text-white whitespace-nowrap">{toast}</span>
      </div>
    </div>
  );
}
