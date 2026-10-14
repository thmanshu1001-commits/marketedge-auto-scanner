# MarketEdge Auto Scanner (beta)

## Important deployment change
This version needs a Netlify Function to fetch daily candles. A simple Netlify Drop upload of only the `public` folder will NOT deploy the function. Deploy the full project through GitHub connected to Netlify, or using Netlify CLI.

## Easiest path: GitHub + Netlify
1. Create a GitHub repository and upload all files/folders from this ZIP (keep `netlify/functions/candles.js`, `netlify.toml`, and `public/index.html`).
2. In Netlify choose Add new project / Import an existing project, connect that GitHub repository, and deploy.
3. Build settings should use publish directory `public`; functions directory `netlify/functions` (netlify.toml configures these).
4. Open the deployed site and press Fetch last 3 months.

## Data and limitations
- The function requests daily OHLCV from Yahoo Finance's unofficial chart endpoint for tickers such as RELIANCE.NS.
- This is not an official NSE API and can be rate-limited, blocked, incomplete, or change without notice. No guarantee of real-time data.
- Default symbols are a small starter list, not the full F&O universe. Edit the symbol list to scan other tickers.
- The algorithm is a rough interpretation of the stated rules, not calibrated to your reference screenshots.
- It excludes the current India-local date; latest returned completed candle is used.
- Not investment advice. Verify matches manually.
