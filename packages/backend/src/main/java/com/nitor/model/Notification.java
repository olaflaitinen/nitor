package com.nitor.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_notifications_user", columnList = "user_id, read"),
    @Index(name = "idx_notifications_created", columnList = "createdAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Profile user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id")
    private Profile actor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private NotificationType type;

    @Column
    private UUID targetId;

    @Column(length = 50)
    private String targetType;

    @Column(columnDefinition = "TEXT")
    private String targetPreview;

    @Column(nullable = false)
    @Builder.Default
    private Boolean read = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum NotificationType {
        CITATION, FOLLOW, REPLY, ENDORSE, MENTION, REPOST
    }
}
