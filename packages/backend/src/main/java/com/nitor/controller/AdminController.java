package com.nitor.controller;

import com.nitor.model.AuditLog;
import com.nitor.model.Profile;
import com.nitor.model.Report;
import com.nitor.model.User;
import com.nitor.service.AdminService;
import com.nitor.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Admin endpoints for platform management
 *
 * All endpoints require admin privileges
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin platform management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;
    private final SecurityUtils securityUtils;

    @GetMapping("/stats")
    @Operation(summary = "Get platform statistics", description = "Admin only: Get platform usage statistics")
    public ResponseEntity<AdminService.PlatformStats> getPlatformStats(
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID adminId = securityUtils.getUserIdFromEmail(userDetails.getUsername());
        AdminService.PlatformStats stats = adminService.getPlatformStats(adminId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users", description = "Admin only: Get paginated list of all users")
    public ResponseEntity<Page<User>> getAllUsers(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        UUID adminId = securityUtils.getUserIdFromEmail(userDetails.getUsername());
        Page<User> users = adminService.getAllUsers(adminId, pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/search")
    @Operation(summary = "Search users", description = "Admin only: Search users by email or name")
    public ResponseEntity<List<User>> searchUsers(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String query) {

        UUID adminId = securityUtils.getUserIdFromEmail(userDetails.getUsername());
        List<User> users = adminService.searchUsers(adminId, query);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{userId}/activate")
    @Operation(summary = "Activate user", description = "Admin only: Activate a user account")
    public ResponseEntity<User> activateUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID userId) {

        UUID adminId = securityUtils.getUserIdFromEmail(userDetails.getUsername());
        User user = adminService.setUserActiveStatus(adminId, userId, true);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{userId}/deactivate")
    @Operation(summary = "Deactivate user", description = "Admin only: Deactivate a user account")
    public ResponseEntity<User> deactivateUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID userId) {

        UUID adminId = securityUtils.getUserIdFromEmail(userDetails.getUsername());
        User user = adminService.setUserActiveStatus(adminId, userId, false);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profiles/{profileId}/verify")
    @Operation(summary = "Verify profile", description = "Admin only: Verify a user profile")
    public ResponseEntity<Profile> verifyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID profileId) {

        UUID adminId = securityUtils.getUserIdFromEmail(userDetails.getUsername());
        Profile profile = adminService.verifyProfile(adminId, profileId);
        return ResponseEntity.ok(profile);
    }

    @DeleteMapping("/content/{contentId}")
    @Operation(summary = "Remove content", description = "Admin only: Remove content for moderation")
    public ResponseEntity<Void> removeContent(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID contentId,
            @RequestParam(required = false, defaultValue = "Violates community guidelines") String reason) {

        UUID adminId = securityUtils.getUserIdFromEmail(userDetails.getUsername());
        adminService.removeContent(adminId, contentId, reason);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reports")
    @Operation(summary = "Get reports", description = "Admin only: Get all content reports")
    public ResponseEntity<Page<Report>> getReports(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Report.ReportStatus status,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        UUID adminId = securityUtils.getUserIdFromEmail(userDetails.getUsername());
        Page<Report> reports = adminService.getReports(adminId, status, pageable);
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/reports/{reportId}")
    @Operation(summary = "Update report status", description = "Admin only: Update report status and resolution")
    public ResponseEntity<Report> updateReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID reportId,
            @RequestParam Report.ReportStatus status,
            @RequestParam(required = false, defaultValue = "") String resolution) {

        UUID adminId = securityUtils.getUserIdFromEmail(userDetails.getUsername());
        Report report = adminService.updateReportStatus(adminId, reportId, status, resolution);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Get audit logs", description = "Admin only: Get platform audit logs")
    public ResponseEntity<Page<AuditLog>> getAuditLogs(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 50, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        UUID adminId = securityUtils.getUserIdFromEmail(userDetails.getUsername());
        Page<AuditLog> auditLogs = adminService.getAuditLogs(adminId, pageable);
        return ResponseEntity.ok(auditLogs);
    }

    @GetMapping("/audit-logs/user/{userId}")
    @Operation(summary = "Get user audit logs", description = "Admin only: Get audit logs for specific user")
    public ResponseEntity<Page<AuditLog>> getUserAuditLogs(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID userId,
            @PageableDefault(size = 50, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        UUID adminId = securityUtils.getUserIdFromEmail(userDetails.getUsername());
        Page<AuditLog> auditLogs = adminService.getUserAuditLogs(adminId, userId, pageable);
        return ResponseEntity.ok(auditLogs);
    }
}
