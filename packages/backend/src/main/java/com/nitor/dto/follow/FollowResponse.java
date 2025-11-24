package com.nitor.dto.follow;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowResponse {
    private UUID id;
    private UUID followerId;
    private UUID followingId;
    private LocalDateTime createdAt;
    private String followerFullName;
    private String followerHandle;
    private String followingFullName;
    private String followingHandle;
}
