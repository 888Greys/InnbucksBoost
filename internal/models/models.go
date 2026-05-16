package models

import "time"

type OrderStatus string

const (
	StatusPending    OrderStatus = "pending"
	StatusProcessing OrderStatus = "processing"
	StatusCompleted  OrderStatus = "completed"
	StatusPartial    OrderStatus = "partial"
	StatusCancelled  OrderStatus = "cancelled"
	StatusFailed     OrderStatus = "failed"
)

type Platform string

const (
	PlatformTikTok    Platform = "tiktok"
	PlatformInstagram Platform = "instagram"
	PlatformYouTube   Platform = "youtube"
	PlatformFacebook  Platform = "facebook"
	PlatformTwitter   Platform = "twitter"
	PlatformTelegram  Platform = "telegram"
	PlatformSpotify   Platform = "spotify"
)

type Package struct {
	ID          string
	Name        string
	Platform    Platform
	Category    string
	PriceKES    int
	MarginKES   int
	Refillable  bool
	Description string
	Components  []PackageComponent
}

type DailyStats struct {
	Lines            []PackageStatLine
	PendingOrders    int
	ProcessingOrders int
	CompletedOrders  int
	TotalOrders      int
}

type PackageStatLine struct {
	PackageID  string
	OrderCount int
	RevenueKES int
}

type PackageComponent struct {
	ServiceID int
	Quantity  int
	Runs      int
	Interval  int
}

type Order struct {
	ID          int64
	PublicID    string
	ClientID    int64
	PackageID   string
	ProfileLink string
	TotalKES    int
	Status      OrderStatus
	WizOrderIDs []int64
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type Client struct {
	ID         int64
	TelegramID int64
	Username   string
	Phone      string
	CreatedAt  time.Time
}

type Transaction struct {
	ID          int64
	OrderID     int64
	AmountKES   int
	MpesaRef    string
	Confirmed   bool
	ConfirmedBy int64
	ConfirmedAt *time.Time
	CreatedAt   time.Time
}

type RefillRecord struct {
	ID          int64
	OrderID     int64
	WizOrderID  int64
	WizRefillID int64
	Status      string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
