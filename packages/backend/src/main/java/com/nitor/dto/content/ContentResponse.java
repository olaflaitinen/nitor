package com.nitor.dto.content;

import com.nitor.dto.profile.ProfileResponse;
import com.nitor.model.Content;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentResponse {
    private UUID id;
    private ProfileResponse author;
    private Content.ContentType type;
    private String body;
    private String title;
    private String abstractText;
    private List<String> keywords;
    private Integer likesCount;
    private Integer repostsCount;
    private Integer commentsCount;
    private Integer viewsCount;
    private Boolean pinned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
