package com.nitor.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate limiting service using token bucket algorithm (Bucket4j)
 *
 * Provides multiple rate limiting strategies:
 * - Per IP address
 * - Per user ID
 * - Per API endpoint
 * - Global rate limiting
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RateLimitingService {

    // private final RedisTemplate<String, String> redisTemplate;

    // In-memory bucket cache (for development)
    // In production with multiple instances, use Redis-backed buckets
    private final Map<String, Bucket> bucketCache = new ConcurrentHashMap<>();

    /**
     * Rate limit configurations
     */
    public enum RateLimitType {
        // Authentication endpoints - 5 requests per minute
        AUTH_LOGIN(5, Duration.ofMinutes(1)),
        AUTH_REGISTER(3, Duration.ofMinutes(1)),

        // API endpoints - 100 requests per minute
        API_GENERAL(100, Duration.ofMinutes(1)),

        // Content creation - 10 posts per hour
        CONTENT_CREATE(10, Duration.ofHours(1)),

        // File upload - 20 uploads per hour
        FILE_UPLOAD(20, Duration.ofHours(1)),

        // Search - 30 searches per minute
        SEARCH(30, Duration.ofMinutes(1)),

        // Follow/Unfollow - 50 actions per hour
        FOLLOW_ACTION(50, Duration.ofHours(1)),

        // Comments - 30 comments per hour
        COMMENT_CREATE(30, Duration.ofHours(1)),

        // Email sending - 5 emails per hour
        EMAIL_SEND(5, Duration.ofHours(1));

        private final long capacity;
        private final Duration refillPeriod;

        RateLimitType(long capacity, Duration refillPeriod) {
            this.capacity = capacity;
            this.refillPeriod = refillPeriod;
        }

        public long getCapacity() {
            return capacity;
        }

        public Duration getRefillPeriod() {
            return refillPeriod;
        }
    }

    /**
     * Check if an action is allowed for a specific key and rate limit type
     *
     * @param key       Unique identifier (IP, userId, etc.)
     * @param limitType Type of rate limit to apply
     * @return true if action is allowed, false if rate limit exceeded
     */
    public boolean isAllowed(String key, RateLimitType limitType) {
        String bucketKey = limitType.name() + ":" + key;
        Bucket bucket = resolveBucket(bucketKey, limitType);

        boolean allowed = bucket.tryConsume(1);

        if (!allowed) {
            log.warn("Rate limit exceeded for key: {} (type: {})", key, limitType);
        }

        return allowed;
    }

    /**
     * Check if action is allowed and throw exception if not
     *
     * @param key       Unique identifier
     * @param limitType Type of rate limit
     * @throws RateLimitExceededException if limit is exceeded
     */
    public void checkLimit(String key, RateLimitType limitType) {
        if (!isAllowed(key, limitType)) {
            throw new RateLimitExceededException(
                    "Rate limit exceeded for " + limitType.name() +
                            ". Please try again later.");
        }
    }

    /**
     * Get remaining tokens for a specific key and limit type
     *
     * @param key       Unique identifier
     * @param limitType Type of rate limit
     * @return Number of remaining requests
     */
    public long getRemainingTokens(String key, RateLimitType limitType) {
        String bucketKey = limitType.name() + ":" + key;
        Bucket bucket = resolveBucket(bucketKey, limitType);
        return bucket.getAvailableTokens();
    }

    /**
     * Reset rate limit for a specific key and type
     * Useful for testing or admin override
     *
     * @param key       Unique identifier
     * @param limitType Type of rate limit
     */
    public void resetLimit(String key, RateLimitType limitType) {
        String bucketKey = limitType.name() + ":" + key;
        bucketCache.remove(bucketKey);
        log.info("Rate limit reset for key: {} (type: {})", key, limitType);
    }

    /**
     * Resolve or create a bucket for the given key
     */
    private Bucket resolveBucket(String key, RateLimitType limitType) {
        return bucketCache.computeIfAbsent(key, k -> createBucket(limitType));
    }

    /**
     * Create a new bucket with the specified rate limit configuration
     */
    @SuppressWarnings("deprecation")
    private Bucket createBucket(RateLimitType limitType) {
        Bandwidth limit = Bandwidth.classic(
                limitType.getCapacity(),
                Refill.intervally(
                        limitType.getCapacity(),
                        limitType.getRefillPeriod()));

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Custom exception for rate limit violations
     */
    public static class RateLimitExceededException extends RuntimeException {
        public RateLimitExceededException(String message) {
            super(message);
        }
    }
}
