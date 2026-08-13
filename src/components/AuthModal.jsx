import { useState } from "react";
import { X, Mail, Lock, User, CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import Logo from "./Logo";

export default function AuthModal({ isOpen, onClose, onLogin, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "signup" && !name.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError("Please fill in email and password");
      return;
    }
    setError("");

    const userData = {
      name: mode === "signup" ? name : email.split("@")[0] || "Buyer User",
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`,
      memberSince: "August 2026",
    };

    onLogin(userData);
    onClose();
  };

  const handleDemoLogin = () => {
    const demoUser = {
      name: "Arafath (Buyer)",
      email: "buyer.arafath@fluxmarket.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
      memberSince: "August 2026",
    };
    onLogin(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border border-slate-100 ff-rise overflow-hidden">
        {/* Decorative background glow */}
        <div
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ background: "var(--flux)" }}
        />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 grid place-items-center text-slate-600 transition-colors"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex justify-center">
            <Logo size={36} />
          </div>
          <h2 className="ff-display font-bold text-2xl text-slate-900">
            {mode === "login" ? "Welcome back, Buyer" : "Join Flux Market"}
          </h2>
          <p className="ff-body text-xs sm:text-sm text-slate-500 mt-1">
            {mode === "login"
              ? "Sign in to complete purchases and track live order updates."
              : "Create an account to unlock order tracking and direct seller chat."}
          </p>
        </div>

        {/* Quick Demo Buyer Login */}
        <div className="mb-5 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-600 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-semibold text-indigo-900">Quick Testing Access</div>
              <div className="text-[11px] text-indigo-600">1-Click Buyer Account</div>
            </div>
          </div>
          <button
            onClick={handleDemoLogin}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
          >
            Demo Buyer Login <ArrowRight size={13} />
          </button>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl mb-5">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setMode("signup"); setError(""); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-medium border border-rose-100 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {mode === "signup" && (
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-700">Full Name</span>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </label>
          )}

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-700">Email Address</span>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@example.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-700">Password</span>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </label>

          <button
            type="submit"
            className="ff-btn ff-btn-primary w-full py-3 text-sm mt-2 shadow-md hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
          >
            {mode === "login" ? "Log In as Buyer" : "Create Buyer Account"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <CheckCircle size={14} className="text-emerald-500" /> 100% Encrypted & Buyer Protected Purchase
        </div>
      </div>
    </div>
  );
}
