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

// Add subscriber to Upstash Redis
async function addSubscriber(email: string): Promise<boolean> {
  try {
    const redis = getRedisClient();
    
    // Check if already exists
    const exists = await redis.sismember(SUBSCRIBERS_KEY, email);
    if (exists === 1) {
      return false; // Already exists
    }

    // Add to set
    await redis.sadd(SUBSCRIBERS_KEY, email);
    return true;
  } catch (error) {
    console.error('Error adding subscriber to Redis:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
      const added = await addSubscriber(normalizedEmail);
      
      if (!added) {
        return NextResponse.json(
          { message: 'You are already subscribed!' },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { message: 'Successfully subscribed to newsletter!' },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error);
      
      // Check if Redis is configured
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
        { error: 'Failed to subscribe. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing subscription request:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
