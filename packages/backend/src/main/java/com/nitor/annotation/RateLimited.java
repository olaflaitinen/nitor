package com.nitor.annotation;

import com.nitor.service.RateLimitingService.RateLimitType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to apply rate limiting to controller methods
 *
 * Usage:
 * @RateLimited(type = RateLimitType.API_GENERAL)
 * public ResponseEntity<?> someEndpoint() { ... }
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimited {
    RateLimitType type() default RateLimitType.API_GENERAL;
    String keyPrefix() default "ip"; // Can be "ip", "user", or custom
}
