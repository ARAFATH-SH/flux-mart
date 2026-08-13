import { Heart } from "lucide-react";
import { PRODUCTS } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function WishlistPage({ wishlist, go, openProduct, addToCart, toggleWish, products = PRODUCTS }) {
  const items = products.filter((p) => wishlist.includes(p.id));
  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-10">
      <h1 className="ff-display font-bold mb-1" style={{ fontSize: 28, color: "var(--ink)" }}>Your wishlist</h1>
      <p className="ff-mono mb-8" style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
      {items.length === 0 ? (
        <div className="ff-card p-14 text-center">
          <Heart size={26} color="var(--ink-soft)" className="mx-auto mb-3" />
          <p className="ff-display font-bold" style={{ fontSize: 18, color: "var(--ink)" }}>Nothing saved yet</p>
          <p className="ff-body mt-2 mb-5" style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>Tap the heart on any product to keep it here.</p>
          <button onClick={() => go("shop")} className="ff-btn ff-btn-primary px-6 py-2.5 text-sm">Browse the shop</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={openProduct} onAdd={addToCart} wished={true} onWish={toggleWish} />
          ))}
        </div>
      )}
    </section>
  );
}
