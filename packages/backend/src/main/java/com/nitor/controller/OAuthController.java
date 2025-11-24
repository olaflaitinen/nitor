package com.nitor.controller;

import com.nitor.dto.auth.AuthResponse;
import com.nitor.service.oauth.OAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/oauth2")
@RequiredArgsConstructor
@Tag(name = "OAuth", description = "OAuth 2.0 social login")
@Slf4j
public class OAuthController {

    private final OAuthService oAuthService;

    @GetMapping("/callback/{provider}")
    @Operation(summary = "OAuth callback endpoint")
    public ResponseEntity<AuthResponse> oauthCallback(
            @PathVariable String provider,
            @RequestParam String code,
            @RequestParam(required = false) String state) {

        log.info("OAuth callback received from provider: {}", provider);
        AuthResponse response = oAuthService.handleOAuthCallback(provider, code);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    @Operation(summary = "Check OAuth status")
    public ResponseEntity<OAuthStatusResponse> getOAuthStatus() {
        boolean enabled = oAuthService.isOAuthEnabled();
        return ResponseEntity.ok(new OAuthStatusResponse(enabled));
    }

    public record OAuthStatusResponse(boolean enabled) {}
}
