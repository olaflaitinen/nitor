package com.nitor.service;

import com.nitor.dto.comment.CommentResponse;
import com.nitor.dto.comment.CreateCommentRequest;
import com.nitor.dto.profile.ProfileResponse;
import com.nitor.exception.ResourceNotFoundException;
import com.nitor.model.Comment;
import com.nitor.model.Content;
import com.nitor.model.Profile;
import com.nitor.repository.CommentRepository;
import com.nitor.repository.ContentRepository;
import com.nitor.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final ContentRepository contentRepository;
    private final ProfileRepository profileRepository;

    @Transactional
    public CommentResponse createComment(UUID contentId, UUID authorId, CreateCommentRequest request) {
        Content content = contentRepository.findById(Objects.requireNonNull(contentId))
                .orElseThrow(() -> new ResourceNotFoundException("Content", "id", contentId));

        Profile author = profileRepository.findById(Objects.requireNonNull(authorId))
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "id", authorId));

        Comment parentComment = null;
        if (request.getParentCommentId() != null) {
            parentComment = commentRepository.findById(Objects.requireNonNull(request.getParentCommentId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", request.getParentCommentId()));
        }

        Comment comment = Comment.builder()
                .content(content)
                .author(author)
                .parentComment(parentComment)
                .body(request.getBody())
                .likesCount(0)
                .isDeleted(false)
                .build();

        comment = Objects.requireNonNull(commentRepository.save(comment));
        log.info("Comment created: {} on content {}", comment.getId(), contentId);

        return mapToCommentResponse(comment);
    }

    @Transactional(readOnly = true)
    public Page<CommentResponse> getContentComments(UUID contentId, Pageable pageable) {
        return commentRepository.findRootCommentsByContentId(contentId, pageable)
                .map(this::mapToCommentResponseWithReplies);
    }

    @Transactional
    public CommentResponse updateComment(UUID commentId, UUID authorId, CreateCommentRequest request) {
        Comment comment = commentRepository.findById(Objects.requireNonNull(commentId))
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        if (!comment.getAuthor().getId().equals(authorId)) {
            throw new ResourceNotFoundException("Not authorized to update this comment");
        }

        comment.setBody(request.getBody());
        comment = commentRepository.save(comment);

        return mapToCommentResponse(comment);
    }

    @Transactional
    public void deleteComment(UUID commentId, UUID authorId) {
        Comment comment = commentRepository.findById(Objects.requireNonNull(commentId))
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        if (!comment.getAuthor().getId().equals(authorId)) {
            throw new ResourceNotFoundException("Not authorized to delete this comment");
        }

        comment.setIsDeleted(true);
        commentRepository.save(comment);
        log.info("Comment deleted: {}", commentId);
    }

    private CommentResponse mapToCommentResponse(Comment comment) {
        Profile author = comment.getAuthor();

        return CommentResponse.builder()
                .id(comment.getId())
                .contentId(comment.getContent().getId())
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .author(ProfileResponse.builder()
                        .id(author.getId())
                        .fullName(author.getFullName())
                        .handle(author.getHandle())
                        .avatarUrl(author.getAvatarUrl())
                        .verified(author.getVerified())
                        .build())
                .body(comment.getBody())
                .likesCount(comment.getLikesCount())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .replies(new ArrayList<>())
                .build();
    }

    private CommentResponse mapToCommentResponseWithReplies(Comment comment) {
        CommentResponse response = mapToCommentResponse(comment);

        List<Comment> replies = commentRepository.findByParentCommentAndIsDeletedFalseOrderByCreatedAtDesc(comment);
        response.setReplies(replies.stream()
                .map(this::mapToCommentResponseWithReplies)
                .collect(Collectors.toList()));

        return response;
    }
}
