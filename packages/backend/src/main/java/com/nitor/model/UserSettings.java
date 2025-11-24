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

    @Column(name = "email_notifications", nullable = false)
    private Boolean emailNotifications = true;

    @Column(name = "push_notifications", nullable = false)
    private Boolean pushNotifications = true;

    @Column(name = "profile_visibility", nullable = false)
    private String profileVisibility = "PUBLIC"; // PUBLIC, CONNECTIONS_ONLY, PRIVATE

    @Column(name = "show_email", nullable = false)
    private Boolean showEmail = false;

    @Column(name = "show_phone", nullable = false)
    private Boolean showPhone = false;

    @Column(name = "allow_messages_from", nullable = false)
    private String allowMessagesFrom = "EVERYONE"; // EVERYONE, CONNECTIONS, NONE

    @Column(nullable = false)
    private String language = "en";

    @Column(nullable = false)
    private String timezone = "UTC";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
