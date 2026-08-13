import { useState, useMemo, useEffect } from "react";
import {
  Store, Plus, Package, DollarSign, TrendingUp, CheckCircle,
  LogOut, Sparkles, Tag, ArrowRight, ShieldCheck, BarChart3,
  MessageSquare, ShoppingCart, Award, Send, Search,
  Truck, Star, MessageCircle, Clock, MapPin, CheckCircle2,
  PackageCheck, Navigation, ShoppingBag, ArrowUpRight, PieChart, Activity,
  Layers, Layers3, Bot, Lightbulb, Zap, RefreshCw, X, ChevronRight, HelpCircle,
  BadgeCheck, UserCheck, ShieldAlert, FileText, Building, Phone, Globe,
  UploadCloud, Lock, Check, AlertCircle
} from "lucide-react";
import { CATEGORIES, catColor } from "../data/products";
import { money } from "../utils/format";
import ProductCard from "../components/ProductCard";

// Helper function to compute Seller Profile Completion Percentage (0-100%)
// 10 items total, 10% weight per item. Trusted Verified Badge unlocks at >= 90%.
export const calcProfileCompletion = (sellerObj) => {
  if (!sellerObj) return { percentage: 0, checklist: [], isTrusted: false };

  const checklist = [
    { key: "storeName", label: "Store / Brand Name", value: Boolean(sellerObj.storeName && sellerObj.storeName.trim() !== ""), weight: 10 },
    { key: "sellerName", label: "Owner / Full Name", value: Boolean(sellerObj.sellerName && sellerObj.sellerName.trim() !== ""), weight: 10 },
    { key: "email", label: "Business Email", value: Boolean(sellerObj.email && sellerObj.email.trim() !== ""), weight: 10 },
    { key: "phone", label: "Phone Number", value: Boolean(sellerObj.phone && sellerObj.phone.trim() !== ""), weight: 10 },
    { key: "category", label: "Primary Category", value: Boolean(sellerObj.category && sellerObj.category.trim() !== ""), weight: 10 },
    { key: "storeBio", label: "Store Description / Bio", value: Boolean(sellerObj.storeBio && sellerObj.storeBio.trim() !== ""), weight: 10 },
    { key: "address", label: "Business Address", value: Boolean(sellerObj.address && sellerObj.address.trim() !== ""), weight: 10 },
    { key: "website", label: "Website or Social Link", value: Boolean(sellerObj.website && sellerObj.website.trim() !== ""), weight: 10 },
    { key: "logoUrl", label: "Store Logo / Avatar", value: Boolean(sellerObj.logoUrl && sellerObj.logoUrl.trim() !== ""), weight: 10 },
    { key: "idVerified", label: "Government ID Verification (KYC)", value: Boolean(sellerObj.idVerified || (sellerObj.idNumber && sellerObj.idNumber.trim() !== "")), weight: 10 },
  ];

  const earned = checklist.reduce((acc, item) => acc + (item.value ? item.weight : 0), 0);
  const isTrusted = earned >= 90;

  return {
    percentage: earned,
    checklist,
    isTrusted,
  };
};


// Mock Seller Sales & Delivery Tracking History with Checkpoint Journey Scans
const INITIAL_SALES_ORDERS = [
  {
    id: "FX-9801",
    customer: "Sarah Jenkins",
    product: "Aeroloop Noise-Cancelling Headphones",
    category: "electronics",
    qty: 2,
    price: 89,
    costPrice: 42,
    date: "2026-08-11",
    status: "In Transit",
    stepIndex: 2,
    progressPct: 50,
    trackingNo: "TRK-4481029",
    carrier: "FedEx Express",
    estDelivery: "Aug 13, 2026",
    address: "742 Evergreen Terr, Springfield, IL",
    scans: [
      { title: "Order Confirmed & Placed", time: "Aug 11, 08:30 AM", location: "Flux Fulfillment Center", done: true },
      { title: "Packed & Label Created", time: "Aug 11, 11:15 AM", location: "Chicago Hub IL", done: true },
      { title: "In Transit — Departed Sort Facility", time: "Aug 11, 04:45 PM", location: "Indianapolis Regional Hub", done: true },
      { title: "Arriving at Local Delivery Center", time: "Est. Aug 12, 06:00 AM", location: "Springfield Distribution Center", done: false },
      { title: "Out for Delivery to Customer", time: "Est. Aug 13, 09:00 AM", location: "Destination Address", done: false },
    ]
  },
  {
    id: "FX-9802",
    customer: "Marcus Vance",
    product: "Halo Wireless Earbuds",
    category: "electronics",
    qty: 1,
    price: 59,
    costPrice: 24,
    date: "2026-08-10",
    status: "Delivered",
    stepIndex: 4,
    progressPct: 100,
    trackingNo: "TRK-9921041",
    carrier: "UPS Ground",
    estDelivery: "Aug 11, 2026",
    address: "104 Ocean Drive, Miami, FL",
    scans: [
      { title: "Order Confirmed & Placed", time: "Aug 10, 09:00 AM", location: "Flux Fulfillment Center", done: true },
      { title: "Packed & Scanned", time: "Aug 10, 01:20 PM", location: "Atlanta Logistics Depot", done: true },
      { title: "In Transit Across State", time: "Aug 10, 08:30 PM", location: "Orlando Transit Station", done: true },
      { title: "Out for Delivery with Driver", time: "Aug 11, 08:15 AM", location: "Miami Local Depot", done: true },
      { title: "Delivered & Signed at Front Door", time: "Aug 11, 02:10 PM", location: "104 Ocean Drive, Miami, FL", done: true },
    ]
  },
  {
    id: "FX-9803",
    customer: "Elena Rostova",
    product: "Orbit Desk Speaker",
    category: "electronics",
    qty: 3,
    price: 45,
    costPrice: 18,
    date: "2026-08-10",
    status: "Processing",
    stepIndex: 1,
    progressPct: 25,
    trackingNo: "TRK-1029384",
    carrier: "DHL Parcel",
    estDelivery: "Aug 14, 2026",
    address: "55 Wall St, New York, NY",
    scans: [
      { title: "Order Confirmed & Placed", time: "Aug 10, 03:45 PM", location: "Flux Merchant Store", done: true },
      { title: "Item Picked & Quality Checked", time: "Aug 11, 09:10 AM", location: "Merchant Warehouse", done: true },
      { title: "Awaiting Carrier Pickup", time: "Est. Aug 12, 10:00 AM", location: "Merchant Facility", done: false },
      { title: "In Transit to NY Sort Center", time: "Est. Aug 13, 02:00 PM", location: "New Jersey Hub", done: false },
      { title: "Delivered to Recipient", time: "Est. Aug 14, 01:00 PM", location: "55 Wall St, NY", done: false },
    ]
  },
  {
    id: "FX-9804",
    customer: "David K.",
    product: "Aeroloop Noise-Cancelling Headphones",
    category: "electronics",
    qty: 1,
    price: 89,
    costPrice: 42,
    date: "2026-08-09",
    status: "Out for Delivery",
    stepIndex: 3,
    progressPct: 75,
    trackingNo: "TRK-7712039",
    carrier: "USPS Priority",
    estDelivery: "Aug 11, 2026",
    address: "302 Pine Ave, Seattle, WA",
    scans: [
      { title: "Order Confirmed & Placed", time: "Aug 09, 10:12 AM", location: "Flux Fulfillment Center", done: true },
      { title: "Packed & Dispatched", time: "Aug 09, 02:00 PM", location: "Seattle Sorting Hub", done: true },
      { title: "Arrived at Neighborhood Postal Depot", time: "Aug 10, 11:30 PM", location: "Seattle West Station", done: true },
      { title: "Out for Delivery with Carrier Truck", time: "Aug 11, 08:30 AM", location: "Seattle WA", done: true },
      { title: "Delivered to Customer Box", time: "Est. Aug 11, 04:00 PM", location: "302 Pine Ave", done: false },
    ]
  },
];

// Business Monthly Revenue & Profit Trend History (for Business Area Graph)
const MONTHLY_TREND_DATA = [
  { month: "Mar", revenue: 4200, profit: 2100, units: 62 },
  { month: "Apr", revenue: 5800, profit: 3000, units: 84 },
  { month: "May", revenue: 5100, profit: 2700, units: 75 },
  { month: "Jun", revenue: 7400, profit: 3900, units: 110 },
  { month: "Jul", revenue: 8900, profit: 4800, units: 135 },
  { month: "Aug", revenue: 11200, profit: 6100, units: 168 },
];

// Mock Customer Reviews
const INITIAL_REVIEWS = [
  {
    id: "rev_1",
    productName: "Aeroloop Noise-Cancelling Headphones",
    customer: "Priya Sharma",
    rating: 5,
    date: "2026-08-09",
    comment: "Sublime ANC performance! Battery lasted full 40 hours during my international trip. Highly recommended.",
    sellerAnswer: "Thank you Priya! Glad the active noise cancellation served you well on your travels."
  },
  {
    id: "rev_2",
    productName: "Halo Wireless Earbuds",
    customer: "Marcus Vance",
    rating: 4,
    date: "2026-08-07",
    comment: "Great sound stage and compact case. Wish it included an extra pair of foam ear tips.",
    sellerAnswer: null
  },
  {
    id: "rev_3",
    productName: "Orbit Desk Speaker",
    customer: "Chloe Bennett",
    rating: 5,
    date: "2026-08-05",
    comment: "Surprising bass response for a desktop speaker of this footprint. Sleek aesthetic matches my setup.",
    sellerAnswer: "Thanks Chloe! Designed with dual passive radiators for that clean deep bass."
  },
];

// Mock Customer Messages
const INITIAL_MESSAGES = [
  {
    id: "msg_1",
    customer: "Maya Lin",
    email: "maya.l@example.com",
    avatarBg: "#FF4667",
    productName: "Aeroloop Noise-Cancelling Headphones",
    unread: true,
    lastUpdated: "10 mins ago",
    status: "Pending Reply",
    messages: [
      { sender: "customer", text: "Hi! Does the Aeroloop headphones come with a 3.5mm audio cable included in the box?", time: "10:15 AM" },
      { sender: "customer", text: "Also, what is the warranty period for battery degradation?", time: "10:16 AM" }
    ]
  },
  {
    id: "msg_2",
    customer: "Devon Reed",
    email: "devon.r@example.com",
    avatarBg: "#4338F5",
    productName: "Halo Wireless Earbuds",
    unread: false,
    lastUpdated: "2 hours ago",
    status: "Replied",
    messages: [
      { sender: "customer", text: "Hello, when are you dropping the red colorway again?", time: "08:30 AM" },
      { sender: "seller", text: "Hi Devon! The red colorway drop is scheduled for next Tuesday at 10 AM EST.", time: "09:05 AM" },
      { sender: "customer", text: "Awesome! Thanks for the quick response.", time: "09:12 AM" }
    ]
  },
];

export default function SellerPage({ seller, setSeller, products, addProduct, deleteProduct, go, openProduct, wishlist, toggleWish, addToCart }) {
  const [authMode, setAuthMode] = useState("signup");
  const [activeTab, setActiveTab] = useState("analytics");

  // Auth Form State
  const [storeName, setStoreName] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessCategory, setBusinessCategory] = useState("electronics");

  // Add Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [pName, setPName] = useState("");
  const [pCategory, setPCategory] = useState("electronics");
  const [pPrice, setPPrice] = useState("");
  const [pCost, setPCost] = useState("");
  const [pStock, setPStock] = useState("50");
  const [pWas, setPWas] = useState("");
  const [pBadge, setPBadge] = useState("");
  const [pBlurb, setPBlurb] = useState("");
  const [pImg, setPImg] = useState("");
  const [pColors, setPColors] = useState("");
  const [pSizes, setPSizes] = useState("");

  // Delivery Tracking State
  const [orders] = useState(INITIAL_SALES_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState("FX-9801");
  const [orderQuery, setOrderQuery] = useState("");

  // Customer Reviews State
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [replyingRevId, setReplyingRevId] = useState(null);
  const [reviewAnswerText, setReviewAnswerText] = useState("");

  // Customer Messaging State
  const [conversations, setConversations] = useState(INITIAL_MESSAGES);
  const [selectedConvId, setSelectedConvId] = useState("msg_1");
  const [replyText, setReplyText] = useState("");

  // AI Profit Advisor Chatbot State
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState([
    {
      sender: "ai",
      text: "👋 Welcome to your Flux AI Profit Advisor! I have analyzed your store's inventory, COGS cost structure, and sales volume. Ask me anything or select a strategy shortcut below to boost your net profit margins!"
    }
  ]);
  const [aiThinking, setAiThinking] = useState(false);

  const sampleImages = [
    { label: "Headphones", url: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop&auto=format&q=80" },
    { label: "Sneakers", url: "https://images.unsplash.com/photo-1676379827610-c380c52db0c6?w=400&h=400&fit=crop&auto=format&q=80" },
    { label: "Lamp / Home", url: "https://images.unsplash.com/photo-1592195985871-2d326ada5d51?w=400&h=400&fit=crop&auto=format&q=80" },
    { label: "Skincare", url: "https://images.unsplash.com/photo-1765726951362-df46f5a74cdf?w=400&h=400&fit=crop&auto=format&q=80" },
    { label: "Fitness", url: "https://images.unsplash.com/photo-1672344048213-76b6e77304bd?w=400&h=400&fit=crop&auto=format&q=80" },
  ];

  // Profile Edit Local Form State
  const [editStoreName, setEditStoreName] = useState(seller?.storeName || "");
  const [editSellerName, setEditSellerName] = useState(seller?.sellerName || "");
  const [editEmail, setEditEmail] = useState(seller?.email || "");
  const [editPhone, setEditPhone] = useState(seller?.phone || "");
  const [editCategory, setEditCategory] = useState(seller?.category || "electronics");
  const [editStoreBio, setEditStoreBio] = useState(seller?.storeBio || "");
  const [editAddress, setEditAddress] = useState(seller?.address || "");
  const [editWebsite, setEditWebsite] = useState(seller?.website || "");
  const [editLogoUrl, setEditLogoUrl] = useState(seller?.logoUrl || "");
  const [editIdType, setEditIdType] = useState(seller?.idType || "Passport");
  const [editIdNumber, setEditIdNumber] = useState(seller?.idNumber || "");
  const [editIdDocUrl, setEditIdDocUrl] = useState(seller?.idDocUrl || "");
  const [editIdVerified, setEditIdVerified] = useState(Boolean(seller?.idVerified));
  const [profileSavedMsg, setProfileSavedMsg] = useState(null);

  useEffect(() => {
    if (seller) {
      setEditStoreName(seller.storeName || "");
      setEditSellerName(seller.sellerName || "");
      setEditEmail(seller.email || "");
      setEditPhone(seller.phone || "");
      setEditCategory(seller.category || "electronics");
      setEditStoreBio(seller.storeBio || "");
      setEditAddress(seller.address || "");
      setEditWebsite(seller.website || "");
      setEditLogoUrl(seller.logoUrl || "");
      setEditIdType(seller.idType || "Passport");
      setEditIdNumber(seller.idNumber || "");
      setEditIdDocUrl(seller.idDocUrl || "");
      setEditIdVerified(Boolean(seller.idVerified || seller.idNumber));
    }
  }, [seller]);

  const profileInfo = useMemo(() => {
    return calcProfileCompletion(seller);
  }, [seller]);

  const liveEditProfileInfo = useMemo(() => {
    const tempSeller = {
      storeName: editStoreName,
      sellerName: editSellerName,
      email: editEmail,
      phone: editPhone,
      category: editCategory,
      storeBio: editStoreBio,
      address: editAddress,
      website: editWebsite,
      logoUrl: editLogoUrl,
      idType: editIdType,
      idNumber: editIdNumber,
      idVerified: editIdVerified,
    };
    return calcProfileCompletion(tempSeller);
  }, [editStoreName, editSellerName, editEmail, editPhone, editCategory, editStoreBio, editAddress, editWebsite, editLogoUrl, editIdType, editIdNumber, editIdVerified]);

  const handleSaveProfile = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const updatedSeller = {
      ...seller,
      storeName: editStoreName.trim(),
      sellerName: editSellerName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      category: editCategory,
      storeBio: editStoreBio.trim(),
      address: editAddress.trim(),
      website: editWebsite.trim(),
      logoUrl: editLogoUrl.trim(),
      idType: editIdType,
      idNumber: editIdNumber.trim(),
      idDocUrl: editIdDocUrl.trim(),
      idVerified: editIdVerified || Boolean(editIdNumber.trim()),
    };

    const newScore = calcProfileCompletion(updatedSeller);
    setSeller(updatedSeller);

    const msg = newScore.isTrusted
      ? `🎉 Profile Updated! Score reached ${newScore.percentage}% — Trusted Verified Seller Badge Active!`
      : `Profile Updated! Completion is ${newScore.percentage}%. Reach 90% to earn Trusted Verified Badge.`;

    setProfileSavedMsg(msg);
    setTimeout(() => setProfileSavedMsg(null), 4500);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!storeName.trim() || !email.trim() || !password.trim()) return;
    const newSeller = {
      id: "seller_" + Date.now(),
      storeName: storeName.trim(),
      sellerName: sellerName.trim() || storeName.trim(),
      email: email.trim(),
      category: businessCategory,
      createdAt: new Date().toLocaleDateString(),
    };
    setSeller(newSeller);
  };

  const handleLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const existingName = email ? email.split("@")[0] : "Jordan";
    const loggedSeller = {
      id: "seller_existing",
      storeName: (existingName || "Apex Audio").toUpperCase() + " Labs",
      sellerName: existingName || "Jordan Lee",
      email: email.trim() || "jordan.lee@apexaudio.com",
      phone: "+1 (555) 382-9011",
      category: businessCategory || "electronics",
      storeBio: "Pioneering active noise cancellation and acoustic design.",
      address: "742 Evergreen Terr, Springfield, IL, USA",
      website: "https://apexaudio.com",
      logoUrl: "https://images.unsplash.com/photo-1599669454699-248893623440?w=200&h=200&fit=crop&auto=format&q=80",
      idType: "Passport",
      idNumber: "PASS-982104-US",
      idDocUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=300&fit=crop&auto=format&q=80",
      idVerified: true,
      createdAt: "2026-01-15",
    };
    setSeller(loggedSeller);
  };


  const handlePublishProduct = (e) => {
    e.preventDefault();
    if (!pName.trim() || !pPrice) return;

    const priceNum = parseFloat(pPrice);
    const costNum = pCost ? parseFloat(pCost) : Math.round(priceNum * 0.55);

    const colorsArr = pColors ? pColors.split(",").map((c) => c.trim()).filter(Boolean) : undefined;
    const sizesArr = pSizes ? pSizes.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean) : undefined;

    const newProd = {
      name: pName.trim(),
      category: pCategory,
      price: priceNum,
      costPrice: costNum,
      stock: parseInt(pStock || "50", 10),
      was: pWas ? parseFloat(pWas) : null,
      rating: 5.0,
      reviews: 1,
      badge: pBadge.trim() || (pWas && parseFloat(pWas) > priceNum ? `-${Math.round(((parseFloat(pWas) - priceNum) / parseFloat(pWas)) * 100)}%` : "New Drop"),
      blurb: pBlurb.trim() || "Freshly listed by " + (seller?.storeName || "verified seller") + ".",
      colors: colorsArr,
      sizes: sizesArr,
      image: pImg.trim() || undefined,
      sellerId: seller?.id,
      storeName: seller?.storeName,
    };

    addProduct(newProd);

    setPName("");
    setPPrice("");
    setPCost("");
    setPStock("50");
    setPWas("");
    setPBadge("");
    setPBlurb("");
    setPImg("");
    setPColors("");
    setPSizes("");
    setShowAddForm(false);
  };

  const handleSubmitReviewAnswer = (revId) => {
    if (!reviewAnswerText.trim()) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === revId ? { ...r, sellerAnswer: reviewAnswerText.trim() } : r))
    );
    setReplyingRevId(null);
    setReviewAnswerText("");
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConvId) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedConvId) {
          return {
            ...c,
            unread: false,
            status: "Replied",
            lastUpdated: "Just now",
            messages: [
              ...c.messages,
              { sender: "seller", text: replyText.trim(), time: timeString },
            ],
          };
        }
        return c;
      })
    );
    setReplyText("");
  };

  const sellerProducts = useMemo(() => {
    return products.filter((p) => !p.sellerId || p.sellerId === seller?.id);
  }, [products, seller]);

  const analyticsData = useMemo(() => {
    const productStatsMap = {};

    sellerProducts.forEach((p) => {
      const cogs = p.costPrice || Math.round(p.price * 0.52);
      productStatsMap[p.id] = {
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        costPrice: cogs,
        stock: p.stock || 45,
        unitProfit: p.price - cogs,
        marginPct: Math.round(((p.price - cogs) / p.price) * 100),
        unitsSold: 0,
        totalRevenue: 0,
        totalProfit: 0,
      };
    });

    orders.forEach((ord) => {
      const match = sellerProducts.find((p) => p.name === ord.product);
      const pid = match ? match.id : ord.product;
      if (!productStatsMap[pid]) {
        productStatsMap[pid] = {
          id: pid,
          name: ord.product,
          category: ord.category,
          price: ord.price,
          costPrice: ord.costPrice,
          stock: 45,
          unitProfit: ord.price - ord.costPrice,
          marginPct: Math.round(((ord.price - ord.costPrice) / ord.price) * 100),
          unitsSold: 0,
          totalRevenue: 0,
          totalProfit: 0,
        };
      }
      productStatsMap[pid].unitsSold += ord.qty;
      productStatsMap[pid].totalRevenue += ord.qty * ord.price;
      productStatsMap[pid].totalProfit += ord.qty * (ord.price - ord.costPrice);
    });

    Object.values(productStatsMap).forEach((stat, idx) => {
      if (stat.unitsSold === 0) {
        const mockUnits = (idx % 3 === 0 ? 45 : idx % 2 === 0 ? 28 : 14) + (stat.id % 5);
        stat.unitsSold = mockUnits;
        stat.totalRevenue = mockUnits * stat.price;
        stat.totalProfit = mockUnits * (stat.price - stat.costPrice);
      }
    });

    const statsList = Object.values(productStatsMap);
    const topSellingList = [...statsList].sort((a, b) => b.unitsSold - a.unitsSold);
    const mostProfitableList = [...statsList].sort((a, b) => b.totalProfit - a.totalProfit);

    const totalRevenueSum = statsList.reduce((acc, curr) => acc + curr.totalRevenue, 0);
    const totalProfitSum = statsList.reduce((acc, curr) => acc + curr.totalProfit, 0);
    const totalUnitsSum = statsList.reduce((acc, curr) => acc + curr.unitsSold, 0);
    const totalCogsSum = totalRevenueSum - totalProfitSum;
    const avgMarginPct = Math.round((totalProfitSum / (totalRevenueSum || 1)) * 100);

    return {
      statsList,
      topSellingList,
      mostProfitableList,
      totalRevenueSum,
      totalProfitSum,
      totalUnitsSum,
      totalCogsSum,
      avgMarginPct,
    };
  }, [sellerProducts, orders]);

  // AI Profit Advisor Intelligence Function
  const generateAiRecommendation = (queryText) => {
    const q = queryText.toLowerCase();
    const topDrop = analyticsData.topSellingList[0];
    const topProfitDrop = analyticsData.mostProfitableList[0];
    const avgMargin = analyticsData.avgMarginPct;

    if (q.includes("re-stock") || q.includes("stock") || q.includes("inventory")) {
      return `📦 **Inventory & Stock Optimization AI Advice:**\n\n- Your top selling item **${topDrop?.name || "Aeroloop Headphones"}** has high demand (${topDrop?.unitsSold || 45} units sold). Re-order stock before inventory drops below 15 units to avoid lost sales.\n- Consider bundling slower items with **${topDrop?.name}** as a 10% discount bundle to clear warehouse space while boosting profit margins.`;
    }

    if (q.includes("price") || q.includes("pricing") || q.includes("margin")) {
      return `🏷️ **Smart Pricing & Margin Strategy:**\n\n- Your average store margin is currently **${avgMargin}%**.\n- For your highest margin item **${topProfitDrop?.name}** (${topProfitDrop?.marginPct}% margin), test a slight 5% price increase ($${Math.round(topProfitDrop?.price * 1.05)}). Due to strong review ratings (5.0★), demand will remain high while yielding an estimated extra **+$640 net profit** monthly!`;
    }

    if (q.includes("increase") || q.includes("growth") || q.includes("boost") || q.includes("more profit")) {
      return `🚀 **3-Step Profit Optimization Blueprint for ${seller?.storeName || "your store"}:**\n\n1. **Capitalize on Winner Drops**: Allocate 60% of marketing focus to **${topProfitDrop?.name}** which generates the highest net profit (+$${topProfitDrop?.totalProfit}).\n2. **Optimize COGS**: Negotiate supplier bulk discounts on your cost price ($${topDrop?.costPrice}/unit) to increase profit margin by +8%.\n3. **Launch Category Extensions**: Expand drops into Electronics accessories where buyer inquiries are highest!`;
    }

    return `💡 **Store Profitability Analysis:**\n\nBased on your live store inventory (${sellerProducts.length} active drops) and total sales revenue ($${analyticsData.totalRevenueSum}):\n- **Highest Volume Item**: ${topDrop?.name} (${topDrop?.unitsSold} units sold)\n- **Most Profitable Item**: ${topProfitDrop?.name} (${topProfitDrop?.marginPct}% margin, +$${topProfitDrop?.totalProfit} profit)\n\n**Key Recommendation**: Increase stock on ${topProfitDrop?.name} and optimize prices on items with margins under 40% to add +$1,200 to your net monthly bottom line!`;
  };

  const handleSendAiMessage = (promptOverride) => {
    const textToSend = promptOverride || aiInput;
    if (!textToSend.trim()) return;

    const userMsg = { sender: "user", text: textToSend.trim() };
    setAiMessages((prev) => [...prev, userMsg]);
    if (!promptOverride) setAiInput("");
    setAiThinking(true);

    setTimeout(() => {
      const responseText = generateAiRecommendation(textToSend);
      setAiMessages((prev) => [...prev, { sender: "ai", text: responseText }]);
      setAiThinking(false);
    }, 600);
  };

  const selectedConv = conversations.find((c) => c.id === selectedConvId);
  const unreadCount = conversations.filter((c) => c.unread).length;
  const unansweredReviewsCount = reviews.filter((r) => !r.sellerAnswer).length;

  const activeOrderTracking = useMemo(() => {
    return orders.find((o) => o.id === selectedOrderId) || orders[0];
  }, [orders, selectedOrderId]);

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      return (
        ord.id.toLowerCase().includes(orderQuery.toLowerCase()) ||
        ord.customer.toLowerCase().includes(orderQuery.toLowerCase()) ||
        ord.product.toLowerCase().includes(orderQuery.toLowerCase())
      );
    });
  }, [orders, orderQuery]);

  const previewProduct = {
    id: 999999,
    name: pName || "Your Product Name",
    category: pCategory,
    price: pPrice ? parseFloat(pPrice) : 49,
    was: pWas ? parseFloat(pWas) : null,
    rating: 5.0,
    reviews: 1,
    badge: pBadge || (pWas && parseFloat(pWas) > parseFloat(pPrice) ? `-${Math.round(((parseFloat(pWas) - parseFloat(pPrice)) / parseFloat(pWas)) * 100)}%` : "New Drop"),
    image: pImg || undefined,
  };

  const TRACKING_STEPS = [
    { label: "Order Placed", icon: ShoppingBag },
    { label: "Packed & Ready", icon: PackageCheck },
    { label: "In Transit", icon: Truck },
    { label: "Out for Delivery", icon: Navigation },
    { label: "Delivered", icon: CheckCircle2 },
  ];

  if (!seller) {
    return (
      <section className="max-w-5xl mx-auto px-5 md:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="ff-mono inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 text-xs font-semibold" style={{ background: "rgba(67,56,245,.1)", color: "var(--flux)" }}>
            <Store size={14} /> FLUX MERCHANT HUB
          </span>
          <h1 className="ff-display font-bold leading-tight" style={{ fontSize: 34, color: "var(--ink)" }}>
            Sell, AI Profit Chatbot & Business Trend Analytics
          </h1>
          <p className="ff-body mt-3 text-base" style={{ color: "var(--ink-soft)" }}>
            AI profit advisor, business sales graphs, dedicated product inventory, graphical delivery tracking, and buyer reviews.
          </p>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => handleLogin({ preventDefault: () => {} })}
              className="ff-btn px-5 py-2.5 text-xs inline-flex items-center gap-2"
              style={{ background: "var(--paper)", color: "var(--ink)", border: "1px solid var(--line)" }}
            >
              <Sparkles size={14} color="var(--flux)" /> Demo Quick Login as Merchant
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="ff-card p-6" style={{ background: "linear-gradient(135deg, var(--ink), #1D1D2B)", color: "#fff" }}>
              <div className="w-10 h-10 rounded-2xl grid place-items-center mb-4" style={{ background: "var(--flux)" }}>
                <Bot size={20} color="#fff" />
              </div>
              <h3 className="ff-display font-bold text-lg">AI Profit Advisor Chatbot</h3>
              <p className="ff-body text-sm mt-1" style={{ color: "rgba(255,255,255,.7)" }}>
                AI analyzes inventory stock & sales COGS to recommend high-profit pricing and stocking strategies.
              </p>
            </div>

            <div className="ff-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl grid place-items-center shrink-0" style={{ background: "rgba(22,184,113,.1)" }}>
                  <BarChart3 size={18} color="var(--grocery)" />
                </div>
                <div>
                  <h4 className="ff-body font-semibold text-sm">Business Trend Area Graphs</h4>
                  <p className="ff-mono text-xs" style={{ color: "var(--ink-soft)" }}>Visual growth curves & revenue breakdown</p>
                </div>
              </div>
            </div>

            <div className="ff-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl grid place-items-center shrink-0" style={{ background: "rgba(240,160,32,.1)" }}>
                  <Truck size={18} color="var(--home)" />
                </div>
                <div>
                  <h4 className="ff-body font-semibold text-sm">Graphical Delivery Tracker</h4>
                  <p className="ff-mono text-xs" style={{ color: "var(--ink-soft)" }}>5-stage visual shipment timeline & scan logs</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="ff-card p-8 ff-rise">
              <div className="flex border-b mb-6" style={{ borderColor: "var(--line)" }}>
                <button
                  onClick={() => setAuthMode("signup")}
                  className="ff-focus ff-body font-semibold pb-3 text-sm flex-1 text-center"
                  style={{
                    color: authMode === "signup" ? "var(--flux)" : "var(--ink-soft)",
                    borderBottom: authMode === "signup" ? "2px solid var(--flux)" : "2px solid transparent",
                  }}
                >
                  Create Merchant Store
                </button>
                <button
                  onClick={() => setAuthMode("login")}
                  className="ff-focus ff-body font-semibold pb-3 text-sm flex-1 text-center"
                  style={{
                    color: authMode === "login" ? "var(--flux)" : "var(--ink-soft)",
                    borderBottom: authMode === "login" ? "2px solid var(--flux)" : "2px solid transparent",
                  }}
                >
                  Merchant Log In
                </button>
              </div>

              {authMode === "signup" ? (
                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5">
                      <span className="ff-body font-medium text-xs" style={{ color: "var(--ink)" }}>Store / Brand Name *</span>
                      <input
                        required
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                        style={{ borderColor: "var(--line)" }}
                        placeholder="e.g. Apex Audio Labs"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="ff-body font-medium text-xs" style={{ color: "var(--ink)" }}>Full Name *</span>
                      <input
                        required
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                        style={{ borderColor: "var(--line)" }}
                        placeholder="Jordan Lee"
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-1.5">
                    <span className="ff-body font-medium text-xs" style={{ color: "var(--ink)" }}>Primary Category</span>
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm bg-white"
                      style={{ borderColor: "var(--line)" }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="ff-body font-medium text-xs" style={{ color: "var(--ink)" }}>Business Email *</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                      style={{ borderColor: "var(--line)" }}
                      placeholder="seller@brand.com"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="ff-body font-medium text-xs" style={{ color: "var(--ink)" }}>Password *</span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                      style={{ borderColor: "var(--line)" }}
                      placeholder="••••••••"
                    />
                  </label>

                  <button type="submit" className="ff-btn ff-btn-primary w-full py-3.5 text-sm mt-2 flex items-center justify-center gap-2">
                    Create Store & Launch Dashboard <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <label className="flex flex-col gap-1.5">
                    <span className="ff-body font-medium text-xs" style={{ color: "var(--ink)" }}>Seller Email *</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                      style={{ borderColor: "var(--line)" }}
                      placeholder="seller@brand.com"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="ff-body font-medium text-xs" style={{ color: "var(--ink)" }}>Password *</span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                      style={{ borderColor: "var(--line)" }}
                      placeholder="••••••••"
                    />
                  </label>

                  <button type="submit" className="ff-btn ff-btn-primary w-full py-3.5 text-sm mt-2 flex items-center justify-center gap-2">
                    Log In to Seller Dashboard <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // LOGGED IN SELLER DASHBOARD
  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-8 relative">
      {/* Toast alert if profile was saved */}
      {profileSavedMsg && (
        <div className="mb-4 p-4 rounded-2xl bg-emerald-600 text-white font-semibold text-sm flex items-center justify-between shadow-lg ff-rise">
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <span>{profileSavedMsg}</span>
          </div>
          <button onClick={() => setProfileSavedMsg(null)} className="hover:opacity-80">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Merchant Top Header */}
      <div className="ff-card p-6 md:p-8 mb-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--ink), #1D1D2B)", color: "#fff" }}>
        <div className="absolute rounded-full" style={{ width: 320, height: 320, background: "var(--flux)", opacity: 0.25, filter: "blur(80px)", top: -60, right: -60 }} />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl grid place-items-center shrink-0 font-bold ff-display text-xl overflow-hidden shadow-md" style={{ background: "var(--flux)", color: "#fff" }}>
              {seller.logoUrl ? (
                <img src={seller.logoUrl} alt={seller.storeName} className="w-full h-full object-cover" />
              ) : (
                seller.storeName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="ff-display font-bold text-2xl">{seller.storeName}</h1>
                {profileInfo.isTrusted ? (
                  <span className="ff-mono px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md" style={{ background: "linear-gradient(135deg, #10B981, #059669)", color: "#fff" }}>
                    <BadgeCheck size={16} color="#fff" /> Trusted Verified Seller
                  </span>
                ) : (
                  <button onClick={() => setActiveTab("profile")} className="ff-mono px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:underline" style={{ background: "rgba(240,160,32,.25)", color: "#FBBF24" }}>
                    <ShieldAlert size={14} /> Profile {profileInfo.percentage}% (Needs 90% for Trusted Badge)
                  </button>
                )}
              </div>
              <p className="ff-body text-sm mt-0.5" style={{ color: "rgba(255,255,255,.7)" }}>
                Owner: {seller.sellerName} · {seller.email} {seller.phone && `· ${seller.phone}`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAiChat(true)}
              className="ff-btn px-4 py-3 text-sm flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #FF4667, var(--flux))", color: "#fff" }}
            >
              <Sparkles size={16} /> Open AI Profit Chatbot
            </button>
            <button
              onClick={() => { setActiveTab("inventory"); setShowAddForm(true); }}
              className="ff-btn px-5 py-3 text-sm flex items-center gap-2"
              style={{ background: "rgba(255,255,255,.15)", color: "#fff", border: "1px solid rgba(255,255,255,.2)" }}
            >
              <Plus size={16} /> Publish Drop
            </button>
            <button
              onClick={() => setSeller(null)}
              className="ff-btn px-4 py-3 text-sm flex items-center gap-2"
              style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1px solid rgba(255,255,255,.2)" }}
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 mt-8 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,.15)" }}>
          {[
            { id: "analytics", label: "Analytics & Business Graphs", icon: BarChart3 },
            { id: "inventory", label: `My Inventory (${sellerProducts.length})`, icon: Package },
            { id: "tracking", label: `Graphical Delivery Tracker`, icon: Truck },
            { id: "messages", label: `Buyer Messages`, icon: MessageSquare, badge: unreadCount },
            { id: "reviews", label: `Product Reviews`, icon: Star, badge: unansweredReviewsCount },
            { id: "profile", label: `Profile & Verification`, icon: BadgeCheck, badgeText: profileInfo.isTrusted ? "Trusted ✓" : `${profileInfo.percentage}%` },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="ff-focus px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shrink-0 transition-all"
                style={{
                  background: isActive ? "#fff" : "rgba(255,255,255,.08)",
                  color: isActive ? "var(--ink)" : "#fff",
                }}
              >
                <Icon size={16} />
                {t.label}
                {t.badge > 0 && (
                  <span className="w-5 h-5 rounded-full text-xs font-bold grid place-items-center" style={{ background: "var(--coral)", color: "#fff" }}>
                    {t.badge}
                  </span>
                )}
                {t.badgeText && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.id === "profile" && profileInfo.isTrusted ? "bg-emerald-500 text-white" : "bg-white/20 text-white"}`}>
                    {t.badgeText}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>


      {/* FLOATING / EMBEDDED AI PROFIT ADVISOR CHATBOT WIDGET */}
      {showAiChat ? (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md shadow-2xl rounded-3xl overflow-hidden border border-indigo-100 flex flex-col ff-rise" style={{ background: "#fff", height: 580 }}>
          {/* Chatbot Header */}
          <div className="p-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg, var(--ink), #1D1D2B)", color: "#fff" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: "linear-gradient(135deg, #FF4667, var(--flux))" }}>
                <Bot size={20} color="#fff" />
              </div>
              <div>
                <h4 className="ff-display font-bold text-sm">Flux AI Profit Advisor</h4>
                <p className="ff-mono text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Analyzing Inventory & Sales Data
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAiChat(false)}
              className="w-8 h-8 rounded-full grid place-items-center hover:bg-white/10 text-gray-300"
            >
              <X size={18} />
            </button>
          </div>

          {/* AI Strategy Quick Buttons */}
          <div className="p-3 bg-slate-50 border-b border-gray-100 flex overflow-x-auto gap-2">
            {[
              "💡 How to increase net profit by 20%?",
              "📦 Which items should I re-stock?",
              "🏷️ Should I adjust product prices?",
            ].map((st, idx) => (
              <button
                key={idx}
                onClick={() => handleSendAiMessage(st)}
                className="ff-mono text-[11px] px-3 py-1.5 rounded-xl border bg-white text-indigo-600 border-indigo-100 shrink-0 hover:bg-indigo-50 transition-colors font-medium"
              >
                {st}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {aiMessages.map((m, idx) => {
              const isAi = m.sender === "ai";
              return (
                <div key={idx} className={`flex gap-2.5 ${isAi ? "items-start" : "items-end justify-end"}`}>
                  {isAi && (
                    <div className="w-7 h-7 rounded-lg grid place-items-center text-white text-xs font-bold shrink-0 mt-1" style={{ background: "var(--flux)" }}>
                      AI
                    </div>
                  )}
                  <div
                    className="p-3.5 rounded-2xl text-xs ff-body leading-relaxed whitespace-pre-line max-w-[85%]"
                    style={{
                      background: isAi ? "var(--paper)" : "var(--flux)",
                      color: isAi ? "var(--ink)" : "#fff",
                      borderRadius: isAi ? "16px 16px 16px 2px" : "16px 16px 2px 16px",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
            {aiThinking && (
              <div className="flex items-center gap-2 text-xs ff-mono text-gray-400 p-2">
                <RefreshCw size={14} className="animate-spin text-indigo-600" /> AI Advisor is calculating profit margins...
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={(e) => { e.preventDefault(); handleSendAiMessage(); }} className="p-3 border-t border-gray-100 flex gap-2 bg-white">
            <input
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask AI how to increase store profit..."
              className="ff-focus ff-body text-xs flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200"
            />
            <button
              type="submit"
              className="ff-btn ff-btn-primary px-4 py-2.5 text-xs flex items-center gap-1 shrink-0"
            >
              Ask <Send size={13} />
            </button>
          </form>
        </div>
      ) : (
        /* Persistent Trigger Floating Button */
        <button
          onClick={() => setShowAiChat(true)}
          className="fixed bottom-6 right-6 z-50 ff-btn px-5 py-3.5 text-sm rounded-full shadow-2xl flex items-center gap-2 text-white ff-rise"
          style={{ background: "linear-gradient(135deg, #FF4667, var(--flux))", boxShadow: "0 10px 25px -5px rgba(67,56,245,.5)" }}
        >
          <Sparkles size={18} className="animate-pulse" />
          <span className="font-bold">AI Profit Advisor</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
        </button>
      )}

      {/* TAB 1: BUSINESS-GRADE GRAPHICAL ANALYTICS & PROFITABILITY DASHBOARD */}
      {activeTab === "analytics" && (
        <div className="flex flex-col gap-8 ff-rise">
          {/* AI Banner Insight */}
          <div className="p-4 md:p-5 rounded-2xl border bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl grid place-items-center text-white shrink-0" style={{ background: "linear-gradient(135deg, #FF4667, var(--flux))" }}>
                <Lightbulb size={20} />
              </div>
              <div>
                <h4 className="ff-body font-bold text-sm" style={{ color: "var(--ink)" }}>
                  AI Profit Advisor Recommendation
                </h4>
                <p className="ff-body text-xs text-gray-600">
                  Your store's top drop <strong>{analyticsData.mostProfitableList[0]?.name || "Aeroloop Headphones"}</strong> is generating +{analyticsData.mostProfitableList[0]?.marginPct}% margin. Re-stocking 25 units will unlock +$1,050 net profit.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAiChat(true)}
              className="ff-mono text-xs font-bold text-indigo-600 hover:underline shrink-0 flex items-center gap-1"
            >
              Ask AI Advisor <ChevronRight size={14} />
            </button>
          </div>

          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="ff-card p-5" style={{ background: "#fff" }}>
              <div className="flex items-center justify-between">
                <span className="ff-mono uppercase text-xs" style={{ color: "var(--ink-soft)" }}>Total Sales Revenue</span>
                <span className="w-8 h-8 rounded-xl grid place-items-center" style={{ background: "rgba(67,56,245,.1)" }}>
                  <DollarSign size={18} color="var(--flux)" />
                </span>
              </div>
              <div className="ff-display font-bold text-2xl mt-2" style={{ color: "var(--ink)" }}>
                {money(analyticsData.totalRevenueSum)}
              </div>
              <span className="ff-mono text-xs text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
                <ArrowUpRight size={13} /> +24.8% growth vs last month
              </span>
            </div>

            <div className="ff-card p-5" style={{ background: "#fff" }}>
              <div className="flex items-center justify-between">
                <span className="ff-mono uppercase text-xs" style={{ color: "var(--ink-soft)" }}>Net Profit</span>
                <span className="w-8 h-8 rounded-xl grid place-items-center" style={{ background: "rgba(22,184,113,.1)" }}>
                  <TrendingUp size={18} color="var(--grocery)" />
                </span>
              </div>
              <div className="ff-display font-bold text-2xl mt-2" style={{ color: "var(--grocery)" }}>
                {money(analyticsData.totalProfitSum)}
              </div>
              <span className="ff-mono text-xs text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
                <ArrowUpRight size={13} /> High Return Drops
              </span>
            </div>

            <div className="ff-card p-5" style={{ background: "#fff" }}>
              <div className="flex items-center justify-between">
                <span className="ff-mono uppercase text-xs" style={{ color: "var(--ink-soft)" }}>Avg Profit Margin</span>
                <span className="w-8 h-8 rounded-xl grid place-items-center" style={{ background: "rgba(240,160,32,.1)" }}>
                  <Award size={18} color="var(--home)" />
                </span>
              </div>
              <div className="ff-display font-bold text-2xl mt-2" style={{ color: "var(--ink)" }}>
                {analyticsData.avgMarginPct}%
              </div>
              <span className="ff-mono text-xs text-indigo-600 mt-1 block font-semibold">Gross Profit Margin</span>
            </div>

            <div className="ff-card p-5" style={{ background: "#fff" }}>
              <div className="flex items-center justify-between">
                <span className="ff-mono uppercase text-xs" style={{ color: "var(--ink-soft)" }}>Units Sold</span>
                <span className="w-8 h-8 rounded-xl grid place-items-center" style={{ background: "rgba(157,75,255,.1)" }}>
                  <Package size={18} color="var(--toys)" />
                </span>
              </div>
              <div className="ff-display font-bold text-2xl mt-2" style={{ color: "var(--ink)" }}>
                {analyticsData.totalUnitsSum} units
              </div>
              <span className="ff-mono text-xs text-gray-500 mt-1 block">Across {analyticsData.statsList.length} drops</span>
            </div>
          </div>

          {/* BUSINESS GRAPH 1: MONTHLY REVENUE & NET PROFIT AREA TREND GRAPH (SVG) */}
          <div className="ff-card p-6 md:p-8" style={{ background: "#fff" }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="ff-mono uppercase text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                  <Activity size={14} /> Business Growth Analytics
                </span>
                <h3 className="ff-display font-bold text-xl mt-0.5" style={{ color: "var(--ink)" }}>
                  Monthly Sales Revenue vs. Net Profit Curve
                </h3>
              </div>

              <div className="flex items-center gap-4 ff-mono text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: "var(--flux)" }} /> Gross Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: "var(--grocery)" }} /> Net Profit</span>
              </div>
            </div>

            {/* SVG Business Area Trend Graph */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[550px]">
                <svg viewBox="0 0 600 200" className="w-full h-52 overflow-visible">
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--flux)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--flux)" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--grocery)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--grocery)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="40" y1="20" x2="580" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="40" y1="60" x2="580" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="40" y1="100" x2="580" y2="100" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="40" y1="140" x2="580" y2="140" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="40" y1="170" x2="580" y2="170" stroke="#E2E8F0" strokeWidth="1.5" />

                  <text x="32" y="24" textAnchor="end" className="text-[10px] fill-gray-400 font-mono">$12k</text>
                  <text x="32" y="64" textAnchor="end" className="text-[10px] fill-gray-400 font-mono">$9k</text>
                  <text x="32" y="104" textAnchor="end" className="text-[10px] fill-gray-400 font-mono">$6k</text>
                  <text x="32" y="144" textAnchor="end" className="text-[10px] fill-gray-400 font-mono">$3k</text>
                  <text x="32" y="174" textAnchor="end" className="text-[10px] fill-gray-400 font-mono">$0</text>

                  <path
                    d="M 60 145 Q 150 120 240 135 T 420 85 T 560 30 L 560 170 L 60 170 Z"
                    fill="url(#revenueGrad)"
                  />
                  <path
                    d="M 60 145 Q 150 120 240 135 T 420 85 T 560 30"
                    fill="none"
                    stroke="var(--flux)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  <path
                    d="M 60 158 Q 150 140 240 148 T 420 120 T 560 85 L 560 170 L 60 170 Z"
                    fill="url(#profitGrad)"
                  />
                  <path
                    d="M 60 158 Q 150 140 240 148 T 420 120 T 560 85"
                    fill="none"
                    stroke="var(--grocery)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {MONTHLY_TREND_DATA.map((d, i) => {
                    const cx = 60 + i * 100;
                    const ry = 170 - (d.revenue / 12000) * 150;
                    const py = 170 - (d.profit / 12000) * 150;

                    return (
                      <g key={d.month}>
                        <circle cx={cx} cy={ry} r="4" fill="#fff" stroke="var(--flux)" strokeWidth="3" />
                        <circle cx={cx} cy={py} r="4" fill="#fff" stroke="var(--grocery)" strokeWidth="3" />
                        <text x={cx} y="190" textAnchor="middle" className="text-xs fill-gray-600 font-mono font-bold">{d.month}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* BUSINESS GRAPH 2 & 3: CATEGORY PROFIT SHARE DOUGHNUT + COGS WATERFALL */}
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 ff-card p-6 flex flex-col justify-between" style={{ background: "#fff" }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <PieChart size={18} color="var(--flux)" />
                  <h3 className="ff-display font-bold text-lg" style={{ color: "var(--ink)" }}>Revenue Share by Category</h3>
                </div>
                <p className="ff-mono text-xs text-gray-500">Breakdown of gross sales volume across categories</p>
              </div>

              <div className="my-6 flex items-center justify-center relative">
                <svg viewBox="0 0 140 140" className="w-40 h-40">
                  <circle cx="70" cy="70" r="50" fill="none" stroke="#F1F5F9" strokeWidth="18" />
                  <circle cx="70" cy="70" r="50" fill="none" stroke="var(--electronics)" strokeWidth="18" strokeDasharray="314" strokeDashoffset="110" />
                  <circle cx="70" cy="70" r="50" fill="none" stroke="var(--grocery)" strokeWidth="18" strokeDasharray="314" strokeDashoffset="240" transform="rotate(-90 70 70)" />
                  <circle cx="70" cy="70" r="50" fill="none" stroke="var(--toys)" strokeWidth="18" strokeDasharray="314" strokeDashoffset="280" transform="rotate(90 70 70)" />
                </svg>
                <div className="absolute text-center">
                  <span className="ff-display font-bold text-xl block" style={{ color: "var(--ink)" }}>100%</span>
                  <span className="ff-mono text-[10px] text-gray-400 uppercase">Category Sales</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 ff-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: "var(--electronics)" }} /> Electronics</span>
                  <span className="font-bold text-gray-800">62% Share</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: "var(--grocery)" }} /> Home & Living</span>
                  <span className="font-bold text-gray-800">24% Share</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: "var(--toys)" }} /> Apparel & Toys</span>
                  <span className="font-bold text-gray-800">14% Share</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 ff-card p-6 md:p-8" style={{ background: "#fff" }}>
              <div className="flex items-center gap-2 mb-2">
                <Layers3 size={18} color="var(--grocery)" />
                <h3 className="ff-display font-bold text-lg" style={{ color: "var(--ink)" }}>Gross Revenue Stacked Expense Breakdown</h3>
              </div>
              <p className="ff-mono text-xs text-gray-500 mb-6">Cost of Goods Sold (COGS) vs Net Seller Profit</p>

              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex justify-between text-xs ff-mono mb-2">
                    <span className="font-semibold text-gray-700">Gross Sales Revenue</span>
                    <span className="font-bold text-indigo-600">{money(analyticsData.totalRevenueSum)} (100%)</span>
                  </div>
                  <div className="w-full h-4 bg-indigo-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs ff-mono mb-2">
                    <span className="font-semibold text-gray-700">Net Profit Kept</span>
                    <span className="font-bold text-emerald-600">+{money(analyticsData.totalProfitSum)} ({analyticsData.avgMarginPct}%)</span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analyticsData.avgMarginPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs ff-mono mb-2">
                    <span className="font-semibold text-gray-700">Cost of Goods Sold (COGS)</span>
                    <span className="font-bold text-amber-600">{money(analyticsData.totalCogsSum)} ({100 - analyticsData.avgMarginPct}%)</span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${100 - analyticsData.avgMarginPct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TWO GRAPHICAL RANKING DASHBOARDS: TOP SELLING VS MOST PROFITABLE */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="ff-card p-6 md:p-8" style={{ background: "#fff" }}>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b" style={{ borderColor: "var(--line)" }}>
                <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: "rgba(67,56,245,.1)" }}>
                  <TrendingUp size={18} color="var(--flux)" />
                </div>
                <div>
                  <h3 className="ff-display font-bold text-lg" style={{ color: "var(--ink)" }}>Which Product is Selling More</h3>
                  <p className="ff-mono text-xs" style={{ color: "var(--ink-soft)" }}>Volume sales distribution & market share bar graph</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {analyticsData.topSellingList.map((p, idx) => {
                  const maxUnits = analyticsData.topSellingList[0]?.unitsSold || 1;
                  const pct = Math.round((p.unitsSold / maxUnits) * 100);

                  return (
                    <div key={p.id} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="ff-mono font-bold w-5 text-gray-400">#{idx + 1}</span>
                          <span className="ff-body font-bold truncate max-w-xs" style={{ color: "var(--ink)" }}>{p.name}</span>
                        </div>
                        <div className="ff-mono font-bold text-indigo-600">
                          {p.unitsSold} units <span className="text-gray-400 font-normal">({money(p.totalRevenue)})</span>
                        </div>
                      </div>

                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex p-0.5">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: idx === 0 ? "var(--flux)" : idx === 1 ? "#6366F1" : "#818CF8",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="ff-card p-6 md:p-8" style={{ background: "#fff" }}>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b" style={{ borderColor: "var(--line)" }}>
                <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: "rgba(22,184,113,.1)" }}>
                  <DollarSign size={18} color="var(--grocery)" />
                </div>
                <div>
                  <h3 className="ff-display font-bold text-lg" style={{ color: "var(--ink)" }}>Which Product is More Profitable</h3>
                  <p className="ff-mono text-xs" style={{ color: "var(--ink-soft)" }}>Ranked by net profit & gross margin %</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {analyticsData.mostProfitableList.map((p, idx) => {
                  const maxProfit = analyticsData.mostProfitableList[0]?.totalProfit || 1;
                  const pct = Math.round((p.totalProfit / maxProfit) * 100);

                  return (
                    <div key={p.id} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="ff-mono font-bold w-5 text-emerald-500">#{idx + 1}</span>
                          <span className="ff-body font-bold truncate max-w-xs" style={{ color: "var(--ink)" }}>{p.name}</span>
                        </div>
                        <div className="ff-mono font-bold text-emerald-600">
                          +{money(p.totalProfit)} <span className="text-emerald-700 font-semibold">({p.marginPct}% Margin)</span>
                        </div>
                      </div>

                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex p-0.5">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: idx === 0 ? "var(--grocery)" : idx === 1 ? "#10B981" : "#34D399",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SELLER DEDICATED PRODUCT INVENTORY */}
      {activeTab === "inventory" && (
        <div className="flex flex-col gap-6 ff-rise">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="ff-display font-bold text-2xl" style={{ color: "var(--ink)" }}>
                Seller Dedicated Product Inventory
              </h2>
              <p className="ff-mono text-xs" style={{ color: "var(--ink-soft)" }}>Manage stock levels, costs, prices and drops live in market feed</p>
            </div>

            <button
              onClick={() => setShowAddForm((v) => !v)}
              className="ff-btn px-5 py-3 text-sm flex items-center gap-2"
              style={{ background: showAddForm ? "var(--ink)" : "var(--flux)", color: "#fff" }}
            >
              <Plus size={16} /> {showAddForm ? "Close Add Form" : "Publish New Product"}
            </button>
          </div>

          {showAddForm && (
            <div className="ff-card p-6 md:p-8 border-2 ff-rise" style={{ borderColor: "var(--flux)" }}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: "var(--line)" }}>
                <div>
                  <h3 className="ff-display font-bold text-xl" style={{ color: "var(--ink)" }}>Publish Product to Market Feed</h3>
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-8 items-start">
                <form onSubmit={handlePublishProduct} className="lg:col-span-7 flex flex-col gap-4">
                  <label className="flex flex-col gap-1.5">
                    <span className="ff-body font-semibold text-xs" style={{ color: "var(--ink)" }}>Product Name *</span>
                    <input
                      required
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                      style={{ borderColor: "var(--line)" }}
                      placeholder="e.g. Stealth Wireless Pro Gaming Earbuds"
                    />
                  </label>

                  <div className="grid sm:grid-cols-4 gap-4">
                    <label className="flex flex-col gap-1.5">
                      <span className="ff-body font-semibold text-xs" style={{ color: "var(--ink)" }}>Category *</span>
                      <select
                        value={pCategory}
                        onChange={(e) => setPCategory(e.target.value)}
                        className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm bg-white"
                        style={{ borderColor: "var(--line)" }}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="ff-body font-semibold text-xs" style={{ color: "var(--ink)" }}>Selling Price ($) *</span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={pPrice}
                        onChange={(e) => setPPrice(e.target.value)}
                        className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                        style={{ borderColor: "var(--line)" }}
                        placeholder="89.00"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="ff-body font-semibold text-xs" style={{ color: "var(--ink)" }}>Cost Price ($)</span>
                      <input
                        type="number"
                        step="0.01"
                        value={pCost}
                        onChange={(e) => setPCost(e.target.value)}
                        className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                        style={{ borderColor: "var(--line)" }}
                        placeholder="40.00"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="ff-body font-semibold text-xs" style={{ color: "var(--ink)" }}>Stock Qty</span>
                      <input
                        type="number"
                        value={pStock}
                        onChange={(e) => setPStock(e.target.value)}
                        className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                        style={{ borderColor: "var(--line)" }}
                        placeholder="50"
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-1.5">
                    <span className="ff-body font-semibold text-xs" style={{ color: "var(--ink)" }}>Description</span>
                    <textarea
                      rows={2}
                      value={pBlurb}
                      onChange={(e) => setPBlurb(e.target.value)}
                      className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm resize-none"
                      style={{ borderColor: "var(--line)" }}
                      placeholder="Product features & specs..."
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="ff-body font-semibold text-xs" style={{ color: "var(--ink)" }}>Image URL</span>
                    <input
                      type="url"
                      value={pImg}
                      onChange={(e) => setPImg(e.target.value)}
                      className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                      style={{ borderColor: "var(--line)" }}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="ff-mono text-xs text-gray-500 mr-1">Presets:</span>
                      {sampleImages.map((s) => (
                        <button
                          key={s.label}
                          type="button"
                          onClick={() => setPImg(s.url)}
                          className="ff-mono text-xs px-2 py-0.5 rounded border bg-gray-50 hover:bg-gray-100"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </label>

                  <div className="flex gap-3 mt-4">
                    <button type="submit" className="ff-btn ff-btn-primary flex-1 py-3.5 text-sm flex items-center justify-center gap-2">
                      <Plus size={16} /> Publish Drop Live to Market
                    </button>
                  </div>
                </form>

                <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border" style={{ borderColor: "var(--line)" }}>
                  <div className="ff-mono uppercase text-xs mb-3 font-semibold text-gray-500">Live Card Preview</div>
                  <div className="max-w-xs mx-auto">
                    <ProductCard product={previewProduct} onOpen={() => {}} onAdd={() => {}} wished={false} onWish={() => {}} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="ff-card p-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b ff-mono uppercase text-xs" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Selling Price</th>
                  <th className="py-3 px-4">Cost Price</th>
                  <th className="py-3 px-4">Profit Margin</th>
                  <th className="py-3 px-4 text-center">Stock Level</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm ff-body" style={{ borderColor: "var(--line)" }}>
                {sellerProducts.map((p) => {
                  const cogs = p.costPrice || Math.round(p.price * 0.52);
                  const marginPct = Math.round(((p.price - cogs) / p.price) * 100);
                  const stock = p.stock || 45;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold">{p.name}</td>
                      <td className="py-3.5 px-4 capitalize ff-mono text-xs" style={{ color: catColor(p.category) }}>{p.category}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold">{money(p.price)}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-gray-500">{money(cogs)}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">+{marginPct}%</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`ff-mono text-xs px-2.5 py-1 rounded-full font-semibold ${stock > 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {stock} in stock
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="ff-mono text-xs text-red-600 hover:underline font-semibold"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: GRAPHICAL DELIVERY TRACKING SECTION */}
      {activeTab === "tracking" && (
        <div className="grid lg:grid-cols-12 gap-8 ff-rise">
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="ff-card p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: "var(--line)" }}>
                <div className="flex items-center gap-2">
                  <Truck size={18} color="var(--flux)" />
                  <h3 className="ff-display font-bold text-base" style={{ color: "var(--ink)" }}>Order Shipments</h3>
                </div>
                <span className="ff-mono text-xs text-gray-500 font-semibold">{orders.length} Active</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white" style={{ borderColor: "var(--line)" }}>
                <Search size={14} color="var(--ink-soft)" />
                <input
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="Search order ID or customer..."
                  className="ff-body text-xs outline-none bg-transparent w-full"
                />
              </div>

              <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredOrders.map((ord) => {
                  const isSelected = ord.id === selectedOrderId;
                  return (
                    <button
                      key={ord.id}
                      onClick={() => setSelectedOrderId(ord.id)}
                      className="ff-focus p-3.5 rounded-2xl text-left border transition-all flex flex-col gap-1.5"
                      style={{
                        background: isSelected ? "var(--paper)" : "#fff",
                        borderColor: isSelected ? "var(--flux)" : "var(--line)",
                        boxShadow: isSelected ? "0 4px 14px -6px rgba(67,56,245,.3)" : "none",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="ff-mono font-bold text-xs" style={{ color: "var(--flux)" }}>{ord.id}</span>
                        <span
                          className="ff-mono text-xs px-2.5 py-0.5 rounded-full font-bold"
                          style={{
                            background:
                              ord.status === "Delivered" ? "rgba(22,184,113,.15)" :
                              ord.status === "Out for Delivery" ? "rgba(67,56,245,.15)" :
                              ord.status === "In Transit" ? "rgba(47,111,240,.15)" : "rgba(240,160,32,.15)",
                            color:
                              ord.status === "Delivered" ? "var(--grocery)" :
                              ord.status === "Out for Delivery" ? "var(--flux)" :
                              ord.status === "In Transit" ? "var(--electronics)" : "var(--home)",
                          }}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <div className="ff-body font-semibold text-sm truncate" style={{ color: "var(--ink)" }}>{ord.customer}</div>
                      <div className="ff-mono text-xs text-gray-500 truncate">{ord.product} (x{ord.qty})</div>
                      <div className="flex items-center justify-between text-xs font-mono text-gray-400 mt-1">
                        <span>Est: {ord.estDelivery}</span>
                        <span>{ord.progressPct}% Delivered</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            {activeOrderTracking && (
              <div className="ff-card p-6 md:p-8 flex flex-col gap-6" style={{ background: "#fff" }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border" style={{ borderColor: "var(--line)" }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="ff-mono font-bold text-base" style={{ color: "var(--flux)" }}>{activeOrderTracking.id}</span>
                      <span className="ff-mono text-xs text-gray-400">· Carrier: {activeOrderTracking.carrier}</span>
                    </div>
                    <h3 className="ff-display font-bold text-lg mt-0.5" style={{ color: "var(--ink)" }}>{activeOrderTracking.product}</h3>
                    <p className="ff-body text-xs text-gray-500 mt-0.5">
                      Buyer: <span className="font-semibold">{activeOrderTracking.customer}</span> · Destination: <span className="font-semibold">{activeOrderTracking.address}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="ff-mono text-xs uppercase text-gray-400 block">Tracking Number</span>
                    <span className="ff-mono font-bold text-sm" style={{ color: "var(--ink)" }}>{activeOrderTracking.trackingNo}</span>
                    <div className="ff-mono text-xs font-bold text-emerald-600 mt-1">
                      Est. Arrival: {activeOrderTracking.estDelivery}
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: "var(--line)" }}>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="ff-display font-bold text-base" style={{ color: "var(--ink)" }}>Delivery Progress Status</h4>
                    <span className="ff-mono font-bold text-sm text-indigo-600">
                      {activeOrderTracking.progressPct}% Completed
                    </span>
                  </div>

                  <div className="relative mb-10">
                    <div className="absolute top-1/2 left-4 right-4 h-1.5 -translate-y-1/2 bg-gray-100 rounded-full" />
                    <div
                      className="absolute top-1/2 left-4 h-1.5 -translate-y-1/2 rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.max(5, activeOrderTracking.progressPct)}%`,
                        background: activeOrderTracking.progressPct === 100 ? "var(--grocery)" : "var(--flux)",
                      }}
                    />

                    <div className="relative flex items-center justify-between">
                      {TRACKING_STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        const isCompleted = idx <= activeOrderTracking.stepIndex;
                        const isCurrent = idx === activeOrderTracking.stepIndex;

                        return (
                          <div key={step.label} className="flex flex-col items-center">
                            <div
                              className="w-10 h-10 rounded-full grid place-items-center z-10 transition-all shadow-sm"
                              style={{
                                background: isCompleted
                                  ? isCurrent && activeOrderTracking.progressPct < 100
                                    ? "var(--flux)"
                                    : "var(--grocery)"
                                  : "#fff",
                                color: isCompleted ? "#fff" : "var(--ink-soft)",
                                border: isCompleted ? "none" : "2px solid var(--line)",
                                boxShadow: isCurrent ? "0 0 0 4px rgba(67,56,245,.2)" : "none",
                              }}
                            >
                              <Icon size={18} />
                            </div>
                            <span
                              className="ff-body font-semibold text-xs mt-2 text-center max-w-[80px]"
                              style={{ color: isCompleted ? "var(--ink)" : "var(--ink-soft)" }}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border bg-slate-50/50" style={{ borderColor: "var(--line)" }}>
                  <div className="flex items-center gap-2 mb-5">
                    <Clock size={16} color="var(--flux)" />
                    <h4 className="ff-display font-bold text-base" style={{ color: "var(--ink)" }}>Detailed Shipment Scan Journey</h4>
                  </div>

                  <div className="flex flex-col gap-4 relative pl-4 border-l-2 border-slate-200 ml-2">
                    {activeOrderTracking.scans.map((scan, idx) => (
                      <div key={idx} className="relative flex items-start justify-between">
                        <div
                          className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white"
                          style={{
                            borderColor: scan.done ? "var(--grocery)" : "var(--line)",
                            background: scan.done ? "var(--grocery)" : "#fff",
                          }}
                        />
                        <div>
                          <div
                            className="ff-body font-semibold text-sm"
                            style={{ color: scan.done ? "var(--ink)" : "var(--ink-soft)" }}
                          >
                            {scan.title}
                          </div>
                          <div className="ff-mono text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <MapPin size={12} /> {scan.location}
                          </div>
                        </div>
                        <span className="ff-mono text-xs text-gray-400 shrink-0 font-medium">{scan.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMER MESSAGING INBOX & REPLIES */}
      {activeTab === "messages" && (
        <div className="grid lg:grid-cols-12 gap-6 ff-rise">
          <div className="lg:col-span-5 ff-card p-4 flex flex-col gap-3" style={{ height: 560 }}>
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--line)" }}>
              <div className="flex items-center gap-2">
                <MessageSquare size={18} color="var(--flux)" />
                <h3 className="ff-display font-bold text-base" style={{ color: "var(--ink)" }}>Buyer Inquiries</h3>
              </div>
              {unreadCount > 0 && (
                <span className="ff-mono text-xs px-2.5 py-0.5 rounded-full font-bold text-white" style={{ background: "var(--coral)" }}>
                  {unreadCount} Unread
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
              {conversations.map((conv) => {
                const isSelected = conv.id === selectedConvId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConvId(conv.id);
                      setConversations((prev) => prev.map((c) => (c.id === conv.id ? { ...c, unread: false } : c)));
                    }}
                    className="ff-focus p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3"
                    style={{
                      background: isSelected ? "var(--paper)" : "#fff",
                      borderColor: isSelected ? "var(--flux)" : "var(--line)",
                    }}
                  >
                    <div className="w-10 h-10 rounded-full grid place-items-center text-white font-bold text-sm shrink-0" style={{ background: conv.avatarBg }}>
                      {conv.customer.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="ff-body font-semibold text-sm truncate" style={{ color: "var(--ink)" }}>{conv.customer}</span>
                        <span className="ff-mono text-xs text-gray-400">{conv.lastUpdated}</span>
                      </div>
                      <p className="ff-mono text-xs truncate mt-0.5" style={{ color: "var(--flux)" }}>{conv.productName}</p>
                      <p className="ff-body text-xs text-gray-500 truncate mt-1">
                        {conv.messages[conv.messages.length - 1]?.text}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 ff-card p-6 flex flex-col" style={{ height: 560 }}>
            {selectedConv ? (
              <>
                <div className="flex items-center justify-between pb-4 border-b mb-4" style={{ borderColor: "var(--line)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full grid place-items-center text-white font-bold text-sm" style={{ background: selectedConv.avatarBg }}>
                      {selectedConv.customer.charAt(0)}
                    </div>
                    <div>
                      <h4 className="ff-body font-bold text-base" style={{ color: "var(--ink)" }}>{selectedConv.customer}</h4>
                      <p className="ff-mono text-xs" style={{ color: "var(--ink-soft)" }}>
                        Item Inquiry: <span className="font-semibold" style={{ color: "var(--flux)" }}>{selectedConv.productName}</span>
                      </p>
                    </div>
                  </div>
                  <span
                    className="ff-mono text-xs px-3 py-1 rounded-full font-semibold"
                    style={{
                      background: selectedConv.status === "Replied" ? "rgba(22,184,113,.15)" : "rgba(255,70,103,.15)",
                      color: selectedConv.status === "Replied" ? "var(--grocery)" : "var(--coral)",
                    }}
                  >
                    {selectedConv.status}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 mb-4">
                  {selectedConv.messages.map((m, idx) => {
                    const isSeller = m.sender === "seller";
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col max-w-md ${isSeller ? "ml-auto items-end" : "mr-auto items-start"}`}
                      >
                        <div
                          className="px-4 py-3 rounded-2xl text-sm ff-body"
                          style={{
                            background: isSeller ? "var(--flux)" : "var(--paper)",
                            color: isSeller ? "#fff" : "var(--ink)",
                            borderRadius: isSeller ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                          }}
                        >
                          {m.text}
                        </div>
                        <span className="ff-mono text-xs text-gray-400 mt-1 px-1">
                          {isSeller ? "You (Seller)" : selectedConv.customer} · {m.time}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSendReply} className="flex gap-2 pt-3 border-t" style={{ borderColor: "var(--line)" }}>
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${selectedConv.customer}...`}
                    className="ff-focus ff-body flex-1 px-4 py-3 rounded-xl border text-sm bg-white"
                    style={{ borderColor: "var(--line)" }}
                  />
                  <button
                    type="submit"
                    className="ff-btn ff-btn-primary px-6 py-3 text-sm flex items-center gap-1.5 shrink-0"
                  >
                    Send Reply <Send size={15} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 grid place-items-center text-center p-8 text-gray-400">
                <MessageSquare size={32} />
                <p>Select a message thread from the left to read and reply to buyers.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: PRODUCT REVIEWS & SELLER ANSWERS */}
      {activeTab === "reviews" && (
        <div className="ff-card p-6 md:p-8 ff-rise">
          <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: "var(--line)" }}>
            <div>
              <h2 className="ff-display font-bold text-xl" style={{ color: "var(--ink)" }}>Product Reviews & Seller Answers</h2>
              <p className="ff-mono text-xs" style={{ color: "var(--ink-soft)" }}>Read buyer reviews for your drops & post official seller answers</p>
            </div>
            {unansweredReviewsCount > 0 && (
              <span className="ff-mono text-xs px-3 py-1 rounded-full font-bold text-white" style={{ background: "var(--coral)" }}>
                {unansweredReviewsCount} Needs Answer
              </span>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl border bg-white flex flex-col gap-3" style={{ borderColor: "var(--line)" }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="ff-body font-bold text-sm" style={{ color: "var(--ink)" }}>{rev.customer}</span>
                    <span className="ff-mono text-xs text-gray-400">· {rev.date}</span>
                  </div>
                  <span className="ff-mono text-xs font-semibold px-2.5 py-0.5 rounded-md" style={{ background: "rgba(67,56,245,.1)", color: "var(--flux)" }}>
                    {rev.productName}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < rev.rating ? "#F0A020" : "none"}
                      color={i < rev.rating ? "#F0A020" : "#D3D4DE"}
                    />
                  ))}
                  <span className="ff-mono text-xs text-gray-500 ml-1">{rev.rating}.0</span>
                </div>

                <p className="ff-body text-sm text-gray-700">{rev.comment}</p>

                {rev.sellerAnswer ? (
                  <div className="mt-2 p-4 rounded-xl bg-slate-50 border-l-4" style={{ borderColor: "var(--flux)" }}>
                    <div className="ff-mono text-xs font-bold text-indigo-600 mb-1 flex items-center gap-1.5">
                      <CheckCircle size={14} /> Official Store Answer
                    </div>
                    <p className="ff-body text-xs text-gray-700">{rev.sellerAnswer}</p>
                  </div>
                ) : replyingRevId === rev.id ? (
                  <div className="mt-2 flex flex-col gap-2 p-4 rounded-xl border bg-indigo-50/50" style={{ borderColor: "var(--flux)" }}>
                    <span className="ff-mono text-xs font-bold text-indigo-700">Write Seller Answer:</span>
                    <textarea
                      rows={2}
                      value={reviewAnswerText}
                      onChange={(e) => setReviewAnswerText(e.target.value)}
                      placeholder="Type your official seller response..."
                      className="ff-focus ff-body text-xs p-3 rounded-lg border bg-white"
                      style={{ borderColor: "var(--line)" }}
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setReplyingRevId(null)}
                        className="ff-btn px-3 py-1.5 text-xs text-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSubmitReviewAnswer(rev.id)}
                        className="ff-btn ff-btn-primary px-4 py-1.5 text-xs"
                      >
                        Post Answer
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setReplyingRevId(rev.id); setReviewAnswerText(""); }}
                    className="ff-mono text-xs text-indigo-600 font-semibold hover:underline inline-flex items-center gap-1 self-start mt-1"
                  >
                    <MessageCircle size={14} /> Answer this review
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: STORE PROFILE EDIT & IDENTITY VERIFICATION (KYC) */}
      {activeTab === "profile" && (
        <div className="flex flex-col gap-8 ff-rise">
          {/* Profile Completion Meter Banner */}
          <div
            className="ff-card p-6 md:p-8 relative overflow-hidden text-white"
            style={{
              background: liveEditProfileInfo.isTrusted
                ? "linear-gradient(135deg, #064E3B, #047857)"
                : "linear-gradient(135deg, #1E1B4B, #312E81)",
            }}
          >
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 280,
                height: 280,
                background: liveEditProfileInfo.isTrusted ? "#10B981" : "#6366F1",
                opacity: 0.25,
                filter: "blur(70px)",
                top: -50,
                right: -50,
              }}
            />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {liveEditProfileInfo.isTrusted ? (
                    <span
                      className="ff-mono px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      style={{ background: "rgba(255,255,255,.2)", color: "#fff" }}
                    >
                      <Sparkles size={14} color="#FBBF24" /> TRUSTED VERIFIED MERCHANT BADGE UNLOCKED
                    </span>
                  ) : (
                    <span
                      className="ff-mono px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
                      style={{ background: "rgba(245,158,11,.25)", color: "#FBBF24" }}
                    >
                      <ShieldAlert size={14} /> VERIFICATION IN PROGRESS ({liveEditProfileInfo.percentage}%)
                    </span>
                  )}
                </div>

                <h2 className="ff-display font-bold text-2xl md:text-3xl">
                  {liveEditProfileInfo.isTrusted
                    ? "Trusted Verified Merchant Status Active"
                    : `Profile Completion: ${liveEditProfileInfo.percentage}%`}
                </h2>
                <p className="ff-body text-xs md:text-sm mt-1 max-w-xl text-gray-200">
                  {liveEditProfileInfo.isTrusted
                    ? "Your profile is 90%+ complete and identity verified! You hold the official Trusted Verified Seller Badge on Flux Market."
                    : "Complete 90% or more of your seller profile & verify your government identity below to earn the official Trusted Verified Merchant Badge."}
                </p>

                {/* Progress Bar */}
                <div className="mt-4 max-w-xl">
                  <div className="flex justify-between text-xs ff-mono mb-1.5 font-semibold">
                    <span>Live Completion Score</span>
                    <span>
                      {liveEditProfileInfo.percentage}% / 100%{" "}
                      {liveEditProfileInfo.percentage >= 90 ? "(Badge Active ✓)" : "(Target: 90%)"}
                    </span>
                  </div>
                  <div className="w-full h-3.5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/20">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${liveEditProfileInfo.percentage}%`,
                        background: liveEditProfileInfo.isTrusted
                          ? "linear-gradient(90deg, #34D399, #10B981)"
                          : "linear-gradient(90deg, #F59E0B, #6366F1)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Badge Card Showcase */}
              <div
                className="shrink-0 p-5 rounded-2xl border text-center flex flex-col items-center justify-center min-w-[220px]"
                style={{
                  background: "rgba(255,255,255,.1)",
                  borderColor: "rgba(255,255,255,.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl grid place-items-center mb-3 shadow-lg"
                  style={{
                    background: liveEditProfileInfo.isTrusted
                      ? "linear-gradient(135deg, #10B981, #059669)"
                      : "#374151",
                  }}
                >
                  <BadgeCheck size={32} color="#fff" />
                </div>
                <div className="ff-display font-bold text-base">{editStoreName || seller.storeName}</div>
                <div
                  className="ff-mono text-xs font-semibold mt-1"
                  style={{ color: liveEditProfileInfo.isTrusted ? "#34D399" : "#FBBF24" }}
                >
                  {liveEditProfileInfo.isTrusted ? "Trusted Verified Merchant" : "Standard Merchant"}
                </div>
                <span className="ff-mono text-[10px] text-gray-300 mt-1">
                  {liveEditProfileInfo.isTrusted ? "Verified ID & 90%+ Profile" : "Needs 90%+ Completion"}
                </span>
              </div>
            </div>

            {/* Checklist breakdown */}
            <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-5 gap-3 ff-mono text-xs">
              {liveEditProfileInfo.checklist.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center gap-2 p-2 rounded-xl"
                  style={{ background: item.value ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.25)" }}
                >
                  <span
                    className="w-4 h-4 rounded-full grid place-items-center shrink-0"
                    style={{ background: item.value ? "#10B981" : "#9CA3AF", color: "#fff" }}
                  >
                    {item.value ? <Check size={10} strokeWidth={3} /> : <X size={10} />}
                  </span>
                  <span className={`truncate ${item.value ? "font-bold text-white" : "text-gray-400"}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form & Identity Verification Edit Cards */}
          <form onSubmit={handleSaveProfile} className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Brand & Contact Info */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="ff-card p-6 md:p-8" style={{ background: "#fff" }}>
                <div className="flex items-center gap-3 mb-6 pb-3 border-b" style={{ borderColor: "var(--line)" }}>
                  <div className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: "rgba(67,56,245,.1)" }}>
                    <Store size={20} color="var(--flux)" />
                  </div>
                  <div>
                    <h3 className="ff-display font-bold text-xl" style={{ color: "var(--ink)" }}>Store & Owner Profile</h3>
                    <p className="ff-mono text-xs text-gray-500">Public store contact and brand details</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5">
                      <span className="ff-body font-semibold text-xs text-gray-700">Store / Brand Name (+10%) *</span>
                      <input
                        required
                        value={editStoreName}
                        onChange={(e) => setEditStoreName(e.target.value)}
                        className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                        style={{ borderColor: "var(--line)" }}
                        placeholder="Apex Audio Labs"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="ff-body font-semibold text-xs text-gray-700">Owner / Full Name (+10%) *</span>
                      <input
                        required
                        value={editSellerName}
                        onChange={(e) => setEditSellerName(e.target.value)}
                        className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                        style={{ borderColor: "var(--line)" }}
                        placeholder="Jordan Lee"
                      />
                    </label>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5">
                      <span className="ff-body font-semibold text-xs text-gray-700">Business Email (+10%) *</span>
                      <input
                        type="email"
                        required
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                        style={{ borderColor: "var(--line)" }}
                        placeholder="seller@brand.com"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="ff-body font-semibold text-xs text-gray-700">Phone Number (+10%)</span>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                        style={{ borderColor: "var(--line)" }}
                        placeholder="+1 (555) 234-5678"
                      />
                    </label>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5">
                      <span className="ff-body font-semibold text-xs text-gray-700">Primary Category (+10%)</span>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm bg-white"
                        style={{ borderColor: "var(--line)" }}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="ff-body font-semibold text-xs text-gray-700">Website or Social Link (+10%)</span>
                      <input
                        type="url"
                        value={editWebsite}
                        onChange={(e) => setEditWebsite(e.target.value)}
                        className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                        style={{ borderColor: "var(--line)" }}
                        placeholder="https://yourstore.com"
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-1.5">
                    <span className="ff-body font-semibold text-xs text-gray-700">Store Description & Tagline (+10%)</span>
                    <textarea
                      rows={3}
                      value={editStoreBio}
                      onChange={(e) => setEditStoreBio(e.target.value)}
                      className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm resize-none"
                      style={{ borderColor: "var(--line)" }}
                      placeholder="Describe your brand, quality standards, warranty, etc."
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="ff-body font-semibold text-xs text-gray-700">Business Address / Location (+10%)</span>
                    <input
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                      style={{ borderColor: "var(--line)" }}
                      placeholder="742 Evergreen Terr, Springfield, IL"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="ff-body font-semibold text-xs text-gray-700">Store Logo / Avatar URL (+10%)</span>
                    <input
                      type="url"
                      value={editLogoUrl}
                      onChange={(e) => setEditLogoUrl(e.target.value)}
                      className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                      style={{ borderColor: "var(--line)" }}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="ff-mono text-xs text-gray-500">Preset Avatars:</span>
                      {sampleImages.slice(0, 4).map((s) => (
                        <button
                          key={s.label}
                          type="button"
                          onClick={() => setEditLogoUrl(s.url)}
                          className="ff-mono text-xs px-2.5 py-1 rounded-lg border bg-gray-50 hover:bg-gray-100"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Identity Verification (KYC) Card */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="ff-card p-6 md:p-8" style={{ background: "#fff" }}>
                <div className="flex items-center gap-3 mb-6 pb-3 border-b" style={{ borderColor: "var(--line)" }}>
                  <div className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: "rgba(22,184,113,.1)" }}>
                    <ShieldCheck size={20} color="var(--grocery)" />
                  </div>
                  <div>
                    <h3 className="ff-display font-bold text-xl" style={{ color: "var(--ink)" }}>Identity Verification (KYC)</h3>
                    <p className="ff-mono text-xs text-gray-500">Verify identity document (+10%)</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border flex flex-col gap-2" style={{ borderColor: "var(--line)" }}>
                    <div className="flex items-center justify-between">
                      <span className="ff-mono text-xs font-bold text-gray-600">KYC Status</span>
                      {editIdVerified || editIdNumber.trim() ? (
                        <span className="ff-mono text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Verified ID ✓
                        </span>
                      ) : (
                        <span className="ff-mono text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                          <Clock size={13} /> Unverified ID
                        </span>
                      )}
                    </div>
                    <p className="ff-body text-xs text-gray-500">
                      Official ID verification builds immediate buyer trust and unlocks priority product placement.
                    </p>
                  </div>

                  <label className="flex flex-col gap-1.5">
                    <span className="ff-body font-semibold text-xs text-gray-700">Document Type</span>
                    <select
                      value={editIdType}
                      onChange={(e) => setEditIdType(e.target.value)}
                      className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm bg-white"
                      style={{ borderColor: "var(--line)" }}
                    >
                      <option value="Passport">Passport</option>
                      <option value="Driver License">Driver's License</option>
                      <option value="National ID Card">National ID Card</option>
                      <option value="Tax ID / EIN">Business Tax ID / EIN</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="ff-body font-semibold text-xs text-gray-700">ID / Document Number</span>
                    <input
                      value={editIdNumber}
                      onChange={(e) => setEditIdNumber(e.target.value)}
                      className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                      style={{ borderColor: "var(--line)" }}
                      placeholder="e.g. PASS-982104-US"
                    />
                  </label>

                  <div className="flex flex-col gap-2">
                    <span className="ff-body font-semibold text-xs text-gray-700">ID Document Photo / Image URL</span>
                    <input
                      type="url"
                      value={editIdDocUrl}
                      onChange={(e) => setEditIdDocUrl(e.target.value)}
                      className="ff-focus ff-body px-3.5 py-2.5 rounded-xl border text-sm"
                      style={{ borderColor: "var(--line)" }}
                      placeholder="https://... photo of ID"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditIdDocUrl("https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=300&fit=crop&auto=format&q=80");
                          setEditIdNumber("PASS-88201-US");
                          setEditIdVerified(true);
                        }}
                        className="ff-mono text-xs px-3 py-1.5 rounded-xl border bg-gray-50 hover:bg-gray-100 font-medium text-indigo-600"
                      >
                        ⚡ Attach Sample Passport Document
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditIdVerified(true);
                      if (!editIdNumber) setEditIdNumber("PASS-982104-US");
                    }}
                    className={`ff-btn py-3 text-xs flex items-center justify-center gap-2 mt-2 font-bold ${
                      editIdVerified || editIdNumber ? "bg-emerald-600 text-white" : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    }`}
                  >
                    <CheckCircle2 size={16} /> {editIdVerified || editIdNumber ? "Identity Verified ✓" : "Verify Identity Document Now"}
                  </button>
                </div>
              </div>

              {/* Submit Save Button */}
              <div className="ff-card p-6" style={{ background: "#fff" }}>
                <button
                  type="submit"
                  className="ff-btn ff-btn-primary w-full py-4 text-base flex items-center justify-center gap-2 shadow-xl"
                  style={{ background: "linear-gradient(135deg, var(--flux), var(--flux-deep))" }}
                >
                  <BadgeCheck size={20} /> Save Profile & Update Verification Score
                </button>
                <p className="ff-mono text-xs text-center text-gray-500 mt-2">
                  Updates frontend state instantly. 90%+ score awards Trusted Verified Merchant Badge.
                </p>
              </div>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
