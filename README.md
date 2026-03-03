# Prem Saktheesh - Personal Executive Website

A production-ready personal executive website built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. This website showcases professional achievements, projects, and blog posts for an AI & Cloud Transformation Leader.

## Features

- **Blog System**: Markdown-based blog with frontmatter parsing using gray-matter
- **GitHub Integration**: Fetches and displays GitHub repositories with featured project highlighting
- **Dark Theme**: Executive-focused dark theme design
- **SEO Optimized**: Comprehensive metadata, OpenGraph tags, Twitter Cards, and structured data (JSON-LD)
- **Sitemap & Robots.txt**: Automatically generated sitemap.xml and robots.txt for search engines
- **RSS Feed**: Blog RSS feed at `/feed.xml` for subscribers
- **Social Sharing**: Built-in social share buttons for blog posts (Twitter, LinkedIn, Facebook)
- **Performance**: Server components, ISR (Incremental Static Regeneration) with 1-hour revalidation
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Markdown Processing**: gray-matter, remark, remark-html
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prem-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and configure:
```
# Required: Your site URL (for sitemap, RSS feed, and social sharing)
NEXT_PUBLIC_SITE_URL=https://prems.in

# Optional: GitHub token (recommended to avoid rate limiting)
GITHUB_TOKEN=your_github_token_here
```

**Notes**:
- `NEXT_PUBLIC_SITE_URL`: Update this with your actual domain when deploying. Used for sitemap, RSS feed, and social sharing metadata.
- `GITHUB_TOKEN`: Optional but recommended. Create a personal access token at https://github.com/settings/tokens

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
prem-website/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with SEO metadata
│   ├── page.tsx           # Homepage
│   ├── about/             # About page
│   ├── projects/           # Projects page (GitHub repos)
│   └── blog/              # Blog pages
│       ├── page.tsx       # Blog listing
│       └── [slug]/        # Individual blog posts
├── components/            # React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Section.tsx
│   ├── ProjectCard.tsx
│   └── BlogCard.tsx
├── lib/                   # Utility functions
│   ├── posts.ts          # Blog post utilities
│   └── github.ts         # GitHub API client
├── content/               # Content files
│   └── blog/             # Markdown blog posts
└── public/               # Static assets
```

## Blog Posts

Blog posts are stored in `/content/blog` as Markdown files with frontmatter:

```markdown
---
title: "Your Post Title"
date: "2024-01-15"
slug: "your-post-slug"
---

Your markdown content here...
```

Required frontmatter fields:
- `title`: Post title
- `date`: Publication date (ISO format: YYYY-MM-DD)
- `slug`: URL slug (should match filename without .md extension)

## GitHub Integration

The projects page fetches repositories from:
- `https://api.github.com/users/premcool/repos`

The repository named "ai-coder-buddy" is automatically featured. To change the featured repository, update the `getFeaturedRepo()` function in `lib/github.ts`.

## ISR (Incremental Static Regeneration)

All dynamic pages use ISR with a revalidation period of 3600 seconds (1 hour):
- Blog listing page
- Individual blog posts
- Projects page

This ensures content stays fresh while maintaining excellent performance.

## SEO & Social Features

### Sitemap
- Automatically generated at `/sitemap.xml`
- Includes all static pages and blog posts
- Updates automatically when new blog posts are added

### RSS Feed
- Available at `/feed.xml`
- Includes all blog posts with descriptions
- Ready for RSS readers and feed aggregators

### Structured Data (JSON-LD)
- Person schema for author information
- Website schema for site metadata
- Blog schema for blog posts
- Helps search engines understand your content

### Social Sharing
- Twitter Cards configured for rich previews
- Open Graph tags for Facebook/LinkedIn sharing
- Social share buttons on blog posts
- Customizable social media profiles in structured data

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SITE_URL` | Your website URL (for sitemap, RSS, social sharing) | Yes |
| `GITHUB_TOKEN` | GitHub personal access token for API requests | No (recommended) |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add `GITHUB_TOKEN` to environment variables
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

Make sure to:
1. Set `GITHUB_TOKEN` environment variable
2. Run `npm run build` during build process
3. Use `npm start` for production server

## Customization

### Styling

The dark theme uses Tailwind CSS with custom colors defined in `tailwind.config.ts`. The primary background color is `#0f172a` (slate-900).

### Content

- **Homepage**: Edit `app/page.tsx` to update hero text and sections
- **About Page**: Edit `app/about/page.tsx` to update your bio and achievements
- **Blog Posts**: Add markdown files to `content/blog/`
- **Projects**: Automatically pulled from GitHub, or modify `lib/github.ts` to use a different source

## Performance

- Server components used throughout for optimal performance
- No client-side data fetching
- ISR ensures fast page loads with fresh content
- Optimized images and assets

## License

This project is private and proprietary.

## Contact

For questions or inquiries, please reach out through the contact information provided on the website.
