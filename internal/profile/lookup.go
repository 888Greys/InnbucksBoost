package profile

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"
	"time"
)

type Info struct {
	Platform   string `json:"platform"`
	Username   string `json:"username"`
	Name       string `json:"name"`
	Bio        string `json:"bio"`
	Followers  string `json:"followers"`
	ProfileURL string `json:"profile_url"`
	AvatarURL  string `json:"avatar_url"`
	Found      bool   `json:"found"`
	IsPrivate  bool   `json:"is_private"`
}

var httpClient = &http.Client{
	Timeout: 10 * time.Second,
	CheckRedirect: func(req *http.Request, via []*http.Request) error {
		if len(via) >= 3 {
			return http.ErrUseLastResponse
		}
		return nil
	},
}

func ProfileURL(platform, username string) string {
	username = strings.TrimPrefix(strings.TrimSpace(username), "@")
	switch platform {
	case "tiktok":
		return "https://www.tiktok.com/@" + username
	case "instagram":
		return "https://www.instagram.com/" + username + "/"
	case "youtube":
		return "https://www.youtube.com/@" + username
	default:
		return ""
	}
}

func Lookup(platform, username string) (*Info, error) {
	username = strings.TrimPrefix(strings.TrimSpace(username), "@")
	profileURL := ProfileURL(platform, username)
	if profileURL == "" {
		return nil, fmt.Errorf("unsupported platform: %s", platform)
	}

	base := &Info{Platform: platform, Username: username, ProfileURL: profileURL}

	body, err := fetchPage(profileURL)
	if err != nil {
		return base, nil
	}

	switch platform {
	case "tiktok":
		return parseTikTok(base, body), nil
	case "instagram":
		return parseInstagram(base, body), nil
	default:
		return parseGenericOG(base, body, platform), nil
	}
}

func fetchPage(url string) (string, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36")
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
	req.Header.Set("Accept-Language", "en-US,en;q=0.9")
	req.Header.Set("Cache-Control", "no-cache")

	resp, err := httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode == 404 {
		return "", fmt.Errorf("404")
	}

	b, _ := io.ReadAll(io.LimitReader(resp.Body, 512*1024))
	return string(b), nil
}

var (
	reUniversalData = regexp.MustCompile(`(?s)<script[^>]+id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>\s*(\{.+?)\s*</script>`)
	reSIGIState     = regexp.MustCompile(`(?s)window\[['"]SIGI_STATE['"]\]\s*=\s*(\{.+?});\s*window\[`)

	reTTFollowerCount = regexp.MustCompile(`"followerCount"\s*:\s*(\d+)`)
	reTTNickname      = regexp.MustCompile(`"nickname"\s*:\s*"((?:[^"\\]|\\.)*)"`)
	reTTSignature     = regexp.MustCompile(`"signature"\s*:\s*"((?:[^"\\]|\\.)*)"`)
	reTTPrivate       = regexp.MustCompile(`"privateAccount"\s*:\s*(true|false)`)
	reTTAvatarLarger  = regexp.MustCompile(`"avatarLarger"\s*:\s*"(https://[^"]+)"`)
)

func parseTikTok(base *Info, html string) *Info {
	var jsonBlob string
	if m := reUniversalData.FindStringSubmatch(html); len(m) > 1 {
		jsonBlob = m[1]
	} else if m := reSIGIState.FindStringSubmatch(html); len(m) > 1 {
		jsonBlob = m[1]
	}

	if jsonBlob != "" {
		if m := reTTPrivate.FindStringSubmatch(jsonBlob); len(m) > 1 && m[1] == "true" {
			base.IsPrivate = true
			base.Found = false
			if m2 := reTTNickname.FindStringSubmatch(jsonBlob); len(m2) > 1 {
				base.Name = jsonUnescape(m2[1])
			}
			return base
		}

		if m := reTTNickname.FindStringSubmatch(jsonBlob); len(m) > 1 {
			base.Name = jsonUnescape(m[1])
		}
		if m := reTTSignature.FindStringSubmatch(jsonBlob); len(m) > 1 {
			base.Bio = truncate(jsonUnescape(m[1]), 120)
		}
		if m := reTTAvatarLarger.FindStringSubmatch(jsonBlob); len(m) > 1 {
			base.AvatarURL = strings.ReplaceAll(m[1], `\/`, `/`)
		}
		if m := reTTFollowerCount.FindStringSubmatch(jsonBlob); len(m) > 1 {
			base.Followers = formatFollowers(m[1]) + " followers"
		}

		base.Found = base.Name != "" && base.Name != base.Username
		return base
	}

	return parseGenericOG(base, html, "tiktok")
}

var (
	reIGPrivate   = regexp.MustCompile(`(?i)"is_private"\s*:\s*true|This Account is Private|this account is private`)
	reIGFollowers = regexp.MustCompile(`(?i)([\d,\.]+[KkMmBb]?)\s*Followers`)
)

func parseInstagram(base *Info, html string) *Info {
	if reIGPrivate.MatchString(html) {
		base.IsPrivate = true
		base.Found = false
		if name := extractOG(html, "title"); name != "" {
			if i := strings.Index(name, " •"); i > 0 {
				name = name[:i]
			}
			base.Name = strings.TrimPrefix(name, "@")
		}
		return base
	}

	name := extractOG(html, "title")
	if i := strings.Index(name, " •"); i > 0 {
		name = name[:i]
	}
	base.Name = strings.TrimPrefix(htmlUnescape(name), "@")
	base.AvatarURL = extractOG(html, "image")

	desc := extractOG(html, "description")
	if m := reIGFollowers.FindStringSubmatch(desc); len(m) > 1 {
		base.Followers = m[1] + " followers"
	}

	if idx := strings.Index(desc, " - "); idx > 0 {
		base.Bio = truncate(htmlUnescape(desc[idx+3:]), 120)
	} else {
		base.Bio = truncate(htmlUnescape(desc), 120)
	}

	base.Found = base.Name != "" && base.Name != base.Username && base.AvatarURL != ""
	return base
}

func parseGenericOG(base *Info, html, platform string) *Info {
	name := extractOG(html, "title")
	desc := extractOG(html, "description")
	avatar := extractOG(html, "image")

	switch platform {
	case "youtube":
		name = strings.TrimSuffix(name, " - YouTube")
	case "tiktok":
		if i := strings.Index(name, " | TikTok"); i > 0 {
			name = name[:i]
		}
		if i := strings.Index(name, " (@"); i > 0 {
			name = name[:i]
		}
		if m := reTTFollowerCount.FindStringSubmatch(html); len(m) > 1 {
			base.Followers = formatFollowers(m[1]) + " followers"
		}
	}

	if base.Followers == "" {
		base.Followers = extractFollowers(platform, desc)
	}

	base.Name = htmlUnescape(name)
	base.Bio = truncate(htmlUnescape(desc), 120)
	base.AvatarURL = avatar
	base.Found = name != "" && name != base.Username && avatar != ""
	return base
}

var (
	rePropFirst    = regexp.MustCompile(`(?i)<meta[^>]+property=["']og:([^"']+)["'][^>]+content=["']([^"']*?)["']`)
	reContentFirst = regexp.MustCompile(`(?i)<meta[^>]+content=["']([^"']*?)["'][^>]+property=["']og:([^"']+)["']`)
	reYTSubs       = regexp.MustCompile(`(?i)([\d,\.]+[KkMmBb]?)\s*[Ss]ubscribers?`)
	reGenFollowers = regexp.MustCompile(`(?i)([\d,\.]+[KkMmBb]?)\s*Followers`)
)

func extractOG(html, prop string) string {
	for _, m := range rePropFirst.FindAllStringSubmatch(html, -1) {
		if strings.EqualFold(m[1], prop) {
			return htmlUnescape(m[2])
		}
	}
	for _, m := range reContentFirst.FindAllStringSubmatch(html, -1) {
		if strings.EqualFold(m[2], prop) {
			return htmlUnescape(m[1])
		}
	}
	return ""
}

func extractFollowers(platform, desc string) string {
	switch platform {
	case "youtube":
		if m := reYTSubs.FindStringSubmatch(desc); len(m) > 1 {
			return m[1] + " subscribers"
		}
	default:
		if m := reGenFollowers.FindStringSubmatch(desc); len(m) > 1 {
			return m[1] + " followers"
		}
	}
	return ""
}

func formatFollowers(raw string) string {
	var n int64
	if err := json.Unmarshal([]byte(raw), &n); err != nil {
		return raw
	}
	switch {
	case n >= 1_000_000:
		return fmt.Sprintf("%.1fM", float64(n)/1_000_000)
	case n >= 1_000:
		return fmt.Sprintf("%.1fK", float64(n)/1_000)
	default:
		return fmt.Sprintf("%d", n)
	}
}

func htmlUnescape(s string) string {
	r := strings.NewReplacer(
		"&#39;", "'", "&amp;", "&", "&quot;", `"`,
		"&lt;", "<", "&gt;", ">", "&#x27;", "'", "&#x2F;", "/",
	)
	return r.Replace(s)
}

func jsonUnescape(s string) string {
	var out string
	if err := json.Unmarshal([]byte(`"`+s+`"`), &out); err != nil {
		return htmlUnescape(s)
	}
	return out
}

func truncate(s string, n int) string {
	if len([]rune(s)) <= n {
		return s
	}
	return string([]rune(s)[:n]) + "…"
}
