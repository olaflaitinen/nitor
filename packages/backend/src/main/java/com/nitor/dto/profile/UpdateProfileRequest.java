package com.nitor.dto.profile;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @Size(min = 2, max = 255)
    private String fullName;

    private String institution;

    private String academicTitle;

    @Size(max = 500)
    private String bio;

    private String orcid;

    private String discipline;

    private Boolean onboardingComplete;
}
