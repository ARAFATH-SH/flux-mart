import { useState, useEffect } from "react";
import { catColor, catIcon } from "../data/products";

export default function CategoryGlyph({ product, className = "", iconSize = 34 }) {
  const [imgFailed, setImgFailed] = useState(false);
  const color = catColor(product?.category || "electronics");
  const Icon = catIcon(product?.category || "electronics");

  useEffect(() => {
    setImgFailed(false);
  }, [product?.image]);

  const hasHeight = className.includes("h-") || className.includes("aspect-");
  const containerClass = `relative overflow-hidden ${className} ${!hasHeight ? "aspect-square min-h-[180px]" : ""}`;

  return (
    <div
      className={containerClass}
      style={{ background: `linear-gradient(135deg, ${color}22, ${color}0D)` }}
    >
      {product?.image && !imgFailed ? (
        <img
          src={product.image}
          alt={product?.name || "Product image"}
          onError={() => setImgFailed(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      ) : (
        <>
          <div
            className="absolute rounded-full opacity-30"
            style={{ width: 140, height: 140, background: color, filter: "blur(30px)", top: -30, right: -30 }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <div className="rounded-2xl grid place-items-center" style={{ width: iconSize * 1.9, height: iconSize * 1.9, background: "#fff", boxShadow: `0 10px 30px -10px ${color}66` }}>
              <Icon size={iconSize} color={color} strokeWidth={1.7} />
            </div>
          </div>
        </>
      )}
      {product?.badge && (
        <span
          className="ff-mono absolute top-3 left-3 px-2 py-1 rounded-lg font-bold z-10 shadow-sm"
          style={{ fontSize: 10.5, background: color, color: "#fff" }}
        >
          {product.badge}
        </span>
      )}
    </div>
  );
}