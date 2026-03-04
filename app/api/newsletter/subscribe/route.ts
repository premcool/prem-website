import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const subscribersFile = path.join(process.cwd(), 'data', 'newsletter-subscribers.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read subscribers from file
function getSubscribers(): string[] {
  ensureDataDirectory();
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

// Save subscribers to file
function saveSubscribers(subscribers: string[]) {
  ensureDataDirectory();
  try {
    fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
  } catch (error) {
    console.error('Error saving subscribers file:', error);
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
    const subscribers = getSubscribers();

    // Check if already subscribed
    if (subscribers.includes(normalizedEmail)) {
      return NextResponse.json(
        { message: 'You are already subscribed!' },
        { status: 200 }
      );
    }

    // Add new subscriber
    subscribers.push(normalizedEmail);
    saveSubscribers(subscribers);

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
