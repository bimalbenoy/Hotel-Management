import { redisClient } from "../config/redis";
import { logger } from "../logger/logger.service";

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);

      if (!data) {
        logger.info(`Cache miss for key: ${key}`);
        return null;
      }

      logger.info(`Cache hit for key: ${key}`);

      return JSON.parse(data) as T;
    } catch (error: any) {
      logger.error(
        `Redis GET failed for key ${key}: ${error.message}`
      );

      return null;
    }
  }

  async set<T>(
    key: string,
    value: T,
    ttlInSeconds: number = 300
  ): Promise<void> {
    try {
      await redisClient.set(
        key,
        JSON.stringify(value),
        {
          EX: ttlInSeconds,
        }
      );

      logger.info(
        `Cache set for key: ${key}, TTL: ${ttlInSeconds}s`
      );
    } catch (error: any) {
      logger.error(
        `Redis SET failed for key ${key}: ${error.message}`
      );
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key);

      logger.info(`Cache deleted for key: ${key}`);
    } catch (error: any) {
      logger.error(
        `Redis DELETE failed for key ${key}: ${error.message}`
      );
    }
  }
}