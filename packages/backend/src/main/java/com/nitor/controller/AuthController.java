package com.nitor.controller;

import com.nitor.annotation.RateLimited;
import com.nitor.dto.auth.AuthResponse;
import com.nitor.dto.auth.LoginRequest;
import com.nitor.dto.auth.RefreshTokenRequest;
import com.nitor.dto.auth.RegisterRequest;
import com.nitor.service.AuthService;
import com.nitor.service.RefreshTokenService;
import com.nitor.service.RateLimitingService.RateLimitType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Create a new user account with profile")
    @RateLimited(type = RateLimitType.AUTH_REGISTER, keyPrefix = "ip")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT tokens")
    @RateLimited(type = RateLimitType.AUTH_LOGIN, keyPrefix = "ip")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Generate new access token using refresh token")
    public ResponseEntity<RefreshTokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        RefreshTokenService.TokenPair tokenPair = refreshTokenService.refreshAccessToken(request.getRefreshToken());

        RefreshTokenResponse response = new RefreshTokenResponse(
                tokenPair.accessToken(),
                tokenPair.refreshToken(),
                "Bearer"
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Invalidate refresh token")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenRequest request) {
        refreshTokenService.revokeToken(request.getRefreshToken());
        return ResponseEntity.ok().build();
    }

    public record RefreshTokenResponse(String accessToken, String refreshToken, String tokenType) {}
}
