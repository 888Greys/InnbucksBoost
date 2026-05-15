"use client";

import { useState } from "react";

// ─── Platforms ────────────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: "facebook",  label: "Facebook",    icon: "📘" },
  { id: "instagram", label: "Instagram",   icon: "📸" },
  { id: "tiktok",    label: "TikTok",      icon: "🎵" },
  { id: "youtube",   label: "YouTube",     icon: "▶️"  },
  { id: "twitter",   label: "X / Twitter", icon: "🐦" },
  { id: "telegram",  label: "Telegram",    icon: "✈️"  },
  { id: "spotify",   label: "Spotify",     icon: "🎧" },
];

// ─── Tier visual config (same across all platforms) ───────────────────────────

const TIERS = [
  {
    id: "test-drive",
    name: "Test Drive",
    badge: null,
    price: "KES 249",
    usd: "≈ $1.90",
    // card style: plain white / gray — basic, low-commitment
    cardBorder:  "border-gray-200",
    headerBg:    "bg-gray-50",
    headerText:  "text-gray-800",
    subText:     "text-gray-400",
    descText:    "text-gray-500",
    btnClass:    "bg-gray-800 hover:bg-gray-900 text-white",
    shadow:      "",
  },
  {
    id: "starter",
    name: "Starter Boost",
    badge: null,
    price: "KES 699",
    usd: "≈ $5.30",
    cardBorder:  "border-blue-200",
    headerBg:    "bg-blue-50",
    headerText:  "text-blue-800",
    subText:     "text-blue-300",
    descText:    "text-blue-600",
    btnClass:    "bg-blue-600 hover:bg-blue-700 text-white",
    shadow:      "",
  },
  {
    id: "legit",
    name: "Legit Profile",
    badge: "🔥 Best Value",
    price: "KES 1,299",
    usd: "≈ $9.99",
    // highlighted — blue border + shadow, "Most Popular" treatment
    cardBorder:  "border-blue-500",
    headerBg:    "bg-blue-600",
    headerText:  "text-white",
    subText:     "text-blue-100",
    descText:    "text-blue-50",
    btnClass:    "bg-white hover:bg-blue-50 text-blue-700 font-bold",
    shadow:      "shadow-2xl shadow-blue-200",
  },
  {
    id: "influencer",
    name: "Influencer Status",
    badge: "⚡ Elite",
    price: "KES 2,499",
    usd: "≈ $19.20",
    cardBorder:  "border-indigo-400",
    headerBg:    "bg-indigo-600",
    headerText:  "text-white",
    subText:     "text-indigo-100",
    descText:    "text-indigo-50",
    btnClass:    "bg-indigo-600 hover:bg-indigo-700 text-white",
    shadow:      "shadow-lg shadow-indigo-100",
  },
  {
    id: "bazuu",
    name: "Bazuu VIP",
    badge: "👑 Premium",
    price: "KES 4,999",
    usd: "≈ $38.40",
    // dark + gold — maximum status
    cardBorder:  "border-yellow-400",
    headerBg:    "bg-gray-900",
    headerText:  "text-yellow-400",
    subText:     "text-gray-400",
    descText:    "text-gray-300",
    btnClass:    "bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold",
    shadow:      "shadow-xl shadow-yellow-100",
  },
];

// ─── Per-platform features (what each tier delivers) ─────────────────────────

type TierFeatures = { [tierId: string]: { mtpId: number; delivers: string[]; note: string } };

const PLATFORM_FEATURES: { [platform: string]: TierFeatures } = {
  facebook: {
    "test-drive":  { mtpId: 9061, delivers: ["1,000 Page Followers", "200 Post Likes", "30-Day Refill Guarantee", "Delivery in 1–6 hrs"], note: "Perfect to test the system" },
    "starter":     { mtpId: 9061, delivers: ["3,000 Page Followers", "500 Post Likes", "30-Day Refill Guarantee", "Delivery in 6–12 hrs"], note: "Noticeable growth overnight" },
    "legit":       { mtpId: 9061, delivers: ["6,000 Page Followers", "1,000 Post Likes", "60-Day Refill Guarantee", "Priority Delivery 6–12 hrs", "Free Page Audit"], note: "Looks fully legitimate" },
    "influencer":  { mtpId: 5798, delivers: ["12,000 Page Followers", "2,000 Post Likes", "60-Day Refill Guarantee", "Express Delivery 3–6 hrs", "WhatsApp Support"], note: "People will ask who manages your page" },
    "bazuu":       { mtpId: 5798, delivers: ["25,000 Page Followers", "5,000 Post Likes", "90-Day Refill Guarantee", "VIP Express Delivery", "Dedicated WhatsApp Agent", "Free Profile Strategy Call"], note: "Full Bazuu status — unstoppable" },
  },
  instagram: {
    "test-drive":  { mtpId: 7403, delivers: ["10,000 Reel Views", "200 Followers", "200 Post Likes", "Lifetime Guaranteed", "Delivery in 1–6 hrs"], note: "See the views land in minutes" },
    "starter":     { mtpId: 7403, delivers: ["40,000 Reel Views", "600 Followers", "500 Post Likes", "Lifetime Guaranteed", "Delivery in 6–12 hrs"], note: "Push your reels into Explore" },
    "legit":       { mtpId: 7403, delivers: ["100,000 Reel Views", "1,500 Followers", "1,000 Post Likes", "Lifetime Guaranteed", "Priority Delivery 6–12 hrs", "Free Hashtag Tips"], note: "Explore page material" },
    "influencer":  { mtpId: 7403, delivers: ["250,000 Reel Views", "4,000 Followers", "2,500 Post Likes", "Lifetime Guaranteed", "Express Delivery 3–6 hrs", "WhatsApp Support"], note: "Brand deals start calling" },
    "bazuu":       { mtpId: 7403, delivers: ["600,000 Reel Views", "10,000 Followers", "6,000 Post Likes", "Lifetime Guaranteed", "VIP Express Delivery", "Dedicated WhatsApp Agent"], note: "Verified influencer territory" },
  },
  tiktok: {
    "test-drive":  { mtpId: 4645, delivers: ["10,000 Video Views", "200 Followers", "200 Likes", "Algorithm-Safe", "Delivery in 1–6 hrs"], note: "Watch the FYP algorithm notice you" },
    "starter":     { mtpId: 4645, delivers: ["40,000 Video Views", "600 Followers", "600 Likes", "Algorithm-Safe", "Delivery in 6–12 hrs"], note: "Real FYP push" },
    "legit":       { mtpId: 4645, delivers: ["100,000 Video Views", "1,500 Followers", "1,500 Likes", "Algorithm-Safe", "Priority Delivery 6–12 hrs", "Free Content Tips"], note: "Trending territory" },
    "influencer":  { mtpId: 4645, delivers: ["300,000 Video Views", "4,000 Followers", "4,000 Likes", "Algorithm-Safe", "Express Delivery 3–6 hrs", "WhatsApp Support"], note: "Brands slide into your DMs" },
    "bazuu":       { mtpId: 4645, delivers: ["700,000 Video Views", "10,000 Followers", "8,000 Likes", "Algorithm-Safe", "VIP Express Delivery", "Dedicated WhatsApp Agent"], note: "TikTok celebrity status" },
  },
  youtube: {
    "test-drive":  { mtpId: 7759, delivers: ["2,000 Video Views", "100 Subscribers", "100 Likes", "30-Day Refill", "Delivery in 1–6 hrs"], note: "See your sub count jump" },
    "starter":     { mtpId: 7759, delivers: ["8,000 Video Views", "400 Subscribers", "300 Likes", "30-Day Refill", "Delivery in 6–12 hrs"], note: "Build monetization momentum" },
    "legit":       { mtpId: 7759, delivers: ["20,000 Video Views", "1,000 Subscribers", "700 Likes", "30-Day Refill", "Priority Delivery 6–12 hrs", "Watch Hours Boost"], note: "Halfway to monetization" },
    "influencer":  { mtpId: 7759, delivers: ["50,000 Video Views", "2,500 Subscribers", "1,500 Likes", "30-Day Refill", "Express Delivery 3–6 hrs", "WhatsApp Support"], note: "Monetization unlocked" },
    "bazuu":       { mtpId: 7759, delivers: ["120,000 Video Views", "6,000 Subscribers", "4,000 Likes", "Lifetime Guaranteed", "VIP Express Delivery", "Dedicated WhatsApp Agent"], note: "Verified YouTube creator" },
  },
  twitter: {
    "test-drive":  { mtpId: 9527, delivers: ["5,000 Tweet Views", "150 Followers", "150 Likes", "Algorithm-Safe", "Delivery in 1–6 hrs"], note: "See your tweets get noticed" },
    "starter":     { mtpId: 9527, delivers: ["20,000 Tweet Views", "500 Followers", "400 Likes", "Algorithm-Safe", "Delivery in 6–12 hrs"], note: "Build your X presence" },
    "legit":       { mtpId: 9527, delivers: ["60,000 Tweet Views", "1,500 Followers", "1,000 Likes", "Algorithm-Safe", "Priority Delivery 6–12 hrs", "Retweet Boost"], note: "Tweets start trending" },
    "influencer":  { mtpId: 9527, delivers: ["150,000 Tweet Views", "4,000 Followers", "2,000 Likes", "Algorithm-Safe", "Express Delivery 3–6 hrs", "WhatsApp Support"], note: "Opinion leader status" },
    "bazuu":       { mtpId: 9527, delivers: ["400,000 Tweet Views", "10,000 Followers", "5,000 Likes", "Algorithm-Safe", "VIP Express Delivery", "Dedicated WhatsApp Agent"], note: "X power user — verified look" },
  },
  telegram: {
    "test-drive":  { mtpId: 8136, delivers: ["500 Channel Members", "3,000 Post Views", "Algorithm-Safe", "Delivery in 1–6 hrs"], note: "Channel looks active instantly" },
    "starter":     { mtpId: 8136, delivers: ["1,500 Channel Members", "10,000 Post Views", "Algorithm-Safe", "Delivery in 6–12 hrs"], note: "Community credibility" },
    "legit":       { mtpId: 8136, delivers: ["4,000 Channel Members", "30,000 Post Views", "Algorithm-Safe", "Priority Delivery 6–12 hrs", "Reactions Boost"], note: "People trust your channel" },
    "influencer":  { mtpId: 8136, delivers: ["8,000 Channel Members", "80,000 Post Views", "Algorithm-Safe", "Express Delivery 3–6 hrs", "WhatsApp Support"], note: "Premium Telegram authority" },
    "bazuu":       { mtpId: 8136, delivers: ["20,000 Channel Members", "200,000 Post Views", "Algorithm-Safe", "VIP Express Delivery", "Dedicated WhatsApp Agent"], note: "Telegram powerhouse" },
  },
  spotify: {
    "test-drive":  { mtpId: 3541, delivers: ["5,000 Plays", "100 Followers", "Lifetime Guaranteed", "Global Listeners", "Delivery in 1–6 hrs"], note: "Hear your play count climb" },
    "starter":     { mtpId: 3541, delivers: ["20,000 Plays", "300 Followers", "Lifetime Guaranteed", "Global Listeners", "Delivery in 6–12 hrs"], note: "Playlist algorithm push" },
    "legit":       { mtpId: 3541, delivers: ["60,000 Plays", "800 Followers", "Lifetime Guaranteed", "USA + Global Listeners", "Priority Delivery 6–12 hrs", "Playlist Pitch Tips"], note: "Editorial playlist territory" },
    "influencer":  { mtpId: 3541, delivers: ["150,000 Plays", "2,000 Followers", "Lifetime Guaranteed", "USA + Europe Listeners", "Express Delivery 3–6 hrs", "WhatsApp Support"], note: "Record label attention" },
    "bazuu":       { mtpId: 3541, delivers: ["400,000 Plays", "5,000 Followers", "Lifetime Guaranteed", "USA + Europe + Africa", "VIP Express Delivery", "Dedicated WhatsApp Agent"], note: "Chart-topping numbers" },
  },
};

// ─── Trust + How It Works ─────────────────────────────────────────────────────

const TRUST_BADGES = [
  { icon: "🔒", label: "Secure M-Pesa" },
  { icon: "⚡", label: "Fast Delivery" },
  { icon: "💯", label: "Drop-Proof Refill" },
  { icon: "🕐", label: "24/7 Support" },
];

const HOW_IT_WORKS = [
  { step: "1", icon: "📦", title: "Pick Your Package", body: "Choose your platform and the tier that fits your budget — from KES 249 to KES 4,999." },
  { step: "2", icon: "📱", title: "Pay via M-Pesa", body: "Enter your Safaricom number. An STK push arrives in seconds — just enter your PIN." },
  { step: "3", icon: "📈", title: "Watch It Land", body: "Followers and likes start arriving within minutes. No password needed, ever." },
];

const FAQS = [
  { q: "Is KES 249 really enough to get started?", a: "Absolutely. The Test Drive package is designed so you can verify with your own eyes that the system works — before spending more. Most customers come back within an hour." },
  { q: "How fast does delivery start?", a: "Within minutes of M-Pesa confirmation. Test Drive and Starter packages start in under 1 hour. Legit, Influencer, and Bazuu packages begin within 30 minutes." },
  { q: "What if my numbers drop?", a: "Every package above Test Drive includes our Drop-Proof Refill Guarantee. If numbers drop within the guarantee window, we top you back up for free." },
  { q: "Do you need my password?", a: "Never. We only need your public profile link. No login, no password, ever." },
  { q: "Which platforms do you support?", a: "Facebook, Instagram, TikTok, YouTube, X/Twitter, Telegram, and Spotify. More coming soon." },
  { q: "Can I order multiple packages?", a: "Yes. Many customers start with Test Drive, confirm it works, then immediately order Legit or Influencer in the same session." },
];

// ─── Payment Modal ────────────────────────────────────────────────────────────

type Order = { tier: (typeof TIERS)[number]; platform: string };

function PaymentModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [phone, setPhone] = useState("");
  const [url, setUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { tier, platform } = order;
  const pf = PLATFORMS.find(p => p.id === platform)!;

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
    // TODO: POST to /api/order — trigger M-Pesa STK push, then auto-place MTP order on confirm
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your Phone!</h3>
            <p className="text-gray-500 text-sm">
              An M-Pesa STK push was sent to <strong className="text-gray-900">{phone}</strong>.
              Enter your PIN to confirm. Delivery starts within minutes.
            </p>
            <button onClick={onClose}
              className="mt-6 w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
              Done — I&apos;ll watch it land 🚀
            </button>
          </div>
        ) : (
          <>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Secure Checkout</span>
            <h2 className="text-xl font-bold text-gray-900 mt-1">
              {pf.icon} {pf.label} — {tier.name}
            </h2>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{tier.price}</p>
            <p className="text-sm text-gray-400 mb-5">{tier.usd}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="pf-url" className="block text-sm font-medium text-gray-700 mb-1">
                  Your {pf.label} Profile / Page URL
                </label>
                <input id="pf-url" type="url" required placeholder={urlPlaceholders[platform]}
                  value={url} onChange={e => setUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  M-Pesa Phone Number
                </label>
                <input id="phone" type="tel" required placeholder="0712 345 678"
                  value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit"
                className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg transition flex items-center justify-center gap-2">
                <span>📱</span> Pay {tier.price} with M-Pesa
              </button>
            </form>
            <p className="text-center text-xs text-gray-400 mt-4">
              🔒 Secure. We never store your PIN or ask for your password.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Pricing Card ─────────────────────────────────────────────────────────────

function PricingCard({ tier, platform, onSelect }: {
  tier: typeof TIERS[number];
  platform: string;
  onSelect: () => void;
}) {
  const features = PLATFORM_FEATURES[platform][tier.id];
  const isLegit = tier.id === "legit";
  const isBazuu = tier.id === "bazuu";

  return (
    <div className={`relative flex flex-col bg-white rounded-2xl border-2 overflow-hidden transition-all duration-200
      hover:-translate-y-1 hover:shadow-xl ${tier.cardBorder} ${tier.shadow}`}>

      {tier.badge && (
        <div className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full z-10
          ${isLegit ? "bg-blue-600 text-white" : isBazuu ? "bg-yellow-400 text-gray-900" : "bg-indigo-600 text-white"}`}>
          {tier.badge}
        </div>
      )}

      {/* Header */}
      <div className={`${tier.headerBg} px-5 pt-6 pb-5`}>
        <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${tier.subText}`}>
          {tier.id === "test-drive" ? "Start here" : tier.id === "bazuu" ? "Maximum status" : ""}
        </p>
        <h3 className={`text-lg font-extrabold ${tier.headerText}`}>{tier.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-3xl font-extrabold ${tier.headerText}`}>{tier.price}</span>
        </div>
        <p className={`text-xs mt-0.5 ${tier.subText}`}>{tier.usd}</p>
        <p className={`text-sm mt-2 italic ${tier.descText}`}>&ldquo;{features.note}&rdquo;</p>
      </div>

      {/* Features */}
      <div className="flex-1 px-5 py-5">
        <ul className="space-y-2.5">
          {features.delivers.map(f => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
              <span className="text-gray-700">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <button onClick={onSelect}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition ${tier.btnClass}`}>
          {tier.id === "test-drive" ? `Try It — ${tier.price}` : `Get ${tier.name} — ${tier.price}`}
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [activePlatform, setActivePlatform] = useState("facebook");
  const [order, setOrder] = useState<Order | null>(null);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const currentPlatform = PLATFORMS.find(p => p.id === activePlatform)!;

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="text-blue-600">Inn</span>Bucks
          </span>
          <button onClick={() => scrollTo("pricing")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition">
            Get Started
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-white pt-14 pb-20 px-4">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 bg-indigo-50 rounded-full opacity-60 blur-2xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            ✅ innbucks.org — Kenya&apos;s #1 Social Growth Service
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
            Gain Instant{" "}
            <span className="text-blue-600">Social Proof.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto mb-6">
            From a KES 249 test to full Bazuu status — grow on Facebook, Instagram, TikTok
            and more. Pay instantly with M-Pesa, delivery starts in minutes.
          </p>

          {/* Platform pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {PLATFORMS.map(p => (
              <button key={p.id}
                onClick={() => { setActivePlatform(p.id); scrollTo("pricing"); }}
                className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-blue-300 shadow-sm rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition">
                <span>{p.icon}</span> {p.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => scrollTo("pricing")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition shadow-lg shadow-blue-200">
              View Packages
            </button>
            <button onClick={() => scrollTo("how-it-works")}
              className="bg-white hover:bg-gray-50 text-gray-700 font-semibold text-lg px-8 py-4 rounded-2xl border border-gray-200 transition">
              How It Works
            </button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {TRUST_BADGES.map(b => (
              <div key={b.label}
                className="flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-full px-4 py-2 text-sm font-medium text-gray-600">
                <span>{b.icon}</span>{b.label}
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-gray-400">
            🇰🇪 Trusted by <strong className="text-gray-700">3,400+ Kenyan creators & page owners</strong>
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(item => (
              <div key={item.step}
                className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center hover:shadow-md transition">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-blue-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {item.step}
                </div>
                <div className="text-4xl mb-4 mt-2">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guarantee Banner ── */}
      <section className="bg-blue-600 py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 text-white text-center md:text-left">
          <div className="text-5xl flex-shrink-0">🛡️</div>
          <div>
            <h3 className="text-2xl font-extrabold mb-1">Drop-Proof Refill Guarantee</h3>
            <p className="text-blue-100 text-sm max-w-xl">
              On every platform, every paid tier above Test Drive: if your numbers drop within
              the guarantee period, we top them back up — free, no questions asked.
            </p>
          </div>
          <div className="md:ml-auto flex-shrink-0">
            <button onClick={() => scrollTo("pricing")}
              className="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition whitespace-nowrap">
              See Packages
            </button>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">5-Tier Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              Choose Your Platform
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Start with KES 249 to test the system. Scale up to Bazuu status when you&apos;re ready.
            </p>
          </div>

          {/* Platform Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => setActivePlatform(p.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border-2 transition
                  ${activePlatform === p.id
                    ? "bg-blue-600 text-white border-transparent shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>
                <span>{p.icon}</span> {p.label}
              </button>
            ))}
          </div>

          {/* Active platform heading */}
          <p className="text-center text-xl font-extrabold text-gray-800 mb-8">
            {currentPlatform.icon} {currentPlatform.label} Packages
          </p>

          {/* 5 Cards — vertical on mobile, 2-col on md, 3+2 on lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TIERS.slice(0, 3).map(tier => (
              <PricingCard key={tier.id} tier={tier} platform={activePlatform}
                onSelect={() => setOrder({ tier, platform: activePlatform })} />
            ))}
          </div>
          {/* Bottom row: Influencer + Bazuu centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 lg:max-w-[calc(66.666%+10px)] lg:mx-auto xl:max-w-none xl:grid-cols-2">
            {TIERS.slice(3).map(tier => (
              <PricingCard key={tier.id} tier={tier} platform={activePlatform}
                onSelect={() => setOrder({ tier, platform: activePlatform })} />
            ))}
          </div>

          {/* Upsell nudge */}
          <p className="text-center text-sm text-gray-400 mt-8">
            💡 <strong className="text-gray-600">Pro tip:</strong> Order Test Drive first. Once you see the followers land, come back for Legit or Bazuu.
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
              <summary className="flex justify-between items-center font-semibold text-gray-900 list-none">
                {item.q}
                <span className="text-blue-600 text-xl transition-transform group-open:rotate-45 flex-shrink-0 ml-4">+</span>
              </summary>
              <p className="mt-3 text-gray-500 text-sm leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <span className="font-extrabold text-white text-lg">
            <span className="text-blue-400">Inn</span>Bucks
          </span>
          <p>© {new Date().getFullYear()} InnBucks. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="https://wa.me/254700000000" className="hover:text-white transition">WhatsApp</a>
          </div>
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
