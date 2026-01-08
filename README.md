# n8n-nodes-bing-webmaster

This is an n8n community node that integrates with **Bing Webmaster Tools API** for SEO monitoring, backlinks analysis, keyword tracking, and rankings analysis.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Features

This node provides complete access to the Bing Webmaster Tools API:

### Site Management
- Get all verified sites
- Verify connection status

### Traffic & Rankings
- Get daily traffic and ranking statistics
- Get search query statistics

### Crawl Analysis (API Exclusive Data)
- Get Bingbot crawl statistics (not available in web interface!)
- Get crawl issues and errors

### Backlinks Analysis
- Get backlinks for site or specific pages
- Get total backlink counts

### Keyword Analysis
- Get historical keyword statistics

### Page Analysis
- Get page statistics
- Get URL indexation info

### URL Submission
- Submit single URL for indexing
- Submit batch URLs for indexing (up to 10,000 per day)

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-bing-webmaster` in the input field
4. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-bing-webmaster
```

## Credentials

You need a Bing Webmaster Tools API key:

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Verify your website
3. Go to **Settings > API Access**
4. Accept the Terms and Conditions
5. Click **Generate** to create your API key

In n8n:
1. Go to **Credentials**
2. Create new **Bing Webmaster Tools API** credentials
3. Enter your API Key and Site URL

## Usage Examples

### Get Traffic Statistics

1. Add the **Bing Webmaster** node
2. Select **Traffic** resource
3. Select **Get Rank and Traffic Stats** operation
4. Execute to get daily impressions, clicks, and average position

### Analyze Backlinks

1. Add the **Bing Webmaster** node
2. Select **Backlink** resource
3. Select **Get URL Links** operation
4. Optionally enter a specific page URL
5. Execute to get backlink data

### Submit URLs for Indexing

1. Add the **Bing Webmaster** node
2. Select **URL Submission** resource
3. Select **Submit URL Batch** operation
4. Enter URLs (one per line)
5. Execute to submit for indexing

## Resources

* [Bing Webmaster Tools API Documentation](https://learn.microsoft.com/en-us/bingwebmaster/)
* [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## Compatibility

- n8n version 1.0.0 or later
- Node.js 18.x or later

## License

[MIT](LICENSE)

## Author

[tete-cordobes](https://github.com/tete-cordobes)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
