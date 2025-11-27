package com.nitor.service;

import com.nitor.dto.content.ContentResponse;
import com.nitor.dto.content.CreateContentRequest;
import com.nitor.dto.profile.ProfileResponse;
import com.nitor.exception.ResourceNotFoundException;
import com.nitor.model.Content;
import com.nitor.model.Profile;
import com.nitor.model.Report;
import com.nitor.repository.ContentRepository;
import com.nitor.repository.ProfileRepository;
import com.nitor.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ContentService {

    private final ContentRepository contentRepository;
    private final ProfileRepository profileRepository;
    private final ReportRepository reportRepository;

    @Transactional
    public ContentResponse createContent(UUID authorId, CreateContentRequest request) {
        Profile author = profileRepository.findById(Objects.requireNonNull(authorId))
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "id", authorId));

        Content content = Content.builder()
                .author(author)
                .type(request.getType())
                .body(request.getBody())
                .title(request.getTitle())
                .abstractText(request.getAbstractText())
                .keywords(request.getKeywords())
                .endorsementsCount(0)
                .repostsCount(0)
                .commentsCount(0)
                .viewsCount(0)
                .pinned(false)
                .isDeleted(false)
                .build();

        content = Objects.requireNonNull(contentRepository.save(content));
        log.info("Content created: {} by user {}", content.getId(), authorId);

        return mapToContentResponse(content);
    }

    @Transactional(readOnly = true)
    public Page<ContentResponse> getFeed(Pageable pageable) {
        return contentRepository.findAllActiveContent(pageable)
                .map(this::mapToContentResponse);
    }

    @Transactional(readOnly = true)
    public ContentResponse getContent(UUID contentId) {
        Content content = contentRepository.findById(Objects.requireNonNull(contentId))
                .orElseThrow(() -> new ResourceNotFoundException("Content", "id", contentId));

        if (content.getIsDeleted()) {
            throw new ResourceNotFoundException("Content has been deleted");
        }

        return mapToContentResponse(content);
    }

    @Transactional
    public ContentResponse updateContent(UUID contentId, UUID authorId, CreateContentRequest request) {
        Content content = contentRepository.findById(Objects.requireNonNull(contentId))
                .orElseThrow(() -> new ResourceNotFoundException("Content", "id", contentId));

        if (!content.getAuthor().getId().equals(authorId)) {
            throw new ResourceNotFoundException("Not authorized to update this content");
        }

        if (request.getBody() != null)
            content.setBody(request.getBody());
        if (request.getTitle() != null)
            content.setTitle(request.getTitle());
        if (request.getAbstractText() != null)
            content.setAbstractText(request.getAbstractText());
        if (request.getKeywords() != null)
            content.setKeywords(request.getKeywords());

        content = contentRepository.save(content);
        return mapToContentResponse(content);
    }

    @Transactional
    public void deleteContent(UUID contentId, UUID authorId) {
        Content content = contentRepository.findById(Objects.requireNonNull(contentId))
                .orElseThrow(() -> new ResourceNotFoundException("Content", "id", contentId));

        if (!content.getAuthor().getId().equals(authorId)) {
            throw new ResourceNotFoundException("Not authorized to delete this content");
        }

        content.setIsDeleted(true);
        contentRepository.save(content);
        log.info("Content deleted: {}", contentId);
    }

    @Transactional(readOnly = true)
    public Page<ContentResponse> getUserContent(UUID userId, Pageable pageable) {
        Profile profile = profileRepository.findById(Objects.requireNonNull(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "id", userId));

        return contentRepository.findByAuthorAndIsDeletedFalse(profile, pageable)
                .map(this::mapToContentResponse);
    }

    @Transactional(readOnly = true)
    public Page<ContentResponse> searchContent(String query, Pageable pageable) {
        return contentRepository.searchContent(query, pageable)
                .map(this::mapToContentResponse);
    }

    private ContentResponse mapToContentResponse(Content content) {
        Profile author = content.getAuthor();

        return ContentResponse.builder()
                .id(content.getId())
                .author(ProfileResponse.builder()
                        .id(author.getId())
                        .fullName(author.getFullName())
                        .handle(author.getHandle())
                        .avatarUrl(author.getAvatarUrl())
                        .institution(author.getInstitution())
                        .academicTitle(author.getAcademicTitle())
                        .verified(author.getVerified())
                        .nitorScore(author.getNitorScore())
                        .build())
                .type(content.getType())
                .body(content.getBody())
                .title(content.getTitle())
                .abstractText(content.getAbstractText())
                .keywords(content.getKeywords())
                .likesCount(content.getEndorsementsCount())
                .repostsCount(content.getRepostsCount())
                .commentsCount(content.getCommentsCount())
                .viewsCount(content.getViewsCount())
                .pinned(content.getPinned())
                .createdAt(content.getCreatedAt())
                .updatedAt(content.getUpdatedAt())
                .build();
    }

    @Transactional
    public void reportContent(UUID contentId, UUID reporterId, String reason) {
        // Verify content exists
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new ResourceNotFoundException("Content", "id", contentId));

        if (content.getIsDeleted()) {
            throw new ResourceNotFoundException("Content has been deleted");
        }

        Report report = Report.builder()
                .reporterId(reporterId)
                .reportedContentId(contentId)
                .reason(reason)
                .status(Report.ReportStatus.PENDING)
                .build();

        reportRepository.save(report);
        log.info("Content {} reported by user {} for reason: {}", contentId, reporterId, reason);
    }
}
