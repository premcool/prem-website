# Newsletter Integration Guide

This guide explains how to integrate the newsletter system with your n8n workflow to automatically send emails when new blog posts are published.

## Overview

The newsletter system:
1. Collects email subscriptions via the form in the footer
2. Stores subscribers in **Upstash Redis** (using a Redis Set)
3. Sends emails via SMTP or Resend API when triggered by webhook
4. Includes secure unsubscribe functionality with HMAC-signed tokens

## Setup Steps

### 1. Configure Redis (Upstash)

1. Create an account at [Upstash](https://upstash.com)
2. Create a Redis database
3. Add to environment variables:
   ```
   UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-redis-token
   ```

### 2. Configure Email Service

**Option A: SMTP (recommended for self-hosted)**
```
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=Prem Saktheesh <prem@prems.in>
```

**Option B: Resend API**
1. Sign up at [Resend](https://resend.com)
2. Create an API key
3. Add and verify your domain
4. Add to environment variables:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=Prem Saktheesh <prem@prems.in>
   ```

### 3. Add Webhook Secret (Required)

Generate a secret key for webhook security:

```bash
openssl rand -hex 32
```

Add to environment variables:
```
NEWSLETTER_WEBHOOK_SECRET=your-generated-secret-here
```

**Important:** The webhook secret is required. The `/api/newsletter/send` and `/api/newsletter/trigger` endpoints will refuse requests if it is not configured.

### 4. Add HTTP Request Node to n8n Workflow

Add this node **after** the "Create File in GitHub" node in your n8n workflow:

**Node Configuration:**
- **Name**: "Send Newsletter"
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://prems.in/api/newsletter/send` (or your domain)
- **Headers**:
  - `Content-Type`: `application/json`
  - `x-webhook-secret`: `{{ $env.NEWSLETTER_WEBHOOK_SECRET }}`
- **Body**:
  ```json
  {
    "slug": "{{ $('Add Image to Frontmatter').item.json.slug }}"
  }
  ```

### 5. Error Handling (Optional)

Add error handling to continue workflow even if newsletter fails:

- **On Error**: Continue Workflow
- Or add a Try-Catch node around the HTTP Request

## Security Features

- **Rate limiting**: Subscribe endpoint limits to 5 requests per IP per minute
- **Email validation**: Strict regex validation on subscribe
- **HMAC-signed unsubscribe tokens**: Unsubscribe links use HMAC-SHA256 tokens to prevent unauthorized unsubscription
- **Required webhook secret**: Send/trigger endpoints require `NEWSLETTER_WEBHOOK_SECRET`

## Testing

### Test Subscription
1. Visit your website
2. Enter an email in the footer newsletter form
3. Verify the subscription by checking Redis (via Upstash console or CLI)

### Test Newsletter Sending
```bash
curl -X POST https://your-domain.com/api/newsletter/send \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-secret-key" \
  -d '{"slug": "your-blog-post-slug"}'
```

### Test Unsubscribe
Click the unsubscribe link in a received newsletter email. It will take you to a confirmation page.

## Email Template

The newsletter email includes:
- Blog post title
- Publication date
- Header image (if available)
- Excerpt (first 300 characters)
- "Read Full Article" button
- Secure unsubscribe link (HMAC-signed)

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/newsletter/subscribe` | Rate-limited | Subscribe email |
| POST | `/api/newsletter/unsubscribe` | Token-verified | Unsubscribe email |
| POST | `/api/newsletter/send` | Webhook secret | Send newsletter |
| POST | `/api/newsletter/trigger` | Webhook secret | Trigger send by slug |

## Troubleshooting

### Emails Not Sending
1. Check email service configuration (SMTP or Resend)
2. Verify `NEWSLETTER_WEBHOOK_SECRET` is set
3. Check Resend dashboard or SMTP server logs
4. Review application logs for error messages

### Subscribers Not Saving
1. Check Redis connection (`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`)
2. Verify Redis database is accessible
3. Check Upstash console for connection issues

### Rate Limit Issues
The subscribe endpoint allows 5 requests per IP per 60 seconds. If testing, wait between requests or use different IPs.

### Webhook Failing
1. Verify `x-webhook-secret` header matches `NEWSLETTER_WEBHOOK_SECRET`
2. Check URL is correct and accessible
3. Review server logs for detailed error messages
