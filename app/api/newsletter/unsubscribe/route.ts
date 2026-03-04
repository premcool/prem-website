import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const SUBSCRIBERS_KEY = 'newsletter:subscribers';

// Remove subscriber from Vercel KV
async function removeSubscriber(email: string): Promise<boolean> {
  try {
    // Check if exists
    const exists = await kv.sismember(SUBSCRIBERS_KEY, email);
    if (!exists) {
      return false; // Not found
    }

    // Remove from set
    await kv.srem(SUBSCRIBERS_KEY, email);
    return true;
  } catch (error) {
    console.error('Error removing subscriber from KV:', error);
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

    if (error.message?.includes('KV') || !process.env.KV_REST_API_URL) {
      console.error('Vercel KV is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.');
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
