package com.nitor.controller;

import com.nitor.model.Content;
import com.nitor.model.Profile;
import com.nitor.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "Global search functionality")
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/content")
    @Operation(summary = "Search content")
    public ResponseEntity<Page<Content>> searchContent(
            @RequestParam String q,
            Pageable pageable) {

        return ResponseEntity.ok(searchService.searchContent(q, pageable));
    }

    @GetMapping("/profiles")
    @Operation(summary = "Search profiles")
    public ResponseEntity<Page<Profile>> searchProfiles(
            @RequestParam String q,
            Pageable pageable) {

        return ResponseEntity.ok(searchService.searchProfiles(q, pageable));
    }

    @GetMapping("/all")
    @Operation(summary = "Global search (content + profiles)")
    public ResponseEntity<SearchService.SearchResults> globalSearch(
            @RequestParam String q,
            Pageable pageable) {

        return ResponseEntity.ok(searchService.globalSearch(q, pageable));
    }
}
