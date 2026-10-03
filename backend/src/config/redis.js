import { createClient } from 'redis';
import { env } from './env.js';

// In-memory cache fallback store when Redis is unavailable
const memoryCache = new Map();
const memoryExpiry = new Map();

let redisClient = null;
let isConnected = false;

/**
 * Initialize Redis Client with fallback
 */
export async function connectRedis() {
    const redisUrl = env.REDIS_URL || 'redis://127.0.0.1:6379';
    try {
        redisClient = createClient({
            url: redisUrl,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 5) {
                        return false; // Stop reconnecting after 5 attempts, fall back to memory
                    }
                    return Math.min(retries * 200, 2000);
                }
            }
        });

        redisClient.on('error', (err) => {
            if (isConnected) {
                console.warn('⚠️ [REDIS]: Connection error, utilizing memory fallback cache:', err.message);
            }
            isConnected = false;
        });

        redisClient.on('connect', () => {
            isConnected = true;
            console.log('⚡ [REDIS]: High-performance cache connected successfully');
        });

        await redisClient.connect();
    } catch (err) {
        isConnected = false;
        console.warn('⚠️ [REDIS]: Local server unavailable (using resilient in-memory fallback cache):', err.message);
    }
}

/**
 * Cache Interface (Transparently uses Redis when available, otherwise in-memory)
 */
export const cache = {
    isConnected: () => isConnected,

    async get(key) {
        try {
            if (isConnected && redisClient) {
                const data = await redisClient.get(key);
                return data ? JSON.parse(data) : null;
            }
        } catch (e) {
            console.warn(`Redis get error for key ${key}:`, e.message);
        }

        // Memory fallback
        const expiry = memoryExpiry.get(key);
        if (expiry && Date.now() > expiry) {
            memoryCache.delete(key);
            memoryExpiry.delete(key);
            return null;
        }
        return memoryCache.get(key) || null;
    },

    async set(key, value, ttlSeconds = 300) {
        try {
            const serialized = JSON.stringify(value);
            if (isConnected && redisClient) {
                await redisClient.setEx(key, ttlSeconds, serialized);
                return true;
            }
        } catch (e) {
            console.warn(`Redis set error for key ${key}:`, e.message);
        }

        // Memory fallback
        memoryCache.set(key, value);
        if (ttlSeconds > 0) {
            memoryExpiry.set(key, Date.now() + ttlSeconds * 1000);
        }
        return true;
    },

    async del(key) {
        try {
            if (isConnected && redisClient) {
                await redisClient.del(key);
            }
        } catch (e) {
            console.warn(`Redis del error for key ${key}:`, e.message);
        }
        memoryCache.delete(key);
        memoryExpiry.delete(key);
        return true;
    },

    async flush() {
        try {
            if (isConnected && redisClient) {
                await redisClient.flushDb();
            }
        } catch (e) {
            console.warn('Redis flush error:', e.message);
        }
        memoryCache.clear();
        memoryExpiry.clear();
        return true;
    },

    /**
     * Cache helper: Fetch from cache or compute and store
     */
    async getOrSet(key, fetcherFn, ttlSeconds = 300) {
        const cached = await this.get(key);
        if (cached !== null && cached !== undefined) {
            return cached;
        }
        const freshData = await fetcherFn();
        if (freshData !== undefined && freshData !== null) {
            await this.set(key, freshData, ttlSeconds);
        }
        return freshData;
    }
};

export default cache;
