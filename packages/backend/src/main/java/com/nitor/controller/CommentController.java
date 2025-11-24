package com.nitor.controller;

import com.nitor.dto.comment.CommentResponse;
import com.nitor.dto.comment.CreateCommentRequest;
import com.nitor.service.CommentService;
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
@RequestMapping("/api/content/{contentId}/comments")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Comment management")
public class CommentController {

    private final CommentService commentService;
    private final SecurityUtils securityUtils;

    @GetMapping
    @Operation(summary = "Get content comments")
    public ResponseEntity<Page<CommentResponse>> getComments(
            @PathVariable UUID contentId,
            Pageable pageable) {
        return ResponseEntity.ok(commentService.getContentComments(contentId, pageable));
    }

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create comment")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable UUID contentId,
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID authorId = extractUserIdFromPrincipal(userDetails);
        CommentResponse response = commentService.createComment(contentId, authorId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{commentId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update comment")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable UUID contentId,
            @PathVariable UUID commentId,
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID authorId = extractUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(commentService.updateComment(commentId, authorId, request));
    }

    @DeleteMapping("/{commentId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete comment")
    public ResponseEntity<Void> deleteComment(
            @PathVariable UUID contentId,
            @PathVariable UUID commentId,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID authorId = extractUserIdFromPrincipal(userDetails);
        commentService.deleteComment(commentId, authorId);
        return ResponseEntity.noContent().build();
    }

    private UUID extractUserIdFromPrincipal(UserDetails userDetails) {
        String email = userDetails.getUsername();
        return securityUtils.getUserIdFromEmail(email);
    }
}
