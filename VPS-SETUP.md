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

### Step 2: Configure Email Sending

You have two options:

**Option A: SMTP (Recommended for self-hosted mail servers like mailinabox)**

If you have your own mail server (e.g., mailinabox at box.prolysi.com):

```bash
# Upstash Redis credentials
UPSTASH_REDIS_REST_URL=https://your-db-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# SMTP Configuration (for mailinabox)
SMTP_HOST=box.prolysi.com
SMTP_PORT=587
SMTP_USER=prem@prems.in
SMTP_PASSWORD=your-email-password
SMTP_FROM_EMAIL=Prem Saktheesh <prem@prems.in>
SMTP_SECURE=false  # Set to false if using self-signed certificates

NEWSLETTER_WEBHOOK_SECRET=your-secret-key-here
```

**Option B: Resend API (Cloud email service)**

```bash
# Upstash Redis credentials
UPSTASH_REDIS_REST_URL=https://your-db-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Resend API Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=Prem Saktheesh <prem@prems.in>

NEWSLETTER_WEBHOOK_SECRET=your-secret-key-here
```

**Note**: The system will use SMTP if SMTP settings are configured, otherwise it falls back to Resend API.

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
- Make sure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set in your environment variables
- (Alternative: `KV_REST_API_URL` and `KV_REST_API_TOKEN` also work)
- Check that the values are correct (no extra spaces or quotes)

### Error: "Failed to subscribe"
- Check Docker logs: `docker-compose logs prem-website`
- Verify Upstash Redis is accessible from your VPS
- Test the Upstash connection using curl:
  ```bash
  curl -X GET "https://your-db-name.upstash.io/smembers/newsletter:subscribers" \
    -H "Authorization: Bearer your-token-here"
  ```

**Note**: This solution uses `@upstash/redis` package, which works on **any platform** (VPS, Vercel, AWS, etc.). It's not tied to Vercel - the package name `@upstash/redis` is from Upstash (the Redis service provider), not Vercel.

### Still having issues?
- Make sure you've run `npm install` to install `@upstash/redis` package
- Rebuild the Docker image: `docker-compose build --no-cache prem-website`
- Check that your VPS can reach Upstash (no firewall blocking)
