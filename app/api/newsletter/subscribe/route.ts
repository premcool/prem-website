import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber, checkRateLimit } from '@/lib/redis';
import { EMAIL_REGEX, getClientIp } from '@/lib/newsletter';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    try {
      const { allowed, remaining } = await checkRateLimit(`subscribe:${clientIp}`, 5, 60);
      if (!allowed) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          {
            status: 429,
            headers: {
              'Retry-After': '60',
              'X-RateLimit-Remaining': String(remaining),
            },
          }
        );
      }
    } catch (error) {
      console.warn('Rate limit check failed, allowing request:', error);
    }

    const { email } = await request.json();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
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
  } catch (error: unknown) {
    console.error('Error processing subscription request:', error);

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
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
