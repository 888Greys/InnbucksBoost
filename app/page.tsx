"use client";

import { useState } from "react";
import {
  FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaSpotify,
  FaShieldAlt, FaBolt, FaCrown, FaWhatsapp, FaCheckCircle,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiTiktok } from "react-icons/si";
import type { IconType } from "react-icons";

// ─── Platform Config ──────────────────────────────────────────────────────────

type Platform = {
  id: string;
  label: string;
  Icon: IconType;
  brand: string;       // hex for active tab bg
  textLight: string;   // tailwind text class for light bg
  activeBg: string;    // tailwind bg for active tab
  activeText: string;  // tailwind text for active tab
  gradient: string;    // hero icon bg gradient
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
    cardClass: "border-gray-200 bg-white",
    headerClass: "bg-gray-50 border-b border-gray-100",
    nameClass: "text-gray-700",
    priceClass: "text-gray-900",
    noteClass: "text-gray-400",
    btn: "bg-gray-900 hover:bg-black text-white",
    badgeBg: "",
  },
  {
    id: "starter",
    name: "Starter Boost",
    badge: null,
    price: "KES 699",
    usd: "≈ $5.30",
    note: "Noticeable growth overnight",
    cardClass: "border-blue-100 bg-white",
    headerClass: "bg-blue-50 border-b border-blue-100",
    nameClass: "text-blue-700",
    priceClass: "text-blue-800",
    noteClass: "text-blue-400",
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
    cardClass: "border-blue-500 bg-white shadow-2xl shadow-blue-100",
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
    cardClass: "border-indigo-400 bg-white shadow-lg shadow-indigo-100",
    headerClass: "bg-indigo-600 border-b border-indigo-700",
    nameClass: "text-white",
    priceClass: "text-white",
    noteClass: "text-indigo-200",
    btn: "bg-indigo-600 hover:bg-indigo-700 text-white",
    badgeBg: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "bazuu",
    name: "Bazuu VIP",
    badge: "👑 Premium",
    price: "KES 4,999",
    usd: "≈ $38.40",
    note: "Full Bazuu status — unstoppable",
    cardClass: "border-yellow-400 bg-gray-900 shadow-xl shadow-yellow-100",
    headerClass: "bg-gray-900 border-b border-yellow-500/30",
    nameClass: "text-yellow-400",
    priceClass: "text-yellow-400",
    noteClass: "text-gray-400",
    btn: "bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold",
    badgeBg: "bg-yellow-400 text-gray-900",
  },
];

// ─── Per-platform delivery ────────────────────────────────────────────────────

type TierFeatures = { [tierId: string]: { mtpId: number; delivers: string[] } };
const PLATFORM_FEATURES: { [platform: string]: TierFeatures } = {
  facebook: {
    "test-drive":  { mtpId: 9061, delivers: ["1,000 Page Followers", "200 Post Likes", "30-Day Refill", "Delivery starts in minutes"] },
    "starter":     { mtpId: 9061, delivers: ["3,000 Page Followers", "500 Post Likes", "30-Day Refill", "Delivery in 6–12 hrs"] },
    "legit":       { mtpId: 9061, delivers: ["6,000 Page Followers", "1,000 Post Likes", "60-Day Refill", "Priority Delivery 6–12 hrs", "Free Page Audit"] },
    "influencer":  { mtpId: 5798, delivers: ["12,000 Page Followers", "2,000 Post Likes", "60-Day Refill", "Express Delivery 3–6 hrs", "WhatsApp Support"] },
    "bazuu":       { mtpId: 5798, delivers: ["25,000 Page Followers", "5,000 Post Likes", "90-Day Refill", "VIP Express Delivery", "Dedicated Agent", "Strategy Call"] },
  },
  instagram: {
    "test-drive":  { mtpId: 7403, delivers: ["10,000 Reel Views", "200 Followers", "200 Post Likes", "Lifetime Guaranteed", "Delivery starts in minutes"] },
    "starter":     { mtpId: 7403, delivers: ["40,000 Reel Views", "600 Followers", "500 Post Likes", "Lifetime Guaranteed", "Delivery in 6–12 hrs"] },
    "legit":       { mtpId: 7403, delivers: ["100,000 Reel Views", "1,500 Followers", "1,000 Post Likes", "Lifetime Guaranteed", "Priority Delivery", "Hashtag Tips"] },
    "influencer":  { mtpId: 7403, delivers: ["250,000 Reel Views", "4,000 Followers", "2,500 Post Likes", "Lifetime Guaranteed", "Express Delivery", "WhatsApp Support"] },
    "bazuu":       { mtpId: 7403, delivers: ["600,000 Reel Views", "10,000 Followers", "6,000 Post Likes", "Lifetime Guaranteed", "VIP Delivery", "Dedicated Agent"] },
  },
  tiktok: {
    "test-drive":  { mtpId: 4645, delivers: ["10,000 Video Views", "200 Followers", "200 Likes", "Algorithm-Safe", "Delivery starts in minutes"] },
    "starter":     { mtpId: 4645, delivers: ["40,000 Video Views", "600 Followers", "600 Likes", "Algorithm-Safe", "Delivery in 6–12 hrs"] },
    "legit":       { mtpId: 4645, delivers: ["100,000 Video Views", "1,500 Followers", "1,500 Likes", "Algorithm-Safe", "Priority Delivery", "Content Tips"] },
    "influencer":  { mtpId: 4645, delivers: ["300,000 Video Views", "4,000 Followers", "4,000 Likes", "Algorithm-Safe", "Express Delivery", "WhatsApp Support"] },
    "bazuu":       { mtpId: 4645, delivers: ["700,000 Video Views", "10,000 Followers", "8,000 Likes", "Algorithm-Safe", "VIP Delivery", "Dedicated Agent"] },
  },
  youtube: {
    "test-drive":  { mtpId: 7759, delivers: ["2,000 Video Views", "100 Subscribers", "100 Likes", "30-Day Refill", "Delivery starts in minutes"] },
    "starter":     { mtpId: 7759, delivers: ["8,000 Video Views", "400 Subscribers", "300 Likes", "30-Day Refill", "Delivery in 6–12 hrs"] },
    "legit":       { mtpId: 7759, delivers: ["20,000 Video Views", "1,000 Subscribers", "700 Likes", "30-Day Refill", "Watch Hours Boost", "Priority Delivery"] },
    "influencer":  { mtpId: 7759, delivers: ["50,000 Video Views", "2,500 Subscribers", "1,500 Likes", "30-Day Refill", "Watch Hours Boost", "WhatsApp Support"] },
    "bazuu":       { mtpId: 7759, delivers: ["120,000 Video Views", "6,000 Subscribers", "4,000 Likes", "Lifetime Guaranteed", "Watch Hours Boost", "Dedicated Agent"] },
  },
  twitter: {
    "test-drive":  { mtpId: 9527, delivers: ["5,000 Tweet Views", "150 Followers", "150 Likes", "Algorithm-Safe", "Delivery starts in minutes"] },
    "starter":     { mtpId: 9527, delivers: ["20,000 Tweet Views", "500 Followers", "400 Likes", "Algorithm-Safe", "Delivery in 6–12 hrs"] },
    "legit":       { mtpId: 9527, delivers: ["60,000 Tweet Views", "1,500 Followers", "1,000 Likes", "Algorithm-Safe", "Retweet Boost", "Priority Delivery"] },
    "influencer":  { mtpId: 9527, delivers: ["150,000 Tweet Views", "4,000 Followers", "2,000 Likes", "Algorithm-Safe", "Retweet Boost", "WhatsApp Support"] },
    "bazuu":       { mtpId: 9527, delivers: ["400,000 Tweet Views", "10,000 Followers", "5,000 Likes", "Algorithm-Safe", "VIP Delivery", "Dedicated Agent"] },
  },
  telegram: {
    "test-drive":  { mtpId: 8136, delivers: ["500 Channel Members", "3,000 Post Views", "Algorithm-Safe", "Delivery starts in minutes"] },
    "starter":     { mtpId: 8136, delivers: ["1,500 Channel Members", "10,000 Post Views", "Algorithm-Safe", "Delivery in 6–12 hrs"] },
    "legit":       { mtpId: 8136, delivers: ["4,000 Channel Members", "30,000 Post Views", "Algorithm-Safe", "Reactions Boost", "Priority Delivery"] },
    "influencer":  { mtpId: 8136, delivers: ["8,000 Channel Members", "80,000 Post Views", "Algorithm-Safe", "Reactions Boost", "WhatsApp Support"] },
    "bazuu":       { mtpId: 8136, delivers: ["20,000 Channel Members", "200,000 Post Views", "Algorithm-Safe", "VIP Delivery", "Dedicated Agent"] },
  },
  spotify: {
    "test-drive":  { mtpId: 3541, delivers: ["5,000 Plays", "100 Followers", "Lifetime Guaranteed", "Global Listeners", "Delivery starts in minutes"] },
    "starter":     { mtpId: 3541, delivers: ["20,000 Plays", "300 Followers", "Lifetime Guaranteed", "Global Listeners", "Delivery in 6–12 hrs"] },
    "legit":       { mtpId: 3541, delivers: ["60,000 Plays", "800 Followers", "Lifetime Guaranteed", "USA + Global", "Playlist Tips", "Priority Delivery"] },
    "influencer":  { mtpId: 3541, delivers: ["150,000 Plays", "2,000 Followers", "Lifetime Guaranteed", "USA + Europe", "Express Delivery", "WhatsApp Support"] },
    "bazuu":       { mtpId: 3541, delivers: ["400,000 Plays", "5,000 Followers", "Lifetime Guaranteed", "USA + Europe + Africa", "VIP Delivery", "Dedicated Agent"] },
  },
};

const TRUST = [
  { Icon: FaShieldAlt, label: "Secure M-Pesa", color: "text-blue-500" },
  { Icon: FaBolt,      label: "Fast Delivery",  color: "text-yellow-500" },
  { Icon: FaCheckCircle, label: "Drop-Proof Refill", color: "text-green-500" },
  { Icon: FaWhatsapp,  label: "24/7 Support",   color: "text-green-600" },
];

const FAQS = [
  { q: "Is KES 249 really enough to get started?", a: "Yes. The Test Drive is designed so skeptics can verify the system works with an airtime-level commitment. Most come back within the hour for a bigger package." },
  { q: "How fast does delivery start?", a: "Within minutes of M-Pesa confirmation. Test Drive and Starter begin in under 1 hour. Legit, Influencer and Bazuu packages start within 30 minutes." },
  { q: "What if my numbers drop?", a: "Every tier above Test Drive includes our Drop-Proof Refill Guarantee. If numbers fall in the guarantee window, we top you up free — no questions asked." },
  { q: "Do you need my password?", a: "Never. We only need your public profile link. No login, no password, ever." },
  { q: "Which platforms do you support?", a: "Facebook, Instagram, TikTok, YouTube, X/Twitter, Telegram, and Spotify — with more coming soon." },
  { q: "Can I order multiple packages?", a: "Yes. Many customers start with Test Drive, confirm it works, then order Legit or Influencer in the same session." },
];

// ─── Payment Modal ────────────────────────────────────────────────────────────

type Order = { tier: typeof TIERS[number]; platform: Platform };

function PaymentModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [phone, setPhone] = useState("");
  const [url, setUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { tier, platform } = order;

  const urlPlaceholders: Record<string, string> = {
    facebook: "https://facebook.com/yourpage",
    instagram: "https://instagram.com/yourprofile",
    tiktok: "https://tiktok.com/@yourusername",
    youtube: "https://youtube.com/@yourchannel",
    twitter: "https://x.com/yourusername",
    telegram: "https://t.me/yourchannel",
    spotify: "https://open.spotify.com/artist/...",
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: POST /api/order → M-Pesa STK push → auto-place MTP order on confirm
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Modal header with brand color */}
        <div className={`bg-gradient-to-r ${platform.gradient} px-6 py-5 flex items-center gap-3`}>
          <platform.Icon size={28} className="text-white" />
          <div>
            <p className="text-white/80 text-xs font-semibold uppercase tracking-widest">Secure Checkout</p>
            <h2 className="text-white text-lg font-extrabold">{platform.label} — {tier.name}</h2>
          </div>
          <button onClick={onClose} className="ml-auto text-white/70 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your Phone!</h3>
              <p className="text-gray-500 text-sm">
                An M-Pesa STK push was sent to <strong className="text-gray-900">{phone}</strong>.
                Enter your PIN to confirm. Delivery starts within minutes.
              </p>
              <button onClick={onClose}
                className="mt-6 w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition">
                Done — I&apos;ll watch it land 🚀
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <p className="text-3xl font-extrabold text-gray-900">{tier.price}</p>
                <p className="text-sm text-gray-400">{tier.usd}</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="pf-url" className="block text-sm font-semibold text-gray-700 mb-1">
                    Your {platform.label} Profile / Page URL
                  </label>
                  <input id="pf-url" type="url" required placeholder={urlPlaceholders[platform.id]}
                    value={url} onChange={e => setUrl(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                    M-Pesa Phone Number
                  </label>
                  <input id="phone" type="tel" required placeholder="0712 345 678"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                </div>
                <button type="submit"
                  className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg transition flex items-center justify-center gap-2">
                  📱 Pay {tier.price} with M-Pesa
                </button>
              </form>
              <p className="text-center text-xs text-gray-400 mt-4">
                🔒 Secure. We never store your PIN or ask for your password.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Pricing Card ─────────────────────────────────────────────────────────────

function PricingCard({ tier, platformId, onSelect }: {
  tier: typeof TIERS[number];
  platformId: string;
  onSelect: () => void;
}) {
  const features = PLATFORM_FEATURES[platformId][tier.id];
  const isBazuu = tier.id === "bazuu";

  return (
    <div className={`relative flex flex-col rounded-2xl border-2 overflow-hidden transition-all duration-200 hover:-translate-y-1 ${tier.cardClass}`}>
      {tier.badge && (
        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full z-10 ${tier.badgeBg}`}>
          {tier.badge}
        </span>
      )}

      {/* Card header */}
      <div className={`px-5 pt-6 pb-5 ${tier.headerClass}`}>
        <h3 className={`text-base font-extrabold ${tier.nameClass}`}>{tier.name}</h3>
        <p className={`text-3xl font-extrabold mt-1 ${tier.priceClass}`}>{tier.price}</p>
        <p className={`text-xs mt-0.5 ${tier.noteClass}`}>{tier.usd}</p>
        <p className={`text-xs mt-2 italic ${tier.noteClass}`}>&ldquo;{tier.note}&rdquo;</p>
      </div>

      {/* Features */}
      <div className="flex-1 px-5 py-5">
        <ul className="space-y-2.5">
          {features.delivers.map(f => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <FaCheckCircle className={`flex-shrink-0 mt-0.5 ${isBazuu ? "text-yellow-400" : "text-green-500"}`} size={13} />
              <span className={isBazuu ? "text-gray-300" : "text-gray-700"}>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <button onClick={onSelect}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition ${tier.btn}`}>
          {tier.id === "test-drive" ? `Try It — ${tier.price}` : `Get ${tier.name} — ${tier.price}`}
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [activePlatformId, setActivePlatformId] = useState("facebook");
  const [order, setOrder] = useState<Order | null>(null);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const activePlatform = PLATFORMS.find(p => p.id === activePlatformId)!;

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="text-blue-600">Inn</span>Bucks
          </span>
          <button onClick={() => scrollTo("pricing")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-full transition shadow-sm shadow-blue-200">
            Get Started
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gray-950 pt-20 pb-24 px-4">
        {/* Background glow */}
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

          {/* Platform icon grid */}
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
          </div>

          {/* Trust badges */}
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
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: "📦", title: "Pick Your Platform & Package", body: "Choose your social network and tier — from KES 249 Test Drive to KES 4,999 Bazuu VIP." },
              { step: "2", icon: "📱", title: "Pay via M-Pesa", body: "Enter your Safaricom number. An STK push lands in seconds — just enter your PIN." },
              { step: "3", icon: "📈", title: "Watch It Land", body: "Followers and views arrive within minutes. No password needed, ever." },
            ].map(item => (
              <div key={item.step} className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center hover:shadow-md transition">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-blue-600 text-white text-sm font-bold rounded-full flex items-center justify-center shadow">
                  {item.step}
                </div>
                <div className="text-4xl mb-4 mt-2">{item.icon}</div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
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
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">5-Tier Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">Choose Your Platform</h2>
            <p className="text-gray-500 mt-2">Start with KES 249 to test the system. Scale to Bazuu when ready.</p>
          </div>

          {/* Platform Tabs with real icons */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {PLATFORMS.map(p => {
              const isActive = activePlatformId === p.id;
              return (
                <button key={p.id} onClick={() => setActivePlatformId(p.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border-2 transition-all
                    ${isActive
                      ? `${p.activeBg} ${p.activeText} border-transparent shadow-md scale-105`
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
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
            <h3 className="text-xl font-extrabold text-gray-900">{activePlatform.label} Packages</h3>
          </div>

          {/* Cards: 3 top + 2 bottom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TIERS.slice(0, 3).map(tier => (
              <PricingCard key={tier.id} tier={tier} platformId={activePlatformId}
                onSelect={() => setOrder({ tier, platform: activePlatform })} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 max-w-2xl mx-auto">
            {TIERS.slice(3).map(tier => (
              <PricingCard key={tier.id} tier={tier} platformId={activePlatformId}
                onSelect={() => setOrder({ tier, platform: activePlatform })} />
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            💡 <strong className="text-gray-600">Pro tip:</strong> Start with Test Drive. Once you see followers land, come back for Legit or Bazuu.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">Common Questions</h2>
          </div>
          {FAQS.map(item => (
            <details key={item.q} className="border-b border-gray-100 py-5 group cursor-pointer">
              <summary className="flex justify-between items-center font-semibold text-gray-900 list-none gap-4">
                {item.q}
                <span className="text-blue-600 text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-gray-500 text-sm leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-gray-500 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <span className="font-extrabold text-white text-lg">
            <span className="text-blue-400">Inn</span>Bucks
          </span>
          {/* Platform icons row */}
          <div className="flex items-center gap-4">
            {PLATFORMS.map(p => (
              <p.Icon key={p.id} size={18} style={{ color: p.brand }} className="opacity-70 hover:opacity-100 transition cursor-pointer" />
            ))}
          </div>
          <p>© {new Date().getFullYear()} InnBucks. All rights reserved.</p>
        </div>
      </footer>

      {/* ── Sticky Mobile CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-gray-100 shadow-2xl px-4 py-3">
        <button onClick={() => scrollTo("pricing")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-base transition">
          📱 Start from KES 249 — Pay with M-Pesa
        </button>
      </div>

      {/* ── Payment Modal ── */}
      {order && <PaymentModal order={order} onClose={() => setOrder(null)} />}
    </div>
  );
}
