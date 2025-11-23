package com.nitor.controller;

import com.nitor.dto.cv.CVResponse;
import com.nitor.dto.cv.EducationRequest;
import com.nitor.model.Education;
import com.nitor.model.Experience;
import com.nitor.model.Project;
import com.nitor.service.CVService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cv")
@RequiredArgsConstructor
@Tag(name = "CV", description = "CV/Resume management")
public class CVController {

    private final CVService cvService;

    @GetMapping("/{userId}")
    @Operation(summary = "Get user CV")
    public ResponseEntity<CVResponse> getUserCV(@PathVariable UUID userId) {
        return ResponseEntity.ok(cvService.getUserCV(userId));
    }

    // Education endpoints
    @PostMapping("/education")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add education")
    public ResponseEntity<Education> addEducation(
            @Valid @RequestBody EducationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = extractUserIdFromPrincipal(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(cvService.addEducation(userId, request));
    }

    @PutMapping("/education/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update education")
    public ResponseEntity<Education> updateEducation(
            @PathVariable UUID id,
            @Valid @RequestBody EducationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = extractUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(cvService.updateEducation(id, userId, request));
    }

    @DeleteMapping("/education/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete education")
    public ResponseEntity<Void> deleteEducation(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = extractUserIdFromPrincipal(userDetails);
        cvService.deleteEducation(id, userId);
        return ResponseEntity.noContent().build();
    }

    // Experience endpoints
    @PostMapping("/experience")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add experience")
    public ResponseEntity<Experience> addExperience(
            @RequestParam String company,
            @RequestParam String role,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String description,
            @RequestParam LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) Boolean isCurrent,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = extractUserIdFromPrincipal(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            cvService.addExperience(userId, company, role, location, description, startDate, endDate, isCurrent)
        );
    }

    @DeleteMapping("/experience/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete experience")
    public ResponseEntity<Void> deleteExperience(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = extractUserIdFromPrincipal(userDetails);
        cvService.deleteExperience(id, userId);
        return ResponseEntity.noContent().build();
    }

    // Project endpoints
    @PostMapping("/projects")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add project")
    public ResponseEntity<Project> addProject(
            @RequestParam String title,
            @RequestParam(required = false) String link,
            @RequestParam(required = false) List<String> technologies,
            @RequestParam(required = false) String description,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = extractUserIdFromPrincipal(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            cvService.addProject(userId, title, link, technologies, description)
        );
    }

    @DeleteMapping("/projects/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete project")
    public ResponseEntity<Void> deleteProject(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {

        UUID userId = extractUserIdFromPrincipal(userDetails);
        cvService.deleteProject(id, userId);
        return ResponseEntity.noContent().build();
    }

    private UUID extractUserIdFromPrincipal(UserDetails userDetails) {
        return UUID.randomUUID(); // TODO: Implement proper user ID extraction from JWT
    }
}
