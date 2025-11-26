package com.nitor.service;

import com.nitor.model.Content;
import com.nitor.model.Profile;
import com.nitor.repository.ContentRepository;
import com.nitor.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class SearchService {

    private final ContentRepository contentRepository;
    private final ProfileRepository profileRepository;

    public Page<Content> searchContent(String query, Pageable pageable) {
        log.info("Searching content with query: {}", query);
        return contentRepository.searchContent(query, pageable);
    }

    public Page<Profile> searchProfiles(String query, Pageable pageable) {
        log.info("Searching profiles with query: {}", query);
        return profileRepository.searchProfiles(query, pageable);
    }

    public SearchResults globalSearch(String query, Pageable pageable) {
        log.info("Performing global search with query: {}", query);

        Page<Content> contents = searchContent(query, pageable);
        Page<Profile> profiles = searchProfiles(query, pageable);

        return new SearchResults(contents, profiles);
    }

    @lombok.Data
    @lombok.AllArgsConstructor
    public static class SearchResults {
        private Page<Content> contents;
        private Page<Profile> profiles;
    }
}
