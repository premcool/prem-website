import { NextRequest, NextResponse } from 'next/server';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prems.in';

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = request.headers.get('x-webhook-secret');
    const expectedSecret = process.env.NEWSLETTER_WEBHOOK_SECRET;

    if (!expectedSecret) {
      console.error('NEWSLETTER_WEBHOOK_SECRET is not set. Newsletter trigger endpoint is disabled for security.');
      return NextResponse.json(
        { error: 'Newsletter webhook secret is not configured' },
        { status: 500 }
      );
    }

    if (webhookSecret !== expectedSecret) {
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

    const newsletterUrl = `${baseUrl}/api/newsletter/send`;
    const response = await fetch(newsletterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': expectedSecret,
      },
      body: JSON.stringify({ slug }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Newsletter send failed (${response.status}):`, errorText);
      return NextResponse.json(
        { error: 'Failed to send newsletter', details: errorText },
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
