package com.nitor.service;

import com.nitor.dto.profile.ProfileResponse;
import com.nitor.dto.profile.UpdateProfileRequest;
import com.nitor.exception.ResourceNotFoundException;
import com.nitor.model.Profile;
import com.nitor.model.User;
import com.nitor.repository.ProfileRepository;
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
public class ProfileService {

    private final ProfileRepository profileRepository;

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(UUID profileId) {
        Profile profile = profileRepository.findById(Objects.requireNonNull(profileId))
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "id", profileId));

        User user = profile.getUser();
        return mapToProfileResponse(profile, user);
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfileByHandle(String handle) {
        Profile profile = profileRepository.findByHandle(handle)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "handle", handle));

        User user = profile.getUser();
        return mapToProfileResponse(profile, user);
    }

    @Transactional
    public ProfileResponse updateProfile(UUID profileId, UpdateProfileRequest request) {
        Profile profile = profileRepository.findById(Objects.requireNonNull(profileId))
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "id", profileId));

        if (request.getFullName() != null)
            profile.setFullName(request.getFullName());
        if (request.getInstitution() != null)
            profile.setInstitution(request.getInstitution());
        if (request.getAcademicTitle() != null)
            profile.setAcademicTitle(request.getAcademicTitle());
        if (request.getBio() != null)
            profile.setBio(request.getBio());
        if (request.getOrcid() != null)
            profile.setOrcid(request.getOrcid());
        if (request.getDiscipline() != null)
            profile.setDiscipline(request.getDiscipline());
        if (request.getOnboardingComplete() != null)
            profile.setOnboardingComplete(request.getOnboardingComplete());

        profile = Objects.requireNonNull(profileRepository.save(profile));

        return mapToProfileResponse(profile, profile.getUser());
    }

    @Transactional(readOnly = true)
    public Page<ProfileResponse> searchProfiles(String query, Pageable pageable) {
        return profileRepository.searchProfiles(query, pageable)
                .map(profile -> mapToProfileResponse(profile, profile.getUser()));
    }

    private ProfileResponse mapToProfileResponse(Profile profile, User user) {
        return ProfileResponse.builder()
                .id(profile.getId())
                .email(user.getEmail())
                .fullName(profile.getFullName())
                .handle(profile.getHandle())
                .institution(profile.getInstitution())
                .academicTitle(profile.getAcademicTitle())
                .avatarUrl(profile.getAvatarUrl())
                .bio(profile.getBio())
                .orcid(profile.getOrcid())
                .discipline(profile.getDiscipline())
                .nitorScore(profile.getNitorScore())
                .verified(profile.getVerified())
                .onboardingComplete(profile.getOnboardingComplete())
                .followersCount(profile.getFollowersCount())
                .followingCount(profile.getFollowingCount())
                .publicationsCount(profile.getPublicationsCount())
                .profileVisibility(profile.getProfileVisibility().name())
                .build();
    }
}
