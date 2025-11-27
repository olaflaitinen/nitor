package com.nitor.service;

import com.nitor.dto.interaction.EndorsementResponse;
import com.nitor.dto.interaction.InteractionStatsResponse;
import com.nitor.dto.interaction.RepostRequest;
import com.nitor.exception.BadRequestException;
import com.nitor.exception.ResourceNotFoundException;
import com.nitor.model.*;
import com.nitor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class InteractionService {

    private final EndorsementRepository endorsementRepository;
    private final RepostRepository repostRepository;
    private final BookmarkRepository bookmarkRepository;
    private final ContentRepository contentRepository;
    private final ProfileRepository profileRepository;

    // ==================== ENDORSEMENTS (LIKES) ====================

    public EndorsementResponse endorseContent(UUID contentId, UUID userId) {
        // Check if content exists
        // Check if content exists
        if (!contentRepository.existsById(Objects.requireNonNull(contentId))) {
            throw new ResourceNotFoundException("Content not found");
        }

        // Check if already endorsed
        if (endorsementRepository.existsByUserIdAndContentId(userId, contentId)) {
            throw new BadRequestException("Content already endorsed");
        }

        // Create endorsement
        Endorsement endorsement = Endorsement.builder()
                .userId(userId)
                .contentId(contentId)
                .build();

        endorsement = Objects.requireNonNull(endorsementRepository.save(endorsement));

        // Get user info for response
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        return EndorsementResponse.builder()
                .id(endorsement.getId())
                .userId(userId)
                .contentId(contentId)
                .createdAt(endorsement.getCreatedAt())
                .userFullName(profile.getFullName())
                .userHandle(profile.getHandle())
                .build();
    }

    public void unendorseContent(UUID contentId, UUID userId) {
        if (!endorsementRepository.existsByUserIdAndContentId(userId, contentId)) {
            throw new ResourceNotFoundException("Endorsement not found");
        }
        endorsementRepository.deleteByUserIdAndContentId(userId, contentId);
    }

    public Page<EndorsementResponse> getContentEndorsements(UUID contentId, Pageable pageable) {
        return endorsementRepository.findByContentId(contentId, pageable)
                .map(this::mapToEndorsementResponse);
    }

    // ==================== REPOSTS ====================

    public void repostContent(UUID contentId, UUID userId, RepostRequest request) {
        // Check if content exists
        contentRepository.findById(Objects.requireNonNull(contentId))
                .orElseThrow(() -> new ResourceNotFoundException("Content not found"));

        // Check if already reposted
        if (repostRepository.existsByUserIdAndContentId(userId, contentId)) {
            throw new BadRequestException("Content already reposted");
        }

        // Create repost
        Repost repost = Repost.builder()
                .userId(userId)
                .contentId(contentId)
                .comment(request != null ? request.getComment() : null)
                .build();

        repostRepository.save(Objects.requireNonNull(repost));
    }

    public void unrepostContent(UUID contentId, UUID userId) {
        if (!repostRepository.existsByUserIdAndContentId(userId, contentId)) {
            throw new ResourceNotFoundException("Repost not found");
        }
        repostRepository.deleteByUserIdAndContentId(userId, contentId);
    }

    public Page<Repost> getUserReposts(UUID userId, Pageable pageable) {
        return repostRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    // ==================== BOOKMARKS ====================

    public void bookmarkContent(UUID contentId, UUID userId) {
        // Check if content exists
        contentRepository.findById(Objects.requireNonNull(contentId))
                .orElseThrow(() -> new ResourceNotFoundException("Content not found"));

        // Check if already bookmarked
        if (bookmarkRepository.existsByUserIdAndContentId(userId, contentId)) {
            throw new BadRequestException("Content already bookmarked");
        }

        // Create bookmark
        Bookmark bookmark = Bookmark.builder()
                .userId(userId)
                .contentId(contentId)
                .build();

        bookmarkRepository.save(Objects.requireNonNull(bookmark));
    }

    public void unbookmarkContent(UUID contentId, UUID userId) {
        if (!bookmarkRepository.existsByUserIdAndContentId(userId, contentId)) {
            throw new ResourceNotFoundException("Bookmark not found");
        }
        bookmarkRepository.deleteByUserIdAndContentId(userId, contentId);
    }

    public Page<Bookmark> getUserBookmarks(UUID userId, Pageable pageable) {
        return bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    // ==================== STATS ====================

    public InteractionStatsResponse getContentInteractionStats(UUID contentId, UUID currentUserId) {
        long endorsementsCount = endorsementRepository.countByContentId(contentId);
        long repostsCount = repostRepository.countByContentId(contentId);
        long bookmarksCount = bookmarkRepository.countByContentId(contentId);

        boolean isEndorsed = currentUserId != null &&
                endorsementRepository.existsByUserIdAndContentId(currentUserId, contentId);
        boolean isReposted = currentUserId != null &&
                repostRepository.existsByUserIdAndContentId(currentUserId, contentId);
        boolean isBookmarked = currentUserId != null &&
                bookmarkRepository.existsByUserIdAndContentId(currentUserId, contentId);

        return InteractionStatsResponse.builder()
                .endorsements(endorsementsCount)
                .reposts(repostsCount)
                .bookmarks(bookmarksCount)
                .isEndorsed(isEndorsed)
                .isReposted(isReposted)
                .isBookmarked(isBookmarked)
                .build();
    }

    // ==================== HELPERS ====================

    private EndorsementResponse mapToEndorsementResponse(Endorsement endorsement) {
        Profile profile = profileRepository.findByUserId(endorsement.getUserId())
                .orElse(null);

        return EndorsementResponse.builder()
                .id(endorsement.getId())
                .userId(endorsement.getUserId())
                .contentId(endorsement.getContentId())
                .createdAt(endorsement.getCreatedAt())
                .userFullName(profile != null ? profile.getFullName() : "Unknown")
                .userHandle(profile != null ? profile.getHandle() : "unknown")
                .build();
    }
}
