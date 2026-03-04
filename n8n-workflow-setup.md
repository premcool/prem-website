# n8n Workflow Setup for Weekly Blog Posts

This workflow automatically generates weekly blog posts from RSS feeds and commits them to your Next.js blog repository.

## Workflow Overview

1. **Schedule Trigger**: Runs every Saturday (day 6 of the week)
2. **RSS Feeds**: Reads from TechCrunch AI, LastWeekIn.AI, and Google Research
3. **AI Content Generation**: Uses Google Gemini to create a cohesive blog post
4. **Image Generation**: Uses OpenAI DALL-E to generate a header image based on the blog post title
5. **Markdown Formatting**: Formats content with proper frontmatter for Next.js (including image URL)
6. **GitHub Integration**: Creates markdown file in `content/blog/` and image in `public/images/blog/`
7. **Notifications**: Sends email confirmation

## Setup Instructions

### 1. GitHub Personal Access Token

Create a GitHub Personal Access Token with `repo` scope:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name it: "n8n Blog Automation"
4. Select scope: `repo` (full control of private repositories)
5. Copy the token

### 2. Configure n8n Credentials

#### GitHub Personal Access Token

In n8n, create a new HTTP Header Auth credential:

- **Name**: `GitHub Personal Access Token`
- **Header Name**: `Authorization`
- **Header Value**: `token YOUR_GITHUB_TOKEN_HERE`

Replace `YOUR_GITHUB_TOKEN_HERE` with your actual token.

#### OpenRouter API Key (for Image Generation)

Create another HTTP Header Auth credential for OpenRouter:

- **Name**: `OpenRouter API`
- **Header Name**: `Authorization`
- **Header Value**: `Bearer YOUR_OPENROUTER_API_KEY`

Replace `YOUR_OPENROUTER_API_KEY` with your actual OpenRouter API key. You can get one from https://openrouter.ai/keys

**Note**: The workflow uses Flux Pro model through OpenRouter, which is significantly cheaper than DALL-E 3. Current pricing is approximately $0.01-0.02 per image (check OpenRouter pricing page for latest rates). 

**Important**: OpenRouter's image generation API endpoint may vary. If the default endpoint doesn't work, check OpenRouter's documentation or consider using Stability AI directly (see alternative configuration below).

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
image: "/images/blog/your-blog-post-title-header.jpg"
---

Your blog post content in markdown format...
```

The `image` field in frontmatter contains the path to the generated header image.

### Content Generation
- Combines 9 articles (3 from each RSS feed)
- Uses Google Gemini to create cohesive content
- Focuses on AI & Cloud Transformation themes
- Generates 500-800 word posts

### Image Generation
- Uses OpenRouter API with `google/gemini-2.5-flash-image-preview` model via `/api/v1/chat/completions` endpoint
- Uses `modalities: ["image", "text"]` to enable image generation
- Image prompt is automatically created from blog post title and content themes
- Images are returned as base64-encoded data URLs in `choices[0].message.images[0].image_url.url`
- Images are saved to `public/images/blog/` directory
- Image filename format: `{slug}-header.jpg`
- **Cost**: Very affordable - uses Gemini 2.5 Flash Image Preview model

### File Naming
- Slug generated from title (lowercase, hyphens)
- Blog post filename: `{slug}.md`
- Blog post path: `content/blog/{slug}.md`
- Image filename: `{slug}-header.jpg`
- Image path: `public/images/blog/{slug}-header.jpg`

## Testing

1. **Manual Trigger**: Click "Execute Workflow" in n8n
2. **Check GitHub**: Verify files appear in:
   - `content/blog/{slug}.md` (blog post)
   - `public/images/blog/{slug}-header.jpg` (header image)
3. **Verify Build**: Check if site rebuilds automatically (Vercel/Netlify)
4. **Check Image**: Verify the image displays correctly on your blog post page

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

### Image Generation Issues
- Verify OpenRouter API key is correct and has sufficient credits
- Check OpenRouter dashboard for API usage and billing information
- Ensure the `public/images/blog/` directory exists in your repository (create it if needed)
- Verify image URL in frontmatter matches your site's public path structure
- If `google/gemini-2.5-flash-image-preview` model is unavailable, try alternative models like `google/gemini-3.1-flash-image-preview` or check OpenRouter's model list for other image generation models
- Verify the model name matches exactly as listed in OpenRouter's documentation
- Ensure `modalities: ["image", "text"]` is set in the request (or `["image"]` for image-only models)
- Check that the response contains `choices[0].message.images` array (not `content` array)

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

### Customize Image Generation
Edit "Generate Image Prompt" node to modify:
- Image style and visual themes
- Color schemes
- Aspect ratio preferences
- Image quality settings

You can also change the model or image configuration in the "Generate Image with OpenRouter" node:
- **Current configuration**: `google/gemini-2.5-flash-image-preview` model with `modalities: ["image", "text"]`
- **Other model options**: 
  - `google/gemini-3.1-flash-image-preview` (supports extended aspect ratios and 0.5K resolution)
  - `black-forest-labs/flux.2-pro` or `black-forest-labs/flux.2-flex` (use `modalities: ["image"]`)
  - `sourceful/riverflow-v2-standard-preview`
- **Image configuration options** (add `image_config` to jsonBody):
  - `aspect_ratio`: "1:1", "16:9", "4:3", etc. (default: "1:1" → 1024×1024)
  - `image_size`: "1K" (default), "2K", "4K", or "0.5K" (gemini-3.1 only)
- Check OpenRouter's documentation: https://openrouter.ai/docs/image-generation

### Alternative: Use Stability AI Directly (Cheapest Option)

If OpenRouter doesn't work for image generation, you can use Stability AI directly (often cheaper):

1. **Update the "Generate Image with OpenRouter" node:**
   - Change URL to: `https://api.stability.ai/v2beta/stable-image/generate/core`
   - Change model parameter to: `stable-diffusion-xl-1024-v1-0` (or remove model parameter)
   - Add header: `Authorization: Bearer YOUR_STABILITY_AI_KEY`
   - Request body format may differ - check Stability AI docs

2. **Get Stability AI API Key:**
   - Sign up at https://platform.stability.ai/
   - Get API key from dashboard
   - Pricing: ~$0.003-0.01 per image (very cheap!)

3. **Or use Replicate API** (hosts Flux and other models):
   - URL: `https://api.replicate.com/v1/predictions`
   - Model: `black-forest-labs/flux-schnell` or `black-forest-labs/flux-pro`
   - Pricing: Pay per second of compute (~$0.001-0.005 per image)

## Security Notes

- Store GitHub token securely in n8n credentials
- Never commit tokens to repository
- Use environment variables for sensitive data
- Consider using GitHub App instead of personal token for better security
