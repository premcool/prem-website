# Rebuild and Newsletter Script

This script automates the process of rebuilding your Next.js site and sending newsletters for new blog posts.

## How It Works

1. **Pulls latest changes** from GitHub (if in a git repository)
2. **Rebuilds the Next.js site** using `npm run build`
3. **Detects new blog posts** by comparing with previously sent newsletters
4. **Sends newsletters** for any new posts via the newsletter API
5. **Tracks sent newsletters** in Redis to avoid duplicate sends

## Setup

### 1. Make the script executable

```bash
chmod +x scripts/rebuild-and-send-newsletter.js
```

### 2. Required Environment Variables

The script needs these environment variables (same as your Next.js app):

```bash
NEXT_PUBLIC_SITE_URL=https://prems.in
NEWSLETTER_WEBHOOK_SECRET=your-secret-key-here  # Optional but recommended
UPSTASH_REDIS_REST_URL=https://your-db-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

### 3. Set Up Cron Job

Add this to your crontab (`crontab -e`):

```bash
# Rebuild site and send newsletters every hour
0 * * * * cd /path/to/prem-website && /usr/bin/node scripts/rebuild-and-send-newsletter.js >> /var/log/prem-website-rebuild.log 2>&1

# Or rebuild every 30 minutes
*/30 * * * * cd /path/to/prem-website && /usr/bin/node scripts/rebuild-and-send-newsletter.js >> /var/log/prem-website-rebuild.log 2>&1
```

**Important:** Make sure to:
- Replace `/path/to/prem-website` with your actual project path
- Use the full path to `node` (find it with `which node`)
- Ensure the cron user has access to the project directory and environment variables

### 4. Environment Variables for Cron

Cron jobs don't inherit your shell environment variables. You have a few options:

**Option A: Load from .env file in the script**
The script can be modified to load from a `.env` file if needed.

**Option B: Set in crontab**
```bash
0 * * * * cd /path/to/prem-website && NEXT_PUBLIC_SITE_URL=https://prems.in UPSTASH_REDIS_REST_URL=... UPSTASH_REDIS_REST_TOKEN=... /usr/bin/node scripts/rebuild-and-send-newsletter.js
```

**Option C: Source environment file**
```bash
0 * * * * cd /path/to/prem-website && source .env.premwebsite && /usr/bin/node scripts/rebuild-and-send-newsletter.js
```

## Usage

### Manual Run

```bash
npm run rebuild-and-newsletter
```

Or directly:

```bash
node scripts/rebuild-and-send-newsletter.js
```

### What It Does

- ✅ Pulls latest code from GitHub
- ✅ Rebuilds the Next.js site
- ✅ Detects new blog posts (compares with Redis tracking)
- ✅ Sends newsletters only for new posts
- ✅ Tracks sent newsletters in Redis to prevent duplicates

## How Newsletter Tracking Works

The script uses Redis to track which blog posts have already had newsletters sent:

- **Key**: `newsletter:sent_posts` (Redis Set)
- **Value**: Set of blog post slugs (e.g., `["my-blog-post", "another-post"]`)

When a new blog post is detected:
1. Script checks if the slug exists in the Redis set
2. If not found, sends newsletter
3. Adds slug to Redis set to mark as sent

This ensures:
- ✅ No duplicate newsletters
- ✅ Only new posts get newsletters
- ✅ Works across multiple script runs

## Troubleshooting

### Script fails with "Redis not configured"
- Make sure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set
- The script will still work but won't track sent newsletters (will send every time)

### Newsletter not sending
- Check that the blog post file exists in `content/blog/`
- Verify the newsletter API endpoint is accessible: `https://prems.in/api/newsletter/send`
- Check logs for specific error messages

### Cron job not running
- Check cron logs: `grep CRON /var/log/syslog` (Linux) or check mail
- Verify cron service is running: `systemctl status cron` (Linux)
- Test manually first: `node scripts/rebuild-and-send-newsletter.js`

### Build fails
- Ensure all dependencies are installed: `npm install`
- Check that Node.js version is compatible (18+)
- Verify environment variables are set correctly

## Integration with n8n Workflows

Your n8n workflows create blog posts in GitHub. The cron job:
1. Runs periodically (e.g., every hour)
2. Pulls the latest blog posts
3. Rebuilds the site
4. Sends newsletters for any new posts

This ensures newsletters are sent **after** the site is rebuilt and the post is live, which is the recommended approach.
