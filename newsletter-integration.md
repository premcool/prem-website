# Newsletter Integration Guide

This guide explains how to integrate the newsletter system with your n8n workflow to automatically send emails when new blog posts are published.

## Overview

The newsletter system:
1. Collects email subscriptions via the form in the footer
2. Stores subscribers in `data/newsletter-subscribers.json`
3. Sends emails via Resend API when triggered by webhook
4. Includes unsubscribe functionality

## Setup Steps

### 1. Configure Resend API

1. Sign up at [Resend](https://resend.com)
2. Create an API key
3. Add and verify your domain (for production)
4. Add to environment variables:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=Prem Saktheesh <prem@prems.in>
   ```

### 2. Add Webhook Secret (Optional but Recommended)

Generate a secret key for webhook security:

```bash
# Generate a random secret
openssl rand -hex 32
```

Add to environment variables:
```
NEWSLETTER_WEBHOOK_SECRET=your-generated-secret-here
```

### 3. Add HTTP Request Node to n8n Workflow

Add this node **after** the "Create File in GitHub" node in your n8n workflow:

**Node Configuration:**
- **Name**: "Send Newsletter"
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://prems.in/api/newsletter/send` (or your domain)
- **Authentication**: None (or use Header Auth if you prefer)
- **Headers**:
  - `Content-Type`: `application/json`
  - `x-webhook-secret`: `{{ $env.NEWSLETTER_WEBHOOK_SECRET }}` (if using secret)
- **Body**:
  ```json
  {
    "slug": "{{ $('Add Image to Frontmatter').item.json.slug }}"
  }
  ```

**Alternative using n8n Expression:**
- **Body Content Type**: JSON
- **Body Parameters**:
  - `slug`: `={{ $('Add Image to Frontmatter').item.json.slug }}`

### 4. Error Handling (Optional)

Add error handling to continue workflow even if newsletter fails:

- **On Error**: Continue Workflow
- Or add a Try-Catch node around the HTTP Request

## Testing

### Test Subscription
1. Visit your website
2. Enter an email in the footer newsletter form
3. Check `data/newsletter-subscribers.json` - your email should be added

### Test Newsletter Sending
1. Create a test blog post (or use existing one)
2. Call the API manually:
   ```bash
   curl -X POST https://your-domain.com/api/newsletter/send \
     -H "Content-Type: application/json" \
     -H "x-webhook-secret: your-secret-key" \
     -d '{"slug": "your-blog-post-slug"}'
   ```
3. Check your email inbox

### Test Unsubscribe
Visit: `https://your-domain.com/api/newsletter/unsubscribe?email=your-email@example.com`

## Email Template

The newsletter email includes:
- Blog post title
- Publication date
- Header image (if available)
- Excerpt (first 300 characters)
- "Read Full Article" button
- Unsubscribe link

## Production Considerations

### Database Option
For production, consider migrating from JSON file to a database:
- PostgreSQL/MySQL for subscribers
- Better scalability
- Better analytics

### Email Service Alternatives
- **SendGrid**: Similar to Resend, good deliverability
- **Mailgun**: Good for transactional emails
- **AWS SES**: Cost-effective for high volume

### Rate Limiting
Consider adding rate limiting to the `/api/newsletter/send` endpoint to prevent abuse.

## Troubleshooting

### Emails Not Sending
1. Check `RESEND_API_KEY` is set correctly
2. Verify domain is verified in Resend dashboard
3. Check Resend API logs
4. Verify webhook secret matches (if using)

### Subscribers Not Saving
1. Check `data/` directory exists and is writable
2. Check file permissions
3. Verify `.gitignore` includes `data/newsletter-subscribers.json`

### Webhook Failing
1. Check webhook secret matches
2. Verify URL is correct
3. Check network connectivity from n8n to your server
4. Review server logs for errors
