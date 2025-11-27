package com.nitor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_settings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Builder.Default
    @Column(name = "email_notifications", nullable = false)
    private Boolean emailNotifications = true;

    @Builder.Default
    @Column(name = "push_notifications", nullable = false)
    private Boolean pushNotifications = true;

    @Builder.Default
    @Column(name = "profile_visibility", nullable = false)
    private String profileVisibility = "PUBLIC"; // PUBLIC, CONNECTIONS_ONLY, PRIVATE

    @Builder.Default
    @Column(name = "show_email", nullable = false)
    private Boolean showEmail = false;

    @Builder.Default
    @Column(name = "show_phone", nullable = false)
    private Boolean showPhone = false;

    @Builder.Default
    @Column(name = "allow_messages_from", nullable = false)
    private String allowMessagesFrom = "EVERYONE"; // EVERYONE, CONNECTIONS, NONE

    @Builder.Default
    @Column(nullable = false)
    private String language = "en";

    @Builder.Default
    @Column(nullable = false)
    private String timezone = "UTC";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
