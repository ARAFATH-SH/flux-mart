import { useState, useEffect, useRef } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import AuthModal from "./components/AuthModal";
import SellerChatModal from "./components/SellerChatModal";
import BuyerAIChatbot from "./components/BuyerAIChatbot";
import CartDrawer from "./components/CartDrawer";
import NavigationHeader from "./components/NavigationHeader";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import DealsPage from "./pages/DealsPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import WishlistPage from "./pages/WishlistPage";
import SellerPage from "./pages/SellerPage";
import { PRODUCTS as INITIAL_PRODUCTS } from "./data/products";

/* ---------------------------------------------------------------------- */
/*  APP WITH PERSISTENT ROUTING & NAVIGATION HISTORY                      */
/* ---------------------------------------------------------------------- */

export default function App() {
  // Safe LocalStorage Initializers
  const [page, setPage] = useState("home");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [seller, setSeller] = useState(null);

  // Persistent Buyer Auth State
  const [buyer, setBuyer] = useState(() => {
    try {
      const saved = localStorage.getItem("flux_buyer");
      return saved ? JSON.parse(saved) : {
        name: "Arafath (Buyer)",
        email: "arafath@example.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
        memberSince: "August 2026",
      };
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Persistent Buyer Orders State (empty until buyer places an order)
  const [buyerOrders, setBuyerOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("flux_orders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistent Cart & Wishlist
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("flux_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("flux_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation History Stack (for universal back button)
  const [navHistory, setNavHistory] = useState([]);

  // Buyer-Seller Chat State
  const [sellerChatOpen, setSellerChatOpen] = useState(false);
  const [chatProduct, setChatProduct] = useState(null);
  const [chatOrder, setChatOrder] = useState(null);

  // AI Assistant Chatbot & Cart Drawer State
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const [product, setProduct] = useState(null);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [toast, setToast] = useState(null);
  const [cartBump, setCartBump] = useState(0);
  const toastTimer = useRef(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try { localStorage.setItem("flux_buyer", JSON.stringify(buyer)); } catch {}
  }, [buyer]);

  useEffect(() => {
    try { localStorage.setItem("flux_orders", JSON.stringify(buyerOrders)); } catch {}
  }, [buyerOrders]);

  useEffect(() => {
    try { localStorage.setItem("flux_cart", JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem("flux_wishlist", JSON.stringify(wishlist)); } catch {}
  }, [wishlist]);

  // URL Hash Routing Sync (Prevents Page Reset on Refresh F5)
  useEffect(() => {
    const parseHashRoute = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash || hash === "home") {
        setPage("home");
      } else if (hash.startsWith("product/")) {
        const prodId = hash.replace("product/", "");
        const matchedProduct = products.find((p) => String(p.id) === String(prodId)) || products[0];
        if (matchedProduct) {
          setProduct(matchedProduct);
          setPage("product");
        } else {
          setPage("home");
        }
      } else if (["shop", "deals", "cart", "checkout", "account", "wishlist", "seller"].includes(hash)) {
        setPage(hash);
      } else {
        setPage("home");
      }
    };

    parseHashRoute();
    window.addEventListener("hashchange", parseHashRoute);
    return () => window.removeEventListener("hashchange", parseHashRoute);
  }, [products]);

  // Navigation Handler with Hash update & History Stack
  const go = (p, selectedProduct = null) => {
    if (page !== p) {
      setNavHistory((prev) => [...prev, { page, product }]);
    }

    if (p === "product" && selectedProduct) {
      setProduct(selectedProduct);
      window.location.hash = `product/${selectedProduct.id}`;
    } else {
      window.location.hash = p;
    }

    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openProduct = (p) => {
    go("product", p);
  };

  const goBack = () => {
    if (navHistory.length > 0) {
      const prev = navHistory[navHistory.length - 1];
      setNavHistory((prevList) => prevList.slice(0, -1));
      if (prev.page === "product" && prev.product) {
        setProduct(prev.product);
        window.location.hash = `product/${prev.product.id}`;
        setPage("product");
      } else {
        window.location.hash = prev.page;
        setPage(prev.page);
      }
    } else {
      window.location.hash = "home";
      setPage("home");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const openSellerChat = (prod, ord = null) => {
    setChatProduct(prod || INITIAL_PRODUCTS[0]);
    setChatOrder(ord);
    setSellerChatOpen(true);
  };

  const handlePlaceOrder = (newOrder) => {
    setBuyerOrders((prev) => [newOrder, ...prev]);
    showToast(`Order #${newOrder.id} placed! Tracking is now live.`);
    setCart([]);
    go("account");
  };

  const handleAddReview = (productId, newReview) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const existingList = p.reviewList || [
            { n: "Priya S.", r: 5, c: "Exactly as pictured, showed up two days early. Excellent sound quality!" },
            { n: "Marcus T.", r: 4, c: "Good value at this price point, durable build and solid materials." }
          ];
          const updatedList = [newReview, ...existingList];
          const avgRating = (
            updatedList.reduce((acc, r) => acc + (r.rating || r.r || 5), 0) / updatedList.length
          ).toFixed(1);

          return {
            ...p,
            rating: parseFloat(avgRating),
            reviews: updatedList.length,
            reviewList: updatedList,
          };
        }
        return p;
      })
    );

    setProduct((prev) => {
      if (prev && prev.id === productId) {
        const existingList = prev.reviewList || [
          { n: "Priya S.", r: 5, c: "Exactly as pictured, showed up two days early. Excellent sound quality!" },
          { n: "Marcus T.", r: 4, c: "Good value at this price point, durable build and solid materials." }
        ];
        const updatedList = [newReview, ...existingList];
        const avgRating = (
          updatedList.reduce((acc, r) => acc + (r.rating || r.r || 5), 0) / updatedList.length
        ).toFixed(1);

        return {
          ...prev,
          rating: parseFloat(avgRating),
          reviews: updatedList.length,
          reviewList: updatedList,
        };
      }
      return prev;
    });

    showToast("Your product review has been published!");
  };

  const addProduct = (p) => {
    const id = Date.now();
    const fullProduct = {
      ...p,
      id,
      rating: p.rating || 5.0,
      reviews: p.reviews || 1,
    };
    setProducts((prev) => [fullProduct, ...prev]);
    showToast(`Published "${p.name}" live to Market!`);
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    showToast("Product removed from market");
  };

  const addToCart = (p, qty = 1, opts = {}) => {
    setCart((prev) => {
      const key = `${p.id}-${opts.color || ""}-${opts.size || ""}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { ...p, key, qty, color: opts.color, size: opts.size }];
    });
    setCartBump((b) => b + 1);
    setCartDrawerOpen(true); // Open slide-over drawer feedback
    showToast(`Added ${p.name} to cart`);
  };

  const updateQty = (key, delta) => {
    setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, i.qty + delta) } : i)).filter(Boolean));
  };
  const removeItem = (key) => setCart((prev) => prev.filter((i) => i.key !== key));
  const clearCart = () => setCart([]);
  const toggleWish = (id) => setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const onSearch = () => { setActiveCat("all"); go("shop"); };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="ff-body min-h-screen" style={{ background: "var(--paper)" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');`}</style>

      <Header
        page={page}
        go={go}
        cartCount={cartCount}
        cartBump={cartBump}
        query={query}
        setQuery={setQuery}
        onSearch={onSearch}
        wishCount={wishlist.length}
        setActiveCat={setActiveCat}
        seller={seller}
        buyer={buyer}
        openAuthModal={() => setAuthModalOpen(true)}
        onToggleAIChat={() => setAiChatOpen((v) => !v)}
        onToggleCartDrawer={() => setCartDrawerOpen(true)}
        products={products}
        openProduct={openProduct}
        orderCount={buyerOrders.length}
      />

      {/* Universal Sticky Back Button & Breadcrumbs Header */}
      <NavigationHeader
        page={page}
        product={product}
        go={go}
        goBack={goBack}
        historyLength={navHistory.length}
      />

      <main key={page} className="ff-rise">
        {page === "home" && (
          <HomePage
            products={products}
            go={go}
            openProduct={openProduct}
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWish={toggleWish}
            setActiveCat={setActiveCat}
          />
        )}
        {page === "shop" && (
          <ShopPage
            products={products}
            go={go}
            openProduct={openProduct}
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWish={toggleWish}
            activeCat={activeCat}
            setActiveCat={setActiveCat}
            query={query}
          />
        )}
        {page === "deals" && (
          <DealsPage
            products={products}
            go={go}
            openProduct={openProduct}
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWish={toggleWish}
          />
        )}
        {page === "product" && product && (
          <ProductPage
            products={products}
            product={product}
            go={go}
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWish={toggleWish}
            openProduct={openProduct}
            onOpenSellerChat={openSellerChat}
            buyer={buyer}
            openAuthModal={() => setAuthModalOpen(true)}
            onAddReview={handleAddReview}
          />
        )}
        {page === "cart" && (
          <CartPage
            cart={cart}
            updateQty={updateQty}
            removeItem={removeItem}
            clearCart={clearCart}
            go={go}
            openProduct={openProduct}
          />
        )}
        {page === "checkout" && (
          <CheckoutPage
            cart={cart}
            clearCart={clearCart}
            go={go}
            buyer={buyer}
            openAuthModal={() => setAuthModalOpen(true)}
            onPlaceOrder={handlePlaceOrder}
          />
        )}
        {page === "account" && (
          <AccountPage
            buyer={buyer}
            setBuyer={setBuyer}
            buyerOrders={buyerOrders}
            go={go}
            onOpenSellerChat={openSellerChat}
          />
        )}
        {page === "wishlist" && (
          <WishlistPage
            wishlist={wishlist}
            products={products}
            openProduct={openProduct}
            addToCart={addToCart}
            toggleWish={toggleWish}
            go={go}
          />
        )}
        {page === "seller" && (
          <SellerPage
            seller={seller}
            setSeller={setSeller}
            products={products}
            addProduct={addProduct}
            deleteProduct={deleteProduct}
            go={go}
            openProduct={openProduct}
            wishlist={wishlist}
            toggleWish={toggleWish}
            addToCart={addToCart}
          />
        )}
      </main>

      <Footer go={go} setActiveCat={setActiveCat} />

      {toast && <Toast msg={toast} />}

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cart={cart}
        updateQty={updateQty}
        removeItem={removeItem}
        go={go}
        showToast={showToast}
      />

      {/* Buyer Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        setBuyer={setBuyer}
      />

      {/* Buyer-Seller Product Chat Modal */}
      <SellerChatModal
        isOpen={sellerChatOpen}
        onClose={() => setSellerChatOpen(false)}
        product={chatProduct}
        buyer={buyer}
        order={chatOrder}
      />

      {/* Buyer AI Shopping Assistant Floating Chatbot */}
      <BuyerAIChatbot
        isOpen={aiChatOpen}
        onToggle={() => setAiChatOpen((v) => !v)}
        openProduct={openProduct}
        addToCart={addToCart}
      />
    </div>
  );
}
