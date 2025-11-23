package com.nitor.controller;

import com.nitor.service.FileUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "File Upload", description = "File upload endpoints")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    @PostMapping("/avatar")
    @Operation(summary = "Upload avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        String fileUrl = fileUploadService.uploadAvatar(file);
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }

    @PostMapping("/content")
    @Operation(summary = "Upload content media")
    public ResponseEntity<Map<String, String>> uploadContentMedia(@RequestParam("file") MultipartFile file) {
        String fileUrl = fileUploadService.uploadContentMedia(file);
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }
}
