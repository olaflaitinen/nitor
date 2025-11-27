package com.nitor.service;

import com.nitor.exception.BadRequestException;
import com.nitor.exception.ResourceNotFoundException;
import com.nitor.model.Follow;
import com.nitor.model.Profile;
import com.nitor.repository.FollowRepository;
import com.nitor.repository.ProfileRepository;
import com.nitor.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings({ "null", "nullness" })
class FollowServiceTest {

    @Mock
    private FollowRepository followRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private FollowService followService;

    private UUID followerId;
    private UUID followingId;
    private Follow testFollow;
    private Profile followerProfile;
    private Profile followingProfile;

    @BeforeEach
    void setUp() {
        followerId = UUID.randomUUID();
        followingId = UUID.randomUUID();

        testFollow = Follow.builder()
                .id(UUID.randomUUID())
                .followerId(followerId)
                .followingId(followingId)
                .build();

        followerProfile = Profile.builder()
                .id(followerId)
                .fullName("Follower User")
                .handle("follower")
                .build();

        followingProfile = Profile.builder()
                .id(followingId)
                .fullName("Following User")
                .handle("following")
                .build();
    }

    @Test
    void followUser_Success() {
        // Given
        when(userRepository.existsById(followerId)).thenReturn(true);
        when(userRepository.existsById(followingId)).thenReturn(true);
        when(followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)).thenReturn(false);
        when(followRepository.save(any(Follow.class))).thenReturn(testFollow);
        when(profileRepository.findByUserId(followerId)).thenReturn(Optional.of(followerProfile));
        when(profileRepository.findByUserId(followingId)).thenReturn(Optional.of(followingProfile));

        // When
        var response = followService.followUser(followerId, followingId);

        // Then
        assertNotNull(response);
        assertEquals(followerId, response.getFollowerId());
        assertEquals(followingId, response.getFollowingId());
        verify(followRepository).save(any(Follow.class));
    }

    @Test
    void followUser_CannotFollowSelf_ThrowsException() {
        // Given
        UUID userId = UUID.randomUUID();

        // When & Then
        assertThrows(BadRequestException.class, () -> followService.followUser(userId, userId));
        verify(followRepository, never()).save(any(Follow.class));
    }

    @Test
    void followUser_AlreadyFollowing_ThrowsException() {
        // Given
        when(userRepository.existsById(any(UUID.class))).thenReturn(true);
        when(followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)).thenReturn(true);

        // When & Then
        assertThrows(BadRequestException.class, () -> followService.followUser(followerId, followingId));
        verify(followRepository, never()).save(any(Follow.class));
    }

    @Test
    void unfollowUser_Success() {
        // Given
        when(followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)).thenReturn(true);

        // When
        followService.unfollowUser(followerId, followingId);

        // Then
        verify(followRepository).deleteByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Test
    void unfollowUser_NotFollowing_ThrowsException() {
        // Given
        when(followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)).thenReturn(false);

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> followService.unfollowUser(followerId, followingId));
        verify(followRepository, never()).deleteByFollowerIdAndFollowingId(any(), any());
    }

    @Test
    void isFollowing_ReturnsTrue() {
        // Given
        when(followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)).thenReturn(true);

        // When
        boolean result = followService.isFollowing(followerId, followingId);

        // Then
        assertTrue(result);
    }

    @Test
    void isFollowing_ReturnsFalse() {
        // Given
        when(followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)).thenReturn(false);

        // When
        boolean result = followService.isFollowing(followerId, followingId);

        // Then
        assertFalse(result);
    }
}
