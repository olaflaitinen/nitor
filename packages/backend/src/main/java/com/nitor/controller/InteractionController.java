package com.nitor.controller;

import com.nitor.dto.interaction.EndorsementResponse;
import com.nitor.dto.interaction.InteractionStatsResponse;
import com.nitor.dto.interaction.RepostRequest;
import com.nitor.model.Bookmark;
import com.nitor.model.Repost;
import com.nitor.service.InteractionService;
import com.nitor.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
@RequestMapping("/api/content/{contentId}")
@RequiredArgsConstructor
@Tag(name = "Interactions", description = "Content interactions (like, repost, bookmark)")
public class InteractionController {

    private final InteractionService interactionService;
    private final SecurityUtils securityUtils;

    // ==================== ENDORSEMENTS (LIKES) ====================

    @PostMapping("/endorse")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Endorse (like) content")
    public ResponseEntity<EndorsementResponse> endorseContent(
            @PathVariable UUID contentId,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = extractUserIdFromPrincipal(userDetails);
        EndorsementResponse response = interactionService.endorseContent(contentId, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/endorse")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Remove endorsement")
    public ResponseEntity<Void> unendorseContent(
            @PathVariable UUID contentId,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = extractUserIdFromPrincipal(userDetails);
        interactionService.unendorseContent(contentId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/endorsements")
    @Operation(summary = "Get content endorsements")
    public ResponseEntity<Page<EndorsementResponse>> getEndorsements(
            @PathVariable UUID contentId,
            Pageable pageable) {

        return ResponseEntity.ok(interactionService.getContentEndorsements(contentId, pageable));
    }

    // ==================== REPOSTS ====================

    @PostMapping("/repost")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Repost content")
    public ResponseEntity<Void> repostContent(
            @PathVariable UUID contentId,
            @Valid @RequestBody(required = false) RepostRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = extractUserIdFromPrincipal(userDetails);
        interactionService.repostContent(contentId, userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/repost")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Remove repost")
    public ResponseEntity<Void> unrepostContent(
            @PathVariable UUID contentId,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = extractUserIdFromPrincipal(userDetails);
        interactionService.unrepostContent(contentId, userId);
        return ResponseEntity.noContent().build();
    }

    // ==================== BOOKMARKS ====================

    @PostMapping("/bookmark")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Bookmark content")
    public ResponseEntity<Void> bookmarkContent(
            @PathVariable UUID contentId,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = extractUserIdFromPrincipal(userDetails);
        interactionService.bookmarkContent(contentId, userId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/bookmark")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Remove bookmark")
    public ResponseEntity<Void> unbookmarkContent(
            @PathVariable UUID contentId,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = extractUserIdFromPrincipal(userDetails);
        interactionService.unbookmarkContent(contentId, userId);
        return ResponseEntity.noContent().build();
    }

    // ==================== STATS ====================

    @GetMapping("/stats")
    @Operation(summary = "Get content interaction statistics")
    public ResponseEntity<InteractionStatsResponse> getInteractionStats(
            @PathVariable UUID contentId,
            @AuthenticationPrincipal(errorOnInvalidType = false) UserDetails userDetails) {

        UUID currentUserId = null;
        if (userDetails != null) {
            currentUserId = extractUserIdFromPrincipal(userDetails);
        }

        return ResponseEntity.ok(interactionService.getContentInteractionStats(contentId, currentUserId));
    }

    // ==================== USER INTERACTIONS ====================

    @GetMapping("/reposts/user/{userId}")
    @Operation(summary = "Get user's reposts")
    public ResponseEntity<Page<Repost>> getUserReposts(
            @PathVariable UUID contentId,
            @PathVariable UUID userId,
            Pageable pageable) {

        return ResponseEntity.ok(interactionService.getUserReposts(userId, pageable));
    }

    @GetMapping("/bookmarks/user")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get user's bookmarks")
    public ResponseEntity<Page<Bookmark>> getUserBookmarks(
            @PathVariable UUID contentId,
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {

        UUID userId = extractUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(interactionService.getUserBookmarks(userId, pageable));
    }

    private UUID extractUserIdFromPrincipal(UserDetails userDetails) {
        String email = userDetails.getUsername();
        return securityUtils.getUserIdFromEmail(email);
    }
}
