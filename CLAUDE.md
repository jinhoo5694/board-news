# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

Korean board game news aggregator that fetches Instagram posts via RSS feeds.

**Tech Stack:**
- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4

### Path Aliases

`@/*` maps to `./src/*`

### Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main news feed (Korean UI)
│   ├── layout.tsx         # Root layout (lang="ko")
│   └── api/
│       ├── posts/route.ts # GET posts from JSON storage
│       └── scrape/route.ts # POST trigger RSS fetch
├── lib/
│   ├── rss.ts             # RSS feed fetcher and parser
│   ├── channels.ts        # Parse RSS URLs from boardgame_channels.txt
│   └── posts.ts           # JSON storage utilities
├── components/
│   ├── PostCard.tsx       # Single post display
│   ├── PostFeed.tsx       # Grid of posts
│   └── ChannelFilter.tsx  # Channel filter chips
└── types/
    └── index.ts           # TypeScript interfaces
data/
└── posts.json             # Fetched posts storage
```

### Data Flow

1. `boardgame_channels.txt` contains RSS feed URLs (from rss.app)
2. `/api/scrape` (POST) fetches all RSS feeds
3. Posts saved to `data/posts.json`
4. `/api/posts` (GET) reads and returns posts
5. Main page displays posts with channel filtering

### Adding More Channels

To add more Instagram channels:
1. Go to https://rss.app and create RSS feed for the Instagram profile
2. Add the RSS feed URL to `boardgame_channels.txt`
