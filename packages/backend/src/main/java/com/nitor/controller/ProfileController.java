package com.nitor.controller;

import com.nitor.dto.profile.ProfileResponse;
import com.nitor.dto.profile.UpdateProfileRequest;
import com.nitor.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
@Tag(name = "Profiles", description = "User profile management")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/{id}")
    @Operation(summary = "Get profile by ID")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable UUID id) {
        return ResponseEntity.ok(profileService.getProfile(id));
    }

    @GetMapping("/handle/{handle}")
    @Operation(summary = "Get profile by handle")
    public ResponseEntity<ProfileResponse> getProfileByHandle(@PathVariable String handle) {
        return ResponseEntity.ok(profileService.getProfileByHandle(handle));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update profile")
    public ResponseEntity<ProfileResponse> updateProfile(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(id, request));
    }

    @GetMapping("/search")
    @Operation(summary = "Search profiles")
    public ResponseEntity<Page<ProfileResponse>> searchProfiles(
            @RequestParam String query,
            Pageable pageable) {
        return ResponseEntity.ok(profileService.searchProfiles(query, pageable));
    }
}
