package com.nitor.dto.cv;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EducationRequest {

    @NotBlank
    private String institution;

    @NotBlank
    private String degree;

    private String fieldOfStudy;

    private String grade;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean isCurrent;

    private String description;
}
