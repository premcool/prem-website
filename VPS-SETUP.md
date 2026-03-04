# VPS Deployment Setup Guide

This guide explains how to set up the newsletter subscription system on your VPS.

## Quick Fix: Set Up Upstash Redis

The newsletter subscription now uses Redis instead of file system (which doesn't work in Docker containers). The easiest solution is to use **Upstash Redis** (free tier available).

### Step 1: Create Upstash Redis Database

1. Go to [https://upstash.com](https://upstash.com)
2. Sign up for a free account
3. Click "Create Database"
4. Choose "Global" or "Regional" (Global is recommended)
5. Click "Create"
6. Copy the **REST API URL** and **REST API Token** from the dashboard

### Step 2: Add Environment Variables

Add these to your `.env.premwebsite` file (or wherever you store environment variables for Docker):

```bash
KV_REST_API_URL=https://your-db-name.upstash.io
KV_REST_API_TOKEN=your-token-here
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=Prem Saktheesh <prem@prems.in>
NEWSLETTER_WEBHOOK_SECRET=your-secret-key-here
```

### Step 3: Rebuild and Restart

```bash
cd /path/to/prem-website
docker-compose build prem-website
docker-compose up -d prem-website
```

### Step 4: Test

1. Visit your website
2. Try subscribing to the newsletter in the footer
3. Check the logs: `docker-compose logs prem-website`

## Alternative: Local Redis Container

If you prefer to self-host Redis, add this to your `docker-compose.yml`:

```yaml
services:
  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    restart: always
    networks:
      - web

  prem-website:
    # ... your existing config ...
    environment:
      # ... existing vars ...
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis

volumes:
  redis-data:
```

Then update the code to use the `redis` package instead of `@vercel/kv`.

## Troubleshooting

### Error: "Newsletter service is not configured"
- Make sure `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set in your environment variables
- Check that the values are correct (no extra spaces or quotes)

### Error: "Failed to subscribe"
- Check Docker logs: `docker-compose logs prem-website`
- Verify Upstash Redis is accessible from your VPS
- Test the Upstash connection using curl:
  ```bash
  curl -X GET "https://your-db-name.upstash.io/smembers/newsletter:subscribers" \
    -H "Authorization: Bearer your-token-here"
  ```

### Still having issues?
- Make sure you've run `npm install` to install `@vercel/kv` package
- Rebuild the Docker image: `docker-compose build --no-cache prem-website`
- Check that your VPS can reach Upstash (no firewall blocking)
