# n8n Workflow Setup for Weekly Blog Posts

This workflow automatically generates weekly blog posts from RSS feeds and commits them to your Next.js blog repository.

## Workflow Overview

1. **Schedule Trigger**: Runs every Saturday (day 6 of the week)
2. **RSS Feeds**: Reads from TechCrunch AI, LastWeekIn.AI, and Google Research
3. **AI Content Generation**: Uses Google Gemini to create a cohesive blog post
4. **Markdown Formatting**: Formats content with proper frontmatter for Next.js
5. **GitHub Integration**: Creates markdown file in `content/blog/` directory
6. **Notifications**: Sends email confirmation

## Setup Instructions

### 1. GitHub Personal Access Token

Create a GitHub Personal Access Token with `repo` scope:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name it: "n8n Blog Automation"
4. Select scope: `repo` (full control of private repositories)
5. Copy the token

### 2. Configure n8n Credentials

In n8n, create a new HTTP Header Auth credential:

- **Name**: `GitHub Personal Access Token`
- **Header Name**: `Authorization`
- **Header Value**: `token YOUR_GITHUB_TOKEN_HERE`

Replace `YOUR_GITHUB_TOKEN_HERE` with your actual token.

### 3. Update Repository Name

If your repository name is different, update these nodes:
- **Create File in GitHub**: Change `premcool/prem-website` to your username/repo
- **Trigger Site Rebuild**: Same update

### 4. Update Email Settings

Configure the email node with your SMTP settings or use n8n's email service.

### 5. GitHub Actions Workflow (Optional)

If you want automatic rebuilds, create `.github/workflows/rebuild.yml`:

```yaml
name: Rebuild Site on Blog Post

on:
  repository_dispatch:
    types: [rebuild]

jobs:
  rebuild:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Trigger Vercel Deployment
        run: |
          # This will trigger Vercel rebuild if webhook is configured
          # Or use Vercel CLI to deploy
```

## Workflow Features

### Markdown Format
The workflow generates markdown files with this structure:

```markdown
---
title: "Your Blog Post Title"
date: "2024-01-15"
slug: "your-blog-post-title"
---

Your blog post content in markdown format...
```

### Content Generation
- Combines 9 articles (3 from each RSS feed)
- Uses Google Gemini to create cohesive content
- Focuses on AI & Cloud Transformation themes
- Generates 500-800 word posts

### File Naming
- Slug generated from title (lowercase, hyphens)
- Filename: `{slug}.md`
- Path: `content/blog/{slug}.md`

## Testing

1. **Manual Trigger**: Click "Execute Workflow" in n8n
2. **Check GitHub**: Verify file appears in `content/blog/`
3. **Verify Build**: Check if site rebuilds automatically (Vercel/Netlify)

## Troubleshooting

### GitHub API Errors
- Verify token has `repo` scope
- Check repository name is correct
- Ensure branch name is `main` (or update if different)

### Content Format Issues
- Review AI agent system message
- Check markdown formatting in code node
- Verify frontmatter format matches your blog structure

### Build Not Triggering
- Configure Vercel/Netlify webhook on GitHub push
- Or use GitHub Actions workflow dispatch
- Or manually trigger rebuild after file creation

## Customization

### Change Schedule
Edit "Schedule Trigger" node:
- Change `triggerAtDay` array (0=Sunday, 6=Saturday)
- Change `field` to `days` for daily posts

### Add More RSS Feeds
1. Add new RSS Feed Read nodes
2. Add Limit nodes (set to 3)
3. Update Merge node `numberInputs` to match

### Modify Content Style
Edit "AI Agent" system message to change:
- Writing tone
- Content length
- Focus areas
- Formatting preferences

## Security Notes

- Store GitHub token securely in n8n credentials
- Never commit tokens to repository
- Use environment variables for sensitive data
- Consider using GitHub App instead of personal token for better security
