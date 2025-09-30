import { createClient } from "redis";

export const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => console.error("Redis error:", err));

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
    console.log("Redis connected");
  }
}
