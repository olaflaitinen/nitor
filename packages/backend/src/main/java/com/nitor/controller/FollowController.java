package com.nitor.controller;

import com.nitor.dto.follow.FollowResponse;
import com.nitor.dto.follow.FollowStatsResponse;
import com.nitor.service.FollowService;
import com.nitor.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/follow")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Follow", description = "User follow/unfollow operations")
public class FollowController {

    private final FollowService followService;
    private final SecurityUtils securityUtils;

    @PostMapping("/{userId}")
    @Operation(summary = "Follow a user")
    public ResponseEntity<FollowResponse> followUser(
            @PathVariable UUID userId,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID followerId = extractUserIdFromPrincipal(userDetails);
        FollowResponse response = followService.followUser(followerId, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Unfollow a user")
    public ResponseEntity<Void> unfollowUser(
            @PathVariable UUID userId,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID followerId = extractUserIdFromPrincipal(userDetails);
        followService.unfollowUser(followerId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/followers")
    @Operation(summary = "Get user's followers")
    public ResponseEntity<Page<FollowResponse>> getFollowers(
            @PathVariable UUID userId,
            Pageable pageable) {

        return ResponseEntity.ok(followService.getFollowers(userId, pageable));
    }

    @GetMapping("/{userId}/following")
    @Operation(summary = "Get users that this user follows")
    public ResponseEntity<Page<FollowResponse>> getFollowing(
            @PathVariable UUID userId,
            Pageable pageable) {

        return ResponseEntity.ok(followService.getFollowing(userId, pageable));
    }

    @GetMapping("/{userId}/stats")
    @Operation(summary = "Get follow statistics for user")
    public ResponseEntity<FollowStatsResponse> getFollowStats(
            @PathVariable UUID userId,
            @AuthenticationPrincipal(errorOnInvalidType = false) UserDetails userDetails) {

        UUID currentUserId = null;
        if (userDetails != null) {
            currentUserId = extractUserIdFromPrincipal(userDetails);
        }

        return ResponseEntity.ok(followService.getFollowStats(userId, currentUserId));
    }

    @GetMapping("/is-following/{userId}")
    @Operation(summary = "Check if current user follows target user")
    public ResponseEntity<Boolean> isFollowing(
            @PathVariable UUID userId,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID followerId = extractUserIdFromPrincipal(userDetails);
        boolean isFollowing = followService.isFollowing(followerId, userId);
        return ResponseEntity.ok(isFollowing);
    }

    private UUID extractUserIdFromPrincipal(UserDetails userDetails) {
        String email = userDetails.getUsername();
        return securityUtils.getUserIdFromEmail(email);
    }
}
