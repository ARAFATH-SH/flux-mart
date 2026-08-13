import { useState, useEffect, useRef } from "react";
import { X, Send, ShieldCheck, CheckCheck, Clock, Store, Package } from "lucide-react";
import { money } from "../utils/format";
import CategoryGlyph from "./CategoryGlyph";

export default function SellerChatModal({ isOpen, onClose, product, buyer, order }) {
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const targetProduct = product || (order?.items?.[0]);
  const sellerName = targetProduct?.category
    ? `${targetProduct.category.toUpperCase()} Official Store`
    : "Verified Flux Seller";

  useEffect(() => {
    if (isOpen && targetProduct) {
      // Initial greeting message from seller
      const initialGreeting = {
        id: 1,
        sender: "seller",
        text: `Hello ${buyer?.name || "there"}! 👋 Thank you for reaching out to ${sellerName} regarding "${targetProduct.name}". How can I help you with this product today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([initialGreeting]);
    }
  }, [isOpen, targetProduct, buyer, sellerName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen || !targetProduct) return null;

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "buyer",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMsg("");
    setIsTyping(true);

    // Simulate smart contextual response from seller
    setTimeout(() => {
      let responseText = `Thanks for asking! "${targetProduct.name}" is 100% authentic, brand new in original packaging, and backed by full warranty. We dispatch orders within 24 hours!`;

      const lower = text.toLowerCase();
      if (lower.includes("shipping") || lower.includes("delivery") || lower.includes("arrive")) {
        responseText = `Standard delivery for "${targetProduct.name}" takes 2-4 business days. All packages are insured and tracked live with door step confirmation!`;
      } else if (lower.includes("warranty") || lower.includes("guarantee")) {
        responseText = `Yes! All items from ${sellerName} include a 1-Year Official Warranty and a 30-day hassle-free money back guarantee.`;
      } else if (lower.includes("discount") || lower.includes("price") || lower.includes("offer")) {
        responseText = `We currently have active flash pricing of ${money(targetProduct.price)} on this item! Plus, orders over $35 get free express shipping.`;
      } else if (lower.includes("stock") || lower.includes("available")) {
        responseText = `Yes, we have live stock ready in our nearest fulfillment center for instant dispatch upon placing your order!`;
      } else if (order) {
        responseText = `Regarding order #${order.id}: It is currently in ${order.statusLabel || "processing"} status. Courier tracking number is ${order.trackingNumber || 'assigned'}. Delivery is right on schedule!`;
      }

      const sellerMsg = {
        id: Date.now() + 1,
        sender: "seller",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, sellerMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const presetQuestions = [
    "🚚 Estimated delivery time?",
    "🛡️ Is this item under warranty?",
    "📦 Is this currently in stock?",
    "🏷️ What is your return policy?",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[600px] flex flex-col relative shadow-2xl border border-slate-100 ff-rise overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 grid place-items-center font-bold text-white shrink-0 shadow-md">
              <Store size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-sm">
                {sellerName}
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>Verified Seller</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock size={11} /> Responds in ~3 mins</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 grid place-items-center text-slate-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Product preview bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-white">
              <CategoryGlyph product={targetProduct} className="w-full h-full" iconSize={14} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 truncate">{targetProduct.name}</div>
              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
                <span>{money(targetProduct.price)}</span>
                {order && <span className="text-indigo-600 font-bold">Order #{order.id}</span>}
              </div>
            </div>
          </div>
          <span className="text-[11px] font-medium px-2 py-1 bg-white rounded-lg border border-slate-200 text-slate-600 shrink-0">
            Buyer Chat
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "buyer" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  m.sender === "buyer"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1 font-mono">
                {m.time} {m.sender === "buyer" && <CheckCheck size={12} className="text-indigo-500" />}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 text-xs px-3 py-2 rounded-2xl w-fit">
              <span className="font-semibold text-[11px]">{sellerName} is typing</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] font-medium px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-xl transition-all shrink-0 whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <input
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type your message to the seller..."
            className="flex-1 bg-slate-100 px-3.5 py-2.5 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-800"
          />
          <button
            type="submit"
            disabled={!inputMsg.trim()}
            className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white grid place-items-center transition-all shadow-md shrink-0"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
