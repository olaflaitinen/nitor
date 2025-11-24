package com.nitor.service.oauth;

import com.nitor.dto.auth.AuthResponse;
import com.nitor.exception.BadRequestException;
import com.nitor.model.Profile;
import com.nitor.model.User;
import com.nitor.repository.ProfileRepository;
import com.nitor.repository.UserRepository;
import com.nitor.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${oauth.google.enabled:false}")
    private boolean googleOAuthEnabled;

    @Value("${oauth.github.enabled:false}")
    private boolean githubOAuthEnabled;

    @Value("${oauth.linkedin.enabled:false}")
    private boolean linkedinOAuthEnabled;

    @Transactional
    public AuthResponse handleOAuthCallback(String provider, String code) {
        log.info("Handling OAuth callback for provider: {}", provider);

        if (!isProviderEnabled(provider)) {
            throw new BadRequestException("OAuth provider " + provider + " is not enabled");
        }

        // TODO: Implement actual OAuth flow
        // 1. Exchange code for access token
        // 2. Fetch user info from provider
        // 3. Create or update user
        // 4. Generate JWT tokens

        throw new UnsupportedOperationException(
            "OAuth integration for " + provider + " requires configuration. " +
            "Please provide OAuth credentials in environment variables."
        );
    }

    @Transactional
    public User createOrUpdateOAuthUser(String provider, String email, String name, String avatarUrl) {
        return userRepository.findByEmail(email)
            .map(existingUser -> {
                log.info("OAuth user already exists: {}", email);
                return existingUser;
            })
            .orElseGet(() -> {
                log.info("Creating new OAuth user: {}", email);

                User newUser = User.builder()
                    .email(email)
                    .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString())) // Random password
                    .emailVerified(true) // Auto-verify OAuth users
                    .build();

                newUser = userRepository.save(newUser);

                Profile newProfile = Profile.builder()
                    .fullName(name)
                    .handle(generateHandleFromEmail(email))
                    .avatarUrl(avatarUrl)
                    .build();
                newProfile.setUser(newUser);

                profileRepository.save(newProfile);

                return newUser;
            });
    }

    private boolean isProviderEnabled(String provider) {
        return switch (provider.toLowerCase()) {
            case "google" -> googleOAuthEnabled;
            case "github" -> githubOAuthEnabled;
            case "linkedin" -> linkedinOAuthEnabled;
            default -> false;
        };
    }

    private String generateHandleFromEmail(String email) {
        String baseHandle = email.split("@")[0]
            .toLowerCase()
            .replaceAll("[^a-z0-9]", "");

        String handle = baseHandle;
        int suffix = 1;

        while (profileRepository.existsByHandle(handle)) {
            handle = baseHandle + suffix;
            suffix++;
        }

        return handle;
    }

    public boolean isOAuthEnabled() {
        return googleOAuthEnabled || githubOAuthEnabled || linkedinOAuthEnabled;
    }
}
