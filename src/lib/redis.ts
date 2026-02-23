import { Redis } from "@upstash/redis";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

let redisInstance: Redis | null = null;

/**
 * Singleton Redis connection with built-in health tracking.
 * If credentials are missing, it initializes as null to trigger failover logic.
 */
export const getRedis = () => {
  if (redisInstance) return redisInstance;

  if (!REDIS_URL || !REDIS_TOKEN) {
    if (process.env.NODE_ENV === "production") {
      console.warn("CRITICAL: Redis credentials missing. System running in Degraded Mode (Direct DB).");
    }
    return null;
  }

  redisInstance = new Redis({
    url: REDIS_URL,
    token: REDIS_TOKEN,
  });

  return redisInstance;
};

/**
 * Distributed Rate Limiting helper.
 */
export async function limitRate(key: string, limit: number, windowMs: number): Promise<{ success: boolean; remaining: number }> {
  const redis = getRedis();
  if (!redis) return { success: true, remaining: 999 }; // Fallback when Redis is down

  const identifier = `ratelimit:${key}`;
  const current = await redis.incr(identifier);
  
  if (current === 1) {
    await redis.pexpire(identifier, windowMs);
  }

  return {
    success: current <= limit,
    remaining: Math.max(0, limit - current),
  };
}
