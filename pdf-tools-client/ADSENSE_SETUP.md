# PDF Master - AdSense Configuration

## Setup Instructions:

1. Create a `.env.local` file in the root of pdf-tools-client/
2. Copy the contents below and replace the placeholders with your actual values
3. Get your AdSense Client ID from: https://www.google.com/adsense
4. Generate Ad Slot IDs from your AdSense account after approval

```env
# Google AdSense Configuration
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX

# Ad Slot IDs (generate these after AdSense approval)
NEXT_PUBLIC_AD_SLOT_BANNER=XXXXXXXXXX
NEXT_PUBLIC_AD_SLOT_SIDEBAR=XXXXXXXXXX
NEXT_PUBLIC_AD_SLOT_INCONTENT=XXXXXXXXXX
```

## Ad Placement:

- **Banner Ads**: Homepage header, tool pages header
- **Sidebar Ads**: Tool pages sidebar (300x600)
- **In-Content Ads**: Between tool sections

## Testing:

Before AdSense approval, you can test with placeholder values. Ads won't show until approval.
