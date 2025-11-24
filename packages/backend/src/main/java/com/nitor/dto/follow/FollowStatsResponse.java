package com.nitor.dto.follow;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowStatsResponse {
    private long followersCount;
    private long followingCount;
    private boolean isFollowing;
    private boolean isFollowedBy;
}
