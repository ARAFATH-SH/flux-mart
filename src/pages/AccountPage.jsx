import { useState } from "react";
import {
  Mail, Lock, User, LogOut, Package, MessageSquare, Heart, Settings, Sparkles,
  MapPin, ShieldCheck, ArrowRight, Camera, CreditCard, Bell, CheckCircle2,
  Save, RefreshCw, Award, ChevronRight, Phone, Gift
} from "lucide-react";
import Logo from "../components/Logo";
import OrderTrackingView from "../components/OrderTrackingView";

export default function AccountPage({ buyer, setBuyer, buyerOrders, go, onOpenSellerChat }) {
  const [mode, setMode] = useState("login");
  const [activeTab, setActiveTab] = useState("orders");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Interactive Buyer Profile Edit State
  const [editName, setEditName] = useState(buyer?.name || "Arafath (Buyer)");
  const [editEmail, setEditEmail] = useState(buyer?.email || "arafath@example.com");
  const [editPhone, setEditPhone] = useState(buyer?.phone || "+1 (555) 234-5678");
  const [editBio, setEditBio] = useState(buyer?.bio || "Tech enthusiast, audiophile & streetwear collector.");
  const [editAvatar, setEditAvatar] = useState(
    buyer?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
  );
  const [streetAddress, setStreetAddress] = useState("742 Evergreen Terrace");
  const [cityState, setCityState] = useState("Springfield, OR 97477");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Notification Toggles
  const [notifyOrder, setNotifyOrder] = useState(true);
  const [notifyPromo, setNotifyPromo] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);

  // Saved Payment Card
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("08/28");

  const avatarSeeds = ["Arafath", "Felix", "Aneka", "Midnight", "Harper", "Zephyr"];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    const user = {
      name: mode === "signup" ? (name || "New Buyer") : (email.split("@")[0] || "Buyer User"),
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`,
      memberSince: "August 2026",
      phone: "+1 (555) 019-2831",
      bio: "Active Flux Marketplace buyer",
    };
    setBuyer(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditAvatar(user.avatar);
  };

  const handleDemoLogin = () => {
    const demoUser = {
      name: "Arafath (Buyer)",
      email: "buyer.arafath@fluxmarket.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
      memberSince: "August 2026",
      phone: "+1 (555) 234-5678",
      bio: "Tech enthusiast, audiophile & streetwear collector.",
    };
    setBuyer(demoUser);
    setEditName(demoUser.name);
    setEditEmail(demoUser.email);
    setEditAvatar(demoUser.avatar);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setBuyer((prev) => ({
      ...prev,
      name: editName,
      email: editEmail,
      phone: editPhone,
      bio: editBio,
      avatar: editAvatar,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!buyer) {
    return (
      <section className="max-w-md mx-auto px-5 py-16">
        <div className="ff-card p-8 ff-rise">
          <div className="text-center mb-7">
            <div className="mx-auto mb-4"><Logo size={38} /></div>
            <h1 className="ff-display font-bold" style={{ fontSize: 22, color: "var(--ink)" }}>
              {mode === "login" ? "Buyer Login" : "Create Buyer Account"}
            </h1>
            <p className="ff-body mt-1" style={{ fontSize: 13, color: "var(--ink-soft)" }}>
              {mode === "login" ? "Log in to track orders & message product sellers." : "Sign up for purchase drops and 15% off first order."}
            </p>
          </div>

          {/* Quick Demo Buyer Login */}
          <div className="mb-5 p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-600" /> Instant Buyer Access
              </div>
              <div className="text-[11px] text-indigo-600 mt-0.5">Test buyer account & order tracking</div>
            </div>
            <button
              onClick={handleDemoLogin}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
            >
              Demo Buyer Login <ArrowRight size={13} />
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <label className="flex flex-col gap-1.5">
                <span className="ff-body font-medium" style={{ fontSize: 12.5 }}>Full name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                  style={{ borderColor: "var(--line)" }}
                  placeholder="Arafath Hossain"
                />
              </label>
            )}
            <label className="flex flex-col gap-1.5">
              <span className="ff-body font-medium" style={{ fontSize: 12.5 }}>Email address</span>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" color="var(--ink-soft)" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ff-focus ff-body pl-10 pr-3.5 py-2.5 rounded-xl border text-sm w-full"
                  style={{ borderColor: "var(--line)" }}
                  placeholder="you@email.com"
                />
              </div>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="ff-body font-medium" style={{ fontSize: 12.5 }}>Password</span>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" color="var(--ink-soft)" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ff-focus ff-body pl-10 pr-3.5 py-2.5 rounded-xl border text-sm w-full"
                  style={{ borderColor: "var(--line)" }}
                  placeholder="••••••••"
                />
              </div>
            </label>
            <button type="submit" className="ff-btn ff-btn-primary w-full py-3 text-sm mt-1">
              {mode === "login" ? "Log in as Buyer" : "Create Buyer Account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
            <span className="ff-mono" style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>OR CONTINUE WITH</span>
            <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleDemoLogin} className="ff-btn ff-btn-ghost py-2.5 text-sm">Google</button>
            <button onClick={handleDemoLogin} className="ff-btn ff-btn-ghost py-2.5 text-sm">Apple</button>
          </div>

          <p className="ff-body text-center mt-6" style={{ fontSize: 13, color: "var(--ink-soft)" }}>
            {mode === "login" ? "New buyer? " : "Already registered? "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-semibold" style={{ color: "var(--flux)" }}>
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-10 ff-rise">
      {/* Buyer Profile Top Header Banner */}
      <div className="ff-card p-6 sm:p-8 mb-8 bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <img
                src={buyer.avatar}
                alt={buyer.name}
                className="w-20 h-20 rounded-full border-4 border-indigo-600 object-cover shadow-lg shrink-0 bg-indigo-50"
              />
              <button
                onClick={() => setActiveTab("profile")}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-slate-900 text-white grid place-items-center shadow-md hover:scale-110 transition-transform"
                title="Edit avatar"
              >
                <Camera size={13} />
              </button>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="ff-display font-bold text-2xl text-slate-900">{buyer.name}</h1>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1">
                  <ShieldCheck size={13} /> VERIFIED BUYER
                </span>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1">
                  <Award size={13} className="text-amber-600" /> VIP GOLD MEMBER
                </span>
              </div>
              <p className="ff-mono text-xs text-slate-500 mt-1">
                {buyer.email} · Member since {buyer.memberSince || "Aug 2026"}
              </p>
              <p className="text-xs text-slate-600 mt-1 line-clamp-1 italic">{buyer.bio}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right pr-3 border-r border-slate-200">
              <span className="text-[11px] font-mono text-slate-400">FLUX REWARDS</span>
              <span className="text-sm font-bold text-amber-600 font-mono">1,450 PTS (5% Cash Back)</span>
            </div>
            <button
              onClick={() => go("shop")}
              className="ff-btn px-4 py-2.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-sm"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => setBuyer(null)}
              className="ff-btn px-3.5 py-2.5 text-xs border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-1.5"
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 mb-8 gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
        {[
          { id: "orders", label: `Order Tracking (${buyerOrders?.length || 0})`, icon: Package },
          { id: "profile", label: "Edit Buyer Profile", icon: User },
          { id: "chats", label: "Seller Messages", icon: MessageSquare },
          { id: "addresses", label: "Shipping Addresses", icon: MapPin },
          { id: "payments", label: "Payment Cards", icon: CreditCard },
          { id: "settings", label: "Account Settings", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "wishlist") {
                  go("wishlist");
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={`pb-3 px-2 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORDER TRACKING & HISTORY */}
      {activeTab === "orders" && (
        <OrderTrackingView orders={buyerOrders} onOpenSellerChat={onOpenSellerChat} go={go} />
      )}

      {/* TAB 2: BUYER PROFILE EDIT SECTION */}
      {activeTab === "profile" && (
        <div className="max-w-3xl mx-auto space-y-6">
          {savedSuccess && (
            <div className="p-4 bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2 shadow-sm animate-fadeIn">
              <CheckCircle2 size={18} className="text-emerald-600" />
              Buyer profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="ff-card p-6 sm:p-8 bg-white border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="ff-display font-bold text-lg text-slate-900">Buyer Profile & Identity</h3>
                <p className="text-xs text-slate-500">Manage your personal details, avatar, and contact info.</p>
              </div>
              <button
                type="submit"
                className="ff-btn px-5 py-2.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Save size={14} /> Save Profile Changes
              </button>
            </div>

            {/* Avatar Selector */}
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-2">Profile Avatar</span>
              <div className="flex items-center gap-4">
                <img
                  src={editAvatar}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-full border-2 border-indigo-600 object-cover bg-slate-100"
                />
                <div className="flex-1">
                  <span className="text-[11px] text-slate-500 font-mono block mb-1.5">Choose Avatar Preset</span>
                  <div className="flex flex-wrap gap-2">
                    {avatarSeeds.map((seed) => {
                      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                      return (
                        <button
                          key={seed}
                          type="button"
                          onClick={() => setEditAvatar(avatarUrl)}
                          className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                            editAvatar === avatarUrl ? "border-indigo-600 ring-2 ring-indigo-500/30" : "border-slate-200"
                          }`}
                        >
                          <img src={avatarUrl} alt={seed} className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-700">Full Name</span>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-700">Email Address</span>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-700">Phone Number</span>
                <input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-700">Buyer Tier Level</span>
                <input
                  value="VIP Gold (1,450 Points)"
                  disabled
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500 font-mono font-semibold"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-700">Buyer Bio / Shopping Interests</span>
              <textarea
                rows={2}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </label>
          </form>
        </div>
      )}

      {/* TAB 3: SELLER MESSAGES & COMMUNICATION */}
      {activeTab === "chats" && (
        <div className="ff-card p-8 text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 grid place-items-center mx-auto shadow-sm">
            <MessageSquare size={28} />
          </div>
          <h3 className="ff-display font-bold text-xl text-slate-900">Direct Seller Inbox</h3>
          <p className="ff-body text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Message product sellers anytime directly from product pages or from your active orders to ask about item specs, stock availability, or custom shipping requests.
          </p>
          <button
            onClick={() => go("shop")}
            className="ff-btn px-5 py-2.5 text-xs bg-indigo-600 text-white font-semibold rounded-xl shadow-sm"
          >
            Explore Market Products
          </button>
        </div>
      )}

      {/* TAB 4: SHIPPING ADDRESSES */}
      {activeTab === "addresses" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="ff-card p-6 bg-white border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-indigo-600" />
                <h3 className="ff-display font-bold text-base text-slate-900">Primary Delivery Address</h3>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">DEFAULT</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-700">Street Line</span>
                <input
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-700">City, State & Zip</span>
                <input
                  value={cityState}
                  onChange={(e) => setCityState(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </label>
            </div>
            <button className="text-xs font-semibold text-indigo-600 hover:underline">
              + Add New Address
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: PAYMENT CARDS */}
      {activeTab === "payments" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="ff-card p-6 bg-white border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-600" />
                <h3 className="ff-display font-bold text-base text-slate-900">Saved Payment Methods</h3>
              </div>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">ENCRYPTED</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-300">VISA DEBIT</span>
                <div className="font-mono font-bold text-base tracking-widest mt-1">{cardNumber}</div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">Exp: {cardExpiry}</div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-white/10 border border-white/20">Primary</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: EXPANDED ACCOUNT SETTINGS */}
      {activeTab === "settings" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="ff-card p-6 bg-white border border-slate-200 space-y-6">
            <h3 className="ff-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-4">
              Expanded Account Settings & Security
            </h3>

            {/* Notification Preferences */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
                <Bell size={14} className="text-indigo-600" /> Notification Preferences
              </h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block">Real-time Order Status Alerts</span>
                    <span className="text-[11px] text-slate-500">Receive instant push & email updates when courier dispatches order.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyOrder}
                    onChange={(e) => setNotifyOrder(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block">Flash Drops & Discount Offers</span>
                    <span className="text-[11px] text-slate-500">Get notified when wishlist items go on flash sale.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyPromo}
                    onChange={(e) => setNotifyPromo(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Security */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
                <Lock size={14} className="text-indigo-600" /> Password & Authentication
              </h4>

              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                Two-Factor Authentication (2FA) is enabled for your buyer account.
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <button className="px-4 py-2.5 text-xs border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 text-left">
                  Change Buyer Password
                </button>
                <button className="px-4 py-2.5 text-xs border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 text-left">
                  View Active Logged In Sessions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
