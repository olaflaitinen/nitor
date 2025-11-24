package com.nitor.service;

import com.nitor.exception.BadRequestException;
import com.nitor.exception.ResourceNotFoundException;
import com.nitor.exception.UnauthorizedException;
import com.nitor.model.*;
import com.nitor.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Admin service for platform management
 *
 * Provides functionality for:
 * - User management (activate/deactivate, verify)
 * - Content moderation (remove inappropriate content)
 * - Report handling
 * - Platform statistics
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ContentRepository contentRepository;
    private final ReportRepository reportRepository;
    private final AuditLogRepository auditLogRepository;

    /**
     * Check if user has admin privileges
     * In production, this would check against a roles table
     */
    public boolean isAdmin(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // For now, check if email contains "admin"
        // In production: implement proper role-based access control
        return user.getEmail().contains("admin");
    }

    /**
     * Verify admin access or throw exception
     */
    private void requireAdmin(UUID userId) {
        if (!isAdmin(userId)) {
            log.warn("Unauthorized admin access attempt by user: {}", userId);
            throw new UnauthorizedException("Admin access required");
        }
    }

    /**
     * Get platform statistics
     */
    @Transactional(readOnly = true)
    public PlatformStats getPlatformStats(UUID adminId) {
        requireAdmin(adminId);

        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByIsActiveTrue();
        long verifiedProfiles = profileRepository.countByVerifiedTrue();
        long totalContent = contentRepository.count();
        long pendingReports = reportRepository.countByStatus(Report.ReportStatus.PENDING);

        return new PlatformStats(
                totalUsers,
                activeUsers,
                verifiedProfiles,
                totalContent,
                pendingReports
        );
    }

    /**
     * Get all users with pagination
     */
    @Transactional(readOnly = true)
    public Page<User> getAllUsers(UUID adminId, Pageable pageable) {
        requireAdmin(adminId);
        return userRepository.findAll(pageable);
    }

    /**
     * Activate or deactivate a user
     */
    @Transactional
    public User setUserActiveStatus(UUID adminId, UUID targetUserId, boolean active) {
        requireAdmin(adminId);

        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", targetUserId.toString()));

        if (user.getEmail().contains("admin")) {
            throw new BadRequestException("Cannot modify admin users");
        }

        user.setIsActive(active);
        user = userRepository.save(user);

        // Audit log
        createAuditLog(
                adminId,
                "USER_" + (active ? "ACTIVATED" : "DEACTIVATED"),
                "User " + targetUserId + " " + (active ? "activated" : "deactivated"),
                targetUserId.toString()
        );

        log.info("User {} {} by admin {}", targetUserId, (active ? "activated" : "deactivated"), adminId);
        return user;
    }

    /**
     * Verify a user profile
     */
    @Transactional
    public Profile verifyProfile(UUID adminId, UUID profileId) {
        requireAdmin(adminId);

        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        profile.setVerified(true);
        profile = profileRepository.save(profile);

        createAuditLog(
                adminId,
                "PROFILE_VERIFIED",
                "Profile " + profileId + " verified",
                profileId.toString()
        );

        log.info("Profile {} verified by admin {}", profileId, adminId);
        return profile;
    }

    /**
     * Remove content (content moderation)
     */
    @Transactional
    public void removeContent(UUID adminId, UUID contentId, String reason) {
        requireAdmin(adminId);

        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found"));

        contentRepository.delete(content);

        createAuditLog(
                adminId,
                "CONTENT_REMOVED",
                "Content removed. Reason: " + reason,
                contentId.toString()
        );

        log.info("Content {} removed by admin {}. Reason: {}", contentId, adminId, reason);
    }

    /**
     * Get all reports with pagination
     */
    @Transactional(readOnly = true)
    public Page<Report> getReports(UUID adminId, Report.ReportStatus status, Pageable pageable) {
        requireAdmin(adminId);

        if (status != null) {
            return reportRepository.findByStatus(status, pageable);
        }
        return reportRepository.findAll(pageable);
    }

    /**
     * Update report status
     */
    @Transactional
    public Report updateReportStatus(UUID adminId, UUID reportId, Report.ReportStatus newStatus, String resolution) {
        requireAdmin(adminId);

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        report.setStatus(newStatus);
        report.setResolvedAt(LocalDateTime.now());
        report.setResolvedBy(adminId);

        report = reportRepository.save(report);

        createAuditLog(
                adminId,
                "REPORT_UPDATED",
                "Report " + reportId + " status updated to " + newStatus + ". Resolution: " + resolution,
                reportId.toString()
        );

        log.info("Report {} updated to {} by admin {}", reportId, newStatus, adminId);
        return report;
    }

    /**
     * Get audit logs with pagination
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogs(UUID adminId, Pageable pageable) {
        requireAdmin(adminId);
        return auditLogRepository.findAll(pageable);
    }

    /**
     * Get audit logs for a specific user
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getUserAuditLogs(UUID adminId, UUID targetUserId, Pageable pageable) {
        requireAdmin(adminId);
        return auditLogRepository.findByUserId(targetUserId, pageable);
    }

    /**
     * Search users by email or name
     */
    @Transactional(readOnly = true)
    public List<User> searchUsers(UUID adminId, String query) {
        requireAdmin(adminId);
        return userRepository.findByEmailContainingIgnoreCase(query);
    }

    /**
     * Create audit log entry
     */
    private void createAuditLog(UUID userId, String action, String details, String resourceId) {
        AuditLog auditLog = AuditLog.builder()
                .userId(userId)
                .action(action)
                .details(details)
                .resourceId(resourceId)
                .ipAddress("system")
                .userAgent("admin-service")
                .build();

        auditLogRepository.save(auditLog);
    }

    /**
     * Platform statistics DTO
     */
    public record PlatformStats(
            long totalUsers,
            long activeUsers,
            long verifiedProfiles,
            long totalContent,
            long pendingReports
    ) {}
}
