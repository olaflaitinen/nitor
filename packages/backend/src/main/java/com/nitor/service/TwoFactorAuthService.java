package com.nitor.service;

import com.nitor.exception.BadRequestException;
import com.nitor.exception.ResourceNotFoundException;
import com.nitor.model.TwoFactorAuth;
import com.nitor.repository.TwoFactorAuthRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.UUID;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class TwoFactorAuthService {

    private final TwoFactorAuthRepository twoFactorAuthRepository;
    private static final int BACKUP_CODES_COUNT = 10;

    @Transactional
    public TwoFactorAuth enable2FA(UUID userId) {
        log.info("Enabling 2FA for user: {}", userId);

        // Check if already exists
        TwoFactorAuth existing = twoFactorAuthRepository.findByUserId(userId).orElse(null);
        if (existing != null && existing.getEnabled()) {
            throw new BadRequestException("2FA is already enabled");
        }

        String secretKey = generateSecretKey();
        String[] backupCodes = generateBackupCodes();

        TwoFactorAuth twoFactorAuth = TwoFactorAuth.builder()
                .userId(userId)
                .secretKey(secretKey)
                .backupCodes(backupCodes)
                .enabled(false) // Will be enabled after verification
                .verified(false)
                .build();

        return Objects.requireNonNull(twoFactorAuthRepository.save(twoFactorAuth));
    }

    @Transactional
    public void verify2FA(UUID userId, String code) {
        TwoFactorAuth twoFactorAuth = twoFactorAuthRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("2FA not setup for user"));

        if (!validateTOTP(twoFactorAuth.getSecretKey(), code)) {
            throw new BadRequestException("Invalid verification code");
        }

        twoFactorAuth.setVerified(true);
        twoFactorAuth.setEnabled(true);
        twoFactorAuthRepository.save(Objects.requireNonNull(twoFactorAuth));

        log.info("2FA verified and enabled for user: {}", userId);
    }

    @Transactional
    public void disable2FA(UUID userId, String code) {
        TwoFactorAuth twoFactorAuth = twoFactorAuthRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("2FA not found"));

        if (!validateTOTP(twoFactorAuth.getSecretKey(), code)) {
            throw new BadRequestException("Invalid code");
        }

        twoFactorAuthRepository.delete(twoFactorAuth);
        log.info("2FA disabled for user: {}", userId);
    }

    public boolean validate2FACode(UUID userId, String code) {
        TwoFactorAuth twoFactorAuth = twoFactorAuthRepository.findByUserId(userId)
                .orElse(null);

        if (twoFactorAuth == null || !twoFactorAuth.getEnabled()) {
            return false;
        }

        // Check TOTP code
        if (validateTOTP(twoFactorAuth.getSecretKey(), code)) {
            return true;
        }

        // Check backup codes
        return checkBackupCode(twoFactorAuth, code);
    }

    public boolean is2FAEnabled(UUID userId) {
        return twoFactorAuthRepository.findByUserId(userId)
                .map(TwoFactorAuth::getEnabled)
                .orElse(false);
    }

    private String generateSecretKey() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[20];
        random.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }

    private String[] generateBackupCodes() {
        SecureRandom random = new SecureRandom();
        return IntStream.range(0, BACKUP_CODES_COUNT)
                .mapToObj(i -> String.format("%08d", random.nextInt(100000000)))
                .toArray(String[]::new);
    }

    private boolean validateTOTP(String secretKey, String code) {
        try {
            long timeWindow = System.currentTimeMillis() / 1000 / 30;
            String expectedCode = generateTOTP(secretKey, timeWindow);
            return code.equals(expectedCode);
        } catch (Exception e) {
            log.error("Error validating TOTP", e);
            return false;
        }
    }

    private String generateTOTP(String secretKey, long timeWindow) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        byte[] data = new byte[8];
        for (int i = 7; i >= 0; i--) {
            data[i] = (byte) (timeWindow & 0xff);
            timeWindow >>= 8;
        }

        Mac mac = Mac.getInstance("HmacSHA1");
        mac.init(new SecretKeySpec(keyBytes, "RAW"));
        byte[] hash = mac.doFinal(data);

        int offset = hash[hash.length - 1] & 0xf;
        int binary = ((hash[offset] & 0x7f) << 24)
                | ((hash[offset + 1] & 0xff) << 16)
                | ((hash[offset + 2] & 0xff) << 8)
                | (hash[offset + 3] & 0xff);

        int otp = binary % 1000000;
        return String.format("%06d", otp);
    }

    @Transactional
    private boolean checkBackupCode(TwoFactorAuth twoFactorAuth, String code) {
        String[] backupCodes = twoFactorAuth.getBackupCodes();
        if (backupCodes == null) {
            return false;
        }

        for (int i = 0; i < backupCodes.length; i++) {
            if (code.equals(backupCodes[i])) {
                // Invalidate used backup code
                backupCodes[i] = null;
                twoFactorAuth.setBackupCodes(backupCodes);
                twoFactorAuthRepository.save(Objects.requireNonNull(twoFactorAuth));
                log.info("Backup code used for user: {}", twoFactorAuth.getUserId());
                return true;
            }
        }
        return false;
    }
}
