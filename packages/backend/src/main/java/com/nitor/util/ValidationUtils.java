package com.nitor.util;

import java.util.regex.Pattern;

public class ValidationUtils {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    private static final Pattern HANDLE_PATTERN = Pattern.compile(
        "^[a-z0-9_-]{3,30}$"
    );

    private static final Pattern ORCID_PATTERN = Pattern.compile(
        "^\\d{4}-\\d{4}-\\d{4}-\\d{3}[0-9X]$"
    );

    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );

    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    public static boolean isValidHandle(String handle) {
        return handle != null && HANDLE_PATTERN.matcher(handle).matches();
    }

    public static boolean isValidOrcid(String orcid) {
        return orcid != null && ORCID_PATTERN.matcher(orcid).matches();
    }

    public static boolean isValidPassword(String password) {
        return password != null && PASSWORD_PATTERN.matcher(password).matches();
    }

    public static boolean isValidUrl(String url) {
        if (url == null || url.isBlank()) {
            return false;
        }
        try {
            new java.net.URL(url);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static String sanitizeHandle(String handle) {
        if (handle == null) {
            return null;
        }
        return handle.toLowerCase()
                .replaceAll("[^a-z0-9_-]", "")
                .substring(0, Math.min(handle.length(), 30));
    }
}
