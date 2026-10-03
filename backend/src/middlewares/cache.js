import { cache } from '../config/redis.js';

/**
 * Express caching middleware for high-traffic GET endpoints
 * @param {number} durationSeconds TTL in seconds (default 120s)
 */
export const cacheResponse = (durationSeconds = 120) => {
    return async (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Exclude specific dynamic paths if requested
        if (req.headers['x-no-cache']) {
            return next();
        }

        const cacheKey = `api_cache:${req.user?.branchId || 'global'}:${req.originalUrl}`;

        try {
            const cachedBody = await cache.get(cacheKey);
            if (cachedBody) {
                res.setHeader('X-Cache-Status', 'HIT');
                res.setHeader('X-Cache-TTL', `${durationSeconds}s`);
                return res.status(200).json(cachedBody);
            }

            res.setHeader('X-Cache-Status', 'MISS');

            // Override res.json to capture and cache response
            const originalJson = res.json.bind(res);
            res.json = (body) => {
                if (res.statusCode === 200 && body && body.success) {
                    cache.set(cacheKey, body, durationSeconds).catch((err) => {
                        console.warn(`Failed to set cache for ${cacheKey}:`, err.message);
                    });
                }
                return originalJson(body);
            };

            next();
        } catch (err) {
            console.warn('Cache middleware error:', err.message);
            next();
        }
    };
};

/**
 * Cache invalidation helper
 */
export const invalidateCachePattern = async (pattern) => {
    await cache.del(pattern);
};

export default {
    cacheResponse,
    invalidateCachePattern
};
