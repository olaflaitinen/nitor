package com.nitor.service;

import com.nitor.dto.follow.FollowResponse;
import com.nitor.dto.follow.FollowStatsResponse;
import com.nitor.exception.BadRequestException;
import com.nitor.exception.ResourceNotFoundException;
import com.nitor.model.Follow;
import com.nitor.model.Profile;
import com.nitor.repository.FollowRepository;
import com.nitor.repository.ProfileRepository;
import com.nitor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public FollowResponse followUser(UUID followerId, UUID followingId) {
        // Validation
        if (followerId.equals(followingId)) {
            throw new BadRequestException("Cannot follow yourself");
        }

        // Check if users exist
        if (!userRepository.existsById(Objects.requireNonNull(followerId))) {
            throw new ResourceNotFoundException("Follower user not found");
        }
        if (!userRepository.existsById(Objects.requireNonNull(followingId))) {
            throw new ResourceNotFoundException("Following user not found");
        }

        // Check if already following
        if (followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            throw new BadRequestException("Already following this user");
        }

        // Create follow relationship
        Follow follow = Follow.builder()
                .followerId(followerId)
                .followingId(followingId)
                .build();

        follow = Objects.requireNonNull(followRepository.save(follow));

        return mapToFollowResponse(follow);
    }

    public void unfollowUser(UUID followerId, UUID followingId) {
        if (!followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            throw new ResourceNotFoundException("Follow relationship not found");
        }

        followRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Transactional(readOnly = true)
    public Page<FollowResponse> getFollowers(UUID userId, Pageable pageable) {
        return followRepository.findByFollowingId(userId, pageable)
                .map(this::mapToFollowResponse);
    }

    @Transactional(readOnly = true)
    public Page<FollowResponse> getFollowing(UUID userId, Pageable pageable) {
        return followRepository.findByFollowerId(userId, pageable)
                .map(this::mapToFollowResponse);
    }

    @Transactional(readOnly = true)
    public FollowStatsResponse getFollowStats(UUID userId, UUID currentUserId) {
        long followersCount = followRepository.countFollowers(userId);
        long followingCount = followRepository.countFollowing(userId);

        boolean isFollowing = currentUserId != null &&
                followRepository.existsByFollowerIdAndFollowingId(currentUserId, userId);
        boolean isFollowedBy = currentUserId != null &&
                followRepository.existsByFollowerIdAndFollowingId(userId, currentUserId);

        return FollowStatsResponse.builder()
                .followersCount(followersCount)
                .followingCount(followingCount)
                .isFollowing(isFollowing)
                .isFollowedBy(isFollowedBy)
                .build();
    }

    @Transactional(readOnly = true)
    public boolean isFollowing(UUID followerId, UUID followingId) {
        return followRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Transactional(readOnly = true)
    public List<UUID> getFollowingIds(UUID userId) {
        return followRepository.findFollowingIds(userId);
    }

    // ==================== HELPERS ====================

    private FollowResponse mapToFollowResponse(Follow follow) {
        Profile followerProfile = profileRepository.findByUserId(follow.getFollowerId())
                .orElse(null);
        Profile followingProfile = profileRepository.findByUserId(follow.getFollowingId())
                .orElse(null);

        return FollowResponse.builder()
                .id(follow.getId())
                .followerId(follow.getFollowerId())
                .followingId(follow.getFollowingId())
                .createdAt(follow.getCreatedAt())
                .followerFullName(followerProfile != null ? followerProfile.getFullName() : "Unknown")
                .followerHandle(followerProfile != null ? followerProfile.getHandle() : "unknown")
                .followingFullName(followingProfile != null ? followingProfile.getFullName() : "Unknown")
                .followingHandle(followingProfile != null ? followingProfile.getHandle() : "unknown")
                .build();
    }
}
