import Redis from "ioredis";
import { Document } from "mongoose";

const redis = new Redis(process.env.REDIS_URL!, {
  // Optional: Configure Redis connection options
  retryStrategy: (times) => {
    // Exponential backoff for reconnection attempts
    return Math.min(times * 1000, 30000); // Max wait time of 30 seconds
  },
});

// Helper function to safely stringify MongoDB documents
const safeStringify = (data: any) => {
  if (data instanceof Document) {
    // Convert Mongoose document to plain object with all virtuals
    return JSON.stringify(data.toObject({ virtuals: true }));
  }
  return JSON.stringify(data);
};

export const setCacheData = async (
  key: string,
  data: any,
  expirationInSeconds = 3600
): Promise<void> => {
  try {
    const serializedData = safeStringify(data);
    await redis.setex(key, expirationInSeconds, serializedData);
  } catch (error) {
    console.error("Redis set error:", error);
    throw error; // Propagate the error for better error handling
  }
};

export const getCacheData = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    if (!data) return null;

    return JSON.parse(data) as T;
  } catch (error) {
    console.error("Redis get error:", error);
    throw error; // Propagate the error for better error handling
  }
};

export const clearCache = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error("Redis delete error:", error);
    throw error; // Propagate the error for better error handling
  }
};

// Handle Redis connection events
redis.on("error", (error) => {
  console.error("Redis connection error:", error);
});

redis.on("connect", () => {
  console.log("Successfully connected to Redis");
});

// Export redis client for direct access if needed
export default redis;
