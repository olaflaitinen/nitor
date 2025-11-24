package com.nitor.dto.interaction;

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
public class EndorsementResponse {
    private UUID id;
    private UUID userId;
    private UUID contentId;
    private LocalDateTime createdAt;
    private String userFullName;
    private String userHandle;
}
