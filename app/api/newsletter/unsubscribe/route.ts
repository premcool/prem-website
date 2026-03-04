import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

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

// Remove subscriber from Upstash Redis
async function removeSubscriber(email: string): Promise<boolean> {
  try {
    const redis = getRedisClient();
    
    // Check if exists
    const exists = await redis.sismember(SUBSCRIBERS_KEY, email);
    if (exists !== 1) {
      return false; // Not found
    }

    // Remove from set
    await redis.srem(SUBSCRIBERS_KEY, email);
    return true;
  } catch (error) {
    console.error('Error removing subscriber from Redis:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  const normalizedEmail = decodeURIComponent(email).toLowerCase().trim();

  try {
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
  } catch (error: any) {
    console.error('Error unsubscribing from newsletter:', error);

    const hasRedisConfig = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
                           (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
    
    if (error.message?.includes('must be set') || !hasRedisConfig) {
      console.error('Upstash Redis is not configured. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.');
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
