package com.nitor.dto.interaction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InteractionStatsResponse {
    private long endorsements;
    private long reposts;
    private long bookmarks;
    private boolean isEndorsed;
    private boolean isReposted;
    private boolean isBookmarked;
}
