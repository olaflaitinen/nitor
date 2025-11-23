package com.nitor.controller;

import com.nitor.dto.content.ContentResponse;
import com.nitor.dto.content.CreateContentRequest;
import com.nitor.service.ContentService;
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
@RequestMapping("/api/content")
@RequiredArgsConstructor
@Tag(name = "Content", description = "Content management (posts and articles)")
public class ContentController {

    private final ContentService contentService;

    @GetMapping("/feed")
    @Operation(summary = "Get content feed")
    public ResponseEntity<Page<ContentResponse>> getFeed(Pageable pageable) {
        return ResponseEntity.ok(contentService.getFeed(pageable));
    }

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create content")
    public ResponseEntity<ContentResponse> createContent(
            @Valid @RequestBody CreateContentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Extract user ID from email (userDetails.getUsername() returns email)
        UUID authorId = extractUserIdFromPrincipal(userDetails);
        ContentResponse response = contentService.createContent(authorId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get content by ID")
    public ResponseEntity<ContentResponse> getContent(@PathVariable UUID id) {
        return ResponseEntity.ok(contentService.getContent(id));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update content")
    public ResponseEntity<ContentResponse> updateContent(
            @PathVariable UUID id,
            @Valid @RequestBody CreateContentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID authorId = extractUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(contentService.updateContent(id, authorId, request));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete content")
    public ResponseEntity<Void> deleteContent(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID authorId = extractUserIdFromPrincipal(userDetails);
        contentService.deleteContent(id, authorId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user's content")
    public ResponseEntity<Page<ContentResponse>> getUserContent(
            @PathVariable UUID userId,
            Pageable pageable) {
        return ResponseEntity.ok(contentService.getUserContent(userId, pageable));
    }

    @GetMapping("/search")
    @Operation(summary = "Search content")
    public ResponseEntity<Page<ContentResponse>> searchContent(
            @RequestParam String query,
            Pageable pageable) {
        return ResponseEntity.ok(contentService.searchContent(query, pageable));
    }

    // Helper method - in production, use JWT claims
    private UUID extractUserIdFromPrincipal(UserDetails userDetails) {
        // This is a placeholder - in real implementation, extract from JWT token
        // For now, we'll need to lookup user by email
        return UUID.randomUUID(); // TODO: Implement proper user ID extraction
    }
}
