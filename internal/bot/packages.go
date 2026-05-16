package bot

import (
	"strings"

	"github.com/aapom/innbucks/internal/models"
)

// Service IDs and wholesale rates from morethanpanel.com (USD/1000 at 130 KES/USD):
// TikTok Followers ID:5760  — $2.44 — 30 Day Refill, 5-10K/Day
// TikTok Views     ID:9121  — $0.04 — 30 Day Refill, 10-100K/Day
// TikTok Likes     ID:2699  — $0.32 — 30 Day Refill, 5-50K/Day
// IG Followers     ID:5440  — $0.35 — 30 Day Refill, 10-50K/Day
// IG Likes         ID:2916  — $0.10 — 30 Day Refill, 5-10K/Day
// YT Subscribers   ID:7494  — $0.70 — No Refill, 10-50K/Day
// YT Views         ID:6003  — $0.41 — Lifetime Guaranteed

var Catalog = []models.Package{
	{
		ID: "test_ksh1", Name: "Test Package",
		Platform: models.PlatformTikTok, Category: "tiktok",
		PriceKES: 1, MarginKES: 1,
		Description: "Test order — KES 1 only",
		Components:  []models.PackageComponent{{ServiceID: 9121, Quantity: 100}},
	},

	// ── TikTok ───────────────────────────────────────────────────────────────
	{
		ID: "tiktok_flex", Name: "TikTok Quick-Start",
		Platform: models.PlatformTikTok, Category: "tiktok",
		PriceKES: 500, MarginKES: 331, Refillable: true,
		Description: "500 Real Followers + 2,000 Views",
		Components: []models.PackageComponent{
			{ServiceID: 5760, Quantity: 500},
			{ServiceID: 9121, Quantity: 2000},
		},
	},
	{
		ID: "tiktok_starter", Name: "TikTok Starter",
		Platform: models.PlatformTikTok, Category: "tiktok",
		PriceKES: 1000, MarginKES: 589, Refillable: true,
		Description: "1,200 Followers + 5,000 Views + 100 Likes",
		Components: []models.PackageComponent{
			{ServiceID: 5760, Quantity: 1200},
			{ServiceID: 9121, Quantity: 5000},
			{ServiceID: 2699, Quantity: 100},
		},
	},
	{
		ID: "tiktok_viral_starter", Name: "TikTok Viral Starter",
		Platform: models.PlatformTikTok, Category: "tiktok",
		PriceKES: 1500, MarginKES: 831, Refillable: true,
		Description: "2,000 Followers + 5,000 Views + 200 Likes",
		Components: []models.PackageComponent{
			{ServiceID: 5760, Quantity: 2000},
			{ServiceID: 9121, Quantity: 5000},
			{ServiceID: 2699, Quantity: 200},
		},
	},

	// ── Instagram ─────────────────────────────────────────────────────────────
	{
		ID: "ig_quick_start", Name: "IG Quick-Start",
		Platform: models.PlatformInstagram, Category: "instagram",
		PriceKES: 500, MarginKES: 476, Refillable: true,
		Description: "500 Real Followers + 100 Likes",
		Components: []models.PackageComponent{
			{ServiceID: 5440, Quantity: 500},
			{ServiceID: 2916, Quantity: 100},
		},
	},
	{
		ID: "ig_business_boost", Name: "IG Business Boost",
		Platform: models.PlatformInstagram, Category: "instagram",
		PriceKES: 800, MarginKES: 751, Refillable: true,
		Description: "1,000 Followers + 300 Likes",
		Components: []models.PackageComponent{
			{ServiceID: 5440, Quantity: 1000},
			{ServiceID: 2916, Quantity: 300},
		},
	},
	{
		ID: "follower_booster", Name: "Follower Booster",
		Platform: models.PlatformInstagram, Category: "instagram",
		PriceKES: 600, MarginKES: 555, Refillable: true,
		Description: "1,000 Followers + 30-day Refill Guarantee",
		Components: []models.PackageComponent{
			{ServiceID: 5440, Quantity: 1000},
		},
	},
	{
		ID: "ig_celebrity_pack", Name: "IG Celebrity Pack",
		Platform: models.PlatformInstagram, Category: "instagram",
		PriceKES: 2500, MarginKES: 2260, Refillable: true,
		Description: "5,000 Followers + 1,000 Likes (5-day drip delivery)",
		Components: []models.PackageComponent{
			{ServiceID: 5440, Quantity: 5000, Runs: 5, Interval: 1440},
			{ServiceID: 2916, Quantity: 1000},
		},
	},

	// ── YouTube ───────────────────────────────────────────────────────────────
	{
		ID: "youtube_kickstart", Name: "YouTube Kickstart",
		Platform: models.PlatformYouTube, Category: "youtube",
		PriceKES: 1500, MarginKES: 1419,
		Description: "300 Subscribers + 1,000 Views",
		Components: []models.PackageComponent{
			{ServiceID: 7494, Quantity: 300},
			{ServiceID: 6003, Quantity: 1000},
		},
	},

	// ── Combo Deals ───────────────────────────────────────────────────────────
	{
		ID: "viral_creator_combo", Name: "Viral Creator Combo",
		Platform: models.PlatformTikTok, Category: "combo",
		PriceKES: 2500, MarginKES: 1476, Refillable: true,
		Description: "3,000 TikTok Followers + 10,000 Views + 500 Likes (drip-fed for safety)",
		Components: []models.PackageComponent{
			{ServiceID: 5760, Quantity: 3000, Runs: 6, Interval: 1440},
			{ServiceID: 9121, Quantity: 10000},
			{ServiceID: 2699, Quantity: 500},
		},
	},

	// ── Web Packages (7 platforms × 5 tiers) ─────────────────────────────────
	{ID: "facebook_web_test",        Name: "Facebook Test Drive",          Platform: models.PlatformFacebook,  Category: "facebook",  PriceKES: 249,  MarginKES: 174,  Refillable: false, Description: "1,000 Page Followers",    Components: []models.PackageComponent{{ServiceID: 9061, Quantity: 1000}}},
	{ID: "facebook_web_starter",     Name: "Facebook Starter Boost",       Platform: models.PlatformFacebook,  Category: "facebook",  PriceKES: 699,  MarginKES: 489,  Refillable: true,  Description: "3,000 Page Followers",    Components: []models.PackageComponent{{ServiceID: 9061, Quantity: 3000}}},
	{ID: "facebook_web_legit",       Name: "Facebook Legit Profile",       Platform: models.PlatformFacebook,  Category: "facebook",  PriceKES: 1299, MarginKES: 909,  Refillable: true,  Description: "6,000 Page Followers",    Components: []models.PackageComponent{{ServiceID: 9061, Quantity: 6000}}},
	{ID: "facebook_web_influencer",  Name: "Facebook Influencer Status",   Platform: models.PlatformFacebook,  Category: "facebook",  PriceKES: 2499, MarginKES: 1749, Refillable: true,  Description: "12,000 Page Followers",   Components: []models.PackageComponent{{ServiceID: 5798, Quantity: 12000}}},
	{ID: "facebook_web_bazuu",       Name: "Facebook Bazuu VIP",           Platform: models.PlatformFacebook,  Category: "facebook",  PriceKES: 4999, MarginKES: 3499, Refillable: true,  Description: "25,000 Page Followers",   Components: []models.PackageComponent{{ServiceID: 5798, Quantity: 25000}}},

	{ID: "instagram_web_test",       Name: "Instagram Test Drive",         Platform: models.PlatformInstagram, Category: "instagram", PriceKES: 249,  MarginKES: 174,  Refillable: false, Description: "10,000 Reel Views",       Components: []models.PackageComponent{{ServiceID: 7403, Quantity: 10000}}},
	{ID: "instagram_web_starter",    Name: "Instagram Starter Boost",      Platform: models.PlatformInstagram, Category: "instagram", PriceKES: 699,  MarginKES: 489,  Refillable: true,  Description: "40,000 Reel Views",       Components: []models.PackageComponent{{ServiceID: 7403, Quantity: 40000}}},
	{ID: "instagram_web_legit",      Name: "Instagram Legit Profile",      Platform: models.PlatformInstagram, Category: "instagram", PriceKES: 1299, MarginKES: 909,  Refillable: true,  Description: "100,000 Reel Views",      Components: []models.PackageComponent{{ServiceID: 7403, Quantity: 100000}}},
	{ID: "instagram_web_influencer", Name: "Instagram Influencer Status",  Platform: models.PlatformInstagram, Category: "instagram", PriceKES: 2499, MarginKES: 1749, Refillable: true,  Description: "250,000 Reel Views",      Components: []models.PackageComponent{{ServiceID: 7403, Quantity: 250000}}},
	{ID: "instagram_web_bazuu",      Name: "Instagram Bazuu VIP",          Platform: models.PlatformInstagram, Category: "instagram", PriceKES: 4999, MarginKES: 3499, Refillable: true,  Description: "600,000 Reel Views",      Components: []models.PackageComponent{{ServiceID: 7403, Quantity: 600000}}},

	{ID: "tiktok_web_test",          Name: "TikTok Test Drive",            Platform: models.PlatformTikTok,    Category: "tiktok",    PriceKES: 249,  MarginKES: 174,  Refillable: false, Description: "10,000 Video Views",      Components: []models.PackageComponent{{ServiceID: 4645, Quantity: 10000}}},
	{ID: "tiktok_web_starter",       Name: "TikTok Starter Boost",         Platform: models.PlatformTikTok,    Category: "tiktok",    PriceKES: 699,  MarginKES: 489,  Refillable: true,  Description: "40,000 Video Views",      Components: []models.PackageComponent{{ServiceID: 4645, Quantity: 40000}}},
	{ID: "tiktok_web_legit",         Name: "TikTok Legit Profile",         Platform: models.PlatformTikTok,    Category: "tiktok",    PriceKES: 1299, MarginKES: 909,  Refillable: true,  Description: "100,000 Video Views",     Components: []models.PackageComponent{{ServiceID: 4645, Quantity: 100000}}},
	{ID: "tiktok_web_influencer",    Name: "TikTok Influencer Status",     Platform: models.PlatformTikTok,    Category: "tiktok",    PriceKES: 2499, MarginKES: 1749, Refillable: true,  Description: "300,000 Video Views",     Components: []models.PackageComponent{{ServiceID: 4645, Quantity: 300000}}},
	{ID: "tiktok_web_bazuu",         Name: "TikTok Bazuu VIP",             Platform: models.PlatformTikTok,    Category: "tiktok",    PriceKES: 4999, MarginKES: 3499, Refillable: true,  Description: "700,000 Video Views",     Components: []models.PackageComponent{{ServiceID: 4645, Quantity: 700000}}},

	{ID: "youtube_web_test",         Name: "YouTube Test Drive",           Platform: models.PlatformYouTube,   Category: "youtube",   PriceKES: 249,  MarginKES: 174,  Refillable: false, Description: "2,000 Video Views",       Components: []models.PackageComponent{{ServiceID: 7759, Quantity: 2000}}},
	{ID: "youtube_web_starter",      Name: "YouTube Starter Boost",        Platform: models.PlatformYouTube,   Category: "youtube",   PriceKES: 699,  MarginKES: 489,  Refillable: true,  Description: "8,000 Video Views",       Components: []models.PackageComponent{{ServiceID: 7759, Quantity: 8000}}},
	{ID: "youtube_web_legit",        Name: "YouTube Legit Profile",        Platform: models.PlatformYouTube,   Category: "youtube",   PriceKES: 1299, MarginKES: 909,  Refillable: true,  Description: "20,000 Video Views",      Components: []models.PackageComponent{{ServiceID: 7759, Quantity: 20000}}},
	{ID: "youtube_web_influencer",   Name: "YouTube Influencer Status",    Platform: models.PlatformYouTube,   Category: "youtube",   PriceKES: 2499, MarginKES: 1749, Refillable: true,  Description: "50,000 Video Views",      Components: []models.PackageComponent{{ServiceID: 7759, Quantity: 50000}}},
	{ID: "youtube_web_bazuu",        Name: "YouTube Bazuu VIP",            Platform: models.PlatformYouTube,   Category: "youtube",   PriceKES: 4999, MarginKES: 3499, Refillable: true,  Description: "120,000 Video Views",     Components: []models.PackageComponent{{ServiceID: 7759, Quantity: 120000}}},

	{ID: "twitter_web_test",         Name: "X/Twitter Test Drive",         Platform: models.PlatformTwitter,   Category: "twitter",   PriceKES: 249,  MarginKES: 174,  Refillable: false, Description: "5,000 Tweet Views",       Components: []models.PackageComponent{{ServiceID: 9527, Quantity: 5000}}},
	{ID: "twitter_web_starter",      Name: "X/Twitter Starter Boost",      Platform: models.PlatformTwitter,   Category: "twitter",   PriceKES: 699,  MarginKES: 489,  Refillable: true,  Description: "20,000 Tweet Views",      Components: []models.PackageComponent{{ServiceID: 9527, Quantity: 20000}}},
	{ID: "twitter_web_legit",        Name: "X/Twitter Legit Profile",      Platform: models.PlatformTwitter,   Category: "twitter",   PriceKES: 1299, MarginKES: 909,  Refillable: true,  Description: "60,000 Tweet Views",      Components: []models.PackageComponent{{ServiceID: 9527, Quantity: 60000}}},
	{ID: "twitter_web_influencer",   Name: "X/Twitter Influencer Status",  Platform: models.PlatformTwitter,   Category: "twitter",   PriceKES: 2499, MarginKES: 1749, Refillable: true,  Description: "150,000 Tweet Views",     Components: []models.PackageComponent{{ServiceID: 9527, Quantity: 150000}}},
	{ID: "twitter_web_bazuu",        Name: "X/Twitter Bazuu VIP",          Platform: models.PlatformTwitter,   Category: "twitter",   PriceKES: 4999, MarginKES: 3499, Refillable: true,  Description: "400,000 Tweet Views",     Components: []models.PackageComponent{{ServiceID: 9527, Quantity: 400000}}},

	{ID: "telegram_web_test",        Name: "Telegram Test Drive",          Platform: models.PlatformTelegram,  Category: "telegram",  PriceKES: 249,  MarginKES: 174,  Refillable: false, Description: "500 Channel Members",     Components: []models.PackageComponent{{ServiceID: 8136, Quantity: 500}}},
	{ID: "telegram_web_starter",     Name: "Telegram Starter Boost",       Platform: models.PlatformTelegram,  Category: "telegram",  PriceKES: 699,  MarginKES: 489,  Refillable: true,  Description: "1,500 Channel Members",   Components: []models.PackageComponent{{ServiceID: 8136, Quantity: 1500}}},
	{ID: "telegram_web_legit",       Name: "Telegram Legit Profile",       Platform: models.PlatformTelegram,  Category: "telegram",  PriceKES: 1299, MarginKES: 909,  Refillable: true,  Description: "4,000 Channel Members",   Components: []models.PackageComponent{{ServiceID: 8136, Quantity: 4000}}},
	{ID: "telegram_web_influencer",  Name: "Telegram Influencer Status",   Platform: models.PlatformTelegram,  Category: "telegram",  PriceKES: 2499, MarginKES: 1749, Refillable: true,  Description: "8,000 Channel Members",   Components: []models.PackageComponent{{ServiceID: 8136, Quantity: 8000}}},
	{ID: "telegram_web_bazuu",       Name: "Telegram Bazuu VIP",           Platform: models.PlatformTelegram,  Category: "telegram",  PriceKES: 4999, MarginKES: 3499, Refillable: true,  Description: "20,000 Channel Members",  Components: []models.PackageComponent{{ServiceID: 8136, Quantity: 20000}}},

	{ID: "spotify_web_test",         Name: "Spotify Test Drive",           Platform: models.PlatformSpotify,   Category: "spotify",   PriceKES: 249,  MarginKES: 174,  Refillable: false, Description: "5,000 Plays",             Components: []models.PackageComponent{{ServiceID: 3541, Quantity: 5000}}},
	{ID: "spotify_web_starter",      Name: "Spotify Starter Boost",        Platform: models.PlatformSpotify,   Category: "spotify",   PriceKES: 699,  MarginKES: 489,  Refillable: true,  Description: "20,000 Plays",            Components: []models.PackageComponent{{ServiceID: 3541, Quantity: 20000}}},
	{ID: "spotify_web_legit",        Name: "Spotify Legit Profile",        Platform: models.PlatformSpotify,   Category: "spotify",   PriceKES: 1299, MarginKES: 909,  Refillable: true,  Description: "60,000 Plays",            Components: []models.PackageComponent{{ServiceID: 3541, Quantity: 60000}}},
	{ID: "spotify_web_influencer",   Name: "Spotify Influencer Status",    Platform: models.PlatformSpotify,   Category: "spotify",   PriceKES: 2499, MarginKES: 1749, Refillable: true,  Description: "150,000 Plays",           Components: []models.PackageComponent{{ServiceID: 3541, Quantity: 150000}}},
	{ID: "spotify_web_bazuu",        Name: "Spotify Bazuu VIP",            Platform: models.PlatformSpotify,   Category: "spotify",   PriceKES: 4999, MarginKES: 3499, Refillable: true,  Description: "400,000 Plays",           Components: []models.PackageComponent{{ServiceID: 3541, Quantity: 400000}}},
}

func CategoryPackages(category string) []models.Package {
	var result []models.Package
	for _, p := range Catalog {
		if p.Category != category {
			continue
		}
		// Only show the new web tier packages in the bot menu
		if !strings.Contains(p.ID, "_web_") {
			continue
		}
		result = append(result, p)
	}
	return result
}

func UpsellTarget(packageID string) (models.Package, bool) {
	targets := map[string]string{
		"tiktok_flex":    "tiktok_viral_starter",
		"ig_quick_start": "ig_business_boost",
	}
	targetID, ok := targets[packageID]
	if !ok {
		return models.Package{}, false
	}
	return GetPackage(targetID)
}

func RefillablePackageIDs() []string {
	var ids []string
	for _, p := range Catalog {
		if p.Refillable {
			ids = append(ids, p.ID)
		}
	}
	return ids
}

func GetPackage(id string) (models.Package, bool) {
	for _, p := range Catalog {
		if p.ID == id {
			return p, true
		}
	}
	return models.Package{}, false
}
