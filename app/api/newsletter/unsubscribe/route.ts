import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const subscribersFile = path.join(process.cwd(), 'data', 'newsletter-subscribers.json');

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

// Save subscribers to file
function saveSubscribers(subscribers: string[]) {
  try {
    fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
  } catch (error) {
    console.error('Error saving subscribers file:', error);
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
  const subscribers = getSubscribers();

  // Remove subscriber
  const updatedSubscribers = subscribers.filter((sub) => sub !== normalizedEmail);
  
  if (subscribers.length === updatedSubscribers.length) {
    return NextResponse.json(
      { message: 'Email not found in subscribers list' },
      { status: 404 }
    );
  }

  saveSubscribers(updatedSubscribers);

  return NextResponse.json(
    { message: 'Successfully unsubscribed from newsletter' },
    { status: 200 }
  );
}
