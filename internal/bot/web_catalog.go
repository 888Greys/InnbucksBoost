package bot

import "github.com/aapom/innbucks/internal/models"

func init() {
	webPackages := []models.Package{
		// ── Facebook ─────────────────────────────────────────────────────────────
		{ID: "facebook_web_test", Name: "Facebook Test Drive", Platform: models.PlatformFacebook, Category: "facebook", PriceKES: 249, MarginKES: 174, Refillable: false, Description: "1,000 Page Followers", Components: []models.PackageComponent{{ServiceID: 9061, Quantity: 1000}}},
		{ID: "facebook_web_starter", Name: "Facebook Starter Boost", Platform: models.PlatformFacebook, Category: "facebook", PriceKES: 699, MarginKES: 489, Refillable: true, Description: "3,000 Page Followers", Components: []models.PackageComponent{{ServiceID: 9061, Quantity: 3000}}},
		{ID: "facebook_web_legit", Name: "Facebook Legit Profile", Platform: models.PlatformFacebook, Category: "facebook", PriceKES: 1299, MarginKES: 909, Refillable: true, Description: "6,000 Page Followers", Components: []models.PackageComponent{{ServiceID: 9061, Quantity: 6000}}},
		{ID: "facebook_web_influencer", Name: "Facebook Influencer Status", Platform: models.PlatformFacebook, Category: "facebook", PriceKES: 2499, MarginKES: 1749, Refillable: true, Description: "12,000 Page Followers", Components: []models.PackageComponent{{ServiceID: 5798, Quantity: 12000}}},
		{ID: "facebook_web_bazuu", Name: "Facebook Bazuu VIP", Platform: models.PlatformFacebook, Category: "facebook", PriceKES: 4999, MarginKES: 3499, Refillable: true, Description: "25,000 Page Followers", Components: []models.PackageComponent{{ServiceID: 5798, Quantity: 25000}}},

		// ── Instagram ────────────────────────────────────────────────────────────
		{ID: "instagram_web_test", Name: "Instagram Test Drive", Platform: models.PlatformInstagram, Category: "instagram", PriceKES: 249, MarginKES: 174, Refillable: false, Description: "10,000 Reel Views", Components: []models.PackageComponent{{ServiceID: 7403, Quantity: 10000}}},
		{ID: "instagram_web_starter", Name: "Instagram Starter Boost", Platform: models.PlatformInstagram, Category: "instagram", PriceKES: 699, MarginKES: 489, Refillable: true, Description: "40,000 Reel Views", Components: []models.PackageComponent{{ServiceID: 7403, Quantity: 40000}}},
		{ID: "instagram_web_legit", Name: "Instagram Legit Profile", Platform: models.PlatformInstagram, Category: "instagram", PriceKES: 1299, MarginKES: 909, Refillable: true, Description: "100,000 Reel Views", Components: []models.PackageComponent{{ServiceID: 7403, Quantity: 100000}}},
		{ID: "instagram_web_influencer", Name: "Instagram Influencer Status", Platform: models.PlatformInstagram, Category: "instagram", PriceKES: 2499, MarginKES: 1749, Refillable: true, Description: "250,000 Reel Views", Components: []models.PackageComponent{{ServiceID: 7403, Quantity: 250000}}},
		{ID: "instagram_web_bazuu", Name: "Instagram Bazuu VIP", Platform: models.PlatformInstagram, Category: "instagram", PriceKES: 4999, MarginKES: 3499, Refillable: true, Description: "600,000 Reel Views", Components: []models.PackageComponent{{ServiceID: 7403, Quantity: 600000}}},

		// ── TikTok ───────────────────────────────────────────────────────────────
		{ID: "tiktok_web_test", Name: "TikTok Test Drive", Platform: models.PlatformTikTok, Category: "tiktok", PriceKES: 249, MarginKES: 174, Refillable: false, Description: "10,000 Video Views", Components: []models.PackageComponent{{ServiceID: 4645, Quantity: 10000}}},
		{ID: "tiktok_web_starter", Name: "TikTok Starter Boost", Platform: models.PlatformTikTok, Category: "tiktok", PriceKES: 699, MarginKES: 489, Refillable: true, Description: "40,000 Video Views", Components: []models.PackageComponent{{ServiceID: 4645, Quantity: 40000}}},
		{ID: "tiktok_web_legit", Name: "TikTok Legit Profile", Platform: models.PlatformTikTok, Category: "tiktok", PriceKES: 1299, MarginKES: 909, Refillable: true, Description: "100,000 Video Views", Components: []models.PackageComponent{{ServiceID: 4645, Quantity: 100000}}},
		{ID: "tiktok_web_influencer", Name: "TikTok Influencer Status", Platform: models.PlatformTikTok, Category: "tiktok", PriceKES: 2499, MarginKES: 1749, Refillable: true, Description: "300,000 Video Views", Components: []models.PackageComponent{{ServiceID: 4645, Quantity: 300000}}},
		{ID: "tiktok_web_bazuu", Name: "TikTok Bazuu VIP", Platform: models.PlatformTikTok, Category: "tiktok", PriceKES: 4999, MarginKES: 3499, Refillable: true, Description: "700,000 Video Views", Components: []models.PackageComponent{{ServiceID: 4645, Quantity: 700000}}},

		// ── YouTube ───────────────────────────────────────────────────────────────
		{ID: "youtube_web_test", Name: "YouTube Test Drive", Platform: models.PlatformYouTube, Category: "youtube", PriceKES: 249, MarginKES: 174, Refillable: false, Description: "2,000 Video Views", Components: []models.PackageComponent{{ServiceID: 7759, Quantity: 2000}}},
		{ID: "youtube_web_starter", Name: "YouTube Starter Boost", Platform: models.PlatformYouTube, Category: "youtube", PriceKES: 699, MarginKES: 489, Refillable: true, Description: "8,000 Video Views", Components: []models.PackageComponent{{ServiceID: 7759, Quantity: 8000}}},
		{ID: "youtube_web_legit", Name: "YouTube Legit Profile", Platform: models.PlatformYouTube, Category: "youtube", PriceKES: 1299, MarginKES: 909, Refillable: true, Description: "20,000 Video Views", Components: []models.PackageComponent{{ServiceID: 7759, Quantity: 20000}}},
		{ID: "youtube_web_influencer", Name: "YouTube Influencer Status", Platform: models.PlatformYouTube, Category: "youtube", PriceKES: 2499, MarginKES: 1749, Refillable: true, Description: "50,000 Video Views", Components: []models.PackageComponent{{ServiceID: 7759, Quantity: 50000}}},
		{ID: "youtube_web_bazuu", Name: "YouTube Bazuu VIP", Platform: models.PlatformYouTube, Category: "youtube", PriceKES: 4999, MarginKES: 3499, Refillable: true, Description: "120,000 Video Views", Components: []models.PackageComponent{{ServiceID: 7759, Quantity: 120000}}},

		// ── Twitter/X ────────────────────────────────────────────────────────────
		{ID: "twitter_web_test", Name: "X/Twitter Test Drive", Platform: models.PlatformTwitter, Category: "twitter", PriceKES: 249, MarginKES: 174, Refillable: false, Description: "5,000 Tweet Views", Components: []models.PackageComponent{{ServiceID: 9527, Quantity: 5000}}},
		{ID: "twitter_web_starter", Name: "X/Twitter Starter Boost", Platform: models.PlatformTwitter, Category: "twitter", PriceKES: 699, MarginKES: 489, Refillable: true, Description: "20,000 Tweet Views", Components: []models.PackageComponent{{ServiceID: 9527, Quantity: 20000}}},
		{ID: "twitter_web_legit", Name: "X/Twitter Legit Profile", Platform: models.PlatformTwitter, Category: "twitter", PriceKES: 1299, MarginKES: 909, Refillable: true, Description: "60,000 Tweet Views", Components: []models.PackageComponent{{ServiceID: 9527, Quantity: 60000}}},
		{ID: "twitter_web_influencer", Name: "X/Twitter Influencer Status", Platform: models.PlatformTwitter, Category: "twitter", PriceKES: 2499, MarginKES: 1749, Refillable: true, Description: "150,000 Tweet Views", Components: []models.PackageComponent{{ServiceID: 9527, Quantity: 150000}}},
		{ID: "twitter_web_bazuu", Name: "X/Twitter Bazuu VIP", Platform: models.PlatformTwitter, Category: "twitter", PriceKES: 4999, MarginKES: 3499, Refillable: true, Description: "400,000 Tweet Views", Components: []models.PackageComponent{{ServiceID: 9527, Quantity: 400000}}},

		// ── Telegram ─────────────────────────────────────────────────────────────
		{ID: "telegram_web_test", Name: "Telegram Test Drive", Platform: models.PlatformTelegram, Category: "telegram", PriceKES: 249, MarginKES: 174, Refillable: false, Description: "500 Channel Members", Components: []models.PackageComponent{{ServiceID: 8136, Quantity: 500}}},
		{ID: "telegram_web_starter", Name: "Telegram Starter Boost", Platform: models.PlatformTelegram, Category: "telegram", PriceKES: 699, MarginKES: 489, Refillable: true, Description: "1,500 Channel Members", Components: []models.PackageComponent{{ServiceID: 8136, Quantity: 1500}}},
		{ID: "telegram_web_legit", Name: "Telegram Legit Profile", Platform: models.PlatformTelegram, Category: "telegram", PriceKES: 1299, MarginKES: 909, Refillable: true, Description: "4,000 Channel Members", Components: []models.PackageComponent{{ServiceID: 8136, Quantity: 4000}}},
		{ID: "telegram_web_influencer", Name: "Telegram Influencer Status", Platform: models.PlatformTelegram, Category: "telegram", PriceKES: 2499, MarginKES: 1749, Refillable: true, Description: "8,000 Channel Members", Components: []models.PackageComponent{{ServiceID: 8136, Quantity: 8000}}},
		{ID: "telegram_web_bazuu", Name: "Telegram Bazuu VIP", Platform: models.PlatformTelegram, Category: "telegram", PriceKES: 4999, MarginKES: 3499, Refillable: true, Description: "20,000 Channel Members", Components: []models.PackageComponent{{ServiceID: 8136, Quantity: 20000}}},

		// ── Spotify ───────────────────────────────────────────────────────────────
		{ID: "spotify_web_test", Name: "Spotify Test Drive", Platform: models.PlatformSpotify, Category: "spotify", PriceKES: 249, MarginKES: 174, Refillable: false, Description: "5,000 Plays", Components: []models.PackageComponent{{ServiceID: 3541, Quantity: 5000}}},
		{ID: "spotify_web_starter", Name: "Spotify Starter Boost", Platform: models.PlatformSpotify, Category: "spotify", PriceKES: 699, MarginKES: 489, Refillable: true, Description: "20,000 Plays", Components: []models.PackageComponent{{ServiceID: 3541, Quantity: 20000}}},
		{ID: "spotify_web_legit", Name: "Spotify Legit Profile", Platform: models.PlatformSpotify, Category: "spotify", PriceKES: 1299, MarginKES: 909, Refillable: true, Description: "60,000 Plays", Components: []models.PackageComponent{{ServiceID: 3541, Quantity: 60000}}},
		{ID: "spotify_web_influencer", Name: "Spotify Influencer Status", Platform: models.PlatformSpotify, Category: "spotify", PriceKES: 2499, MarginKES: 1749, Refillable: true, Description: "150,000 Plays", Components: []models.PackageComponent{{ServiceID: 3541, Quantity: 150000}}},
		{ID: "spotify_web_bazuu", Name: "Spotify Bazuu VIP", Platform: models.PlatformSpotify, Category: "spotify", PriceKES: 4999, MarginKES: 3499, Refillable: true, Description: "400,000 Plays", Components: []models.PackageComponent{{ServiceID: 3541, Quantity: 400000}}},
	}
	Catalog = append(Catalog, webPackages...)
}
