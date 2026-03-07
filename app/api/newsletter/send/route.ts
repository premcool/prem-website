import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/posts';
import { Redis } from '@upstash/redis';
import nodemailer from 'nodemailer';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prems.in';
const SUBSCRIBERS_KEY = 'newsletter:subscribers';

// Initialize Redis client
function getRedisClient() {
  // Support both naming conventions for flexibility
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL and KV_REST_API_TOKEN) must be set');
  }

  return new Redis({
    url,
    token,
  });
}

// Get subscribers from Upstash Redis
async function getSubscribers(): Promise<string[]> {
  try {
    const redis = getRedisClient();
    const subscribers = await redis.smembers(SUBSCRIBERS_KEY);
    return (subscribers || []).map((s: any) => String(s));
  } catch (error) {
    console.error('Error reading subscribers from Redis:', error);
    return [];
  }
}

// Send email using SMTP or Resend API
async function sendEmail(to: string, subject: string, html: string) {
  // Check if SMTP is configured (for mailinabox or other SMTP servers)
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.SMTP_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'Prem Saktheesh <prem@prems.in>';

  // Use SMTP if configured
  if (smtpHost && smtpPort && smtpUser && smtpPassword) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: smtpPort === '465', // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
        // For mailinabox and self-hosted servers, might need to allow self-signed certs
        tls: {
          rejectUnauthorized: process.env.SMTP_SECURE !== 'false',
        },
      });

      const info = await transporter.sendMail({
        from: smtpFrom,
        to,
        subject,
        html,
      });

      return { id: info.messageId, success: true };
    } catch (error: any) {
      console.error('SMTP error:', error);
      throw new Error(`SMTP error: ${error.message}`);
    }
  }

  // Fallback to Resend API if SMTP not configured
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error('Email service not configured. Please set SMTP settings or RESEND_API_KEY');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: smtpFrom,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (optional but recommended)
    const webhookSecret = request.headers.get('x-webhook-secret');
    const expectedSecret = process.env.NEWSLETTER_WEBHOOK_SECRET;

    if (expectedSecret && webhookSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { slug, title, content, date, image, category } = body;

    let post;

    // If full post data is provided (from n8n), use it directly
    // Otherwise, fetch by slug from file system
    if (title && content && date && slug) {
      // Use post data provided directly from n8n workflow
      post = {
        slug,
        title,
        date,
        category,
        image: image || undefined,
        content,
        contentHtml: '', // Not needed for email
      };
    } else if (slug) {
      // Fallback: fetch from file system (for backward compatibility)
      post = await getPostBySlug(slug);
      
      if (!post) {
        return NextResponse.json(
          { error: 'Blog post not found. Either provide full post data (title, content, date, slug) or ensure the post exists in the file system.' },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Either slug or full post data (title, content, date, slug) is required' },
        { status: 400 }
      );
    }

    // Get subscribers
    const subscribers = await getSubscribers();

    if (subscribers.length === 0) {
      return NextResponse.json(
        { message: 'No subscribers to send to' },
        { status: 200 }
      );
    }

    // Create email content
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    const excerpt = post.content.substring(0, 300).replace(/\n/g, ' ').trim() + '...';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Blog Post</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
            ${post.image ? `<img src="${baseUrl}${post.image}" alt="${post.title}" style="width: 100%; border-radius: 8px; margin-bottom: 20px;" />` : ''}
            <h2 style="color: #1f2937; margin-top: 0; font-size: 22px;">${post.title}</h2>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="color: #374151; margin-bottom: 30px;">${excerpt}</p>
            <a href="${postUrl}" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Read Full Article →</a>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              You're receiving this because you subscribed to Prem Saktheesh's newsletter.<br>
              <a href="${baseUrl}/unsubscribe?email={{email}}" style="color: #3B82F6;">Unsubscribe</a>
            </p>
          </div>
        </body>
      </html>
    `;

    // Send emails to all subscribers
    const results = [];
    for (const email of subscribers) {
      try {
        // Replace {{email}} placeholder with actual email for unsubscribe link
        const personalizedHtml = emailHtml.replace(/\{\{email\}\}/g, encodeURIComponent(email));
        await sendEmail(email, `New Blog Post: ${post.title}`, personalizedHtml);
        results.push({ email, status: 'success' });
      } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
        results.push({ email, status: 'error', error: String(error) });
      }
    }

    const successCount = results.filter((r) => r.status === 'success').length;
    const errorCount = results.filter((r) => r.status === 'error').length;

    return NextResponse.json({
      message: `Newsletter sent to ${successCount} subscribers`,
      success: successCount,
      errors: errorCount,
      results,
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter', details: String(error) },
      { status: 500 }
    );
  }
}
