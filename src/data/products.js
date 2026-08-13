import {
  Cpu, Shirt, Sofa, Carrot, Gamepad2, Sparkles, Package,
  Dumbbell, BookOpen, PawPrint, Car,
} from "lucide-react";

export const CATEGORIES = [
  { id: "electronics", name: "Electronics", icon: Cpu, color: "var(--electronics)" },
  { id: "fashion", name: "Fashion", icon: Shirt, color: "var(--fashion)" },
  { id: "home", name: "Home", icon: Sofa, color: "var(--home)" },
  { id: "grocery", name: "Grocery", icon: Carrot, color: "var(--grocery)" },
  { id: "toys", name: "Toys", icon: Gamepad2, color: "var(--toys)" },
  { id: "beauty", name: "Beauty", icon: Sparkles, color: "var(--beauty)" },
  { id: "sports", name: "Sports", icon: Dumbbell, color: "var(--sports)" },
  { id: "books", name: "Books", icon: BookOpen, color: "var(--books)" },
  { id: "pets", name: "Pets", icon: PawPrint, color: "var(--pets)" },
  { id: "automotive", name: "Automotive", icon: Car, color: "var(--automotive)" },
];
export const catColor = (id) => CATEGORIES.find((c) => c.id === id)?.color || "var(--flux)";
export const catIcon = (id) => CATEGORIES.find((c) => c.id === id)?.icon || Package;

// Hex equivalents of the CSS custom properties above (used only as a last-resort fallback).
const CATEGORY_HEX = {
  electronics: "2F6FF0", fashion: "FF3D81", home: "F0A020", grocery: "16B871",
  toys: "9D4BFF", beauty: "0FB3A8", sports: "EF4444", books: "6366F1",
  pets: "0EA5E9", automotive: "64748B",
};

// Fallback: a category-colored placeholder labeled with the product name.
// Only used if a product doesn't carry its own `image` field below.
export const productImage = (product) => {
  const bg = CATEGORY_HEX[product.category] || "4338F5";
  const label = encodeURIComponent(product.name);
  return `https://placehold.co/400x400/${bg}/FFFFFF?text=${label}&font=roboto`;
};

// Real, freely-licensed photos (Unsplash License — free for commercial use,
// no attribution required) sized to 400x400 for consistent card layouts.
const img = (id) => `https://images.unsplash.com/${id}?w=400&h=400&fit=crop&auto=format&q=80`;

const RAW_PRODUCTS = [
  { id: 1, name: "Aeroloop Noise-Cancelling Headphones", category: "electronics", price: 89, was: 159, rating: 4.8, reviews: 1204, badge: "-45%", blurb: "Adaptive ANC, 40hr battery, warm signature tuning.", colors: ["#10101A", "#E3E4EC"], image: img("photo-1599669454699-248893623440") },
  { id: 2, name: "Kinfolk Weekly Pantry Bundle", category: "grocery", price: 24, was: 39, rating: 4.7, reviews: 860, badge: "Bundle", blurb: "Seasonal produce and staples, portioned for two.", image: img("photo-1768751947135-a841b07a820f") },
  { id: 3, name: "Streetwear Essentials Pack", category: "fashion", price: 58, was: 82, rating: 4.6, reviews: 540, badge: "-30%", blurb: "Boxy tee, cargo pant, five-panel cap — one drop.", sizes: ["XS", "S", "M", "L", "XL"], image: img("photo-1676379827610-c380c52db0c6") },
  { id: 4, name: "Amber Accent Lamp", category: "home", price: 34, was: 49, rating: 4.9, reviews: 1100, badge: "Top pick", colors: ["#F0A020", "#10101A", "#FFFFFF"], image: img("photo-1592195985871-2d326ada5d51") },
  { id: 5, name: "Prism 300pc Building Set", category: "toys", price: 19, was: 26, rating: 4.5, reviews: 780, badge: "-25%", image: img("photo-1558907353-ceb54f3882ed") },
  { id: 6, name: "Fielday Meal Starter Kit", category: "grocery", price: 31, was: 44, rating: 4.8, reviews: 920, badge: "Recommended", image: img("photo-1768751947135-a841b07a820f") },
  { id: 7, name: "Halo Wireless Earbuds", category: "electronics", price: 59, was: 79, rating: 4.4, reviews: 2100, badge: "New", colors: ["#10101A", "#FF4667", "#2F6FF0"], image: img("photo-1599669454699-248893623440") },
  { id: 8, name: "Wanderer Travel Backpack", category: "fashion", price: 42, was: 64, rating: 4.6, reviews: 610, colors: ["#10101A", "#4A4A58", "#F0A020"], image: img("photo-1676379827610-c380c52db0c6") },
  { id: 9, name: "Verdant Ceramic Planter Trio", category: "home", price: 27, was: 38, rating: 4.7, reviews: 340, image: img("photo-1592195985871-2d326ada5d51") },
  { id: 10, name: "Glow Vitamin-C Serum", category: "beauty", price: 22, was: 30, rating: 4.6, reviews: 990, badge: "-27%", image: img("photo-1765726951362-df46f5a74cdf") },
  { id: 11, name: "Bounce Foam Court Sneakers", category: "fashion", price: 68, was: 95, rating: 4.5, reviews: 1500, sizes: ["7", "8", "9", "10", "11"], image: img("photo-1676379827610-c380c52db0c6") },
  { id: 12, name: "Orbit Desk Speaker", category: "electronics", price: 45, was: 60, rating: 4.3, reviews: 410, badge: "-25%", image: img("photo-1599669454699-248893623440") },
  { id: 13, name: "Nestwell Weighted Throw", category: "home", price: 39, was: 55, rating: 4.8, reviews: 700, image: img("photo-1592195985871-2d326ada5d51") },
  { id: 14, name: "Tumble Plush Dino Set", category: "toys", price: 16, was: 22, rating: 4.9, reviews: 260, badge: "New", image: img("photo-1558907353-ceb54f3882ed") },
  { id: 15, name: "Barefoot Mineral SPF 30", category: "beauty", price: 18, was: 24, rating: 4.7, reviews: 505, image: img("photo-1765726951362-df46f5a74cdf") },
  { id: 16, name: "Harvest Cold-Brew Concentrate", category: "grocery", price: 12, was: 16, rating: 4.5, reviews: 388, image: img("photo-1768751947135-a841b07a820f") },
  { id: 17, name: "Flexcore Adjustable Dumbbell Set", category: "sports", price: 79, was: 109, rating: 4.7, reviews: 640, badge: "-27%", image: img("photo-1672344048213-76b6e77304bd") },
  { id: 18, name: "Trailhead Foam Yoga Mat", category: "sports", price: 26, was: 34, rating: 4.6, reviews: 512, image: img("photo-1672344048213-76b6e77304bd") },
  { id: 19, name: "Midnight Library Hardcover Set", category: "books", price: 29, was: 42, rating: 4.8, reviews: 730, badge: "-31%", image: img("photo-1660593089599-f8e50f5204b6") },
  { id: 20, name: "Focused Mind Journal & Planner", category: "books", price: 14, was: 19, rating: 4.6, reviews: 355, image: img("photo-1660593089599-f8e50f5204b6") },
  { id: 21, name: "Cozycoat Orthopedic Pet Bed", category: "pets", price: 38, was: 52, rating: 4.9, reviews: 890, badge: "Top pick", image: img("photo-1708303364738-48188a0e050f") },
  { id: 22, name: "Wagwell Interactive Chew Toy", category: "pets", price: 11, was: 15, rating: 4.5, reviews: 421, image: img("photo-1708303364738-48188a0e050f") },
  { id: 23, name: "Roadline All-Season Floor Mats", category: "automotive", price: 45, was: 64, rating: 4.4, reviews: 298, badge: "-30%", image: img("photo-1570475433067-adbaa402f76d") },
  { id: 24, name: "Voltway Portable Jump Starter", category: "automotive", price: 62, was: 84, rating: 4.7, reviews: 505, badge: "New", image: img("photo-1570475433067-adbaa402f76d") },
];

export const PRODUCTS = RAW_PRODUCTS.map((p) => ({ ...p, image: p.image || productImage(p) }));