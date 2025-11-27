package com.nitor.service;

import com.nitor.exception.BadRequestException;
import com.nitor.exception.ResourceNotFoundException;
import com.nitor.model.RefreshToken;
import com.nitor.model.User;
import com.nitor.repository.RefreshTokenRepository;
import com.nitor.repository.UserRepository;
import com.nitor.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Value("${jwt.refresh-expiration:604800000}") // 7 days in milliseconds
    private long refreshTokenExpiration;

    private static final int TOKEN_LENGTH = 64;

    /**
     * Creates a new refresh token for a user
     */
    @Transactional
    public RefreshToken createRefreshToken(UUID userId) {
        log.info("Creating refresh token for user: {}", userId);

        // Verify user exists
        userRepository.findById(Objects.requireNonNull(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));

        // Revoke all existing tokens for this user (single device policy)
        // For multi-device support, remove this line and implement device tracking
        refreshTokenRepository.revokeAllUserTokens(userId);

        // Generate secure random token
        String token = generateSecureToken();

        // Calculate expiration
        LocalDateTime expiresAt = LocalDateTime.now()
                .plusSeconds(refreshTokenExpiration / 1000);

        RefreshToken refreshToken = RefreshToken.builder()
                .userId(userId)
                .token(token)
                .expiresAt(expiresAt)
                .revoked(false)
                .build();

        refreshToken = Objects.requireNonNull(refreshTokenRepository.save(refreshToken));
        log.info("Refresh token created for user: {}", userId);

        return refreshToken;
    }

    /**
     * Validates a refresh token and returns it if valid
     */
    @Transactional(readOnly = true)
    public RefreshToken validateRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (refreshToken.getRevoked()) {
            log.warn("Attempted use of revoked refresh token");
            throw new BadRequestException("Refresh token has been revoked");
        }

        if (refreshToken.isExpired()) {
            log.warn("Attempted use of expired refresh token");
            throw new BadRequestException("Refresh token has expired");
        }

        return refreshToken;
    }

    /**
     * Rotates a refresh token - creates a new one and revokes the old one
     * This is critical for security to prevent token replay attacks
     */
    @Transactional
    public RefreshToken rotateRefreshToken(String oldToken) {
        log.info("Rotating refresh token");

        // Validate the old token
        RefreshToken oldRefreshToken = validateRefreshToken(oldToken);

        // Revoke the old token
        oldRefreshToken.setRevoked(true);
        refreshTokenRepository.save(oldRefreshToken);

        // Create and return a new token
        RefreshToken newRefreshToken = createRefreshToken(oldRefreshToken.getUserId());

        log.info("Refresh token rotated successfully for user: {}", oldRefreshToken.getUserId());
        return newRefreshToken;
    }

    /**
     * Generates a new access token from a valid refresh token
     * Also rotates the refresh token for security
     */
    @Transactional
    public TokenPair refreshAccessToken(String refreshTokenString) {
        log.info("Refreshing access token");

        // Validate and rotate the refresh token
        RefreshToken oldRefreshToken = validateRefreshToken(refreshTokenString);
        RefreshToken newRefreshToken = rotateRefreshToken(refreshTokenString);

        // Get user details
        User user = userRepository.findById(Objects.requireNonNull(oldRefreshToken.getUserId()))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Generate new access token
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());

        log.info("Access token refreshed for user: {}", user.getId());

        return new TokenPair(accessToken, newRefreshToken.getToken());
    }

    /**
     * Revokes a specific refresh token
     */
    @Transactional
    public void revokeToken(String token) {
        log.info("Revoking refresh token");
        refreshTokenRepository.revokeToken(token);
    }

    /**
     * Revokes all refresh tokens for a user (useful for logout from all devices)
     */
    @Transactional
    public void revokeAllUserTokens(UUID userId) {
        log.info("Revoking all refresh tokens for user: {}", userId);
        refreshTokenRepository.revokeAllUserTokens(userId);
    }

    /**
     * Scheduled task to clean up expired and revoked tokens
     * Runs daily at 3 AM
     */
    @Scheduled(cron = "0 0 3 * * ?")
    @Transactional
    public void cleanupExpiredTokens() {
        log.info("Running scheduled cleanup of expired refresh tokens");
        LocalDateTime now = LocalDateTime.now();
        refreshTokenRepository.deleteExpiredAndRevokedTokens(now);
        log.info("Expired refresh tokens cleanup completed");
    }

    /**
     * Generates a cryptographically secure random token
     */
    private String generateSecureToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[TOKEN_LENGTH];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    /**
     * DTO for returning both access and refresh tokens
     */
    public record TokenPair(String accessToken, String refreshToken) {
    }
}
