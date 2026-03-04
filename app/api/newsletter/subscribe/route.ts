import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const SUBSCRIBERS_KEY = 'newsletter:subscribers';

// Get subscribers from Vercel KV
async function getSubscribers(): Promise<string[]> {
  try {
    const subscribers = await kv.smembers(SUBSCRIBERS_KEY);
    return subscribers || [];
  } catch (error) {
    console.error('Error reading subscribers from KV:', error);
    return [];
  }
}

// Add subscriber to Vercel KV
async function addSubscriber(email: string): Promise<boolean> {
  try {
    // Check if already exists
    const exists = await kv.sismember(SUBSCRIBERS_KEY, email);
    if (exists) {
      return false; // Already exists
    }

    // Add to set
    await kv.sadd(SUBSCRIBERS_KEY, email);
    return true;
  } catch (error) {
    console.error('Error adding subscriber to KV:', error);
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
      
      // Check if KV is configured
      if (error.message?.includes('KV') || !process.env.KV_REST_API_URL) {
        console.error('Vercel KV is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.');
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
