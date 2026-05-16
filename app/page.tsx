"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaSpotify,
  FaShieldAlt, FaBolt, FaCrown, FaCheckCircle,
  FaChevronLeft, FaChevronRight,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiTiktok } from "react-icons/si";
import type { IconType } from "react-icons";

// ─── Platform Config ──────────────────────────────────────────────────────────

type Platform = {
  id: string;
  label: string;
  Icon: IconType;
  brand: string;
  textLight: string;
  activeBg: string;
  activeText: string;
  gradient: string;
};

const PLATFORMS: Platform[] = [
  { id: "facebook",  label: "Facebook",    Icon: FaFacebook,  brand: "#1877F2", textLight: "text-blue-600",   activeBg: "bg-[#1877F2]",  activeText: "text-white", gradient: "from-blue-500 to-blue-700" },
  { id: "instagram", label: "Instagram",   Icon: FaInstagram, brand: "#E1306C", textLight: "text-pink-600",   activeBg: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400", activeText: "text-white", gradient: "from-purple-500 via-pink-500 to-orange-400" },
  { id: "tiktok",    label: "TikTok",      Icon: SiTiktok,    brand: "#010101", textLight: "text-gray-900",   activeBg: "bg-gray-900",   activeText: "text-white", gradient: "from-gray-800 to-gray-900" },
  { id: "youtube",   label: "YouTube",     Icon: FaYoutube,   brand: "#FF0000", textLight: "text-red-600",    activeBg: "bg-red-600",    activeText: "text-white", gradient: "from-red-500 to-red-700" },
  { id: "twitter",   label: "X / Twitter", Icon: FaXTwitter,  brand: "#000000", textLight: "text-slate-800",  activeBg: "bg-slate-900",  activeText: "text-white", gradient: "from-slate-700 to-slate-900" },
  { id: "telegram",  label: "Telegram",    Icon: FaTelegram,  brand: "#26A5E4", textLight: "text-sky-500",    activeBg: "bg-sky-500",    activeText: "text-white", gradient: "from-sky-400 to-sky-600" },
  { id: "spotify",   label: "Spotify",     Icon: FaSpotify,   brand: "#1DB954", textLight: "text-green-600",  activeBg: "bg-green-600",  activeText: "text-white", gradient: "from-green-500 to-green-700" },
];

// ─── Tier Config ──────────────────────────────────────────────────────────────

const TIERS = [
  {
    id: "test-drive",
    name: "Test Drive",
    badge: null,
    price: "KES 249",
    usd: "≈ $1.90",
    note: "Try it risk-free — airtime price",
    cardClass: "border-white/10 bg-gray-800",
    headerClass: "bg-gray-800 border-b border-white/10",
    nameClass: "text-gray-300",
    priceClass: "text-white",
    noteClass: "text-gray-500",
    btn: "bg-white hover:bg-gray-100 text-gray-900 font-bold",
    badgeBg: "",
  },
  {
    id: "starter",
    name: "Starter Boost",
    badge: null,
    price: "KES 699",
    usd: "≈ $5.30",
    note: "Noticeable growth overnight",
    cardClass: "border-blue-500/30 bg-gray-800",
    headerClass: "bg-gray-800 border-b border-blue-500/20",
    nameClass: "text-blue-400",
    priceClass: "text-white",
    noteClass: "text-blue-400/60",
    btn: "bg-blue-600 hover:bg-blue-700 text-white",
    badgeBg: "",
  },
  {
    id: "legit",
    name: "Legit Profile",
    badge: "🔥 Best Value",
    price: "KES 1,299",
    usd: "≈ $9.99",
    note: "Looks fully legitimate",
    cardClass: "border-blue-500 bg-gray-800 shadow-2xl shadow-blue-500/20",
    headerClass: "bg-blue-600 border-b border-blue-700",
    nameClass: "text-white",
    priceClass: "text-white",
    noteClass: "text-blue-200",
    btn: "bg-white hover:bg-blue-50 text-blue-700 font-bold",
    badgeBg: "bg-yellow-400 text-gray-900",
  },
  {
    id: "influencer",
    name: "Influencer Status",
    badge: "⚡ Elite",
    price: "KES 2,499",
    usd: "≈ $19.20",
    note: "Brand deals start calling",
    cardClass: "border-indigo-500 bg-gray-800 shadow-lg shadow-indigo-500/20",
    headerClass: "bg-indigo-600 border-b border-indigo-700",
    nameClass: "text-white",
    priceClass: "text-white",
    noteClass: "text-indigo-200",
    btn: "bg-indigo-600 hover:bg-indigo-700 text-white",
    badgeBg: "bg-indigo-500 text-white",
  },
  {
    id: "bazuu",
    name: "Bazuu VIP",
    badge: "👑 Premium",
    price: "KES 4,999",
    usd: "≈ $38.40",
    note: "Full Bazuu status — unstoppable",
    cardClass: "border-yellow-400 bg-gray-900 shadow-xl shadow-yellow-400/20",
    headerClass: "bg-gray-900 border-b border-yellow-500/30",
    nameClass: "text-yellow-400",
    priceClass: "text-yellow-400",
    noteClass: "text-gray-500",
    btn: "bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold",
    badgeBg: "bg-yellow-400 text-gray-900",
  },
];

// ─── Per-platform delivery ────────────────────────────────────────────────────

type TierFeatures = { [tierId: string]: { packageId: string; mtpId: number; qty: number; delivers: string[] } };
const PLATFORM_FEATURES: { [platform: string]: TierFeatures } = {
  facebook: {
    "test-drive":  { packageId: "facebook_web_test",        mtpId: 9061, qty: 1000,  delivers: ["1,000 Page Followers", "200 Post Likes", "30-Day Refill", "Delivery starts in minutes"] },
    "starter":     { packageId: "facebook_web_starter",     mtpId: 9061, qty: 3000,  delivers: ["3,000 Page Followers", "500 Post Likes", "30-Day Refill", "Delivery in 6–12 hrs"] },
    "legit":       { packageId: "facebook_web_legit",       mtpId: 9061, qty: 6000,  delivers: ["6,000 Page Followers", "1,000 Post Likes", "60-Day Refill", "Priority Delivery 6–12 hrs", "Free Page Audit"] },
    "influencer":  { packageId: "facebook_web_influencer",  mtpId: 5798, qty: 12000, delivers: ["12,000 Page Followers", "2,000 Post Likes", "60-Day Refill", "Express Delivery 3–6 hrs", "Telegram Support"] },
    "bazuu":       { packageId: "facebook_web_bazuu",       mtpId: 5798, qty: 25000, delivers: ["25,000 Page Followers", "5,000 Post Likes", "90-Day Refill", "VIP Express Delivery", "Dedicated Agent", "Strategy Call"] },
  },
  instagram: {
    "test-drive":  { packageId: "instagram_web_test",       mtpId: 7403, qty: 10000,  delivers: ["10,000 Reel Views", "200 Followers", "200 Post Likes", "Lifetime Guaranteed", "Delivery starts in minutes"] },
    "starter":     { packageId: "instagram_web_starter",    mtpId: 7403, qty: 40000,  delivers: ["40,000 Reel Views", "600 Followers", "500 Post Likes", "Lifetime Guaranteed", "Delivery in 6–12 hrs"] },
    "legit":       { packageId: "instagram_web_legit",      mtpId: 7403, qty: 100000, delivers: ["100,000 Reel Views", "1,500 Followers", "1,000 Post Likes", "Lifetime Guaranteed", "Priority Delivery", "Hashtag Tips"] },
    "influencer":  { packageId: "instagram_web_influencer", mtpId: 7403, qty: 250000, delivers: ["250,000 Reel Views", "4,000 Followers", "2,500 Post Likes", "Lifetime Guaranteed", "Express Delivery", "Telegram Support"] },
    "bazuu":       { packageId: "instagram_web_bazuu",      mtpId: 7403, qty: 600000, delivers: ["600,000 Reel Views", "10,000 Followers", "6,000 Post Likes", "Lifetime Guaranteed", "VIP Delivery", "Dedicated Agent"] },
  },
  tiktok: {
    "test-drive":  { packageId: "tiktok_web_test",          mtpId: 4645, qty: 10000,  delivers: ["10,000 Video Views", "200 Followers", "200 Likes", "Algorithm-Safe", "Delivery starts in minutes"] },
    "starter":     { packageId: "tiktok_web_starter",       mtpId: 4645, qty: 40000,  delivers: ["40,000 Video Views", "600 Followers", "600 Likes", "Algorithm-Safe", "Delivery in 6–12 hrs"] },
    "legit":       { packageId: "tiktok_web_legit",         mtpId: 4645, qty: 100000, delivers: ["100,000 Video Views", "1,500 Followers", "1,500 Likes", "Algorithm-Safe", "Priority Delivery", "Content Tips"] },
    "influencer":  { packageId: "tiktok_web_influencer",    mtpId: 4645, qty: 300000, delivers: ["300,000 Video Views", "4,000 Followers", "4,000 Likes", "Algorithm-Safe", "Express Delivery", "Telegram Support"] },
    "bazuu":       { packageId: "tiktok_web_bazuu",         mtpId: 4645, qty: 700000, delivers: ["700,000 Video Views", "10,000 Followers", "8,000 Likes", "Algorithm-Safe", "VIP Delivery", "Dedicated Agent"] },
  },
  youtube: {
    "test-drive":  { packageId: "youtube_web_test",         mtpId: 7759, qty: 2000,   delivers: ["2,000 Video Views", "100 Subscribers", "100 Likes", "30-Day Refill", "Delivery starts in minutes"] },
    "starter":     { packageId: "youtube_web_starter",      mtpId: 7759, qty: 8000,   delivers: ["8,000 Video Views", "400 Subscribers", "300 Likes", "30-Day Refill", "Delivery in 6–12 hrs"] },
    "legit":       { packageId: "youtube_web_legit",        mtpId: 7759, qty: 20000,  delivers: ["20,000 Video Views", "1,000 Subscribers", "700 Likes", "30-Day Refill", "Watch Hours Boost", "Priority Delivery"] },
    "influencer":  { packageId: "youtube_web_influencer",   mtpId: 7759, qty: 50000,  delivers: ["50,000 Video Views", "2,500 Subscribers", "1,500 Likes", "30-Day Refill", "Watch Hours Boost", "Telegram Support"] },
    "bazuu":       { packageId: "youtube_web_bazuu",        mtpId: 7759, qty: 120000, delivers: ["120,000 Video Views", "6,000 Subscribers", "4,000 Likes", "Lifetime Guaranteed", "Watch Hours Boost", "Dedicated Agent"] },
  },
  twitter: {
    "test-drive":  { packageId: "twitter_web_test",         mtpId: 9527, qty: 5000,   delivers: ["5,000 Tweet Views", "150 Followers", "150 Likes", "Algorithm-Safe", "Delivery starts in minutes"] },
    "starter":     { packageId: "twitter_web_starter",      mtpId: 9527, qty: 20000,  delivers: ["20,000 Tweet Views", "500 Followers", "400 Likes", "Algorithm-Safe", "Delivery in 6–12 hrs"] },
    "legit":       { packageId: "twitter_web_legit",        mtpId: 9527, qty: 60000,  delivers: ["60,000 Tweet Views", "1,500 Followers", "1,000 Likes", "Algorithm-Safe", "Retweet Boost", "Priority Delivery"] },
    "influencer":  { packageId: "twitter_web_influencer",   mtpId: 9527, qty: 150000, delivers: ["150,000 Tweet Views", "4,000 Followers", "2,000 Likes", "Algorithm-Safe", "Retweet Boost", "Telegram Support"] },
    "bazuu":       { packageId: "twitter_web_bazuu",        mtpId: 9527, qty: 400000, delivers: ["400,000 Tweet Views", "10,000 Followers", "5,000 Likes", "Algorithm-Safe", "VIP Delivery", "Dedicated Agent"] },
  },
  telegram: {
    "test-drive":  { packageId: "telegram_web_test",        mtpId: 8136, qty: 500,   delivers: ["500 Channel Members", "3,000 Post Views", "Algorithm-Safe", "Delivery starts in minutes"] },
    "starter":     { packageId: "telegram_web_starter",     mtpId: 8136, qty: 1500,  delivers: ["1,500 Channel Members", "10,000 Post Views", "Algorithm-Safe", "Delivery in 6–12 hrs"] },
    "legit":       { packageId: "telegram_web_legit",       mtpId: 8136, qty: 4000,  delivers: ["4,000 Channel Members", "30,000 Post Views", "Algorithm-Safe", "Reactions Boost", "Priority Delivery"] },
    "influencer":  { packageId: "telegram_web_influencer",  mtpId: 8136, qty: 8000,  delivers: ["8,000 Channel Members", "80,000 Post Views", "Algorithm-Safe", "Reactions Boost", "Telegram Support"] },
    "bazuu":       { packageId: "telegram_web_bazuu",       mtpId: 8136, qty: 20000, delivers: ["20,000 Channel Members", "200,000 Post Views", "Algorithm-Safe", "VIP Delivery", "Dedicated Agent"] },
  },
  spotify: {
    "test-drive":  { packageId: "spotify_web_test",         mtpId: 3541, qty: 5000,   delivers: ["5,000 Plays", "100 Followers", "Lifetime Guaranteed", "Global Listeners", "Delivery starts in minutes"] },
    "starter":     { packageId: "spotify_web_starter",      mtpId: 3541, qty: 20000,  delivers: ["20,000 Plays", "300 Followers", "Lifetime Guaranteed", "Global Listeners", "Delivery in 6–12 hrs"] },
    "legit":       { packageId: "spotify_web_legit",        mtpId: 3541, qty: 60000,  delivers: ["60,000 Plays", "800 Followers", "Lifetime Guaranteed", "USA + Global", "Playlist Tips", "Priority Delivery"] },
    "influencer":  { packageId: "spotify_web_influencer",   mtpId: 3541, qty: 150000, delivers: ["150,000 Plays", "2,000 Followers", "Lifetime Guaranteed", "USA + Europe", "Express Delivery", "Telegram Support"] },
    "bazuu":       { packageId: "spotify_web_bazuu",        mtpId: 3541, qty: 400000, delivers: ["400,000 Plays", "5,000 Followers", "Lifetime Guaranteed", "USA + Europe + Africa", "VIP Delivery", "Dedicated Agent"] },
  },
};

const TRUST = [
  { Icon: FaShieldAlt,   label: "Secure M-Pesa",    color: "text-blue-500" },
  { Icon: FaBolt,        label: "Fast Delivery",     color: "text-yellow-500" },
  { Icon: FaCheckCircle, label: "Drop-Proof Refill", color: "text-green-500" },
  { Icon: FaTelegram,    label: "24/7 Support",      color: "text-sky-500" },
];

const FAQS = [
  { q: "Is KES 249 really enough to get started?", a: "Yes. The Test Drive is designed so skeptics can verify the system works with an airtime-level commitment. Most come back within the hour for a bigger package." },
  { q: "How fast does delivery start?", a: "Within minutes of M-Pesa confirmation. Test Drive and Starter begin in under 1 hour. Legit, Influencer and Bazuu packages start within 30 minutes." },
  { q: "What if my numbers drop?", a: "Every tier above Test Drive includes our Drop-Proof Refill Guarantee. If numbers fall in the guarantee window, we top you up free — no questions asked." },
  { q: "Do you need my password?", a: "Never. We only need your public profile link. No login, no password, ever." },
  { q: "Which platforms do you support?", a: "Facebook, Instagram, TikTok, YouTube, X/Twitter, Telegram, and Spotify — with more coming soon." },
  { q: "Can I order multiple packages?", a: "Yes. Many customers start with Test Drive, confirm it works, then order Legit or Influencer in the same session." },
];

// ─── Carousel data (Legit Profile highlight across all platforms) ──────────────

// ─── API types + dynamic feature builder ─────────────────────────────────────

type ApiPackage = { id: string; name: string; platform: string; price_kes: number; description: string };

const TIER_SUFFIX_MAP: Record<string, string> = {
  test: "test-drive", starter: "starter", legit: "legit", influencer: "influencer", bazuu: "bazuu",
};

const TIER_EXTRAS: Record<string, string[]> = {
  "test-drive":  ["Algorithm-Safe", "Delivery starts in minutes"],
  "starter":     ["30-Day Refill", "Delivery in 6–12 hrs"],
  "legit":       ["30-Day Refill", "Priority Delivery"],
  "influencer":  ["60-Day Refill", "Express Delivery", "Telegram Support"],
  "bazuu":       ["90-Day Refill", "VIP Express Delivery", "Dedicated Agent"],
};

function buildDynamicFeatures(packages: ApiPackage[]): typeof PLATFORM_FEATURES {
  const result: typeof PLATFORM_FEATURES = {};
  for (const pkg of packages) {
    if (!pkg.id.includes("_web_")) continue;
    const suffix = pkg.id.replace(`${pkg.platform}_web_`, "");
    const tierId = TIER_SUFFIX_MAP[suffix];
    if (!tierId) continue;
    if (!result[pkg.platform]) result[pkg.platform] = {};
    result[pkg.platform][tierId] = {
      packageId: pkg.id,
      mtpId: 0,
      qty: 0,
      delivers: [
        ...pkg.description.split(" + ").map(s => s.trim()),
        ...(TIER_EXTRAS[tierId] ?? []),
      ],
    };
  }
  return result;
}

// ─── Payment Modal ────────────────────────────────────────────────────────────

type Order = { tier: typeof TIERS[number]; platform: Platform };
type ModalStage = "form" | "waiting" | "tracking" | "error";

const URL_PLACEHOLDERS: Record<string, string> = {
  facebook:  "@yourpage or facebook.com/yourpage",
  instagram: "@yourprofile or instagram.com/yourprofile",
  tiktok:    "@yourusername or tiktok.com/@yourusername",
  youtube:   "@yourchannel or youtube.com/@yourchannel",
  twitter:   "@yourusername or x.com/yourusername",
  telegram:  "@yourchannel or t.me/yourchannel",
  spotify:   "artist ID or open.spotify.com/artist/...",
};

function normalizeProfileUrl(platformId: string, input: string): string {
  const v = input.trim().replace(/^@/, "");
  if (/^https?:\/\//i.test(v)) return v;
  const bases: Record<string, string> = {
    facebook:  "https://facebook.com/",
    instagram: "https://instagram.com/",
    tiktok:    "https://tiktok.com/@",
    youtube:   "https://youtube.com/@",
    twitter:   "https://x.com/",
    telegram:  "https://t.me/",
    spotify:   "https://open.spotify.com/artist/",
  };
  return (bases[platformId] ?? "https://") + v;
}

// ─── Order Status Tracker ─────────────────────────────────────────────────────

const STATUS_META: Record<string, { emoji: string; label: string; color: string }> = {
  pending:    { emoji: "⏳", label: "Awaiting Payment",  color: "text-yellow-400" },
  paid:       { emoji: "💰", label: "Payment Confirmed", color: "text-green-400" },
  processing: { emoji: "🚀", label: "In Progress",       color: "text-blue-400" },
  completed:  { emoji: "✅", label: "Delivered",         color: "text-green-400" },
  failed:     { emoji: "⚠️", label: "Failed",            color: "text-red-400" },
  cancelled:  { emoji: "🚫", label: "Cancelled",         color: "text-gray-400" },
};

type OrderStatus = {
  order_id: number;
  public_id: string;
  status: string;
  package_name: string;
  platform: string;
  price_kes: number;
  created_at: string;
};

function OrderTracker({ apiBase }: { apiBase: string }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrderStatus | null>(null);
  const [err, setErr] = useState("");

  async function check() {
    const id = parseInt(input.trim(), 10);
    if (!id) { setErr("Enter a valid order number."); return; }
    setErr(""); setResult(null); setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/orders/${id}`);
      if (!res.ok) { setErr("Order not found. Check the number and try again."); return; }
      setResult(await res.json());
    } catch {
      setErr("Could not reach the server. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  const meta = result ? (STATUS_META[result.status] ?? { emoji: "❓", label: result.status, color: "text-gray-400" }) : null;

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Order number e.g. 42"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && check()}
          className="flex-1 bg-gray-800 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={check}
          disabled={loading}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition text-sm whitespace-nowrap">
          {loading ? "Checking…" : "Check"}
        </button>
      </div>

      {err && <p className="mt-3 text-red-400 text-sm">{err}</p>}

      {result && meta && (
        <div className="mt-5 bg-gray-800 border border-white/10 rounded-2xl p-5 text-left">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{meta.emoji}</span>
            <div>
              <p className={`font-bold text-lg ${meta.color}`}>{meta.label}</p>
              <p className="text-gray-500 text-xs font-mono">{result.public_id || `#${result.order_id}`}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Package</span>
              <span className="text-white font-medium">{result.package_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Platform</span>
              <span className="text-white capitalize">{result.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Amount</span>
              <span className="text-white">KES {result.price_kes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Placed</span>
              <span className="text-white">{new Date(result.created_at).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}</span>
            </div>
          </div>
          {result.status === "processing" && (
            <p className="mt-4 text-xs text-blue-300 bg-blue-900/30 rounded-xl px-4 py-2">
              Your order is being delivered. Followers typically start arriving within 0–30 minutes.
            </p>
          )}
          {result.status === "failed" && (
            <a href="https://t.me/workratew" target="_blank" rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition">
              <FaTelegram size={16} /> Contact Support on Telegram
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function PaymentModal({ order, platformFeatures, onClose }: { order: Order; platformFeatures: typeof PLATFORM_FEATURES; onClose: () => void }) {
  const [phone, setPhone] = useState("");
  const [profileInput, setProfileInput] = useState("");
  const [stage, setStage] = useState<ModalStage>("form");
  const [errMsg, setErrMsg] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [orderStatus, setOrderStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { tier, platform } = order;
  const features = platformFeatures[platform.id]?.[tier.id] ?? PLATFORM_FEATURES[platform.id][tier.id];

  function stopPolling() {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }

  useEffect(() => () => stopPolling(), []);

  function copyOrderId() {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function startPolling(id: string) {
    let attempts = 0;
    const MAX = 60;
    let transitioned = false;

    pollRef.current = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        const status: string = data.status ?? "pending";
        setOrderStatus(status);

        if (!transitioned && ["processing", "completed", "partial"].includes(status)) {
          transitioned = true;
          setStage("tracking");
        }
        if (status === "completed" || status === "failed" || status === "cancelled") {
          stopPolling();
          if (status === "failed" || status === "cancelled") {
            setErrMsg("Order failed. Please contact support on Telegram @workratew.");
            setStage("error");
          }
        }
      } catch {
        // network blip — keep polling
      }
      if (attempts >= MAX && !transitioned) {
        stopPolling();
        setErrMsg("Payment not confirmed in time. If you entered your PIN, contact us on Telegram @workratew and we'll confirm manually.");
        setStage("error");
      }
    }, 5000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profileInput.trim()) {
      setErrMsg("Please enter your profile username or URL.");
      return;
    }
    setLoading(true);
    setErrMsg("");
    const profileLink = normalizeProfileUrl(platform.id, profileInput);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package_id: features.packageId, profile_link: profileLink, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send M-Pesa request");
      setOrderId(data.public_id || String(data.order_id));
      setStage("waiting");
      startPolling(data.public_id || String(data.order_id));
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong. Please retry.");
    } finally {
      setLoading(false);
    }
  }

  const trackingSteps = [
    { key: "processing", label: "Payment Received & Order Placed", icon: "✅" },
    { key: "delivering", label: "Boost Being Delivered", icon: "🚀" },
    { key: "completed",  label: "Delivery Complete",    icon: "🎉" },
  ];

  function stepDone(stepKey: string) {
    if (stepKey === "processing") return ["processing", "partial", "completed"].includes(orderStatus);
    if (stepKey === "delivering") return ["partial", "completed"].includes(orderStatus);
    if (stepKey === "completed")  return orderStatus === "completed";
    return false;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/10">

        {/* Header */}
        <div className={`bg-gradient-to-r ${platform.gradient} px-6 py-5 flex items-center gap-3`}>
          <platform.Icon size={28} className="text-white" />
          <div>
            <p className="text-white/80 text-xs font-semibold uppercase tracking-widest">Secure Checkout</p>
            <h2 className="text-white text-lg font-extrabold">{platform.label} — {tier.name}</h2>
          </div>
          <button onClick={onClose} className="ml-auto text-white/70 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="p-6">

          {/* ── FORM ── */}
          {stage === "form" && (
            <>
              <div className="mb-5">
                <p className="text-3xl font-extrabold text-white">{tier.price}</p>
                <p className="text-sm text-gray-500">{tier.usd}</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="pf-url" className="block text-sm font-semibold text-gray-300 mb-1">
                    Your {platform.label} Username or Profile URL
                  </label>
                  <input id="pf-url" type="text" required placeholder={URL_PLACEHOLDERS[platform.id]}
                    value={profileInput} onChange={e => setProfileInput(e.target.value)}
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white placeholder-gray-500" />
                  <p className="text-xs text-gray-600 mt-1">You can enter just your username — we&apos;ll build the full URL.</p>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-300 mb-1">
                    M-Pesa Phone Number
                  </label>
                  <input id="phone" type="tel" required placeholder="0712 345 678"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white placeholder-gray-500" />
                </div>
                {errMsg && <p className="text-red-400 text-sm">{errMsg}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold text-lg transition flex items-center justify-center gap-2">
                  {loading ? "Sending…" : `📱 Pay ${tier.price} with M-Pesa`}
                </button>
              </form>
              <p className="text-center text-xs text-gray-500 mt-4">
                🔒 Secure. We never store your PIN or ask for your password.
              </p>
            </>
          )}

          {/* ── WAITING ── */}
          {stage === "waiting" && (
            <div className="text-center py-8">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-green-600/30" />
                <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Check Your Phone</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                An M-Pesa STK push was sent to <strong className="text-white">{phone}</strong>.
                <br />Enter your PIN to confirm payment.
              </p>
              <div className="mt-6 bg-gray-800 rounded-xl px-4 py-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-white text-sm font-semibold">Confirming your payment…</span>
                </div>
                <p className="text-xs text-gray-500">Please wait. This page updates automatically — do not close it.</p>
              </div>
            </div>
          )}

          {/* ── TRACKING ── */}
          {stage === "tracking" && (
            <div className="py-4">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{orderStatus === "completed" ? "🎉" : "🚀"}</div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {orderStatus === "completed" ? "Boost Delivered!" : "Payment Confirmed!"}
                </h3>
                <p className="text-gray-400 text-sm">
                  {orderStatus === "completed"
                    ? `Your ${platform.label} boost has been fully delivered.`
                    : `Your ${platform.label} boost is being processed.`}
                </p>
              </div>

              {/* Status steps */}
              <div className="bg-gray-800 rounded-xl p-4 mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Order Progress</p>
                {trackingSteps.map((step, i) => {
                  const done = stepDone(step.key);
                  const active = step.key === "delivering" && orderStatus === "processing";
                  return (
                    <div key={step.key} className={`flex items-center gap-3 py-2.5 ${i < trackingSteps.length - 1 ? "border-b border-white/5" : ""}`}>
                      <span className="text-base w-6 text-center flex-shrink-0">{done ? step.icon : "⏳"}</span>
                      <span className={`text-sm font-medium flex-1 ${done ? "text-white" : "text-gray-500"}`}>{step.label}</span>
                      {active && <div className="w-3 h-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin flex-shrink-0" />}
                      {done && !active && <FaCheckCircle className="text-green-500 flex-shrink-0" size={14} />}
                    </div>
                  );
                })}
              </div>

              {orderId && (
                <div className="bg-gray-800 border border-white/10 rounded-xl px-4 py-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1.5">Save your Order ID to track delivery later</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white font-bold tracking-widest flex-1 text-sm">{orderId}</span>
                    <button onClick={copyOrderId}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition flex-shrink-0">
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1.5">Use this ID in the <em>Track Order</em> section to check status anytime.</p>
                </div>
              )}

              <a href="https://t.me/workratew" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold transition mb-3">
                <FaTelegram size={18} /> Telegram Support
              </a>
              <button onClick={onClose} className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition">
                Close
              </button>
            </div>
          )}

          {/* ── ERROR ── */}
          {stage === "error" && (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">Payment Issue</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{errMsg}</p>
              <a href="https://t.me/workratew" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold transition mb-3">
                <FaTelegram size={18} /> Contact Support on Telegram
              </a>
              <button onClick={() => { setStage("form"); setErrMsg(""); }}
                className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition">
                Try Again
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Pricing Card ─────────────────────────────────────────────────────────────

function PricingCard({ tier, platformId, platformFeatures, onSelect }: {
  tier: typeof TIERS[number];
  platformId: string;
  platformFeatures: typeof PLATFORM_FEATURES;
  onSelect: () => void;
}) {
  const features = platformFeatures[platformId]?.[tier.id] ?? PLATFORM_FEATURES[platformId]?.[tier.id];
  const isBazuu = tier.id === "bazuu";

  if (!features) return null;

  return (
    <div className={`relative flex flex-col rounded-2xl border-2 overflow-hidden transition-all duration-200 hover:-translate-y-1 ${tier.cardClass}`}>
      {tier.badge && (
        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full z-10 ${tier.badgeBg}`}>
          {tier.badge}
        </span>
      )}

      <div className={`px-5 pt-6 pb-5 ${tier.headerClass}`}>
        <h3 className={`text-base font-extrabold ${tier.nameClass}`}>{tier.name}</h3>
        <p className={`text-3xl font-extrabold mt-1 ${tier.priceClass}`}>{tier.price}</p>
        <p className={`text-xs mt-0.5 ${tier.noteClass}`}>{tier.usd}</p>
        <p className={`text-xs mt-2 italic ${tier.noteClass}`}>&ldquo;{tier.note}&rdquo;</p>
      </div>

      <div className="flex-1 px-5 py-5">
        <ul className="space-y-2.5">
          {features.delivers.map(f => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <FaCheckCircle className={`flex-shrink-0 mt-0.5 ${isBazuu ? "text-yellow-400" : "text-green-500"}`} size={13} />
              <span className="text-gray-300">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-5 pb-5">
        <button onClick={onSelect}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition ${tier.btn}`}>
          {tier.id === "test-drive" ? `Try It — ${tier.price}` : `Get ${tier.name} — ${tier.price}`}
        </button>
      </div>
    </div>
  );
}

// ─── Packages Carousel ────────────────────────────────────────────────────────

function PackagesCarousel({ onOrder, slides }: { onOrder: (order: Order) => void; slides: { platform: Platform; tier: typeof TIERS[number]; features: typeof PLATFORM_FEATURES[string][string] }[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  function updateArrows() {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }

  function slide(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* Arrow: left */}
      <button
        onClick={() => slide("left")}
        disabled={!canLeft}
        aria-label="Scroll left"
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center shadow-lg transition -translate-x-1/2
          ${canLeft ? "text-white hover:bg-gray-700" : "text-gray-600 cursor-not-allowed"}`}>
        <FaChevronLeft size={14} />
      </button>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        onScroll={updateArrows}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {slides.map(({ platform, tier, features }) => (
          <div key={platform.id}
            className="flex-shrink-0 w-64 rounded-2xl border border-white/10 bg-gray-800 overflow-hidden hover:-translate-y-1 transition-transform duration-200">
            {/* Card header */}
            <div className={`bg-gradient-to-r ${platform.gradient} px-4 py-4 flex items-center gap-3`}>
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <platform.Icon size={20} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-extrabold text-sm leading-tight">{platform.label}</p>
                <p className="text-white/70 text-xs">{tier.name}</p>
              </div>
              <span className="ml-auto text-xs font-bold bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full flex-shrink-0">
                🔥 Best Value
              </span>
            </div>

            {/* Price */}
            <div className="px-4 pt-4 pb-2 border-b border-white/10">
              <p className="text-2xl font-extrabold text-white">{tier.price}</p>
              <p className="text-gray-500 text-xs">{tier.usd}</p>
            </div>

            {/* Features */}
            <ul className="px-4 py-3 space-y-1.5">
              {features.delivers.slice(0, 4).map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
                  <FaCheckCircle className="text-green-500 flex-shrink-0" size={11} />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="px-4 pb-4">
              <button
                onClick={() => onOrder({ tier, platform })}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition">
                Order Now — {tier.price}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow: right */}
      <button
        onClick={() => slide("right")}
        disabled={!canRight}
        aria-label="Scroll right"
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center shadow-lg transition translate-x-1/2
          ${canRight ? "text-white hover:bg-gray-700" : "text-gray-600 cursor-not-allowed"}`}>
        <FaChevronRight size={14} />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [activePlatformId, setActivePlatformId] = useState("facebook");
  const [order, setOrder] = useState<Order | null>(null);
  const [showCta, setShowCta] = useState(true);
  const [platformFeatures, setPlatformFeatures] = useState(PLATFORM_FEATURES);

  useEffect(() => {
    const t = setTimeout(() => setShowCta(false), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetch("/api/packages")
      .then(r => r.json())
      .then((pkgs: ApiPackage[]) => {
        const dynamic = buildDynamicFeatures(pkgs);
        if (Object.keys(dynamic).length > 0) setPlatformFeatures(dynamic);
      })
      .catch(() => {});
  }, []);

  const carouselSlides = PLATFORMS.map(p => ({
    platform: p,
    tier: TIERS.find(t => t.id === "legit")!,
    features: platformFeatures[p.id]?.["legit"] ?? PLATFORM_FEATURES[p.id]["legit"],
  }));

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const activePlatform = PLATFORMS.find(p => p.id === activePlatformId)!;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur border-b border-white/10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="text-2xl font-extrabold tracking-tight text-white">
            <span className="text-blue-400">Inn</span>Bucks
          </span>
          <button onClick={() => scrollTo("pricing")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-full transition shadow-sm shadow-blue-200">
            Get Started
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gray-950 pt-20 pb-24 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block bg-blue-600/20 text-blue-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-blue-600/30">
            ✅ innbucks.org — Kenya&apos;s #1 Social Growth Service
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-5">
            Gain Instant{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Social Proof.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto mb-10">
            From KES 249 to full Bazuu status — grow on 7 platforms, pay with M-Pesa,
            delivery starts in minutes.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {PLATFORMS.map(p => (
              <button key={p.id}
                onClick={() => { setActivePlatformId(p.id); scrollTo("pricing"); }}
                className="group flex flex-col items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl px-4 py-3 transition">
                <p.Icon size={24} style={{ color: p.brand }} />
                <span className="text-xs text-gray-400 group-hover:text-white transition font-medium">{p.label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => scrollTo("pricing")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition shadow-lg shadow-blue-900/50">
              View Packages
            </button>
            <button onClick={() => scrollTo("how-it-works")}
              className="bg-white/10 hover:bg-white/15 text-white font-semibold text-lg px-8 py-4 rounded-2xl border border-white/10 transition">
              How It Works
            </button>
            <button onClick={() => scrollTo("track")}
              className="bg-white/10 hover:bg-white/15 text-white font-semibold text-lg px-8 py-4 rounded-2xl border border-white/10 transition">
              Track Order
            </button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {TRUST.map(b => (
              <div key={b.label}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm font-medium text-gray-300">
                <b.Icon className={b.color} size={14} />
                {b.label}
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-gray-500">
            🇰🇪 Trusted by <strong className="text-gray-300">3,400+ Kenyan creators & page owners</strong>
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">How It Works</h2>
            <p className="text-gray-500 text-sm mt-2">Three steps. Done in under 2 minutes.</p>
          </div>

          {/* Overlapping stacked cards */}
          <div className="relative flex flex-col">
            {[
              { step: "1", icon: "📦", title: "Pick Your Platform & Package", body: "Choose your social network and tier — from KES 249 Test Drive to KES 4,999 Bazuu VIP.", rotate: "-rotate-1", zClass: "z-10" },
              { step: "2", icon: "📱", title: "Pay via M-Pesa in Seconds", body: "Enter your Safaricom number. An STK push lands instantly — just enter your PIN. No card, no bank.", rotate: "rotate-1", zClass: "z-20" },
              { step: "3", icon: "📈", title: "Watch Your Numbers Climb", body: "Followers and views arrive within minutes of payment. No login needed, no password ever shared.", rotate: "-rotate-1", zClass: "z-30" },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`relative bg-gray-800 rounded-2xl border border-white/10 px-8 py-7 shadow-2xl transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] hover:shadow-blue-900/30 ${item.rotate} ${item.zClass} ${i > 0 ? "-mt-4" : ""}`}>
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/50">
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Step {item.step}</span>
                    </div>
                    <h3 className="text-white font-extrabold text-base mb-1.5">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Support note */}
          <div className="mt-8 flex items-center gap-4 bg-sky-900/30 border border-sky-700/40 rounded-2xl px-6 py-4">
            <FaTelegram size={28} className="text-sky-400 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">Bought a package? We&apos;re here for you.</p>
              <p className="text-gray-400 text-xs mt-0.5">
                After your purchase, message our support team on Telegram @workratew for order updates, questions, or any help. Available 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Guarantee Banner ── */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 text-white text-center md:text-left">
          <FaShieldAlt size={48} className="flex-shrink-0 text-white/80" />
          <div>
            <h3 className="text-2xl font-extrabold mb-1">Drop-Proof Refill Guarantee</h3>
            <p className="text-blue-100 text-sm max-w-xl">
              On every platform, every tier above Test Drive: if your numbers drop within the guarantee
              period, we top you back up — free, no questions asked.
            </p>
          </div>
          <div className="md:ml-auto flex-shrink-0">
            <button onClick={() => scrollTo("pricing")}
              className="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition whitespace-nowrap shadow">
              See Packages
            </button>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">5-Tier Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Choose Your Platform</h2>
            <p className="text-gray-500 mt-2">Start with KES 249 to test the system. Scale to Bazuu when ready.</p>
          </div>

          {/* Platform Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {PLATFORMS.map(p => {
              const isActive = activePlatformId === p.id;
              return (
                <button key={p.id} onClick={() => setActivePlatformId(p.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border-2 transition-all
                    ${isActive
                      ? `${p.activeBg} ${p.activeText} border-transparent shadow-md scale-105`
                      : "bg-gray-800 text-gray-400 border-white/10 hover:border-white/20 hover:text-white"}`}>
                  <p.Icon size={16} style={isActive ? { color: "white" } : { color: p.brand }} />
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Active platform heading */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activePlatform.gradient} flex items-center justify-center shadow`}>
              <activePlatform.Icon size={22} className="text-white" />
            </div>
            <h3 className="text-xl font-extrabold text-white">{activePlatform.label} Packages</h3>
          </div>

          {/* Cards: 3 top + 2 bottom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TIERS.slice(0, 3).map(tier => (
              <PricingCard key={tier.id} tier={tier} platformId={activePlatformId} platformFeatures={platformFeatures}
                onSelect={() => setOrder({ tier, platform: activePlatform })} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 max-w-2xl mx-auto">
            {TIERS.slice(3).map(tier => (
              <PricingCard key={tier.id} tier={tier} platformId={activePlatformId} platformFeatures={platformFeatures}
                onSelect={() => setOrder({ tier, platform: activePlatform })} />
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            💡 <strong className="text-gray-400">Pro tip:</strong> Start with Test Drive. Once you see followers land, come back for Legit or Bazuu.
          </p>
        </div>
      </section>

      {/* ── Packages Carousel ── */}
      <section className="py-16 px-4 bg-gray-900 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">All Platforms</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">Most Popular Package</h2>
            <p className="text-gray-500 text-sm mt-1">Legit Profile — KES 1,299 across every platform</p>
          </div>
          <PackagesCarousel onOrder={setOrder} slides={carouselSlides} />
          <p className="text-center text-xs text-gray-600 mt-6">
            Swipe or use arrows to browse all 7 platforms
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white">Common Questions</h2>
          </div>
          {FAQS.map(item => (
            <details key={item.q} className="border-b border-white/10 py-5 group cursor-pointer">
              <summary className="flex justify-between items-center font-semibold text-white list-none gap-4">
                {item.q}
                <span className="text-blue-400 text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-gray-400 text-sm leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Order Status Checker ── */}
      <section id="track" className="py-20 px-4 bg-gray-900 border-t border-white/5">
        <div className="max-w-lg mx-auto text-center">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Real-Time Tracking</span>
          <h2 className="text-3xl font-extrabold text-white mt-2 mb-1">Check Your Order</h2>
          <p className="text-gray-500 text-sm mb-8">Enter the order number you received after payment.</p>
          <OrderTracker apiBase={process.env.NEXT_PUBLIC_API_URL ?? ""} />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-gray-500 py-10 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <span className="font-extrabold text-white text-lg">
            <span className="text-blue-400">Inn</span>Bucks
          </span>
          <div className="flex items-center gap-4">
            {PLATFORMS.map(p => (
              <p.Icon key={p.id} size={18} style={{ color: p.brand }} className="opacity-70 hover:opacity-100 transition cursor-pointer" />
            ))}
          </div>
          <p>© {new Date().getFullYear()} InnBucks. All rights reserved.</p>
        </div>
      </footer>

      {/* ── Sticky Mobile CTA (auto-hides after 5 s) ── */}
      <div className={`fixed bottom-0 left-0 right-0 z-30 md:hidden bg-gray-900 border-t border-white/10 shadow-2xl px-4 py-3 transition-all duration-500
        ${showCta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"}`}>
        <button onClick={() => scrollTo("pricing")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-base transition">
          📱 Start from KES 249 — Pay with M-Pesa
        </button>
      </div>

      {/* ── Payment Modal ── */}
      {order && <PaymentModal order={order} platformFeatures={platformFeatures} onClose={() => setOrder(null)} />}
    </div>
  );
}
