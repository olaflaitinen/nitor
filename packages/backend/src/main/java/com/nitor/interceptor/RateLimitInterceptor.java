package com.nitor.interceptor;

import com.nitor.annotation.RateLimited;
import com.nitor.service.RateLimitingService;
import com.nitor.util.SecurityUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.UUID;

/**
 * Interceptor that automatically applies rate limiting based on @RateLimited annotation
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimitingService rateLimitingService;
    private final SecurityUtils securityUtils;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;
        RateLimited rateLimited = handlerMethod.getMethodAnnotation(RateLimited.class);

        if (rateLimited == null) {
            return true; // No rate limiting configured
        }

        // Determine the rate limit key based on configuration
        String key = getRateLimitKey(request, rateLimited.keyPrefix());

        // Check rate limit
        rateLimitingService.checkLimit(key, rateLimited.type());

        // Add rate limit headers to response
        long remainingTokens = rateLimitingService.getRemainingTokens(key, rateLimited.type());
        response.setHeader("X-RateLimit-Limit", String.valueOf(rateLimited.type().getCapacity()));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(remainingTokens));

        return true;
    }

    /**
     * Determine the rate limit key based on the key prefix
     */
    private String getRateLimitKey(HttpServletRequest request, String keyPrefix) {
        return switch (keyPrefix) {
            case "user" -> {
                // Rate limit by authenticated user
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.isAuthenticated()) {
                    try {
                        UUID userId = securityUtils.getUserIdFromEmail(auth.getName());
                        yield userId.toString();
                    } catch (Exception e) {
                        log.warn("Failed to extract user ID for rate limiting, falling back to IP");
                        yield getClientIp(request);
                    }
                }
                yield getClientIp(request);
            }
            case "ip" -> getClientIp(request);
            default -> keyPrefix + ":" + getClientIp(request);
        };
    }

    /**
     * Extract client IP address from request
     * Handles X-Forwarded-For header for proxy/load balancer scenarios
     */
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}
