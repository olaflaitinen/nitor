package com.nitor.service;

import com.nitor.dto.auth.AuthResponse;
import com.nitor.dto.auth.LoginRequest;
import com.nitor.dto.auth.RegisterRequest;
import com.nitor.dto.profile.ProfileResponse;
import com.nitor.exception.BadRequestException;
import com.nitor.exception.ResourceNotFoundException;
import com.nitor.model.Profile;
import com.nitor.model.User;
import com.nitor.repository.ProfileRepository;
import com.nitor.repository.UserRepository;
import com.nitor.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class AuthService {

        private final UserRepository userRepository;
        private final ProfileRepository profileRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;
        private final AuthenticationManager authenticationManager;
        private final RefreshTokenService refreshTokenService;

        @Transactional
        public AuthResponse register(RegisterRequest request) {
                log.info("Registering new user: {}", request.getEmail());

                // Check if user already exists
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new BadRequestException("Email already registered");
                }

                if (profileRepository.existsByHandle(request.getHandle())) {
                        throw new BadRequestException("Handle already taken");
                }

                // Create user
                User user = User.builder()
                                .email(request.getEmail())
                                .passwordHash(passwordEncoder.encode(request.getPassword()))
                                .emailVerified(true) // Auto-verify for demo (in production, send email)
                                .isActive(true)
                                .build();

                user = Objects.requireNonNull(userRepository.save(user));

                // Create profile
                Profile profile = Profile.builder()
                                .id(user.getId())
                                .user(user)
                                .fullName(request.getFullName())
                                .handle(request.getHandle())
                                .nitorScore(BigDecimal.ZERO)
                                .verified(false)
                                .onboardingComplete(false)
                                .followersCount(0)
                                .followingCount(0)
                                .publicationsCount(0)
                                .profileVisibility(Profile.ProfileVisibility.PUBLIC)
                                .build();

                profile = profileRepository.save(Objects.requireNonNull(profile));

                // Generate tokens
                String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());
                String refreshToken = refreshTokenService.createRefreshToken(user.getId()).getToken();

                log.info("User registered successfully: {}", user.getEmail());

                return AuthResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken)
                                .tokenType("Bearer")
                                .user(mapToProfileResponse(profile, user))
                                .needsOnboarding(true)
                                .build();
        }

        @Transactional(readOnly = true)
        public AuthResponse login(LoginRequest request) {
                log.info("User login attempt: {}", request.getEmail());

                // Authenticate user
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                // Get user
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

                // Get profile
                Profile profile = profileRepository.findById(user.getId())
                                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user"));

                // Generate tokens
                String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());
                String refreshToken = refreshTokenService.createRefreshToken(user.getId()).getToken();

                log.info("User logged in successfully: {}", user.getEmail());

                return AuthResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken)
                                .tokenType("Bearer")
                                .user(mapToProfileResponse(profile, user))
                                .needsOnboarding(!profile.getOnboardingComplete())
                                .build();
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

        @Transactional
        public void forgotPassword(String email) {
                log.info("Password reset requested for email: {}", email);

                // Find user by email (don't reveal if user exists or not for security)
                userRepository.findByEmail(email).ifPresent(user -> {
                        // Generate reset token (UUID)
                        String resetToken = UUID.randomUUID().toString();

                        // Set token and expiry (15 minutes)
                        user.setResetPasswordToken(resetToken);
                        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(15));

                        userRepository.save(user);

                        // TODO: In production, send email with reset link
                        // For now, just log the token (dev/demo mode)
                        log.info("Password reset token for {}: {}", email, resetToken);
                        log.info("Reset link: http://localhost:3000/#/reset-password?token={}", resetToken);
                });
        }

        @Transactional
        public void resetPassword(String token, String newPassword) {
                log.info("Password reset attempt with token");

                // Find user by reset token
                User user = userRepository.findByResetPasswordToken(token)
                                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

                // Check if token is expired
                if (user.getResetPasswordTokenExpiry() == null ||
                                user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
                        throw new BadRequestException("Reset token has expired");
                }

                // Update password
                user.setPasswordHash(passwordEncoder.encode(newPassword));

                // Clear reset token
                user.setResetPasswordToken(null);
                user.setResetPasswordTokenExpiry(null);

                userRepository.save(user);

                log.info("Password reset successfully for user: {}", user.getEmail());
        }
}
