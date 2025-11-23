package com.nitor.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {

    private UUID id;
    private String email;
    private String fullName;
    private String handle;
    private String institution;
    private String academicTitle;
    private String avatarUrl;
    private String bio;
    private String orcid;
    private String discipline;
    private BigDecimal nitorScore;
    private Boolean verified;
    private Boolean onboardingComplete;
    private Integer followersCount;
    private Integer followingCount;
    private Integer publicationsCount;
    private String profileVisibility;
}
