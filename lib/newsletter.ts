import { createHmac } from 'crypto';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getTokenSecret(): string {
  const secret = process.env.NEWSLETTER_WEBHOOK_SECRET || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!secret) {
    throw new Error('No secret available for token generation. Set NEWSLETTER_WEBHOOK_SECRET.');
  }
  return secret;
}

export function generateUnsubscribeToken(email: string): string {
  return createHmac('sha256', getTokenSecret())
    .update(email.toLowerCase().trim())
    .digest('hex');
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  try {
    const expected = generateUnsubscribeToken(email);
    return token === expected;
  } catch {
    return false;
  }
}

export function getUnsubscribeUrl(email: string, baseUrl: string): string {
  const token = generateUnsubscribeToken(email);
  return `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  return 'unknown';
}
