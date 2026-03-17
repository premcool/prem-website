import { NextRequest, NextResponse } from 'next/server';
import { removeSubscriber } from '@/lib/redis';
import { verifyUnsubscribeToken } from '@/lib/newsletter';

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and token are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = decodeURIComponent(email).toLowerCase().trim();

    if (!verifyUnsubscribeToken(normalizedEmail, token)) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 403 }
      );
    }

    const removed = await removeSubscriber(normalizedEmail);

    if (!removed) {
      return NextResponse.json(
        { message: 'Email not found in subscribers list' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Successfully unsubscribed from newsletter' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error unsubscribing from newsletter:', error);

    const message = error instanceof Error ? error.message : '';
    const hasRedisConfig =
      (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
      (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

    if (message.includes('not configured') || !hasRedisConfig) {
      return NextResponse.json(
        { error: 'Newsletter service is not configured. Please contact the administrator.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to unsubscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
