import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getPostBySlug } from '@/lib/posts';

const subscribersFile = path.join(process.cwd(), 'data', 'newsletter-subscribers.json');
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prems.in';

// Read subscribers from file
function getSubscribers(): string[] {
  if (!fs.existsSync(subscribersFile)) {
    return [];
  }
  try {
    const data = fs.readFileSync(subscribersFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscribers file:', error);
    return [];
  }
}

// Send email using Resend API
async function sendEmail(to: string, subject: string, html: string) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error('RESEND_API_KEY is not configured');
    throw new Error('Email service not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'Prem Saktheesh <prem@prems.in>',
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

    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'Blog post slug is required' },
        { status: 400 }
      );
    }

    // Get blog post
    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Get subscribers
    const subscribers = getSubscribers();

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
