package com.nitor.dto.notification;

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
public class NotificationMessage {
    private UUID id;
    private UUID userId;
    private String type;
    private String title;
    private String message;
    private String link;
    private LocalDateTime timestamp;
    private boolean read;
}
