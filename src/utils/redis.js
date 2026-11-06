import { createClient } from "redis";

const memoryStore = new Map();
export const redisClient = createClient({ url: process.env.REDIS_URL || "redis://127.0.0.1:6379" });

redisClient.on("error", (err) => {
  // Silent fallback to avoid crash
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (err) {
    console.log("Redis server offline, running in-memory cache fallback.");
  }
};

export const setCache = async (key, value, ttlSeconds = 300) => {
  try {
    if (redisClient.isOpen) {
      await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
      return;
    }
  } catch {}
  memoryStore.set(key, value);
  setTimeout(() => memoryStore.delete(key), ttlSeconds * 1000);
};

export const getCache = async (key) => {
  try {
    if (redisClient.isOpen) {
      const val = await redisClient.get(key);
      return val ? JSON.parse(val) : null;
    }
  } catch {}
  return memoryStore.get(key) || null;
};

export const delCache = async (key) => {
  try {
    if (redisClient.isOpen) {
      await redisClient.del(key);
    }
  } catch {}
  memoryStore.delete(key);
};
