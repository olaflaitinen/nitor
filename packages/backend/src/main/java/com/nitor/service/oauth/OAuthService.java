package com.nitor.service.oauth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nitor.dto.auth.AuthResponse;
import com.nitor.dto.profile.ProfileResponse;
import com.nitor.exception.BadRequestException;
import com.nitor.model.Profile;
import com.nitor.model.User;
import com.nitor.repository.ProfileRepository;
import com.nitor.repository.UserRepository;
import com.nitor.security.JwtUtil;
import com.nitor.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings("null")
public class OAuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Google OAuth
    @Value("${oauth.google.enabled:false}")
    private boolean googleOAuthEnabled;

    @Value("${oauth.google.client-id:}")
    private String googleClientId;

    @Value("${oauth.google.client-secret:}")
    private String googleClientSecret;

    @Value("${oauth.google.redirect-uri:}")
    private String googleRedirectUri;

    @Value("${oauth.google.token-uri:}")
    private String googleTokenUri;

    @Value("${oauth.google.user-info-uri:}")
    private String googleUserInfoUri;

    // GitHub OAuth
    @Value("${oauth.github.enabled:false}")
    private boolean githubOAuthEnabled;

    @Value("${oauth.github.client-id:}")
    private String githubClientId;

    @Value("${oauth.github.client-secret:}")
    private String githubClientSecret;

    @Value("${oauth.github.redirect-uri:}")
    private String githubRedirectUri;

    @Value("${oauth.github.token-uri:}")
    private String githubTokenUri;

    @Value("${oauth.github.user-info-uri:}")
    private String githubUserInfoUri;

    // LinkedIn OAuth
    @Value("${oauth.linkedin.enabled:false}")
    private boolean linkedinOAuthEnabled;

    @Value("${oauth.linkedin.client-id:}")
    private String linkedinClientId;

    @Value("${oauth.linkedin.client-secret:}")
    private String linkedinClientSecret;

    @Value("${oauth.linkedin.redirect-uri:}")
    private String linkedinRedirectUri;

    @Value("${oauth.linkedin.token-uri:}")
    private String linkedinTokenUri;

    @Value("${oauth.linkedin.user-info-uri:}")
    private String linkedinUserInfoUri;

    @Transactional
    public AuthResponse handleOAuthCallback(String provider, String code) {
        log.info("Handling OAuth callback for provider: {}", provider);

        if (!isProviderEnabled(provider)) {
            throw new BadRequestException("OAuth provider " + provider + " is not enabled");
        }

        try {
            // 1. Exchange authorization code for access token
            String accessToken = exchangeCodeForToken(provider, code);

            // 2. Fetch user info from provider
            OAuthUserInfo userInfo = fetchUserInfo(provider, accessToken);

            // 3. Create or update user
            User user = createOrUpdateOAuthUser(provider, userInfo.email(), userInfo.name(), userInfo.avatarUrl());

            // 4. Get profile
            Profile profile = profileRepository.findById(Objects.requireNonNull(user.getId()))
                    .orElseThrow(() -> new BadRequestException("Profile not found"));

            // 5. Generate JWT tokens
            String jwtAccessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());
            String refreshToken = refreshTokenService.createRefreshToken(user.getId()).getToken();

            log.info("OAuth authentication successful for user: {}", user.getEmail());

            return AuthResponse.builder()
                    .accessToken(jwtAccessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .user(mapToProfileResponse(profile, user))
                    .needsOnboarding(!profile.getOnboardingComplete())
                    .build();

        } catch (Exception e) {
            log.error("OAuth authentication failed for provider: {}", provider, e);
            throw new BadRequestException("OAuth authentication failed: " + e.getMessage());
        }
    }

    private String exchangeCodeForToken(String provider, String code) throws Exception {
        String tokenUri;
        String clientId;
        String clientSecret;
        String redirectUri;

        switch (provider.toLowerCase()) {
            case "google" -> {
                tokenUri = googleTokenUri;
                clientId = googleClientId;
                clientSecret = googleClientSecret;
                redirectUri = googleRedirectUri;
            }
            case "github" -> {
                tokenUri = githubTokenUri;
                clientId = githubClientId;
                clientSecret = githubClientSecret;
                redirectUri = githubRedirectUri;
            }
            case "linkedin" -> {
                tokenUri = linkedinTokenUri;
                clientId = linkedinClientId;
                clientSecret = linkedinClientSecret;
                redirectUri = linkedinRedirectUri;
            }
            default -> throw new BadRequestException("Unknown provider: " + provider);
        }

        // Prepare request
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        // Exchange code for token
        ResponseEntity<String> response = restTemplate.postForEntity(Objects.requireNonNull(tokenUri), request,
                String.class);

        if (response.getStatusCode() != HttpStatus.OK) {
            throw new BadRequestException("Failed to exchange code for token");
        }

        // Parse response
        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        return jsonNode.get("access_token").asText();
    }

    private OAuthUserInfo fetchUserInfo(String provider, String accessToken) throws Exception {
        String userInfoUri;

        switch (provider.toLowerCase()) {
            case "google" -> userInfoUri = googleUserInfoUri;
            case "github" -> userInfoUri = githubUserInfoUri;
            case "linkedin" -> userInfoUri = linkedinUserInfoUri;
            default -> throw new BadRequestException("Unknown provider: " + provider);
        }

        // Prepare request with Bearer token
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(Objects.requireNonNull(accessToken));
        HttpEntity<String> request = new HttpEntity<>(headers);

        // Fetch user info
        ResponseEntity<String> response = restTemplate.exchange(
                Objects.requireNonNull(userInfoUri),
                HttpMethod.GET,
                request,
                String.class);

        if (response.getStatusCode() != HttpStatus.OK) {
            throw new BadRequestException("Failed to fetch user info");
        }

        // Parse user info based on provider
        return parseUserInfo(provider, response.getBody());
    }

    private OAuthUserInfo parseUserInfo(String provider, String responseBody) throws Exception {
        JsonNode jsonNode = objectMapper.readTree(responseBody);

        return switch (provider.toLowerCase()) {
            case "google" -> new OAuthUserInfo(
                    jsonNode.get("email").asText(),
                    jsonNode.get("name").asText(),
                    jsonNode.has("picture") ? jsonNode.get("picture").asText() : null);
            case "github" -> {
                String email = jsonNode.has("email") && !jsonNode.get("email").isNull()
                        ? jsonNode.get("email").asText()
                        : fetchGithubEmail(jsonNode.get("email").asText()); // GitHub might require separate API call
                yield new OAuthUserInfo(
                        email,
                        jsonNode.get("name").asText(),
                        jsonNode.has("avatar_url") ? jsonNode.get("avatar_url").asText() : null);
            }
            case "linkedin" -> new OAuthUserInfo(
                    fetchLinkedInEmail(), // LinkedIn requires separate API call for email
                    jsonNode.get("localizedFirstName").asText() + " " + jsonNode.get("localizedLastName").asText(),
                    null // LinkedIn profile pictures require separate API call
                );
            default -> throw new BadRequestException("Unknown provider: " + provider);
        };
    }

    private String fetchGithubEmail(String accessToken) {
        // GitHub's /user endpoint might not include email
        // Need to call /user/emails endpoint
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(Objects.requireNonNull(accessToken));
            HttpEntity<String> request = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    "https://api.github.com/user/emails",
                    HttpMethod.GET,
                    request,
                    String.class);

            JsonNode emails = objectMapper.readTree(response.getBody());
            for (JsonNode emailNode : emails) {
                if (emailNode.get("primary").asBoolean()) {
                    return emailNode.get("email").asText();
                }
            }

            // Return first email if no primary found
            if (emails.size() > 0) {
                return emails.get(0).get("email").asText();
            }

            throw new BadRequestException("No email found in GitHub account");
        } catch (Exception e) {
            log.error("Failed to fetch GitHub email", e);
            throw new BadRequestException("Failed to fetch GitHub email");
        }
    }

    private String fetchLinkedInEmail() {
        // LinkedIn requires a separate API call to get email
        // This is a simplified version - in production, you'd need to implement this
        // properly
        throw new UnsupportedOperationException("LinkedIn email fetching not yet implemented");
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
                            .isActive(true)
                            .build();

                    newUser = Objects.requireNonNull(userRepository.save(newUser));

                    Profile newProfile = Profile.builder()
                            .id(newUser.getId())
                            .user(newUser)
                            .fullName(name)
                            .handle(generateHandleFromEmail(email))
                            .avatarUrl(avatarUrl)
                            .nitorScore(BigDecimal.ZERO)
                            .verified(false)
                            .onboardingComplete(false)
                            .followersCount(0)
                            .followingCount(0)
                            .publicationsCount(0)
                            .profileVisibility(Profile.ProfileVisibility.PUBLIC)
                            .build();

                    profileRepository.save(Objects.requireNonNull(newProfile));

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

    private ProfileResponse mapToProfileResponse(Profile profile, User user) {
        return ProfileResponse.builder()
                .id(profile.getId())
                .email(user.getEmail())
                .fullName(profile.getFullName())
                .handle(profile.getHandle())
                .institution(profile.getInstitution())
                .academicTitle(profile.getAcademicTitle())
                .avatarUrl(profile.getAvatarUrl())
                .bio(profile.getBio())
                .orcid(profile.getOrcid())
                .discipline(profile.getDiscipline())
                .nitorScore(profile.getNitorScore())
                .verified(profile.getVerified())
                .onboardingComplete(profile.getOnboardingComplete())
                .followersCount(profile.getFollowersCount())
                .followingCount(profile.getFollowingCount())
                .publicationsCount(profile.getPublicationsCount())
                .profileVisibility(profile.getProfileVisibility().name())
                .build();
    }

    private record OAuthUserInfo(String email, String name, String avatarUrl) {
    }
}
