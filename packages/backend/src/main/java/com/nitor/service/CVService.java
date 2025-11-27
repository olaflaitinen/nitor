package com.nitor.service;

import com.nitor.dto.cv.CVResponse;
import com.nitor.dto.cv.EducationRequest;
import com.nitor.dto.cv.ExperienceRequest;
import com.nitor.dto.cv.ProjectRequest;
import com.nitor.exception.ResourceNotFoundException;
import com.nitor.model.Education;
import com.nitor.model.Experience;
import com.nitor.model.Profile;
import com.nitor.model.Project;
import com.nitor.repository.EducationRepository;
import com.nitor.repository.ExperienceRepository;
import com.nitor.repository.ProfileRepository;
import com.nitor.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CVService {

    private final ProfileRepository profileRepository;
    private final EducationRepository educationRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;

    @Transactional(readOnly = true)
    public CVResponse getUserCV(UUID userId) {
        Profile profile = profileRepository.findById(Objects.requireNonNull(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "id", userId));

        List<Education> education = educationRepository.findByUserOrderByStartDateDesc(profile);
        List<Experience> experience = experienceRepository.findByUserOrderByStartDateDesc(profile);
        List<Project> projects = projectRepository.findByUserOrderByStartDateDesc(profile);

        return CVResponse.builder()
                .education(education)
                .experience(experience)
                .projects(projects)
                .build();
    }

    // Education endpoints
    @Transactional
    public Education addEducation(UUID userId, EducationRequest request) {
        Profile profile = profileRepository.findById(Objects.requireNonNull(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "id", userId));

        Education education = Education.builder()
                .user(profile)
                .institution(request.getInstitution())
                .degree(request.getDegree())
                .fieldOfStudy(request.getFieldOfStudy())
                .grade(request.getGrade())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .isCurrent(request.getIsCurrent() != null ? request.getIsCurrent() : false)
                .description(request.getDescription())
                .build();

        return Objects.requireNonNull(educationRepository.save(education));
    }

    @Transactional
    public Education updateEducation(UUID educationId, UUID userId, EducationRequest request) {
        Education education = educationRepository.findById(Objects.requireNonNull(educationId))
                .orElseThrow(() -> new ResourceNotFoundException("Education", "id", educationId));

        if (!education.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Not authorized");
        }

        education.setInstitution(request.getInstitution());
        education.setDegree(request.getDegree());
        education.setFieldOfStudy(request.getFieldOfStudy());
        education.setGrade(request.getGrade());
        education.setStartDate(request.getStartDate());
        education.setEndDate(request.getEndDate());
        education.setIsCurrent(request.getIsCurrent() != null ? request.getIsCurrent() : false);
        education.setDescription(request.getDescription());

        return Objects.requireNonNull(educationRepository.save(education));
    }

    @Transactional
    public void deleteEducation(UUID educationId, UUID userId) {
        Education education = educationRepository.findById(Objects.requireNonNull(educationId))
                .orElseThrow(() -> new ResourceNotFoundException("Education", "id", educationId));

        if (!education.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Not authorized");
        }

        educationRepository.delete(education);
    }

    // Experience endpoints
    @Transactional
    public Experience addExperience(UUID userId, ExperienceRequest request) {
        Profile profile = profileRepository.findById(Objects.requireNonNull(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "id", userId));

        Experience experience = Experience.builder()
                .user(profile)
                .company(request.getCompany())
                .role(request.getRole())
                .location(request.getLocation())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .isCurrent(request.getIsCurrent() != null ? request.getIsCurrent() : false)
                .build();

        return Objects.requireNonNull(experienceRepository.save(experience));
    }

    @Transactional
    public void deleteExperience(UUID experienceId, UUID userId) {
        Experience experience = experienceRepository.findById(Objects.requireNonNull(experienceId))
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", experienceId));

        if (!experience.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Not authorized");
        }

        experienceRepository.delete(experience);
    }

    // Project endpoints
    @Transactional
    public Project addProject(UUID userId, ProjectRequest request) {
        Profile profile = profileRepository.findById(Objects.requireNonNull(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "id", userId));

        Project project = Project.builder()
                .user(profile)
                .title(request.getTitle())
                .link(request.getLink())
                .technologies(request.getTechnologies())
                .description(request.getDescription())
                .build();

        return Objects.requireNonNull(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(UUID projectId, UUID userId) {
        Project project = projectRepository.findById(Objects.requireNonNull(projectId))
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        if (!project.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Not authorized");
        }

        projectRepository.delete(project);
    }
}
