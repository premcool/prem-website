import { NextRequest, NextResponse } from 'next/server';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prems.in';

/**
 * Webhook endpoint to trigger newsletter send after rebuild
 * Called by GitHub Actions workflow after blog post is created and site is rebuilt
 */
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
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'Blog post slug is required' },
        { status: 400 }
      );
    }

    // Call the newsletter send API internally
    const newsletterUrl = `${baseUrl}/api/newsletter/send`;
    const response = await fetch(newsletterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward the webhook secret if provided
        ...(webhookSecret && { 'x-webhook-secret': webhookSecret }),
      },
      body: JSON.stringify({ slug }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: 'Failed to send newsletter', details: error },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json({
      message: 'Newsletter triggered successfully',
      result,
    });
  } catch (error) {
    console.error('Error triggering newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to trigger newsletter', details: String(error) },
      { status: 500 }
    );
  }
}
