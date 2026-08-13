import { useRef } from "react";
import { Heart, Plus } from "lucide-react";
import { catColor } from "../data/products";
import { money } from "../utils/format";
import Stars from "./Stars";
import CategoryGlyph from "./CategoryGlyph";

export default function ProductCard({ product, onOpen, onAdd, wished, onWish }) {
  const ref = useRef(null);
  const color = catColor(product.category);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${py * -6}deg) rotateY(${px * 6}deg) translateY(-4px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="ff-card group cursor-pointer overflow-hidden flex flex-col"
      style={{ transformStyle: "preserve-3d" }}
      onClick={() => onOpen(product)}
    >
      <div className="relative">
        <CategoryGlyph product={product} className="h-44 w-full" />
        <button
          onClick={(e) => { e.stopPropagation(); onWish(product.id); }}
          aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
          className="ff-focus absolute top-3 right-3 w-9 h-9 rounded-full bg-white grid place-items-center shadow-sm"
        >
          <Heart size={16} fill={wished ? "var(--coral)" : "none"} color={wished ? "var(--coral)" : "var(--ink)"} />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="ff-mono uppercase" style={{ fontSize: 10.5, letterSpacing: ".07em", color }}>{product.category}</span>
        <h3 className="ff-body font-semibold leading-snug" style={{ fontSize: 14.5, color: "var(--ink)" }}>{product.name}</h3>
        <div className="flex items-center gap-1.5">
          <Stars rating={product.rating} />
          <span className="ff-mono" style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{product.rating} ({product.reviews})</span>
        </div>
        <div className="mt-auto pt-2 flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="ff-display font-bold" style={{ fontSize: 19, color: "var(--ink)" }}>{money(product.price)}</span>
            {product.was && <span className="ff-mono line-through" style={{ fontSize: 12, color: "var(--ink-soft)" }}>{money(product.was)}</span>}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
            className="ff-btn w-9 h-9 grid place-items-center"
            style={{ background: color, color: "#fff" }}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
