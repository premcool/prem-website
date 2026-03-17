import { Redis } from '@upstash/redis';

const SUBSCRIBERS_KEY = 'newsletter:subscribers';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error(
      'Redis not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL and KV_REST_API_TOKEN).'
    );
  }

  redisClient = new Redis({ url, token });
  return redisClient;
}

export async function getSubscribers(): Promise<string[]> {
  const redis = getRedisClient();
  const subscribers = await redis.smembers(SUBSCRIBERS_KEY);
  return (subscribers || []).map((s: unknown) => String(s));
}

export async function addSubscriber(email: string): Promise<boolean> {
  const redis = getRedisClient();
  const exists = await redis.sismember(SUBSCRIBERS_KEY, email);
  if (exists === 1) return false;
  await redis.sadd(SUBSCRIBERS_KEY, email);
  return true;
}

export async function removeSubscriber(email: string): Promise<boolean> {
  const redis = getRedisClient();
  const exists = await redis.sismember(SUBSCRIBERS_KEY, email);
  if (exists !== 1) return false;
  await redis.srem(SUBSCRIBERS_KEY, email);
  return true;
}

export async function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  const redis = getRedisClient();
  const key = `ratelimit:${identifier}`;
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }
  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
  };
}
